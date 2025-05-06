const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i; // Tautan Grup WhatsApp
const WaLinkRegex = /wa.me\/([0-9]+)/i; // Tautan WhatsApp individu
const ChannelLinkRegex = /whatsapp.com\/channel\/([0-9A-Za-z]+)/i; // Tautan Channel WhatsApp
const OtherLinkRegex = /(?:http|https):\/\/(?:www\.)?[^\s/$.?#].[^\s]*/i; // Pola untuk Tautan Umum

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return;
    let chat = global.db.data.chats[m.chat];
    let isGroupLink = linkRegex.exec(m.text);
    let isLinkWa = WaLinkRegex.exec(m.text);
    let isChannelLink = ChannelLinkRegex.exec(m.text);
    let isOtherLink = OtherLinkRegex.exec(m.text);

    if (chat.antiLink && m.isGroup) {
        if ((isGroupLink || isChannelLink || isOtherLink) && !isAdmin) {
            if (isBotAdmin) {
                const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
                if (m.text.includes(linkThisGroup)) return !0;
            }
            if (chat.teks) {
                m.reply(`_*‼️ Tautan Terdeteksi!*_\n_pesan kamu akan dihapus! ❌_ ${isBotAdmin ? '' : '\n\n_❬Bot Bukan Admin❭_'}`);
            }
            if (isBotAdmin) {
                await this.sendMessage(m.chat, { delete: m.key });
            }
        }
    } else if (chat.antiLinkWa && m.isGroup) {
        if ((isLinkWa || isChannelLink) && !isAdmin) {
            if (chat.teks) {
                m.reply(`_*‼️ Tautan WhatsApp Terdeteksi!*_\n_pesan kamu akan dihapus! ❌_ ${isBotAdmin ? '' : '\n\n_❬Bot Bukan Admin❭_'}`);
            }
            if (isBotAdmin) {
                await this.sendMessage(m.chat, { delete: m.key });
            }
        }
    } else if (chat.antiOtherLink && m.isGroup) {
        // Deteksi dan hapus semua tautan lainnya
        if (isOtherLink && !isAdmin) {
            if (chat.teks) {
                m.reply(`_*‼️ Tautan Terdeteksi!*_\n_pesan kamu akan dihapus! ❌_ ${isBotAdmin ? '' : '\n\n_❬Bot Bukan Admin❭_'}`);
            }
            if (isBotAdmin) {
                await this.sendMessage(m.chat, { delete: m.key });
            }
        }
    }
    return;
}