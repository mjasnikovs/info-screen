import path from 'path'
import {unlink} from 'node:fs/promises'

const handler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(404).send({error: 'Route accepts only post requests. The non-post request was requested.'})
	}

	const data = (() => {
		try {
			return JSON.parse(req.body)
		} catch (e) {
			return e
		}
	})()

	if (data instanceof Error) {
		return res.status(500).send()
	}

	const imagePath = path.resolve('public/cdn/', data.image)

	return unlink(imagePath)
		.then(() => res.status(200).send())
		.catch(() => res.status(500).send())
}

export default handler
