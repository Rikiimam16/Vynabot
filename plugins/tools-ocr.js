import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m) => {
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

  // Use Itzpire's OCR endpoint with the uploaded image URL
  let ocrUrl = `https://itzpire.com/tools/ocr?url=${encodeURIComponent(imageUrl)}`;

  let ocrResponse = await fetch(ocrUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  });

  if (!ocrResponse.ok) throw 'Gagal memproses OCR di Itzpire';

  let ocrResult = await ocrResponse.json();
  if (ocrResult.status === "success" && ocrResult.data && ocrResult.data.ParsedText) {
    // Send only the extracted text to the user
    m.reply(`📜 *Hasil OCR :*\n${ocrResult.data.ParsedText}`);
  } else {
    m.reply('Gagal mendapatkan teks dari gambar.');
  }
}

handler.help = ['ocr'];
handler.tags = ['ai'];
handler.command = /^(ocr)$/i;
handler.limit = 5;

export default handler;
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/ 