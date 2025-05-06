let handler = async (m, { conn, text }) => {
  if (!text) 
    return await conn.sendMessage(m.chat, { text: 'Silakan gunakan format: .textalay [teks]' }, { quoted: m });

  // Fungsi untuk mengubah teks menjadi gaya alay
  const toAlay = (text) => {
    return text
      .replace(/a/gi, '4')
      .replace(/i/gi, '1')
      .replace(/u/gi, 'ü')
      .replace(/e/gi, '3')
      .replace(/o/gi, '0')
      .replace(/s/gi, '5')
      .replace(/g/gi, '9');
  };

  const alayText = toAlay(text);

  await conn.sendMessage(m.chat, { text: `4l4y v3rs10n:\n${alayText}` }, { quoted: m });
};

handler.help = ['textalay'];
handler.tags = ['tools'];
handler.command = /^(textalay|alay)$/i;
handler.register = true;

export default handler;

/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/