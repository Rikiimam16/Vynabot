import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, command, text }) => {
    try {
        if (!text) return conn.reply(m.chat, 'Masukkan teksnya!', m);

        let apiUrl;
        let stickerMetadata = {
            type: 'full',
            pack: global.info.stickpack,         // Nama pack stiker
            author: global.info.stickauth,              // Nama pembuat stiker
            quality: 70 
        };

        // Pilih API berdasarkan perintah
        switch (command) {
            case 'attp':
                apiUrl = `https://api.botcahx.eu.org/api/maker/attp?text=${encodeURIComponent(text)}&apikey=${global.api.btch}`;
                break;
            case 'ttp':
                apiUrl = `https://api.botcahx.eu.org/api/maker/ttp?text=${encodeURIComponent(text)}&apikey=${global.api.btch}`;
                break;
            default:
                return conn.reply(m.chat, 'Perintah tidak dikenali!', m);
        }

        // Ambil data dari API
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Gagal mengambil data dari API.');

        const buffer = await response.buffer();

        // Jika `attp`, proses sebagai stiker animasi
        if (command === 'attp') {
            const stiker = await new Sticker(buffer, stickerMetadata).toBuffer();
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { asSticker: true });
        } 
        // Jika `ttp`, langsung kirim sebagai stiker
        else if (command === 'ttp') {
            await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m, false, { asSticker: true });
        }
    } catch (e) {
        console.error(e);
        throw 'Terjadi kesalahan saat memproses permintaan!';
    }
};

handler.command = /^(attp|ttp)$/i; // Dukungan untuk kedua perintah
handler.tags = ['main'];
handler.help = ['attp', 'ttp'];

handler.limit = true;

export default handler;