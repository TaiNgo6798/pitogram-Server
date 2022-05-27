import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql'
import { Photo } from 'generator/graphql.schema'
import { getMongoManager } from 'typeorm'
import { PhotoEntity } from 'models/photo.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@common'

import axios from 'axios'
import { ObjectID } from 'mongodb'

import mediaHost from 'mediaHost'

@Resolver('Photo')
export class PhotoResolver {
	// -----------------------------QUERIES -----------------------------
	@Query()
	async getPhotoByPostID(@Args('postID') postID): Promise<Photo> {
		const res = await getMongoManager().findOne(PhotoEntity, {
			where: {
				postID
			}
		})
		return res
	}

	// ---------MUTATIONS----------------
	@UseGuards(GqlAuthGuard)
	@Mutation()
	async addPhoto(@Args('PhotoInput') photo): Promise<Photo> {
		const newPhoto = new PhotoEntity(photo)
		const res = await getMongoManager().save(PhotoEntity, newPhoto)
		return res
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async deletePhotoByPostID(@Args() input): Promise<boolean> {
		try {
			const { postID, Authorization } = input

			const photoNeedDelete = await getMongoManager().findOne(PhotoEntity, {
				where: {
					postID: new ObjectID(postID)
				}
			})

			const config = {
				headers: {
					'Content-Type': 'text/plain',
					Authorization
				}
			}

			axios.put(
				`${mediaHost}/file/delete?type=post&id=${photoNeedDelete.pathID}`,
				photoNeedDelete.pathID,
				config
			)

			const res = await getMongoManager().findOneAndDelete(PhotoEntity, {
				postID: new ObjectID(postID)
			})
			return res.value ? true : false
		} catch (err) {
			console.log(err)
			console.log('cant delete images')
			return false
		}
	}
}
