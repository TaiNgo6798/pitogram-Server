import { ObjectID } from 'mongodb'
import {
	Resolver,
	Mutation,
	Args,
	Query,
	ResolveProperty,
	Parent
} from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import { getMongoManager } from 'typeorm'
import { UserEntity } from 'models/user.entity'
import { User } from 'generator/graphql.schema'
import { sendMail } from 'common/email'
import { ChatResolver } from './chat.resolver'
import { Inject, forwardRef } from '@nestjs/common'

// USER RESOLVER CANT USE GUARD SO I NEED TO CREATE PROFILE RESOLVER

const saltRounds = 10
@Resolver('User')
export class UserResolver {
	constructor(
		@Inject(forwardRef(() => ChatResolver))
		private readonly chatResolver: ChatResolver
	) {}

	@ResolveProperty('unReadFrom')
	async getUnreadList(@Parent() u) {
		try {
			const { _id } = u
			const result = await this.chatResolver.getMyUnReadMessages(_id)
			return result
		} catch (error) {
			console.log(error)
		}
	}
	// -----------------------------QUERIES -----------------------------
	@Query()
	async users(): Promise<User[]> {
		const res = await getMongoManager().find(UserEntity, {})
		return res
	}

	@Query()
	async getUserByID(@Args('_id') _id): Promise<User> {
		try {
			if (_id.length === 0) {
				return null
			}
			const res = await getMongoManager().findOne(UserEntity, _id)
			return res
		} catch (error) {
			return null
		}
	}

	// -----------------------------MUTATIONS -----------------------------

	@Mutation()
	async resetPassword(@Args('email') email): Promise<boolean> {
		try {
			const res = await sendMail(email, 'Reset mat khau', 'doi mk ban oiii !')
			return res
		} catch (error) {
			return false
		}
	}

	@Mutation()
	async login(@Args('loginInput') loginInput): Promise<any> {
		const { email, password } = loginInput
		const user = await getMongoManager().findOne(UserEntity, {
			email
		})
		try {
			if (bcrypt.compareSync(password, user.password)) {
				if (user.permissions.indexOf('ACCESS') !== -1) {
					const {
						_id,
						firstName,
						lastName,
						avatar,
						dob,
						gender,
						permissions,
						unReadFrom
					} = user
					const token = jwt.sign(
						{
							_id,
							email,
							firstName,
							lastName,
							avatar,
							dob,
							gender,
							permissions,
							unReadFrom
						},
						'taingo6798'
					)
					return {
						status: 2,
						message: 'Dang nhap thanh cong  !',
						token
					}
				} else {
					return {
						status: 1,
						message: 'locked'
					}
				}
			} else {
				return {
					status: 1,
					message: 'Sai mat khau !'
				}
			}
		} catch (err) {
			console.log(err)
			return {
				status: 0,
				message: 'Dang nhap that bai !'
			}
		}
	}

	@Mutation()
	async createUser(@Args('user') user): Promise<any> {
		try {
			const { email, password, firstName, lastName, avatar, gender } = user

			const permissions = [
				'ACCESS',
				'POST',
				'DELETE',
				'EDIT',
				'POSTCOMMENT',
				'EDITCOMMENT',
				'DELETECOMMENT'
			]

			const newUser = new UserEntity({
				email,
				password: bcrypt.hashSync(password, saltRounds),
				firstName,
				lastName,
				avatar,
				coverPhoto: '',
				bio: '',
				dob: '',
				gender,
				relationship: null,
				phone: null,
				schools: [],
				companies: [],
				permissions,
				lastSeen: Date.now()
			})
			const duplicateUser = await getMongoManager().findOne(UserEntity, {
				email
			})
			if (!duplicateUser) {
				const savedRes = await getMongoManager().save(UserEntity, newUser)
				return true
			}
			return false
		} catch (err) {
			return false
		}
	}
	@Mutation()
	async updateUser(@Args('_id') _id, @Args('interest') interest) {
		try {
			const isUser = await getMongoManager().findOne(UserEntity, _id)
			console.log(isUser)
			if (isUser) {
				const updatedUser = await getMongoManager().findOneAndUpdate(
					UserEntity,
					{
						_id: new ObjectID(_id)
					},
					{
						$set: { interestList: interest }
					}
				)
				return true
			}
			return false
		} catch (err) {
			console.log(err)
			return false
		}
	}
	@Mutation()
	async updateUserPermission(@Args('_id') _id, @Args('permiss') permiss) {
		try {
			const isUser = await getMongoManager().findOne(UserEntity, _id)
			if (isUser) {
				const updatedUser = await getMongoManager().findOneAndUpdate(
					UserEntity,
					{
						_id: new ObjectID(_id)
					},
					{
						$set: { permissions: permiss }
					}
				)
				return true
			}
			return false
		} catch (err) {
			console.log(err)
			return false
		}
	}
}
