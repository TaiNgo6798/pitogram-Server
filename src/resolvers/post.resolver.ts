import { ReportEntity } from './../models/report.entity'
import {
	Resolver,
	Query,
	Context,
	Mutation,
	Args,
	ResolveProperty,
	Parent
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'common/guard/auth.guard'
import { getMongoManager } from 'typeorm'
import { PostEntity } from 'models/post.entity'
import { ObjectID } from 'mongodb'
import { CommentService } from 'services/comment.service'
import { UserResolver } from 'resolvers/user.resolver'
import { Post } from 'generator/graphql.schema'
import { LikeResolver } from 'resolvers/like.resolver'
import { LikeService } from 'services/like.service'
import { CommentResolver } from 'resolvers/comment.resolver'

import { PhotoEntity } from 'models/photo.entity'
import { PhotoResolver } from './photo.resolver'

@Resolver('Post')
export class PostResolver {
	constructor(
		private readonly photoResolver: PhotoResolver,
		private readonly commentService: CommentService,
		private readonly commentResolver: CommentResolver,
		private readonly userResolver: UserResolver,
		private readonly likeResolver: LikeResolver,
		private readonly likeService: LikeService
	) {}

	// -----------------------------QUERIES -----------------------------
	@Query()
	async posts(@Args() args): Promise<Post[]> {
		const { skip, limit } = args
		const postList = await getMongoManager().find(PostEntity, {
			skip,
			take: limit || 50,
			order: {
				time: 'DESC'
			}
		})
		return postList
	}

	@Query()
	async getPostsByUserID(@Args() input): Promise<Post[]> {
		const limit = 30
		const { skip, userID: idWho } = input
		const postList = await getMongoManager().find(PostEntity, {
			where: {
				idWho: new ObjectID(idWho.toString())
			},
			skip,
			take: limit,
			order: {
				time: -1
			}
		})
		return postList
	}

	@ResolveProperty('who')
	async getUserByID(@Parent() p) {
		const { idWho: id } = p
		const result = await this.userResolver.getUserByID(id)
		return result
	}

	@ResolveProperty('photo')
	async getPhotoByPostID(@Parent() p) {
		const { _id } = p
		const result = await this.photoResolver.getPhotoByPostID(_id)
		return result
	}

	@ResolveProperty('likes')
	async getLikes(@Parent() post) {
		const { _id: id } = post
		const result = this.likeResolver.getLikesByPostID(id)
		return result
	}

	@ResolveProperty('commentsCount')
	async countCmt(@Parent() post) {
		const { _id: postID } = post
		const result = await this.commentResolver.countCommentByPostID(postID)
		return result
	}

	@Query()
	async getOnePost(@Args('_id') _id): Promise<Post> {
		try {
			const savedResult = await getMongoManager().findOne(PostEntity, {
				where: {
					_id: new ObjectID(_id)
				}
			})
			return savedResult
		} catch (error) {
			console.log(error)
			return null
		}
	}

	@Query()
	async getImagesByUserID(
		@Args('userID') _id,
		@Args('limit') limit
	): Promise<PostEntity[]> {
		try {
			const savedResult = await getMongoManager().find(PostEntity, {
				where: { idWho: new ObjectID(_id) },
				select: ['photo', '_id'],
				take: limit,
				order: {
					time: 'DESC'
				}
			})
			return savedResult
		} catch (error) {
			console.log(error)
			return null
		}
	}

	@Query()
	async countPostByMonths(@Args('months') months): Promise<any[]> {
		const res = await getMongoManager().find(PostEntity, {
			select: ['time']
		})

		const o = {}
		res.map(v => {
			const t = new Date(v.time)
			const m = t.getMonth() + 1
			if (months.includes(m)) {
				o[m] = (o[m] || 0) + 1
			}
		})

		return [
			{
				month: 0,
				count: res.length
			},
			...months.map(m => {
				return {
					month: m,
					count: o[m] || 0
				}
			})
		]
	}

	@Query()
	async search(@Args() args): Promise<PostEntity[]> {
		try {
			const { skip, limit, keywords } = args
			const savedResult = await getMongoManager().find(PostEntity, {
				where: {
					tags: {
						$elemMatch: {
							$in: keywords
						}
					}
				},
				skip,
				take: limit || 50,
				order: {
					time: 'DESC'
				}
			})
			return savedResult
		} catch (error) {
			console.log(error)
			return null
		}
	}

	// -----------------------------MUTATIONS -----------------------------

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async addPost(@Context() context, @Args('post') post): Promise<Post> {
		try {
			const { user } = context
			if (user.permissions.indexOf('POST') !== -1) {
				const { description = '', photo, tags = [] } = post
				const newPost = new PostEntity({
					idWho: user._id,
					tags,
					description,
					time: Date.now()
				})
				const savedResult = await getMongoManager().save(PostEntity, newPost) // tao post

				if (savedResult) {
					const newPhoto = new PhotoEntity({
						...photo,
						postID: savedResult._id
					})
					const savedPhoto = await getMongoManager().save(PhotoEntity, newPhoto) // luu hinh
				}
				return savedResult
			} else {
				return null
			}
		} catch (error) {
			return null
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async deletePost(
		@Context() context,
		@Args('deleteInput') deleteInput
	): Promise<boolean> {
		try {
			const {
				user: { permissions, _id },
				Authorization
			} = context

			const { postID } = deleteInput
			const postNeedDelete = await getMongoManager().findOne(PostEntity, {
				where: {
					_id: new ObjectID(postID)
				}
			})

			if (
				(permissions.indexOf('DELETE') !== -1 &&
					postNeedDelete.idWho.toString() === _id.toString()) ||
				permissions.indexOf('ADMIN') !== -1
			) {
				const reportList = await getMongoManager().find(ReportEntity, {
					postID
				})
				for (const r of reportList) {
					const update = await getMongoManager().findOneAndDelete(
						ReportEntity,
						{
							_id: new ObjectID(r._id)
						}
					)
				}
				const res = await Promise.all([
					this.photoResolver.deletePhotoByPostID({
						Authorization,
						postID
					}),
					this.likeService.deleteLikeOnePost(postID),
					this.commentService.deleteCommentOnePost(postID),

					getMongoManager().findOneAndDelete(PostEntity, {
						_id: new ObjectID(postID)
					})
				])

				return res[3].value ? true : false
			} else {
				console.log('no permission')
				return false
			}
		} catch (err) {
			console.log(err)
			return false
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async updatePost(@Context() context, @Args('post') post): Promise<boolean> {
		try {
			const { user } = context
			const { _id, description, tags } = post
			const postNeedEdit = await getMongoManager().findOne(PostEntity, {
				where: {
					_id: new ObjectID(_id)
				}
			})
			if (
				user.permissions.indexOf('EDIT') !== -1 &&
				user._id.toString() === postNeedEdit.idWho.toString()
			) {
				const res = await getMongoManager().findOneAndUpdate(
					PostEntity,
					{
						_id: new ObjectID(_id)
					},
					{
						$set: {
							description
						}
					}
				)
				return res.value ? true : false
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}
	@UseGuards(GqlAuthGuard)
	@Mutation()
	async blockAndUnblockCmt(
		@Context() context,
		@Args('post') post
	): Promise<boolean> {
		try {
			const { user } = context
			const { _id, isBlock } = post
			const postNeedEdit = await getMongoManager().findOne(PostEntity, {
				where: {
					_id: new ObjectID(_id)
				}
			})
			if (
				user.permissions.indexOf('EDIT') !== -1 &&
				user._id.toString() === postNeedEdit.idWho.toString()
			) {
				const res = await getMongoManager().findOneAndUpdate(
					PostEntity,
					{
						_id: new ObjectID(_id)
					},
					{
						$set: {
							isBlock
						}
					}
				)
				return res.value ? true : false
			} else {
				return false
			}
		} catch (error) {
			return false
		}
	}
}
