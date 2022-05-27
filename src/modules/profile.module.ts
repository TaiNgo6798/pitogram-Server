import { Module } from '@nestjs/common'
import { UserModule } from './user.module'
import { ProfileResolver } from 'resolvers/profile.resolver'

@Module({
	imports: [UserModule],
	providers: [ProfileResolver]
})
export class ProfileModule {}
