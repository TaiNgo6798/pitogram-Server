import { UserEntity } from './user.entity'
import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { PostEntity } from './post.entity'
@Entity({
	name: 'report'
})
export class ReportEntity {
	@ObjectIdColumn()
	_id: string
	@Column()
	reporterID: string
	@Column()
	reporterName: string
	@Column()
	postID: string
	@Column()
	posterID: string
	@Column()
	message: string
	@Column()
	posterName: string
	@Column()
	reportCount: number
	@Column()
	createDate: number
	@Column()
	tags: string[]
	constructor(args: Partial<ReportEntity>) {
		Object.assign(this, args)
	}
}
