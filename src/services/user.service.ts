import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UserService {
	async decodeToken(token: string): Promise<any> {
		// TODO:
		// Decode token để lấy object trong token
		try {
			const data = await jwt.verify(token, 'taingo6798')
			return data
		} catch (error) {
			return null
		}
	}
}
