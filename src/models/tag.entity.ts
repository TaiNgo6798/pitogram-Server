import { Entity, Column, ObjectIdColumn, PrimaryColumn } from 'typeorm'

@Entity({
	name: 'tag'
})
export class TagEntity {
	@ObjectIdColumn()
	_id: string
	@Column()
	tagName: string
	constructor(args: Partial<TagEntity>) {
		Object.assign(this, args)
	}
}
