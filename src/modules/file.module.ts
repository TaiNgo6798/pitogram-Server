import { Module } from '@nestjs/common'
import { FileController } from 'controllers/file.controller'
import { FileService } from 'services/file.service'
import { UserModule } from './user.module'

@Module({
	imports: [UserModule],
	controllers: [FileController],
	providers: [FileService],
	exports: [FileService]
})
export class FileModule {}
