let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
                ? m.quoted.sender 
                : args[0] 
                    ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
                    : false
    } else {
        who = m.chat
    }
    if (!who) throw `Siapa Yg Mau Di Hapus Premiumnya, Sayang?!`
    
    let user = db.data.users[who]
    if (!user) throw `Pengguna tidak ditemukan di database. Pastikan pengguna sudah terdaftar.`

    user.premium = false
    user.premiumTime = 0

    m.reply(`Success
*Nama:* ${user.name || 'Tidak diketahui'}
Status Premium telah dihapus.`)
}

handler.help = ['delprem']
handler.tags = ['owner']
handler.command = /^(del|hapus|\-)p(rem)?$/i

handler.group = true 
handler.owner = true

export default handler