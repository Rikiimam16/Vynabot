import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !mime.includes('image')) throw '⚠️ Tidak ada gambar yang ditemukan.';

    m.reply('⏳ Sedang memproses gambar, mohon tunggu...');

    let media = await q.download();
    if (!media || media.length === 0) throw '⚠️ Gagal mengunduh gambar, coba kirim ulang.';

    // Gunakan FormData untuk upload
    let bodyForm = new FormData();
    bodyForm.append('file', Buffer.from(media), { filename: 'image.jpg', contentType: mime });

    let uploadResponse = await fetch("https://8030.us.kg/api/upload.php", {
        method: "POST",
        body: bodyForm,
        headers: bodyForm.getHeaders(),
    });

    let uploadResult = await uploadResponse.json();
    if (!uploadResult.status || !uploadResult.result.url) throw '⚠️ Gagal mengunggah gambar ke server.';

    let uploadedImageUrl = uploadResult.result.url;

    let reminiUrl = `https://api.botcahx.eu.org/api/tools/remini?url=${encodeURIComponent(uploadedImageUrl)}&apikey=${global.api.btch}`;

    let reminiResponse = await fetch(reminiUrl);
    let reminiResult = await reminiResponse.json();

    if (!reminiResult.status || !reminiResult.url) throw '⚠️ Gagal meningkatkan kualitas gambar.';

    let enhancedImageUrl = reminiResult.url;

    conn.sendMessage(m.chat, { image: { url: enhancedImageUrl }, caption: '✅ Gambar berhasil ditingkatkan!!' }, { quoted: m });
};

handler.help = ['remini','hd'];
handler.tags = ['ai', 'image'];
handler.command = /^(remini|hd)$/i;
handler.limit = 5;

export default handler;