import { Injectable } from '@nestjs/common'
import { CommentEntity } from 'models/comments.entity'
import { getMongoManager } from 'typeorm'

@Injectable()
export class CommentService {
	async deleteCommentOnePost(id: string): Promise<boolean> {
		try {
			const res = await getMongoManager().deleteMany(CommentEntity, {
				postID: id
			})
			return true
		} catch (error) {
			return false
		}
	}
}
