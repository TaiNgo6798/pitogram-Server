import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import * as sharp from 'sharp'
import { getStorage } from 'firebase-admin/storage'

@Injectable()
export class FileService {
	async deleteFile(id, type) {
		const path = `social/${type}`
		const bucket = getStorage().bucket('taingoblog.appspot.com')
		if (id) {
			try {
				const sizes = ['small', 'medium', 'large', 'original']
				await Promise.all(
					sizes.map(v => {
						const pathToDel = `${path}/${id}-${v}.jpg`
						return bucket.file(pathToDel).delete()
					})
				)
				return true
			} catch (err) {
				console.log(err)
				return false
			}
		}
		return false
	}

	async saveFile(file, type) {
		try {
			const bucket = getStorage().bucket('taingoblog.appspot.com')
			const id = v4()
			const path = `social/${type}`

			const sizes = [
				{ small: 500 },
				{ medium: 1024 },
				{ large: 2048 },
				{ original: undefined }
			]

			console.time(`uploaded ${id} in`)
			await Promise.all(
				sizes.map(v => {
					// upload to firebase
					const pathToSave = `${path}/${id}-${Object.keys(v)[0]}.jpg`
					return new Promise<void>((resolve, reject) => {
						let sharpFile = sharp(file.buffer)
						if (Object.values(v)[0] !== undefined) {
							sharpFile = sharpFile.resize(Object.values(v)[0])
						}

						sharpFile.toBuffer().then(data => {
							const bucketFile = bucket.file(pathToSave)
							bucketFile.save(data).then(() => {
								bucketFile.makePublic().then(() => resolve())
							})
						})
					})
				})
			)

			console.timeEnd(`uploaded ${id} in`)
			return {
				id,
				originalname: file.originalname,
				size: file.size
			}
		} catch (err) {
			console.log(err.message)
			return false
		}
	}

	async getFileUrl(id, type, size) {
		try {
			// Download a file from your bucket.
			const bucket = getStorage().bucket('taingoblog.appspot.com')
			const file = bucket.file(`social/${type}/${id}-${size}.jpg`)
			return file.publicUrl()
		} catch (error) {
			return false
		}
	}

	async sendFile(id, res, type, size) {
		try {
			// Download a file from your bucket.
			const bucket = getStorage().bucket('taingoblog.appspot.com')
			bucket
				.file(`social/${type}/${id}-${size}.jpg`)
				.download()
				.then(data => {
					const contents = data[0]
					res.send(contents)
				})
				.catch(e => res.json(e.message))
		} catch (error) {
			res.end(error.message)
		}
	}
}
