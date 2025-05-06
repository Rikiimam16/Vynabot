const { proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let M = proto.WebMessageInfo;
    let chats = db.data.chats[m.chat];
    let msgs = chats.listStr || {};

    switch (command) {
        case 'addlist':
            if (!text) throw `Gunakan: ${usedPrefix + command} <nama item|deskripsi item>`;
            let [itemName, itemText] = text.split('|');
            if (!itemName || !itemText) throw `Format tidak valid. Gunakan: ${usedPrefix + command} <nama item|deskripsi item>`;
            if (itemName in msgs) throw `Item '${itemName}' sudah terdaftar`;
            msgs[itemName] = itemText;
            chats.listStr = msgs;
            m.reply(`Berhasil menambahkan item '${itemName}' ke daftar`);
            break;
        
        case 'list':
            if (!text) throw `Silakan tentukan item yang ingin Anda lihat. Ketik\n *.listall* untuk melihat semua item yang tersedia`;
            if (!(text in msgs)) throw `Item '${text}' tidak ada`;
            await m.reply(`*${text}*\n${msgs[text]}`);
            break;
        
        case 'dellist':
            if (!text) throw `Gunakan: ${usedPrefix + command} <nama item>`;
            if (!(text in msgs)) throw `Item '${text}' tidak terdaftar`;
            delete msgs[text];
            chats.listStr = msgs;
            m.reply(`Berhasil menghapus item '${text}' dari daftar`);
            break;
        
        case 'listall':
            let itemList = Object.keys(msgs).map(item => `│◉ ${item}`).join('\n');
            if (itemList) {
                m.reply(`┏─• *📜 LIST ITEM 📜*\n${itemList}\n┗─•\n\nUntuk melihat detail item, ketik nama item. Contoh: *.list* nama_item`);
            } else {
                m.reply('Tidak ada item yang tersedia.');
            }
            break;
        
        default:
            throw `Perintah tidak valid: ${command}`;
    }
}

handler.help = ['list', 'addlist', 'dellist', 'listall'];
handler.tags = ['list'];
handler.command = /^(list|addlist|dellist|listall)$/i;
handler.premium = false;

export default handler;
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/