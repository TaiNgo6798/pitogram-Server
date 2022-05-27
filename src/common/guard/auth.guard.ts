import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import { UserResolver } from 'resolvers/user.resolver'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly userResolver: UserResolver) {}

	async canActivate(context: ExecutionContext) {
		try {
			let authorization
			const req = context.switchToHttp().getRequest() // req from axios
			const gqlCtx = GqlExecutionContext.create(context) // context from graphql

			if (req) {
				const { headers } = req
				authorization = headers.authorization
			} else {
				authorization = gqlCtx.getContext().req.headers.authorization
			}

			const decodedObj = await jwt.verify(
				authorization.split(' ')[1],
				'taingo6798'
			)
			const foundUser = await this.userResolver.getUserByID(decodedObj['_id'])

			if (foundUser) {
				if (req) {
					req.user = foundUser
				} else {
					gqlCtx.getContext().user = foundUser
					gqlCtx.getContext().Authorization = authorization
				}
				return true
			} else {
				return false
			}
		} catch (err) {
			console.log(err)
			return false
		}
	}
}
