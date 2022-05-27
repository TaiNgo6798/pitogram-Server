import {
	Resolver,
	Query,
	Args,
	Mutation,
	Context,
	Subscription,
	ResolveProperty,
	Parent
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'common/guard/auth.guard'
import { getMongoManager } from 'typeorm'
import { CommentEntity } from 'models/comments.entity'
import { UserResolver } from 'resolvers/user.resolver'
import { ObjectID } from 'mongodb'
import { PubSub } from 'graphql-subscriptions'
import { LikeResolver } from './like.resolver'
import { NotificationResolver } from './notification.resolver'
import { PostEntity } from 'models/post.entity'

const pubsub = new PubSub()

@Resolver('Comment')
export class CommentResolver {
	constructor(
		private readonly userResolver: UserResolver,
		private readonly likeResolver: LikeResolver,
		private readonly notiResolver: NotificationResolver
	) {}

	// -----------------------------QUERIES -----------------------------
	@Query()
	async getCommentsByPostID(@Args() args): Promise<CommentEntity[]> {
		try {
			const { skip = 0, limit, postID } = args
			const comments = await getMongoManager().find(CommentEntity, {
				where: {
					postID,
					parentID: postID
				},
				order: {
					time: -1
				},
				skip,
				take: limit || 4
			})
			return comments
		} catch (error) {
			console.log(error)
			return null
		}
	}
	@Query()
	async getCommentsByPostID1(@Args() args): Promise<CommentEntity[]> {
		try {
			const { skip = 0, limit, postID } = args
			const comments = await getMongoManager().find(CommentEntity, {
				where: {
					parentID: postID
				},
				order: {
					time: -1
				},
				skip,
				take: limit || 4
			})
			return comments
		} catch (error) {
			console.log(error)
			return null
		}
	}
	@Query()
	async getCommentsByParentID(@Args() args): Promise<CommentEntity[]> {
		try {
			const { skip = 0, limit, parentID } = args
			const comments = await getMongoManager().find(CommentEntity, {
				where: {
					parentID
				},
				order: {
					time: -1
				},
				skip,
				take: limit || 4
			})
			return comments
		} catch (error) {
			console.log(error)
			return null
		}
	}
	@ResolveProperty('who')
	async getUserByID(@Parent() c) {
		const { userID: id } = c
		const result = await this.userResolver.getUserByID(id)
		return result
	}

	@ResolveProperty('likes')
	async getLikes(@Parent() cmt) {
		const { _id: id } = cmt
		const result = this.likeResolver.getLikesByPostID(id)
		return result
	}

	@UseGuards(GqlAuthGuard)
	@Query()
	async countCommentByPostID(@Args('postID') _id) {
		const result = await getMongoManager().findAndCount(CommentEntity, {
			postID: _id.toString(),
			parentID: _id.toString()
		})
		return result[1]
	}

	// -----------------------------MUTATIONS -----------------------------
	@UseGuards(GqlAuthGuard)
	@Mutation()
	async submitCommentStatus(@Context() context, @Args('input') input) {
		const {
			user: { _id: idWho }
		} = context
		// tra ve cho subscription
		input.idWho = idWho
		pubsub.publish('commentTyping', {
			commentTyping: input
		})
		return input.status
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async editOneComment(
		@Context() context,
		@Args('editInput') editInput
	): Promise<boolean> {
		try {
			const { user } = context
			if (user.permissions.indexOf('EDITCOMMENT') !== -1) {
				const { _id, text } = editInput
				const result = await getMongoManager().findOneAndUpdate(
					CommentEntity,
					{
						_id: new ObjectID(_id)
					},
					{
						$set: {
							text
						}
					}
				)
				return true
			} else {
				return false
			}
		} catch (error) {
			console.log(error)
			return false
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async postOneComment(
		@Context() context,
		@Args('commentInput') commentInput
	): Promise<boolean> {
		try {
			const { user } = context
			if (user.permissions.indexOf('POSTCOMMENT') !== -1) {
				const { postID, text, parentID } = commentInput
				const { user } = context
				const newComment = new CommentEntity({
					userID: user._id,
					postID,
					text,
					time: Date.now(),
					parentID
				})
				const savedResult = await getMongoManager().save(
					CommentEntity,
					newComment
				)
				// create a notification
				const post = await getMongoManager().findOne(PostEntity, postID)
				const savedNoti =
					user._id.toString() !== post.idWho.toString() &&
					(await this.notiResolver.createNotification({
						userID: post.idWho.toString(), // post's owner id
						postID,
						thumb: user.avatar || user.gender,
						text: `${user.firstName} ${user.lastName} commented on your photo.`,
						whoInteractive: user._id.toString(),
						timeStamp: Date.now(),
						seen: false
					}))

				// tra ve cho subscription
				pubsub.publish('commentCreated', {
					commentCreated: newComment
				})
				return true
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}
	@UseGuards(GqlAuthGuard)
	@Mutation()
	async deleteOneComment(
		@Context() context,
		@Args('_id') _id
	): Promise<boolean> {
		try {
			const { user } = context
			if (user.permissions.indexOf('DELETECOMMENT') !== -1) {
				const res = await getMongoManager().findOneAndDelete(CommentEntity, {
					_id: new ObjectID(_id)
				})
				return res.value ? true : false
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}

	// -----------------------------------------------------SUBSCRIPTIONS-------------------------------------------------------------------------
	@Subscription('commentCreated', {
		filter: (payload, variables) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription (post.graphql)
			// Context truyen tu ham onConnect ben module
			const { postID } = variables
			const { commentCreated } = payload
			if (commentCreated.parentID === postID) {
				return true
			}
			return false
		}
	})
	commentCreated() {
		return pubsub.asyncIterator('commentCreated')
	}

	@Subscription('commentTyping', {
		filter: (payload, variables, context) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription (post.graphql)
			// Context truyen tu ham onConnect ben module
			const { postID } = variables
			const { commentTyping } = payload
			const {
				req: { _id }
			} = context
			if (
				commentTyping.postID === postID &&
				commentTyping.idWho.toString() !== _id.toString()
			) {
				return true
			}
			return false
		}
	})
	commentTyping() {
		return pubsub.asyncIterator('commentTyping')
	}
}
