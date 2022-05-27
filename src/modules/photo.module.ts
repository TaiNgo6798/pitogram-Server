import { Module } from '@nestjs/common'
import { PhotoResolver } from 'resolvers/photo.resolver'
import { UserModule } from './user.module'

@Module({
	imports: [UserModule],
	providers: [PhotoResolver],
	exports: [PhotoResolver]
})
export class PhotoModule {}
