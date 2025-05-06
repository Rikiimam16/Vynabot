import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn }) => { // Tambahkan `conn` jika diperlukan
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw 'Tidak ada media yang ditemukan';

  // Send loading message
  m.reply('Loading, sedang proses...');

  let media = await q.download();

  // Upload image to Itzpire API
  let formData = new FormData();
  formData.append('file', media, {
    filename: 'image.png',
    contentType: mime
  });

  let itzpireUpload = await fetch('https://itzpire.com/tools/upload', {
    method: 'POST',
    body: formData,
    headers: {
      ...formData.getHeaders()
    }
  });

  if (!itzpireUpload.ok) throw 'Gagal mengunggah gambar ke Itzpire';
  let itzpireResult = await itzpireUpload.json();
  let imageUrl = itzpireResult.fileInfo.url;

  // Use BOTCAHX Anime API with the uploaded image URL
  let animeUrl = `https://api.botcahx.eu.org/api/maker/jadianime?url=${encodeURIComponent(imageUrl)}&apikey=${global.api.btch}`;

  let animeResponse = await fetch(animeUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });

  if (!animeResponse.ok) throw 'Gagal memproses gambar ke anime';

  let animeResult = await animeResponse.json();
  if (animeResult.status === true && animeResult.result && animeResult.result.img_crop_single) {
    // Send the anime image to the user
    await m.reply('Berhasil mengubah gambar menjadi anime!');
    await conn.sendFile(m.chat, animeResult.result.img_crop_single, 'anime.png', 'Ini hasilnya!', m);
  } else {
    m.reply('Gagal mengubah gambar menjadi anime.');
  }
};

handler.help = ['jadianime'];
handler.tags = ['premium'];
handler.command = /^(jadianime)$/i;
handler.premium = true;

export default handler;
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/