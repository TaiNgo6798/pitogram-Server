import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import chalk from 'chalk'

// Import firebase-admin
import * as admin from 'firebase-admin'

import { ValidationPipe, LoggingInterceptor, TimeoutInterceptor } from 'common'

import {
	NODE_ENV,
	DOMAIN,
	PORT,
	END_POINT,
	STATIC,
	PRIMARY_COLOR,
	PROJECT_ID,
	PRIVATE_KEY,
	CLIENT_EMAIL
} from '@environments'
import { getConnection } from 'typeorm'

declare const module: any

async function bootstrap() {
	try {
		const app = await NestFactory.create<NestExpressApplication>(AppModule)

		app.enableCors({
			origin: true,
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
			credentials: true
		})

		await app.init()

		const adminConfig: admin.ServiceAccount = {
			projectId: PROJECT_ID,
			privateKey: PRIVATE_KEY.replace(/\\n/g, '\n'),
			clientEmail: CLIENT_EMAIL
		}

		// Initialize the firebase admin app
		admin.initializeApp({
			credential: admin.credential.cert(adminConfig),
			databaseURL:
				'https://taingoblog-default-rtdb.asia-southeast1.firebasedatabase.app'
		})

		// NOTE: database connect
		const connection = getConnection('default')
		const { isConnected } = connection
		isConnected
			? Logger.log(`🌨️  Database connected`, 'TypeORM', false)
			: Logger.error(`❌  Database connect error`, '', 'TypeORM', false)

		// NOTE: compression
		app.use(compression())

		// NOTE: added security
		app.use(helmet())

		// NOTE: body parser
		app.use(bodyParser.json({ limit: '50mb' }))
		app.use(
			bodyParser.urlencoded({
				limit: '50mb',
				extended: true,
				parameterLimit: 50000
			})
		)

		// NOTE: rateLimit
		app.use(
			rateLimit({
				windowMs: 1000 * 60 * 60, // an hour
				max: 100!, // limit each IP to 100 requests per windowMs
				message:
					'⚠️  Too many request created from this IP, please try again after an hour'
			})
		)

		// NOTE: interceptors
		app.useGlobalInterceptors(new LoggingInterceptor())
		app.useGlobalInterceptors(new TimeoutInterceptor())

		// NOTE: global nest setup
		app.useGlobalPipes(new ValidationPipe())

		app.enableShutdownHooks()

		// NOTE: size limit
		app.use('*', (req, res, next) => {
			const query = req.query.query || req.body.query || ''
			if (query.length > 2000) {
				throw new Error('Query too large')
			}
			next()
		})

		// NOTE: serve static
		app.useStaticAssets(join(__dirname, `../${STATIC}`))

		await app.listen(PORT!)

		// NOTE: hot module replacement
		if (module.hot) {
			module.hot.accept()
			module.hot.dispose(() => app.close())
		}

		NODE_ENV !== 'production'
			? Logger.log(
					`🚀  Server ready at http://${DOMAIN!}:${chalk
						.hex(PRIMARY_COLOR!)
						.bold(`${PORT!}`)}/${END_POINT!}`,
					'Bootstrap',
					false
			  )
			: Logger.log(
					`🚀  Server is listening on port ${chalk
						.hex(PRIMARY_COLOR!)
						.bold(`${PORT!}`)}`,
					'Bootstrap',
					false
			  )

		NODE_ENV !== 'production' &&
			Logger.log(
				`🚀  Subscriptions ready at ws://${DOMAIN!}:${chalk
					.hex(PRIMARY_COLOR!)
					.bold(`${PORT!}`)}/${END_POINT!}`,
				'Bootstrap',
				false
			)
	} catch (error) {
		Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
		process.exit()
	}
}

bootstrap().catch(e => {
	Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false)
	throw e
})
