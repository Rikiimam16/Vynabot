import axios from 'axios';

// Daftar surah untuk konversi nama surah ke nomor surah
const surahMap = {
    "al-fatihah": 1,
    "al-baqarah": 2,
    "ali-imran": 3,
    "an-nisa": 4,
    "al-kahf": 18,
    "yasin": 36,
    // Tambahkan surah lainnya jika perlu
};

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Gunakan format: ${usedPrefix}${command} <nama_surah> <ayat>`;
    
    const [surahInput, ayat] = text.split(' ');
    if (!surahInput || !ayat || isNaN(ayat)) throw `Format salah! Contoh penggunaan: ${usedPrefix}${command} Al-Kahf 10`;

    // Konversi nama surah ke nomor jika memungkinkan
    const surah = surahMap[surahInput.toLowerCase()] || surahInput;

    try {
        const res = await fetchAyat(surah, ayat);
        m.reply(`
Surah: *${res.surah}* (Ayat ${ayat})
Arab: ${res.arab}
Latin: ${res.latin}
Terjemahan: ${res.terjemahan}
        `);
    } catch (e) {
        m.reply(`Surah atau ayat tidak ditemukan! Pastikan nama surah atau nomor surah benar.`);
    }
};

handler.help = ['ngaji'];
handler.tags = ['islami'];
handler.command = /^(ngaji|quran|bacaquran)$/i;

export default handler;

// Fungsi untuk mengambil ayat dari API
async function fetchAyat(surah, ayat) {
    try {
        const { data } = await axios.get(`https://api.quran.gading.dev/surah/${surah}/${ayat}`);
        
        return {
            surah: data.data.surah.name.transliteration.id,
            arab: data.data.text.arab,
            latin: data.data.text.transliteration.en,
            terjemahan: data.data.translation.id,
        };
    } catch (e) {
        console.error(e); // Log error untuk debugging
        throw new Error('Error fetching data');
    }
}