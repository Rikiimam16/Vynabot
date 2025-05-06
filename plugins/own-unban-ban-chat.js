const handler = async (m, { conn, args, isROwner, command }) => {
    /*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    if (!isROwner) {
        conn.reply(m.chat, 'Perintah ini hanya bisa digunakan oleh pemilik bot.', m);
        return;
    }
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    let groups = Object.values(await conn.groupFetchAllParticipating());
    if (groups.length === 0) {
        conn.reply(m.chat, 'Bot tidak ada dalam grup manapun.', m);
        return;
    }

    // Jika command adalah `gcbanchat`, tampilkan daftar grup
    if (command === 'gcbanchat') {
        let groupList = groups.map((g, i) => `${i + 1}. ${g.subject}`).join('\n');
        conn.reply(
            m.chat,
            `Daftar grup yang diikuti bot:\n\n${groupList}\n\nGunakan perintah:\n- *banchat <no>* untuk membisukan grup\n- *unbanchat <no>* untuk mengaktifkan kembali grup`,
            m
        );
        return;
    }
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
    if (!['banchat', 'unbanchat'].includes(command)) return;

    // Pastikan user memasukkan nomor grup
    let index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= groups.length) {
        conn.reply(m.chat, 'Nomor grup tidak valid. Gunakan *gcbanchat* untuk melihat daftar grup.', m);
        return;
    }

    let groupId = groups[index].id;
    let groupName = groups[index].subject;

    // Status banchat global
    global.db.data.chats[groupId] = global.db.data.chats[groupId] || {};

    if (command === 'banchat') {
        global.db.data.chats[groupId].isBanned = true;
        conn.reply(m.chat, `✅ Grup *${groupName}* telah dibisukan.`, m);
    } else if (command === 'unbanchat') {
        global.db.data.chats[groupId].isBanned = false;
        conn.reply(m.chat, `✅ Grup *${groupName}* telah diaktifkan kembali.`, m);
    }
};

handler.help = ['gcbanchat', 'banchat', 'unbanchat'];
handler.tags = ['owner'];
handler.command = /^(gcbanchat|banchat|unbanchat)$/i;
handler.owner = true;

export default handler;