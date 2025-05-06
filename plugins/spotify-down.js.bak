import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [url] = text.split("|");
  if (!url) throw `*Contoh penggunaan:* ${usedPrefix}${command} ⧼url⧽`;

  try {
    let response = await fetch(`https://api.agatz.xyz/api/spotifydl?url=${url}`);
    let data = await response.json();
    
    if (!data.status || !data.data) throw 'Data tidak ditemukan atau terjadi kesalahan dalam mengambil data.';

    let trackData = data.data;
    let audioUrl = trackData.url_audio_v1; // Direct audio URL
    
    if (!audioUrl) throw 'Audio URL tidak tersedia.';

    let caption = `— *Spotify Download Link*

• Channel: ${trackData.nama_channel}
• Title: ${trackData.judul}
• Duration: ${trackData.durasi} seconds`;

    // Send the audio file directly
    await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mp4' }, { caption: caption });

  } catch (err) {
    m.reply(`Error: ${err.message}`);
  }
};

handler.help = ['spotifydl'];
handler.tags = ['downloader'];
handler.command = /^(spotifydl)$/i;
handler.register = true;
handler.premium = false;
handler.limit = true;

export default handler;