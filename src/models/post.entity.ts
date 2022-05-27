import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { UserEntity } from './user.entity'

import { LikeEntity } from './likes.entity'
import { PhotoEntity } from './photo.entity'

@Entity({
	name: 'post'
})
export class PostEntity {
	@ObjectIdColumn()
	_id: string

	@Column()
	idWho: string
	@Column()
	who: UserEntity
	@Column()
	photo: PhotoEntity
	@Column()
	description: string
	@Column()
	likes: LikeEntity[]
	@Column()
	time: number
	@Column()
	commentsCount: number
	@Column()
	tags: string[]
	@Column()
	isBlock: boolean
	constructor(args: Partial<PostEntity>) {
		Object.assign(this, args)
	}
}
