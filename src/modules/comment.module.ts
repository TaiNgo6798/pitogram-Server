import { forwardRef, Module } from '@nestjs/common'
import { CommentResolver } from 'resolvers/comment.resolver'
import { CommentService } from 'services/comment.service'
import { UserModule } from './user.module'
import { LikeModule } from './like.module'
import { NotificationModule } from './notification.module'

@Module({
	imports: [forwardRef(() => UserModule), LikeModule, NotificationModule],
	providers: [CommentResolver, CommentService],
	exports: [CommentResolver, CommentService]
})
export class CommentModule {}
