import path from 'path'
import {readdir} from 'node:fs/promises'

const CDN_PATH = path.resolve('public/cdn/')

const handler = async (req, res) => {
	if (req.method !== 'GET') {
		return res.status(404).send({error: 'Route accepts only get requests. The non-get request was requested.'})
	}

	const files = await readdir(CDN_PATH)
	const imageList = files.filter(file => file !== '.gitkeep').sort((a, b) => a.localeCompare(b))
	return res.status(200).send(imageList)
}

export default handler
