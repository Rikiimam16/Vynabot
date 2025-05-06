let notes = {}; // Objek untuk menyimpan catatan secara sementara

let handler = async (m, { conn, text, command }) => {
    try {
        switch (command) {
            case 'addcatatan':
                if (!text.includes('|')) {
                    throw '⚠️ Format salah! Gunakan format: *.addcatatan nama|text*';
                }

                let [name, content] = text.split('|').map(s => s.trim());
                if (!name || !content) throw '⚠️ Nama atau isi catatan tidak boleh kosong!';

                notes[name] = content;
                await conn.sendMessage(m.chat, { text: `✅ Catatan "${name}" berhasil ditambahkan!` }, { quoted: m });
                break;

            case 'delcatatan':
                if (!text) throw '⚠️ Gunakan perintah: *.delcatatan nama*';

                if (!notes[text]) throw `⚠️ Catatan dengan nama "${text}" tidak ditemukan!`;

                delete notes[text];
                await conn.sendMessage(m.chat, { text: `✅ Catatan "${text}" berhasil dihapus!` }, { quoted: m });
                break;

            case 'listcatatan':
                if (Object.keys(notes).length === 0) {
                    await conn.sendMessage(m.chat, { text: '📋 Tidak ada catatan yang tersedia.' }, { quoted: m });
                } else {
                    let list = '*📋 Daftar Catatan:*\n\n';
                    list += Object.keys(notes).map(name => `• ${name}`).join('\n');
                    await conn.sendMessage(m.chat, { text: list }, { quoted: m });
                }
                break;

            case 'lihatcatatan':
                if (!text) throw '⚠️ Gunakan perintah: *.lihatcatatan nama*';

                if (!notes[text]) throw `⚠️ Catatan dengan nama "${text}" tidak ditemukan!`;

                let catatanContent = `*📄 Catatan "${text}":*\n\n${notes[text]}`;
                await conn.sendMessage(m.chat, { text: catatanContent }, { quoted: m });
                break;

            default:
                throw '⚠️ Perintah tidak dikenal!';
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: `❗ Terjadi kesalahan: ${e}` }, { quoted: m });
    }
};

handler.help = ['addcatatan', 'delcatatan', 'listcatatan', 'lihatcatatan'];
handler.tags = ['main'];
handler.command = /^(addcatatan|delcatatan|listcatatan|lihatcatatan)$/i;
handler.group = true;

export default handler;

/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/