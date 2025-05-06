import { Sticker } from 'wa-sticker-formatter'
import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split`|`
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `Balas gambar dengan perintah\n\n${usedPrefix + command} <${atas ? atas : 'teks atas'}>|<${bawah ? bawah : 'teks bawah'}>`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `_*Mime ${mime} tidak didukung!*_`
    
    m.reply('Tunggu sebentar...')
    
    // Download gambar dari pesan
    let img = await q.download()
    
    // Upload gambar ke Itzpire
    let form = new FormData()
    form.append('file', img, 'image.png') // 'image.png' bisa disesuaikan dengan jenis file

    let response = await fetch('https://itzpire.com/tools/upload', {
        method: 'POST',
        body: form,
        headers: {
            'accept': '*/*'
        }
    })

    if (!response.ok) throw 'Gagal mengunggah gambar!'
    let json = await response.json()
    
    if (json.status !== 'success') throw 'Upload gagal!'
    
    let url = json.fileInfo.url
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : ' ')}/${encodeURIComponent(bawah ? bawah : ' ')}.png?background=${url}`
    
    // Buat stiker dari meme URL
    let stiker = await createSticker(meme, false, '', '')
    
    // Kirim stiker ke chat
    await conn.sendFile(m.chat, stiker, '', '', m, '')
}

handler.help = ['smeme <text>|<text>']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i
handler.limit = true
export default handler

// Fungsi untuk membuat stiker
async function createSticker(img, url, packName, authorName, quality) {
    let stickerMetadata = {
        type: 'full',
        pack: stickpack,
		author: stickauth,
        quality: quality || 100 // Kualitas stiker
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/