const handler = async (m, { conn }) => {
    // Mengambil semua grup
    let groups = Object.values(await conn.groupFetchAllParticipating());

    // Jika tidak ada grup
    if (groups.length === 0) {
        conn.reply(m.chat, 'Bot tidak ada dalam grup manapun.', m);
        return;
    }

    // Menampilkan daftar grup
    let groupList = groups.map((g, i) => `${i + 1}. ${g.subject}`).join('\n');
    conn.reply(
        m.chat,
        `Daftar grup yang diikuti bot:\n\n${groupList}\n\nGunakan perintah .gc <no> <action> untuk mengelola grup.`,
        m
    );
};

handler.help = ['gcl'];
handler.tags = ['owner'];
handler.command = /^(gcl)$/i;
handler.register = true;
handler.owner = true;

export default handler;