let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
  var id_codingHub = m.chat; // ID grup tertentu jika ingin spesifik
  if (m.chat == id_codingHub) {
    let q = m.quoted ? m.quoted : m; // Memeriksa apakah ada pesan yang dibalas
    let mime = (q.msg || q).mimetype || q.mediaType || ""; // Deteksi tipe media
    text = text
      ? text
      : m.quoted?.text
        ? m.quoted.text
        : m.quoted?.caption
          ? m.quoted.caption
          : m.quoted?.description
            ? m.quoted.description
            : "";
    if (!text)
      throw `Contoh: ${usedPrefix + command} Halo semua, ini pesan untuk kalian!`;

    // Membuat fkontak (dummy pesan kontak)
    let fkontak = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net", // Pesan dummy
        remoteJid: "status@broadcast",
      },
      message: {
        contactMessage: {
          displayName: "Pesan Semua Orang",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Bot;;;\nFN:Bot\nitem1.TEL;waid=0:0\nEND:VCARD",
        },
      },
    };

    if (/video|image/g.test(mime) && !/webp/g.test(mime)) {
      let media = await q.download?.(); // Mengunduh media
      if (!media) throw "Gagal mengunduh media!";
      await conn.sendFile(m.chat, media, "", text, null, false, {
        mentions: participants.map((a) => a.id),
        quoted: fkontak,
      });
    } else {
      await conn.reply(m.chat, text, fkontak, {
        mentions: participants.map((a) => a.id),
      });
    }
  } else {
    throw "Perintah ini hanya bisa digunakan di grup tertentu!";
  }
};

handler.command = /^(everyone)$/i;
handler.group = true;

export default handler;