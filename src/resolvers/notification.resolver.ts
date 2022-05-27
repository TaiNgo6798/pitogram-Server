import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql'
import { getMongoManager } from 'typeorm'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'common/guard/auth.guard'
import { NotificationEntity } from 'models/notification.entity'
import { ObjectID } from 'mongodb'
import { PubSub } from 'graphql-subscriptions'
const pubsub = new PubSub()

@Resolver('Notification')
export class NotificationResolver {
	@Query()
	async getNotiByUserID(@Args('userID') userID): Promise<NotificationEntity[]> {
		const res = await getMongoManager().find(NotificationEntity, {
			where: {
				userID: userID.toString()
			},
			order: {
				timeStamp: -1
			}
		})
		return res
	}

	@Query()
	async getAllNoti(): Promise<NotificationEntity[]> {
		const res = await getMongoManager().find(NotificationEntity, {
			order: {
				timeStamp: -1
			}
		})
		return res
	}

	// ---------MUTATIONS----------------
	@UseGuards(GqlAuthGuard)
	@Mutation()
	async createNotification(
		@Args('notiInput') notiInput
	): Promise<NotificationEntity> {
		const newNoti = new NotificationEntity(notiInput)
		const res = await getMongoManager().save(NotificationEntity, newNoti)

		// tra ve cho subscription
		pubsub.publish('notiAdded', {
			notiAdded: newNoti
		})
		return res
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async deleteNotification(@Args('_id') _id): Promise<boolean> {
		const res = await getMongoManager().findOneAndDelete(NotificationEntity, {
			_id: new ObjectID(_id)
		})
		return res['value'] ? true : false
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async deleteAllNotification(): Promise<boolean> {
		const res = await getMongoManager().deleteMany(NotificationEntity, {})
		return true
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async iReadMyNoti(@Args('_id') _id): Promise<boolean> {
		const result = await getMongoManager().findOneAndUpdate(
			NotificationEntity,
			{
				_id: new ObjectID(_id)
			},
			{
				$set: {
					seen: true
				}
			}
		)
		return result['value'] ? true : false
	}

	// -----------------------------------------------------SUBSCRIPTIONS-------------------------------------------------------------------------
	@Subscription('notiAdded', {
		filter: (payload, variables, context) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription (post.graphql)
			// Context truyen tu ham onConnect ben module
			const {
				req: { _id: userID } // who just like or cmt
			} = context

			const { notiAdded } = payload
			if (
				notiAdded.userID.toString() === userID.toString() &&
				userID.toString() !== notiAdded.whoInteractive.toString()
			) {
				return true
			}
			return false
		}
	})
	notiAdded() {
		return pubsub.asyncIterator('notiAdded')
	}
}
