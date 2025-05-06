let isProcessing = false; // Flag untuk mengecek status proses

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        // Tampilkan pesan penggunaan jika input tidak diberikan
        const usageMessage = `⚠️ *Penggunaan perintah yang benar:* ⚠️\n\n` +
                             `• *${command} <judul lagu>*\n` +
                             `Misalnya:\n` +
                             `• *play jj20detik*`;

        await conn.sendMessage(m.chat, { text: usageMessage }, { quoted: m });
        return;
    }

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    // Cek apakah proses sedang berjalan
    if (isProcessing) {
        await conn.sendMessage(
            m.chat,
            { text: '⚠️ Proses play sebelumnya masih berjalan. Mohon tunggu hingga selesai.' },
            { quoted: m }
        );
        return;
    }

    isProcessing = true; // Tandai proses sedang berjalan

    // Beritahu pengguna bahwa proses sedang berjalan
    await conn.sendMessage(m.chat, { text: '⌛ Sedang diproses... Mohon jangan spam, tunggu proses selesai.' }, { quoted: m });

    try {
        // Panggil API untuk mendapatkan audio
        
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
        const apiUrl = `https://anabot.my.id/api/download/playmusic?query=${encodeURIComponent(text)}&apikey=freeApikey`;

        // Kirim audio langsung dari API
        await conn.sendFile(
            m.chat,
            apiUrl,            // URL file audio langsung dari API
            `${text}.mp3`,     // Nama file audio
            '',                // Pesan tambahan kosong
            m,                 // Pesan yang dikutip
            { mimetype: 'audio/mp3' } // Jenis file
        );
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: '❗ Terjadi kesalahan saat memproses perintah play!' }, { quoted: m });
    } finally {
        isProcessing = false; // Reset flag setelah proses selesai
    }
};

handler.help = ['play'];
handler.tags = ['main'];
handler.command = /^(play)$/i;

export default handler;

/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/