import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { UserEntity } from './user.entity'

@Entity({
	name: 'likes'
})
export class LikeEntity {
	@ObjectIdColumn()
	_id: string

	@Column()
	who: UserEntity
	@Column()
	parentID: string
	@Column()
	idWho: string
	@Column()
	react: any

	constructor(args: Partial<LikeEntity>) {
		Object.assign(this, args)
	}
}
