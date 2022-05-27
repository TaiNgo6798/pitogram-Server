import { ObjectID } from 'mongodb'
import { Tag } from './../generator/graphql.schema'
import { TagEntity } from 'models/tag.entity'
import { getMongoManager } from 'typeorm'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
@Resolver('Tag')
export class TagResolver {
	constructor() {}
	@Query()
	async tags() {
		const res = await getMongoManager().find(TagEntity, {})
		return res
	}
	@Mutation()
	async createTags(@Args('tags') tags): Promise<any> {
		try {
			const res = Promise.all(
				tags.map(tag => {
					const newTag = new TagEntity({
						tagName: tag
					})
					return getMongoManager()
						.findOne(TagEntity, { tagName: tag })
						.then(found => {
							if (!found) {
								getMongoManager().save(TagEntity, newTag)
							}
						})
				})
			)
			return true
		} catch (err) {
			return false
		}
	}
	@Mutation()
	async deleteTag(@Args('_id') _id): Promise<any> {
		try {
			const isValidTag = await getMongoManager().findOne(TagEntity, _id)
			if (isValidTag) {
				const deletedTag = await getMongoManager().findOneAndDelete(TagEntity, {
					_id: new ObjectID(_id)
				})
				return true
			}
			return false
		} catch (err) {
			return false
		}
	}
}
