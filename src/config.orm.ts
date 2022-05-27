import { NODE_ENV, MONGO_URL } from '@environments'

const orm = {
	development: {
		url: MONGO_URL!
	},
	testing: {
		url: MONGO_URL!
	},
	staging: {
		host: 'localhost',
		username: '',
		password: ''
	},
	production: {
		url: MONGO_URL!
	}
}

export default orm[NODE_ENV!]
