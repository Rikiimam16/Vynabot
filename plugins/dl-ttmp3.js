/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from 'node-fetch';
import { toAudio } from '../lib/converter.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://vt.tiktok.com/xxxxxxx`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        // Encode URL dan fetch data TikTok
        let url = encodeURIComponent(text);
        const tiktokRes = await fetch(`https://btch.us.kg/download/tikdl?url=${url}`);
        const tiktokData = await tiktokRes.json();

        if (!tiktokData?.status) throw 'Gagal mendownload video TikTok.';

        const { video, title, thumbnail } = tiktokData.result;

        // Unduh video dari URL
        const media = await fetch(video[0]).then(res => res.buffer());
        if (!media) throw 'Gagal mengunduh video TikTok.';

        // Konversi video ke audio
        const audio = await toAudio(media, 'mp4');
        if (!audio.data) throw 'Gagal mengkonversi video menjadi audio.';

        // Kirim hasil audio ke chat
        await conn.sendFile(m.chat, audio.data, 'tiktok.mp3', `🎵 ${title}`, m, null, { mimetype: 'audio/mp4' });
        conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key,
            }
        });
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['tiktokmp3', 'ttmp3'];
handler.tags = ['downloader'];
handler.command = /^(tiktokmp3|ttmp3)$/i;
handler.premium = false;

export default handler;