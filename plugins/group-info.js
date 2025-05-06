import fetch from "node-fetch";

let handler = async (m, { conn, participants, groupMetadata }) => {
    try {
        // Mendapatkan URL foto profil grup
        let pp = await conn.profilePictureUrl(m.chat, "image").catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

        // Mengambil buffer untuk thumbnail
        let thumbnail = await (await fetch(pp)).buffer();

        // Mengambil informasi grup
        const { isBanned, welcome, pembatasan, sWelcome, sBye, sPromote, isDetect, sDemote, antiLink, antiVirtex, antiBadword, antiLinkWa, viewonce, nsfw, rpg, game, delete: del } = global.db.data.chats[m.chat];
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';

        let text = `
*ID Grup:* ${groupMetadata.id}
*Nama Grup:* ${groupMetadata.subject}
*Deskripsi:* ${groupMetadata.desc?.toString() || 'Tidak tersedia'}
*Total Anggota:* ${participants.length} anggota
*Pemilik Grup:* @${owner.split('@')[0]}
*Admin Grup:*
${listAdmin}

*Pengaturan Grup:*
${isBanned ? '✅' : '❌'} Banned
${isDetect ? '✅' : '❌'} Detect
${welcome ? '✅' : '❌'} Welcome
${pembatasan ? '✅' : '❌'} Restrict
${del ? '❌' : '✅'} Anti Delete
${antiLink ? '✅' : '❌'} Anti Link
${antiVirtex ? '✅' : '❌'} Anti Virtex
${antiBadword ? '✅' : '❌'} Anti BadWord
${antiLinkWa ? '✅' : '❌'} Anti LinkWa
${viewonce ? '✅' : '❌'} Anti ViewOnce
${nsfw ? '✅' : '❌'} Nsfw
${rpg ? '✅' : '❌'} Rpg Game
${game ? '✅' : '❌'} Game

*Pesan Grup:*
Welcome: ${sWelcome || 'Tidak diatur'}
Bye: ${sBye || 'Tidak diatur'}
Promote: ${sPromote || 'Tidak diatur'}
Demote: ${sDemote || 'Tidak diatur'}
`.trim();

        // Mengirim pesan dengan foto grup dan informasi
        await conn.sendFile(m.chat, pp, "group-picture.jpg", text, m, {
            jpegThumbnail: thumbnail,
            mentions: [...groupAdmins.map(v => v.id), owner],
        });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, "Terjadi kesalahan saat mengambil informasi grup.", m);
    }
};

handler.help = ['infogrup'];
handler.tags = ['group'];
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i;

handler.group = true;

export default handler;