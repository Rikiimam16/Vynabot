import { sticker } from '../lib/sticker.js'

global.stickpack = "Ytb Vynaa Valerie" // Ganti dengan nama paket stiker
global.stickauth = "S U B S C R I B E" // Ganti dengan nama pembuat stiker

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh penggunaan: ${usedPrefix + command} hai kamu`
    let stiker = await sticker(null, `https://ochinpo-helper.hf.space/brat?text=${text}`, global.stickpack, global.stickauth)
    conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}

handler.help = ['brat']
handler.tags = ['main']
handler.command = /^(brat)$/i
handler.premium = true;

export default handler