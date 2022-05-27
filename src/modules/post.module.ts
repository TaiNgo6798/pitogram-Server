import { forwardRef, Module } from '@nestjs/common'
import { PostResolver } from 'resolvers/post.resolver'
import { UserModule } from './user.module'
import { CommentModule } from './comment.module'
import { FileModule } from './file.module'
import { LikeModule } from './like.module'
import { PhotoModule } from './photo.module'

@Module({
	imports: [UserModule, CommentModule, FileModule, LikeModule, PhotoModule],
	providers: [PostResolver],
	exports: [PostResolver]
})
export class PostModule {}
