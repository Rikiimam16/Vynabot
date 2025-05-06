import fetch from "node-fetch";

let handler = async (m, { conn, command }) => {
  try {
    let who;
    // Memeriksa apakah di grup dan mengambil ID pengguna yang ditandai atau membalas pesan
    if (m.isGroup) {
      who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
      who = m.quoted ? m.quoted.sender : m.sender;
    }

    // Mengambil URL foto profil pengguna
    let pp = await conn.profilePictureUrl(who, "image").catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
    
    // Mengirimkan file dengan thumbnail
    let thumbnail = await (await fetch(pp)).buffer();
    await conn.sendFile(m.chat, pp, "profile-picture.jpg", "Berhasil mengambil foto profil.", m, {
      jpegThumbnail: thumbnail,
    });
  } catch (e) {
    // Jika terjadi error, ambil foto profil pengirim pesan
    let sender = m.sender;
    let pp = await conn.profilePictureUrl(sender, "image").catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
    let thumbnail = await (await fetch(pp)).buffer();
    await conn.sendFile(m.chat, pp, "profile-picture.jpg", "Berhasil mengambil foto profil.", m, {
      jpegThumbnail: thumbnail,
    });
  }
};

// Metadata untuk handler
handler.help = ["getpp <@tag/reply>"];
handler.tags = ["group"];
handler.command = /^(getpp|getpic?t?|pp)$/i;

export default handler;