import { Module, forwardRef } from '@nestjs/common'
import { TagResolver } from 'resolvers/tag.resolver'

@Module({
	providers: [TagResolver]
})
export class TagModule {}
