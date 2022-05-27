import { Entity, Column, ObjectIdColumn } from 'typeorm'

@Entity({
	name: 'notification'
})
export class NotificationEntity {
	@ObjectIdColumn()
	_id: string
	@Column()
	userID: string // whos noti
	@Column()
	postID: string
	@Column()
	thumb: string
	@Column()
	text: string
	@Column()
	whoInteractive: string
	@Column()
	timeStamp: number
	@Column()
	seen: boolean

	constructor(args: Partial<NotificationEntity>) {
		Object.assign(this, args)
	}
}
