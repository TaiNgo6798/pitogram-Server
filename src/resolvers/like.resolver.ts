import {
	Resolver,
	Query,
	Args,
	ResolveProperty,
	Parent,
	Mutation,
	Context,
	Subscription
} from '@nestjs/graphql'
import { Like } from 'generator/graphql.schema'
import { getMongoManager } from 'typeorm'
import { LikeEntity } from 'models/likes.entity'
import { UserResolver } from 'resolvers/user.resolver'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'common/guard/auth.guard'
import { UserEntity } from 'models/user.entity'
import { NotificationResolver } from './notification.resolver'
import { PostEntity } from '@models'

@Resolver('Like')
@UseGuards(GqlAuthGuard)
export class LikeResolver {
	constructor(
		private readonly userResolver: UserResolver,
		private readonly notiResolver: NotificationResolver
	) {}

	@Query()
	async getLikesByPostID(@Args('parentID') parentID): Promise<Like[]> {
		const res = await getMongoManager().find(LikeEntity, {
			parentID: parentID.toString()
		})
		return res
	}

	@ResolveProperty('who')
	async getUser(@Parent() like) {
		const { idWho } = like
		const res = await this.userResolver.getUserByID(idWho)
		return res
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async unLike(
		@Context() context,
		@Args('parentID') parentID
	): Promise<boolean> {
		try {
			const { _id: idWho } = context.user
			const result = await getMongoManager().findOneAndDelete(LikeEntity, {
				parentID,
				idWho
			})
			return result ? true : false
		} catch {
			return false
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async doLike(
		@Context() context,
		@Args('likeInput') likeInput
	): Promise<boolean> {
		try {
			const { _id: idWho } = context.user
			const { parentID, react } = likeInput
			const currentLikes = await getMongoManager().find(LikeEntity, {
				parentID,
				idWho
			})
			const who = await getMongoManager().findOne(UserEntity, idWho)
			const post = await getMongoManager().findOne(PostEntity, parentID)

			if (who) {
				if (currentLikes.length === 0) {
					const newLike = new LikeEntity({
						parentID,
						idWho,
						react
					})
					const savedRes = await getMongoManager().save(LikeEntity, newLike)

					// create a notification
					const savedNoti =
						idWho.toString() !== post.idWho.toString() &&
						(await this.notiResolver.createNotification({
							userID: post.idWho.toString(), // post's owner id
							postID: parentID.toString(),
							thumb: who.avatar || who.gender,
							text: `${who.firstName} ${who.lastName} ${react} your photo.`,
							whoInteractive: idWho.toString(),
							timeStamp: Date.now(),
							seen: false
						}))
				} else {
					if (currentLikes[0].react !== react) {
						const res = await getMongoManager().findOneAndUpdate(
							LikeEntity,
							{
								parentID,
								idWho
							},
							{
								$set: {
									react
								}
							}
						)
					}
				}
				return true
			}
			return false
		} catch (error) {
			console.log(error)
			return false
		}
	}
}
