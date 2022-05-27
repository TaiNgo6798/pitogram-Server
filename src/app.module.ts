import { CacheModule, Module, HttpModule } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import * as jwt from 'jsonwebtoken'

import { CacheService, TypeOrmService } from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { ConfigModule } from '@nestjs/config'
import * as Resolvers from './resolvers'
import * as Modules from './modules'

@Module({
	imports: [
		ScheduleModule.forRoot(),
		GraphQLModule.forRootAsync({
			useFactory: () => ({
				typePaths: ['./**/*.graphql'],
				context: ({ req, connection }) => {
					if (connection) {
						return {
							req: connection.context // tra data ve cho filter trong subscription
						}
					}
					return { req }
				},
				installSubscriptionHandlers: true,
				subscriptions: {
					onConnect: (params, ws) => {
						try {
							const token = params['Authorization'].split(' ')[1]
							const decodedObj = jwt.verify(token, 'taingo6798')
							// return data den context trong filter o resolver
							return decodedObj
						} catch (err) {
							return false
						}
					}
				}
			})
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		HttpModule,
		...Object.values(Modules),
		ConfigModule.forRoot({ isGlobal: true })
	],
	controllers: [AppController],
	providers: [...Object.values(Resolvers), AppService]
})
export class AppModule {}
