import { Entity, Column, ObjectIdColumn } from 'typeorm'

@Entity({
	name: 'photo'
})
export class PhotoEntity {
	@ObjectIdColumn()
	_id: string

	@Column()
	postID: string

	@Column()
	pathID: string
	@Column()
	height: number
	@Column()
	width: number
	@Column()
	artist: string
	@Column()
	copyright: string
	@Column()
	flash: string
	@Column()
	focalLength: number
	@Column()
	iso: number
	@Column()
	lensModel: string
	@Column()
	make: string
	@Column()
	model: string
	@Column()
	createDate: string

	constructor(args: Partial<PhotoEntity>) {
		Object.assign(this, args)
	}
}
