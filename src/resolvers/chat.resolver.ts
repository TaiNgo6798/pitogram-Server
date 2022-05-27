import {
	Resolver,
	Args,
	Query,
	Mutation,
	Subscription,
	Context
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../common/guard/auth.guard'
import { ChatEntity } from 'models/chat.entity'
import { getMongoManager } from 'typeorm'
import { PubSub } from 'graphql-subscriptions'
import { ObjectID } from 'mongodb'
import { UnreadMessage } from 'generator/graphql.schema'
import { CHAT_SKIP_STEP } from '@constants'

const pubsub = new PubSub()

@Resolver('Chat')
export class ChatResolver {
	// ------------------QUERIES-------------------------------

	@UseGuards(GqlAuthGuard)
	@Query()
	async getMyUnReadMessages(@Args('_id') myID): Promise<UnreadMessage[]> {
		try {
			const res = await getMongoManager().find(ChatEntity, {
				where: {
					receiveID: myID.toString(),
					seen: false
				},
				select: ['sendID']
			})
			const ids = new Set(res.map(v => v.sendID.toString()))

			return [...ids].map(v => res.find(e => e.sendID.toString() === v))
		} catch (error) {
			console.log('error', error.message)
			return []
		}
	}

	@UseGuards(GqlAuthGuard)
	@Query()
	async getChats(
		@Context() context,
		@Args('input') input
	): Promise<ChatEntity[]> {
		try {
			const { receiveID, skip } = input
			const {
				user: { _id: sendID }
			} = context
			const secretString =
				sendID > receiveID ? sendID + receiveID : receiveID + sendID
			const res = await getMongoManager().find(ChatEntity, {
				where: {
					secretString
				},
				take: CHAT_SKIP_STEP,
				skip,
				order: {
					time: -1
				}
			})
			return res || []
		} catch (error) {
			console.log(error)
			return []
		}
	}

	// ----------------MUTATIONS-----------------------

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async iReadMyChatWith(
		@Context() context,
		@Args('_id') _id
	): Promise<boolean> {
		try {
			const {
				user: { _id: myID }
			} = context
			const secretString = myID > _id ? myID + _id : _id + myID
			const res = await getMongoManager().find(ChatEntity, {
				secretString
			})

			const result = await getMongoManager().save(
				res.map((v: ChatEntity) => {
					v.seen = true
					return v
				})
			)

			return true
		} catch (error) {
			console.log('error', error.message)
			return false
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async submitChatStatus(@Context() context, @Args('input') input) {
		const { receiveID, status } = input
		const {
			user: { _id: sendID }
		} = context
		const secretString =
			sendID > receiveID ? sendID + receiveID : receiveID + sendID
		// tra ve cho subscription
		pubsub.publish('chatTyping', {
			chatTyping: {
				receiveID,
				secretString,
				status
			}
		})
		return input.status
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async sendChat(@Context() context, @Args('input') input): Promise<boolean> {
		try {
			const { receiveID, text } = input
			const {
				user: { _id: sendID }
			} = context
			const secretString =
				sendID > receiveID ? sendID + receiveID : receiveID + sendID
			const newChat = new ChatEntity({
				receiveID,
				sendID,
				text,
				secretString,
				time: Date.now(),
				seen: false
			})
			const res = await getMongoManager().save(newChat)
			// tra ve cho subscription
			pubsub.publish('newChatSentToConversation', {
				newChatSentToConversation: newChat
			})
			pubsub.publish('newChatSentToMe', {
				newChatSentToMe: newChat
			})
			return true
		} catch (error) {
			console.log(error)
			return null
		}
	}

	@UseGuards(GqlAuthGuard)
	@Mutation()
	async reactToAChat(
		@Context() context,
		@Args('input') input
	): Promise<boolean> {
		try {
			const { react, chatID } = input
			const {
				user: { _id: idWho }
			} = context
			const chat = await getMongoManager().findOne(ChatEntity, {
				where: {
					_id: new ObjectID(chatID)
				}
			})
			const currentReact = chat.reactions || [{}]
			if (currentReact.filter(v => v.idWho === idWho).length > 0) {
				// reacted
				const reReact = await getMongoManager().findOneAndUpdate(
					ChatEntity,
					{
						_id: new ObjectID(chatID)
					},
					{
						$set: {
							reactions: currentReact.map(v => {
								if (v.idWho === idWho) {
									v.react = react
								}
								return v
							})
						}
					}
				)
			} else {
				// not reacted
				currentReact.push({ idWho, react })
				const newReact = await getMongoManager().findOneAndUpdate(
					ChatEntity,
					{
						_id: new ObjectID(chatID)
					},
					{
						$set: {
							reactions: currentReact
						}
					}
				)
			}
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	// ---------------------SUBSRIPTIONS-----------------------
	@Subscription('newChatSentToConversation', {
		filter: (payload, variables, context) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription
			// context truyen tu ham onConnect ben module
			const { receiveID } = variables
			const { newChatSentToConversation } = payload
			const {
				req: { _id }
			} = context
			const secretString = _id > receiveID ? _id + receiveID : receiveID + _id
			return newChatSentToConversation.secretString === secretString
		}
	})
	newChatSentToConversation() {
		return pubsub.asyncIterator('newChatSentToConversation')
	}

	@Subscription('newChatSentToMe', {
		filter: (payload, variables, context) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription (post.graphql)
			// context truyen tu ham onConnect ben module
			const { newChatSentToMe } = payload
			const {
				req: { _id }
			} = context
			return newChatSentToMe.receiveID === _id
		}
	})
	newChatSentToMe() {
		return pubsub.asyncIterator('newChatSentToMe')
	}

	@Subscription('chatTyping', {
		filter: (payload, variables, context) => {
			// payload: du lieu tra ve cho subscription
			// variables: cac bien truyen vao tu Graphql Subscription (post.graphql)
			// context truyen tu ham onConnect ben module
			const { receiveID } = variables
			const { chatTyping } = payload
			const {
				req: { _id }
			} = context
			const secretString = _id > receiveID ? _id + receiveID : receiveID + _id // secretString tu subscription()
			return (
				chatTyping.secretString === secretString && chatTyping.receiveID === _id
			)
		}
	})
	chatTyping() {
		return pubsub.asyncIterator('chatTyping')
	}
}
