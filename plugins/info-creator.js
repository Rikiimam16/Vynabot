import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, text, args, command }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let name = await conn.getName(who)

// FAKE KONTAK
 const repPy = {
	key: {
		remoteJid: '0@s.whatsapp.net',
		fromMe: false,
		id: global.info.wm,
		participant: '0@s.whatsapp.net'
	},
	message: {
		requestPaymentMessage: {
			currencyCodeIso4217: "USD",
			amount1000: 999999999,
			requestFrom: '0@s.whatsapp.net',
			noteMessage: {
				extendedTextMessage: {
					text: global.info.namebot,
				}
			},
			expiryTimestamp: 999999999,
			amount: {
				value: 91929291929,
				offset: 1000,
				currencyCode: "INR"
			}
		}
	}
}

  const sentMsg = await conn.sendContactArray(m.chat, [
    [`${global.info.nomerown}`, `${await conn.getName(global.info.nomerown+'@s.whatsapp.net')}`, `RIKI リキ `, `Alone is Fun`, `404 Not Found`, `🇮🇩Indonesia, Pekalongan`, `404 Not Found`, ` Creator Rikz BOTZ`],
    [`${conn.user.jid.split('@')[0]}`, `${await conn.getName(conn.user.jid)}`, `Whatsapp Bot`, `Don't Spam`, `Nothing`, `🇮🇩 Indonesia`, `Nothing`, `Bot MultiDevice`]
  ], repPy)
  await conn.reply(m.chat, `
*About Rikz BOTZ*

Halo! Saya adalah Rikz BOTZ, bot yang dikembangkan oleh RIKIリキ. Saya di sini untuk membantu Anda dengan berbagai kebutuhan seperti bekerja, bermain dan hiburan lainnya. Untuk menggunakan bot, ketik .menu ya

Mari kolaborasi untuk menciptakan solusi cerdas bersama! 
`, sentMsg)
  } 

handler.help = ['owner', 'creator']
handler.tags = ['general']
handler.command = /^(owner|creator)/i
export default handler