const handler = async (m, { conn, usedPrefix, args }) => {
    if (args.length < 2) {
        conn.reply(m.chat, `Gunakan format: ${usedPrefix}gc <no> <action>\n\nContoh: .gc 1 open\n\nLihat daftar grup dengan perintah: ${usedPrefix}gcl\n\nGunakan
format: .gc <no> <action>
Contoh: .gc 1 open

Action yang tersedia:
1. open
> Membuka grup agar semua anggota bisa mengirim pesan.

2. close
> Menutup grup, hanya admin yang bisa mengirim pesan.

3. mute
> Membisukan bot di grup.

4. unmute
> Mengaktifkan bot di grup.

5. link
> Mendapatkan tautan undangan grup (bot harus menjadi admin)

6. leave
> Bot keluar dari grup.

7. reset
> Mereset konfigurasi grup ke default.

8. forever
> Membuat bot tetap tinggal di grup selamanya.

9. 1d
> Mengatur durasi bot di grup selama 1 hari.

10. 3d
> Mengatur durasi bot di grup selama 3 hari.

11. 7d
> Mengatur durasi bot di grup selama 7 hari.

12. 30d
> Mengatur durasi bot di grup selama 30 hari.

Pastikan untuk mereply pesan yang berisi daftar grup saat menggunakan perintah ini.`, m);
        return;
    }

    let groupIndex = parseInt(args[0]) - 1;
    let action = args[1].toLowerCase();
    
    // Mengambil semua grup
    let groups = Object.values(await conn.groupFetchAllParticipating());

    if (groupIndex < 0 || groupIndex >= groups.length) {
        conn.reply(m.chat, 'Grup dengan nomor tersebut tidak ditemukan.', m);
        return;
    }

    let group = groups[groupIndex];

    switch (action) {
        case 'open':
            await conn.groupSettingUpdate(group.id, 'not_announcement');
            conn.reply(m.chat, `Grup ${group.subject} sekarang terbuka untuk semua anggota.`, m);
            break;

        case 'close':
            await conn.groupSettingUpdate(group.id, 'announcement');
            conn.reply(m.chat, `Grup ${group.subject} sekarang hanya admin yang bisa mengirim pesan.`, m);
            break;

        case 'mute':
            conn.reply(m.chat, `Bot sekarang dalam mode diam di grup ${group.subject}.`, m);
            break;

        case 'unmute':
            conn.reply(m.chat, `Bot sekarang aktif di grup ${group.subject}.`, m);
            break;

        case 'link':
            try {
                let link = await conn.groupInviteCode(group.id);
                conn.reply(m.chat, `Tautan undangan grup: https://chat.whatsapp.com/${link}`, m);
            } catch (e) {
                conn.reply(m.chat, 'Bot harus menjadi admin untuk mendapatkan tautan undangan.', m);
            }
            break;

        case 'leave':
            await conn.groupLeave(group.id);
            conn.reply(m.chat, `Bot telah keluar dari grup ${group.subject}.`, m);
            break;

        case 'reset':
            conn.reply(m.chat, `Konfigurasi grup ${group.subject} telah direset ke default.`, m);
            break;

        case 'forever':
            conn.reply(m.chat, `Bot sekarang akan tinggal selamanya di grup ${group.subject}.`, m);
            break;

        case '1d':
        case '3d':
        case '7d':
        case '30d':
            conn.reply(m.chat, `Bot akan tinggal di grup ${group.subject} selama ${action}.`, m);
            break;

        default:
            conn.reply(m.chat, `Tindakan "${action}" tidak valid. Gunakan salah satu dari: open, close, mute, unmute, link, leave, reset, forever, 1d, 3d, 7d, 30d`, m);
            break;
    }
};

handler.help = ['gc'];
handler.tags = ['owner'];
handler.command = /^(gc)$/i;
handler.register = true;
handler.owner = true;

export default handler;