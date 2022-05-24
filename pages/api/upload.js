import path from 'path'
import fs from 'fs'
import busboy from 'busboy'
import childProces from 'node:child_process'
import util from 'node:util'

const exec = util.promisify(childProces.exec)

export const config = {
	api: {
		bodyParser: false
	}
}

const generateWebp = () =>
	new Promise(wepResolve => {
		const generateWebpUrl = () => {
			const webpName = `${new Date().getTime()}${Math.floor(Math.random() * 99999)}-%04d.webp`
			const webpPath = path.resolve('public/cdn/', webpName)
			return {webpName, webpPath}
		}

		const filePathExists = () => {
			const f = generateWebpUrl()
			fs.access(f.webpPath, fs.constants.F_OK, err => (err ? wepResolve(f) : filePathExists()))
		}
		return filePathExists()
	})

const generateTemp = filename =>
	new Promise(wepResolve => {
		const type = filename.split('.')

		const generateUrl = () => {
			const name = `${new Date().getTime()}${Math.floor(Math.random() * 99999)}.${type[type.length - 1]}`
			const filePath = path.resolve('temp/', name)
			return {name, filePath}
		}

		const filePathExists = () => {
			const f = generateUrl()
			fs.access(f.filePath, fs.constants.F_OK, err => (err ? wepResolve(f) : filePathExists()))
		}
		return filePathExists()
	})

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
	}

	const fileSet = new Set()

	const imageHandler = new Promise(async (resolve, reject) => {
		const bb = busboy({headers: req.headers})

		bb.on('file', async (name, file, {filename, mimeType}) => {
			if (
				[
					'image/jpeg',
					'image/jpg',
					'image/png',
					'application/pdf',
					'application/vnd.ms-powerpoint',
					'application/vnd.openxmlformats-officedocument.presentationml.presentation',
					'application/vnd.openxmlformats-officedocument.presentationml.template',
					'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
				].indexOf(mimeType) === -1
			) {
				file.resume()
				return reject(new Error(`Image mimeType is invalid :"${mimeType}".`))
			}

			const {filePath} = await generateTemp(filename)
			fileSet.add(filePath)

			const fstream = fs.createWriteStream(filePath)
			file.pipe(fstream)

			fstream.on('finish', async () => {
				const {webpPath} = await generateWebp({filename})

				await exec(`
					convert -units pixelsperinch -density 288 ${filePath} \
					-quality 75 -resize 1920x1080\\> -resize 1920x1080\\< \
					-gravity center -background white -extent 1920x1080 \
					${webpPath}
				`).catch(err => reject(new Error(err)))

				fs.unlink(filePath, e => e && console.error(e))

				fileSet.delete(filePath)
				if (fileSet.size === 0) {
					return resolve()
				}
			})
		})

		req.pipe(bb)
		return
	})

	await imageHandler
		.then(() => res.status(200).send({}))
		.catch(err => {
			console.error(err)
			return res.status(500).send({message: 'Server error'})
		})
}

export default handler
