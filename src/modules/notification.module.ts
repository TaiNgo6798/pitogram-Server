import { Module } from '@nestjs/common'
import { NotificationResolver } from '@resolvers'
import { UserModule } from './user.module'

@Module({
	imports: [UserModule],
	providers: [NotificationResolver],
	exports: [NotificationResolver]
})
export class NotificationModule {}
