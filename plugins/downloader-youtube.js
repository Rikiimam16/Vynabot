import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        let usageMessage = `⚠️ *Penggunaan perintah yang benar:* ⚠️\n\n`;
        usageMessage += `• *${command} <URL YouTube>*\n`;
        usageMessage += `Misalnya:\n`;
        usageMessage += `• *!${command} https://www.youtube.com/watch?v=VSL5F43qgng*`;

        await conn.sendMessage(m.chat, { text: usageMessage }, { quoted: m });
        return;
    }

    await conn.sendMessage(m.chat, { text: '⏳ Sedang diproses... Mohon jangan spam, tunggu proses selesai.' }, { quoted: m });

    try {
        // Fetch data dari API dengan API Key baru
        let res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=${global.api.btch}`);
        let json = await res.json();

        // Log respons API
        console.log('Respons API:', json);

        if (!json.status) throw 'Gagal mengunduh video/audio dari YouTube!';

        // Ambil data dari respons API
        let { title = 'Tidak diketahui', thumb = 'Tidak tersedia', duration = 'Tidak diketahui', mp3, mp4 } = json.result;

        // Informasi video
        let videoInfo = `*Judul:* ${title}\n`;
        videoInfo += `*Durasi:* ${duration} detik\n`;
        videoInfo += `*Thumbnail:* ${thumb}\n`;

        // Kirim informasi video
        await conn.sendMessage(m.chat, { text: videoInfo }, { quoted: m });

        switch (command) {
            case 'ytmp3':
                if (!mp3) throw 'URL audio tidak tersedia!';
                await conn.sendMessage(m.chat, { text: '🔊 Mengunduh audio...' }, { quoted: m });
                await conn.sendFile(m.chat, mp3, `${title}.mp3`, '', m, { mimetype: 'audio/mp3' });
                break;

            case 'ytmp4':
                if (!mp4) throw 'URL video tidak tersedia!';
                await conn.sendMessage(m.chat, { text: '🎥 Mengunduh video...' }, { quoted: m });
                await conn.sendFile(m.chat, mp4, `${title}.mp4`, '', m, { mimetype: 'video/mp4' });
                break;

            default:
                throw `Perintah tidak valid: ${command}`;
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: `❗ Terjadi kesalahan: ${e}` }, { quoted: m });
    }
};

handler.help = ['ytmp3', 'ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3|ytmp4)$/i;

export default handler;