import { Entity, Column, ObjectIdColumn } from 'typeorm'

@Entity({
	name: 'chat'
})
export class ChatEntity {
	@ObjectIdColumn()
	_id: string
	@Column()
	sendID: string
	@Column()
	receiveID: string
	@Column()
	secretString: string
	@Column()
	text: string
	@Column()
	reactions: [any]
	@Column()
	time: number
	@Column()
	seen: boolean

	constructor(args: Partial<ChatEntity>) {
		Object.assign(this, args)
	}
}
