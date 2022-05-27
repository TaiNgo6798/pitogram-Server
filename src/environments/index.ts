import * as dotenv from 'dotenv'
dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development'

// author
const AUTHOR: string = process.env.AUTHOR || 'TaiNgo'

// application
const DOMAIN: string = process.env.DOMAIN || 'localhost'
const PORT: number = +process.env.PORT || 6798
const END_POINT: string = process.env.END_POINT || 'graphql'
const PRIMARY_COLOR: string = '#87e8de'

// static
const STATIC: string = process.env.STATIC || 'static'

// mongodb
const MONGO_URL: string =
	'mongodb://taingouser:taingo6798@103.92.28.75:27017/pitogram_social'

// firebase
const PROJECT_ID: string = 'taingoblog'
const PRIVATE_KEY_ID: string = '913c45ca74309c585df600d2306f901750ae1017'
const PRIVATE_KEY: string =
	'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDO6tFHBSSISIPL\nqiTf4TY7iXwSW0vQJexSJeIg9WioX5iCjkWNLgd+Q7S8+BkHBRIATDYJKQtLAs4g\nJWC3raEvtPbUX6y1/WMWELMtP4n5qOL+4zmQb6Z43+2V7WkQnniGZiqQcDGYNpmI\n1Y8JvY17Vy2aIOclySTHiGwjTqnVDuwiQ3PLcG4RvSrsDJrqFr2kMtultx1sNFMU\nXoe2jviKI9+Ts706zQZLwlTljw65vrdg/m1r5OMjm3PAqONoY1UCTYPXLEBjG82N\nIqqHvVGi+WeVKjD6ZnOI8awbcpCmvxN2SHsGup/zyo3i1s9sQ7s2k45XaFrLe6Kb\n/4yP19IrAgMBAAECggEAJyJcQG1lkmz8mEluvfUPV8VR9PrVZOG3R3YoxYkEqUuj\nQZX86424FxZhGZhmy2AXHn1LfwIHQ8GdEJFhMHwjTy2PvWz28lihI+w2pyksRE6/\n1+tL2Nh1CMl5WvDS/TSroOezxyuhBaPV9/5EFliGaLx9QHhWn1vim+ZeZXMcRdI8\ng37rYQHc+D4vVAFpERDjNFKNvIX1R1Ja4mqD2uFE21Ka4KpINPfXWSaO996/D1P2\nUNwYfEDP0O0RAdrzyikxciHJkXfZsEYLgBOXKg7d+UvFAgW38XA6KxYF2C/4d8x3\nk6s0To1ci72pFGbWDLnf/FcTukrwTANAH+AB07YwQQKBgQDydJrmzprMPIGm16WS\nZVl4Wz24JIX7EqHyh77W9GpCA1fxqMw0kU8StvBQ2VE+zAXPA1UcreFM9/obIksq\nF7n1qptgVftBVhWe6lkXnSqilN8oTRkSuOzxYK0a0mXG1j6/tGn26wJvgTuMza+O\n4rMk5r2WyzD5fcv4MC/nbRpsiwKBgQDaeflz+k9NZjd/U1GCxv8mUjHWjFSZrhKh\njPIsxkA6l+ine85W1zfDr6FqaxaScQ6wYMA70CRCTVGK3sO32KpKEBCSmDDT7IAa\nuTHOnLVsHR93XCsZ2nOWyJ4aEa6IbiaUe4cm/Jn96ALABdnQFpFWLacqLrRHvEY6\nEEWqTgzE4QKBgQDycrX/fbR/7TV9IIGaPizU1PCH9kXgRsaZHzMwAmNLNcq4hiIF\noxTeUv9G6bl7wUtBskRnFF2KuSJqBcYCBo3XYs5S7Ef/EtU1/4Qtv+VFhPcOduJO\nvYt66EDR5HkP92fyDbg0yNa7qBBjgb8/c+TOTsphQzjrE+dmfNE6a/iTdwKBgQCB\n5f/xeyRnipz4sVtHfHX8HObQ/8LVVPBy6VCcWouZyvRjkHMQowne6a/5jA5xp5Lq\nP7xMU+cbHMmc3fJUfxhQzNhtsNtnRbitKut4QyiDTZWF7GEcEAyl3EZUjarOJ1/8\n7K1g+tO8aZQpA9GLrb9gE+jOZdJ+zGyc3UvuhFWHQQKBgCq07p0NmP3F/YzeNapm\nI+odm+49o6X13ijcULlXeXqA5EMizE/ZBSOuIo5sNT2A0BPjFpvptvtBkg2ZAeve\nfKpGh/W4Qo66++Hja5nLvDaS2AD4T4GT0ijXyyDkYdeF1wh3wlLph2jy7CvCZe8v\nbqLdjPolm9zLlyTsqwM7TfpV\n-----END PRIVATE KEY-----\n'
const CLIENT_EMAIL: string =
	'firebase-adminsdk-59fws@taingoblog.iam.gserviceaccount.com'
const CLIENT_ID: string = '110912639478969256548'
const AUTH_URI: string = 'https://accounts.google.com/o/oauth2/auth'
const TOKEN_URI: string = 'https://oauth2.googleapis.com/token'
const AUTH_PROVIDER_X509_CERT_URL: string =
	'https://www.googleapis.com/oauth2/v1/certs'
const CLIENT_X509_CERT_URL: string =
	'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-59fws%40taingoblog.iam.gserviceaccount.com'

export {
	NODE_ENV,
	AUTHOR,
	DOMAIN,
	PORT,
	END_POINT,
	STATIC,
	MONGO_URL,
	PRIMARY_COLOR,
	PROJECT_ID,
	PRIVATE_KEY_ID,
	PRIVATE_KEY,
	CLIENT_EMAIL,
	CLIENT_ID,
	AUTH_URI,
	TOKEN_URI,
	AUTH_PROVIDER_X509_CERT_URL,
	CLIENT_X509_CERT_URL
}
