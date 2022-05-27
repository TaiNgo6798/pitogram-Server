import * as nodemailer from 'nodemailer'

async function sendMail(
	email: string,
	subject: string,
	text: string
): Promise<boolean> {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'taingosocial@gmail.com',
				pass: 'Ngothanhtai6798' // naturally, replace both with your real credentials or an application-specific password
			}
		})

		const mailOptions = {
			to: email,
			subject,
			text
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error)
				return false
			} else {
				return true
			}
		})
		return true
	} catch (error) {
		return false
	}
}

export { sendMail }
