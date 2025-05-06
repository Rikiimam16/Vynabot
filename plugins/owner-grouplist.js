const handler = async (m, { conn, usedPrefix, args }) => {
    let groups = Object.values(await conn.groupFetchAllParticipating());

    if (args.length === 0) {
        // Menampilkan daftar grup dengan format yang lebih sederhana
        const list = groups.map((group, index) => {
            const waktuDibuat = formatTime(group.creation);
            const batasan = group.restrict ? 'Dibatasi' : 'Tidak Dibatasi';
            const totalAnggota = group.participants.length;
            const waktuSekarang = formatTime(new Date()); // Waktu saat ini sebagai contoh
            return `${index + 1}. ${group.subject}\nID: ${group.id}\nStatus: ${batasan} | Anggota: ${totalAnggota} | Aktif | ${waktuSekarang}`;
        }).join('\n\n');
        
        conn.reply(m.chat, `Bot saat ini tergabung dalam ${groups.length} grup.\n\nDaftar Grup:\n\n${list}\n\nGunakan perintah *${usedPrefix}listgc [nomor]* untuk melihat detail grup tertentu.`, m);
    } else if (args.length === 1 && /^\d+$/.test(args[0])) {
        const index = parseInt(args[0]) - 1;
        if (index >= 0 && index < groups.length) {
            const group = groups[index];
            const jumlahSuperAdmin = group.participants.filter(p => p.admin === 'superadmin').length;
            const jumlahAdmin = group.participants.filter(p => p.admin === 'admin').length;
            const daftarAdmin = group.participants.filter(p => p.admin === 'admin').map(a => `- ${a.id.replace(/(\d+)@.+/, '@$1')}`).join('\n');
            const daftarSuperAdmin = group.participants.filter(p => p.admin === 'superadmin').map(a => `- ${a.id.replace(/(\d+)@.+/, '@$1')}`).join('\n');
            const info = `Detail Grup Nomor ${index + 1}\n\n` +
                `Nama Grup: ${group.subject}\n` +
                `ID Grup: ${group.id}\n` +
                `Pemilik Grup: ${group.owner.replace(/(\d+)@.+/, '@$1')}\n` +
                `Waktu Dibuat: ${formatTime(group.creation)}\n` +
                `Deskripsi: ${group.desc || 'Tidak ada deskripsi'}\n` +
                `Batasan Pengaturan: ${group.restrict ? 'Ya' : 'Tidak'}\n` +
                `Pengumuman: ${group.announce ? 'Ya' : 'Tidak'}\n` +
                `Total Anggota: ${group.participants.length}\n` +
                `Jumlah Superadmin: ${jumlahSuperAdmin}\n` +
                `Daftar Superadmin:\n${daftarSuperAdmin || 'Tidak ada superadmin'}\n` +
                `Jumlah Admin: ${jumlahAdmin}\n` +
                `Daftar Admin:\n${daftarAdmin || 'Tidak ada admin'}\n` +
                `Durasi Pesan Sementara: ${formatDuration(group.ephemeralDuration) || 'Tidak diatur'}`;
            await m.reply(info, null, {
                contextInfo: {
                    mentionedJid: group.participants.map((v) => v.id)
                }
            });
        } else {
            conn.reply(m.chat, 'Grup dengan nomor urutan tersebut tidak ditemukan.', m);
        }
    } else {
        conn.reply(m.chat, `Format perintah salah.\n\nGunakan:\n- *${usedPrefix}listgc* untuk melihat daftar grup.\n- *${usedPrefix}listgc [nomor]* untuk melihat detail grup tertentu.`, m);
    }
};

handler.menu = ['groups', 'grouplist'];
handler.tags = ['owner'];
handler.command = /^(gro?ups?list)|(listgro?ups?)|(listgc)$/i;
handler.owner = true;
export default handler;

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID')}`;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formatted = [];
    if (hours > 0) formatted.push(`${hours} jam`);
    if (minutes > 0) formatted.push(`${minutes} menit`);
    return formatted.join(' ') || 'Tidak diatur';
}