import {
	Resolver,
	Mutation,
	Context,
	Args,
	Subscription
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from 'common/guard/auth.guard'
import { getMongoManager } from 'typeorm'
import { UserEntity } from 'models/user.entity'
import { PubSub } from 'graphql-subscriptions'

import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const pubsub = new PubSub()

// USER RESOLVER CANT USE GUARD SO I NEED TO CREATE PROFILE RESOLVER

@Resolver('Profile')
export class ProfileResolver {
	@UseGuards(GqlAuthGuard)
	@Mutation()
	async imOnline(@Context() context): Promise<boolean> {
		const {
			user: { _id, lastSeen }
		} = context
		const now = Date.now()
		const res = await getMongoManager().findOneAndUpdate(
			UserEntity,
			{
				_id
			},
			{
				$set: {
					lastSeen: now
				}
			}
		)
		// tra ve cho subscription
		pubsub.publish('someOneJustOnline', {
			someOneJustOnline: res.value
				? { _id, oldLastSeen: lastSeen, lastSeen: now }
				: null
		})
		return true
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async updateUserInfo(
		@Context() context,
		@Args('userInfo') userInfo
	): Promise<boolean> {
		try {
			const {
				user: { _id }
			} = context
			const res = await getMongoManager().findOneAndUpdate(
				UserEntity,
				{
					_id
				},
				{
					$set: userInfo
				}
			)
			return true
		} catch (error) {
			return false
		}
	}

	@Subscription('someOneJustOnline', {
		filter: (payload, variables, context) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription (post.graphql)
			// context truyen tu ham onConnect ben module
			const {
				someOneJustOnline: { oldLastSeen }
			} = payload

			// chi tra ve data khi trang thai online thay doi offline => online
			let minute = dayjs().diff(dayjs(oldLastSeen), 'minute')
			if (minute >= 1) {
				return true
			} else {
				return false
			}
		}
	})
	someOneJustOnline() {
		return pubsub.asyncIterator('someOneJustOnline')
	}
}
