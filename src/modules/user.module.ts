import { Module, forwardRef } from '@nestjs/common'
import { UserService } from 'services/user.service'
import { UserResolver } from 'resolvers/user.resolver'
import { ChatModule } from './chat.module'

@Module({
	imports: [UserModule, forwardRef(() => ChatModule)],
	providers: [UserService, UserResolver],
	exports: [UserService, UserResolver]
})
export class UserModule {}
