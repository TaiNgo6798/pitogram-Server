import { Module } from '@nestjs/common'
import { LikeResolver } from 'resolvers/like.resolver'
import { UserModule } from './user.module'
import { LikeService } from 'services/like.service'
import { NotificationModule } from './notification.module'

@Module({
	imports: [UserModule, NotificationModule],
	providers: [LikeResolver, LikeService],
	exports: [LikeResolver, LikeService]
})
export class LikeModule {}
