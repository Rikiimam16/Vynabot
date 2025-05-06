import fetch from "node-fetch";
import { canLevelUp, xpRange } from "../lib/levelling.js";

let handler = async (m, { conn }) => {
  try {
    let who = m.isGroup
      ? m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : m.sender
      : m.sender;
    let name = conn.getName(who);
    let user = global.db.data.users[who];
    let maxLevel = 1000; // Maksimum level
    let multiplier = 10; // Pengali untuk perhitungan XP
    let { min, xp, max } = xpRange(user.level, multiplier); // Mendapatkan XP range

    // URL avatar pengguna atau default
    let avatarURL = await conn
      .profilePictureUrl(who, "image")
      .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    // URL background
    let backgroundURL = "https://i.ibb.co/2jMjYXK/IMG-20250103-WA0469.jpg";

    if (!canLevelUp(user.level, user.exp, multiplier)) {
      // Jika pemain belum bisa naik level
      let text = `
╭――╼ *LEVEL STATUS*
│❐ Nama : *${name}*
│❐ Level : *${user.level}/${maxLevel}*
│❐ XP : *${user.exp}*/*${xp}*
│❐ Peran : *${user.role || "Tidak ada"}*
╰――╼

Kamu membutuhkan *${max - user.exp}* XP lagi untuk naik level! Terus semangat!
`.trim();

      await conn.sendMessage(m.chat, { text }, { quoted: m });
    } else {
      // Jika pemain naik level
      let beforeLevel = user.level * 1;
      while (canLevelUp(user.level, user.exp, multiplier)) {
        user.level++;
      }

      let fromLevel = beforeLevel;
      let toLevel = user.level;

      // Membuat gambar level-up menggunakan API
      let apiURL = `https://api.siputzx.my.id/api/canvas/level-up?backgroundURL=${encodeURIComponent(
        backgroundURL
      )}&avatarURL=${encodeURIComponent(avatarURL)}&fromLevel=${fromLevel}&toLevel=${toLevel}&name=${encodeURIComponent(name)}`;
      console.log("API URL:", apiURL); // Debugging

      let response = await fetch(apiURL);
      if (!response.ok) throw `Error ${response.status}: ${response.statusText}`;
      let buffer = await response.buffer();

      // Mengirim gambar level-up
      let caption = `
╭――╼ *LEVEL UP!*
│❐ Nama : *${name}*
│❐ Level : *${fromLevel} ➜ ${toLevel}*
│❐ XP : *${user.exp}*/*${xp}*
│❐ Peran : *${user.role || "Tidak ada"}*
╰――╼

Selamat! Kamu telah naik level!
`.trim();

      await conn.sendFile(m.chat, buffer, "level-up.jpg", caption, m);
    }
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi kesalahan: ${error.message || error}`);
  }
};

handler.help = ["levelup <@tag/reply>"];
handler.tags = ["game"];
handler.command = /^(levelup|lvlup)$/i;

export default handler;