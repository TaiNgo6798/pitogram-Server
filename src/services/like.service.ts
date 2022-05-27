import { Injectable } from '@nestjs/common'
import { getMongoManager } from 'typeorm'
import { LikeEntity } from 'models/likes.entity'

@Injectable()
export class LikeService {
	async deleteLikeOnePost(postID): Promise<boolean> {
		try {
			const res = await getMongoManager().deleteMany(LikeEntity, {
				postID
			})
			return true
		} catch (error) {
			return false
		}
	}
}
