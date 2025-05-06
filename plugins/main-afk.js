import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender];

    // Menetapkan waktu AFK dan alasan
    user.afk = +new Date();
    user.afkReason = text;

    // Mengambil foto profil pengguna
    let ppUrl = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    // Mengirimkan pesan status AFK
    conn.sendMessage(m.chat, {
        text: `${user.registered ? user.name : conn.getName(m.sender)} is now AFK\n\nReason ➠ ${text ? text : 'Tanpa Alasan'}`,
        contextInfo: {
            externalAdReply: {
                title: 'AFK NOTICE',
                body: global.info.namebot,
                thumbnailUrl: ppUrl,
                sourceUrl: global.url.sgc,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });
};

handler.help = ['afk'].map(v => v + ' <alasan>');
handler.tags = ['group'];
handler.command = /^afk$/i;
handler.premium = true;

export default handler;