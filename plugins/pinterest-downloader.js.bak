import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('pin.it')) 
    return await conn.sendMessage(m.chat, { text: 'Please provide a valid Pinterest link.' }, { quoted: m });

  try {
    // Kirim reaksi loading
    await conn.relayMessage(m.chat, {
      reactionMessage: { 
        key: m.key, 
        text: '⏱️' 
      }
    }, { messageId: m.key.id });

    // Encode URL Pinterest untuk request API
    let encodedUrl = encodeURIComponent(text);
    const response = await fetch(`https://itzpire.com/download/pinterest?url=${encodedUrl}`, {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    const data = await response.json();

    // Cek apakah responsnya berhasil
    if (data.status === "success" && data.data) {
      let videoUrl = data.data.video;
      let imageUrls = data.data.image;

      if (videoUrl) {
        // Perbaiki format URL video jika ada duplikasi "https:"
        if (videoUrl.startsWith('https:https:')) {
          videoUrl = videoUrl.replace('https:https:', 'https:');
        }

        // Kirim video yang sudah diperbaiki
        await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: 'Here is your video!' }, { quoted: m });
      } else if (imageUrls && imageUrls.length > 0) {
        // Kirim gambar jika ditemukan
        for (let image of imageUrls) {
          await conn.sendMessage(m.chat, { image: { url: image }, caption: 'Here is your image!' }, { quoted: m });
        }
      } else {
        // Jika tidak ada media
        await conn.sendMessage(m.chat, { text: 'No media found at the provided link.' }, { quoted: m });
      }
    } else {
      // Handle jika status tidak sukses
      await conn.sendMessage(m.chat, { text: 'Failed to fetch media from the provided link.' }, { quoted: m });
    }
  } catch (error) {
    // Log error lebih detail
    console.error('Error details:', error.message || error);
    await conn.sendMessage(m.chat, { text: `Error: ${error.message || 'Fetching media failed. Please try again later.'}` }, { quoted: m });
  }
};

handler.help = ['pindl'];
handler.tags = ['downloader'];
handler.command = /^pindl$/i;
handler.register = true;

export default handler;
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
HAPUS INI TUMBUH GIGI DI PANTAT
*/ 