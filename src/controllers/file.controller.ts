import {
	Controller,
	Post,
	UseInterceptors,
	Get,
	Res,
	Req,
	HttpException,
	Put,
	UploadedFile,
	UseGuards,
	Body
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from 'services/file.service'
import * as FileType from 'file-type'
import { GqlAuthGuard } from 'common/guard/auth.guard'

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@UseGuards(GqlAuthGuard)
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('file', {
			limits: {
				fileSize: 30 * 1024 * 1024
			}
		})
	)
	async uploadFile(@UploadedFile() file, @Req() req) {
		try {
			const { type } = req.query
			const fileType = (await FileType.fromBuffer(file.buffer)) || false
			if (file.originalname.split('').indexOf('/') !== -1) {
				return new HttpException('Stop hacking this !', 400)
			} else {
				if (fileType && (fileType.ext === 'png' || fileType.ext === 'jpg')) {
					return this.fileService.saveFile(file, type)
				}
				return new HttpException('Unsupported Media Type ', 415)
			}
		} catch (error) {
			console.log(error)
		}
	}

	@UseGuards(GqlAuthGuard)
	@Put('delete')
	async deleteFile(@Req() req) {
		try {
			const { id, type } = req.query
			return this.fileService.deleteFile(id, type)
		} catch (error) {
			return false
		}
	}

	@Get('url')
	async getFileUrl(@Req() req) {
		const { id, type, size } = req.query
		if (id.split('').indexOf('/') !== -1) {
			return new HttpException('Stop hacking this !', 400)
		}
		try {
			return this.fileService.getFileUrl(id, type, size)
		} catch (error) {
			return 'No image'
		}
	}
}
