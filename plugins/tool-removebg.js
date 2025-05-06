import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !mime.includes('image')) throw '⚠️ Tidak ada gambar yang ditemukan.';

    m.reply('⏳ Sedang menghapus latar belakang gambar, mohon tunggu...');

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

    let removeBgUrl = `https://api.botcahx.eu.org/api/tools/removebg?url=${encodeURIComponent(uploadedImageUrl)}&apikey=${global.api.btch}`;

    let removeBgResponse = await fetch(removeBgUrl);
    let removeBgResult = await removeBgResponse.json();

    if (!removeBgResult.status || !removeBgResult.url?.result) throw '⚠️ Gagal menghapus latar belakang gambar.';

    let removedBgImageUrl = removeBgResult.url.result;

    conn.sendMessage(m.chat, { image: { url: removedBgImageUrl }, caption: '✅ Latar belakang berhasil dihapus!' }, { quoted: m });
};

handler.help = ['removebg'];
handler.tags = ['image', 'tools'];
handler.command = /^(removebg|nobg)$/i;
handler.limit = 5;

export default handler;