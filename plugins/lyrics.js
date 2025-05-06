import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Usage: ${usedPrefix}lirik <judul lagu>`;
    
    try {
        // Panggil API untuk mendapatkan lirik
        const res = await fetch(`https://api.botcahx.eu.org/api/search/lirik?lirik=${encodeURIComponent(text)}&apikey=${global.api.btch}`);
        const data = await res.json();

        if (!data.status || !data.result) throw 'Lirik tidak ditemukan!';

        const {
            lyrics,
            title,
            artist,
            image,
            fullTitle,
            releaseDateForDisplay,
            url
        } = data.result;

        let caption = `🎶 *Lirik Lagu*\n\n`;
        caption += `∘ *Judul*   : ${title}\n`;
        caption += `∘ *Artis*   : ${artist}\n`;
        caption += `∘ *Rilis*   : ${releaseDateForDisplay || 'Tidak tersedia'}\n`;
        caption += `∘ *Sumber*  : [Lihat Lirik](${url})\n\n`;
        caption += `🎵 *Lirik:*\n${lyrics}`;

        await conn.sendMessage(m.chat, {
            image: { url: image },
            caption: caption,
            contextInfo: {
                externalAdReply: {
                    title: fullTitle,
                    body: `Lirik oleh ${artist}`,
                    thumbnailUrl: image,
                    sourceUrl: url
                }
            }
        }, { quoted: m });

    } catch (e) {
        conn.reply(m.chat, `Error: ${e.message || e}`, m);
    }
};

handler.command = handler.help = ['lirik', 'lyrics'];
handler.tags = ['search'];
handler.exp = 0;
handler.limit = false;

export default handler;