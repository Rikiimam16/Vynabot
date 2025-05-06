import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) 
    return await conn.sendMessage(m.chat, { text: 'Silakan gunakan format: .ai [pertanyaan]' }, { quoted: m });

  try {
    // Kirim reaksi loading
    await conn.relayMessage(m.chat, {
      reactionMessage: { 
        key: m.key, 
        text: '⏱️' 
      }
    }, { messageId: m.key.id });

    // Encode teks untuk permintaan API
    let encodedText = encodeURIComponent(text);
    const response = await fetch(`https://api.tioo.eu.org/openai?text=${encodedText}`, {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    const data = await response.json();

    // Periksa status dan format data
    if (data?.status) {
      const aiResponse = data.result || 'Tidak ada respons AI.';
      
      // Format pesan
      let responseText = `
*AI*: ${aiResponse}
      `.trim();

      await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: 'Gagal mendapatkan respons dari API. Coba lagi nanti.' }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.' }, { quoted: m });
  }
};

handler.help = ['ai'];
handler.tags = ['ai'];
handler.command = /^openai|ai|gpt$/i;
handler.register = false;

export default handler;
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/