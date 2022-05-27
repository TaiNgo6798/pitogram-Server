import { Module, forwardRef } from '@nestjs/common'
import { ReportResolver } from 'resolvers/report.resolver'

@Module({
	providers: [ReportResolver]
})
export class ReportModule {}
