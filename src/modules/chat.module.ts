import { Module, forwardRef } from '@nestjs/common'
import { ChatResolver } from 'resolvers/chat.resolver'
import { UserModule } from './user.module'

@Module({
	imports: [forwardRef(() => UserModule)],
	providers: [ChatResolver],
	exports: [ChatResolver]
})
export class ChatModule {}
