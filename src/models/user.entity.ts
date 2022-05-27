import { Entity, Column, ObjectIdColumn, PrimaryColumn } from 'typeorm'

@Entity({
	name: 'user'
})
export class UserEntity {
	@ObjectIdColumn()
	_id: string

	@PrimaryColumn()
	email: string
	@Column()
	password: string
	@Column()
	firstName: string
	@Column()
	lastName: string
	@Column()
	avatar: string
	@Column()
	coverPhoto: string
	@Column()
	bio: string
	@Column()
	dob: string
	@Column()
	gender: string
	@Column()
	relationship: string
	@Column()
	phone: string
	@Column()
	schools: any
	@Column()
	companies: any
	@Column()
	permissions: any
	@Column()
	lastSeen: number
	@Column()
	unReadFrom: any
	@Column()
	followingPostIDs: string[]
	@Column()
	interestList: string[]
	constructor(args: Partial<UserEntity>) {
		Object.assign(this, args)
	}
}
