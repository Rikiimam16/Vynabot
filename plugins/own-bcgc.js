/* 
JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";

// Database untuk blacklist group (simpan di memory)
let blacklistGroups = [];

const handler = async (m, { conn, usedPrefix, command, text, args }) => {
  switch (command) {
    case 'share':
    case 'jpm':
    case 'bcgc':
    case 'broadcast':
      await handleBroadcast(m, conn, usedPrefix, command, text);
      break;
      
    case 'listbcgc':
      await listGroups(m, conn, usedPrefix, args);
      break;
      
    case 'blacklistgc':
      await addBlacklist(m, conn, text);
      break;
      
    case 'listblacklistgc':
      await showBlacklist(m, conn);
      break;
      
    case 'delblacklistgc':
      await removeBlacklist(m, conn, text);
      break;
      
    default:
      conn.reply(m.chat, `Perintah tidak dikenali. Gunakan ${usedPrefix}help untuk melihat daftar perintah.`, m);
  }
};

// Fungsi untuk handle broadcast
async function handleBroadcast(m, conn, usedPrefix, command, text) {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || q.mediaType || "";

  if (!mime && !text) {
    return conn.reply(
      m.chat,
      `Contoh: balas/kirim gambar dengan keterangan *${usedPrefix + command}*`,
      m
    );
  }

  // Mengunduh gambar jika ada
  const image = mime ? await uploadImage(await q.download()) : "";

  // Mengambil semua grup yang bisa diakses
  const allGroups = await getAllGroups(conn);
  const groupIds = allGroups.filter(id => !blacklistGroups.includes(id));
  
  if (groupIds.length === 0) {
    return conn.reply(m.chat, "❌ Tidak ada grup yang tersedia untuk broadcast", m);
  }

  await conn.reply(m.chat, `📤 Memulai broadcast ke ${groupIds.length} grup...`, m);

  let successCount = 0;
  let failCount = 0;
  const failedGroups = [];

  for (const [index, id] of groupIds.entries()) {
    try {
      await delay(index * 2000); // Delay 2 detik antara setiap pengiriman
      
      const options = image
        ? { image: { url: image }, caption: text || '' }
        : { text: text.trim() };

      await conn.sendMessage(id, options, { quoted: null });
      successCount++;
      
      // Update progress setiap 10 grup
      if ((index + 1) % 10 === 0) {
        await conn.reply(m.chat, `⏳ Progress: ${index + 1}/${groupIds.length} grup (${Math.round((index + 1) / groupIds.length * 100)}%)`, m);
      }
    } catch (err) {
      console.error(`Gagal mengirim pesan ke grup ${id}:`, err);
      failCount++;
      failedGroups.push(id);
      
      // Jika error karena bot keluar dari grup, tambahkan ke blacklist otomatis
      if (err.message.includes("not in the chat") || err.message.includes("kicked")) {
        blacklistGroups.push(id);
      }
    }
  }

  // Buat laporan broadcast
  let report = `✅ Broadcast selesai\n\n`;
  report += `• Total grup: ${allGroups.length}\n`;
  report += `• Terkirim: ${successCount}\n`;
  report += `• Gagal: ${failCount}\n`;
  report += `• Blacklist: ${blacklistGroups.length}\n`;
  
  if (failedGroups.length > 0) {
    report += `\n⚠️ Gagal mengirim ke:\n${failedGroups.map(id => `- ${id}`).join('\n')}`;
  }

  await conn.reply(m.chat, report, m);
}

// Fungsi untuk mendapatkan semua grup (versi diperbaiki)
async function getAllGroups(conn, retries = 3) {
  try {
    // Menggunakan groupFetchAllParticipating sebagai ganti conn.chats.all
    const groups = await conn.groupFetchAllParticipating();
    return Object.keys(groups).filter(id => !blacklistGroups.includes(id));
  } catch (error) {
    if (retries > 0) {
      await delay(2000);
      return getAllGroups(conn, retries - 1);
    }
    throw error;
  }
}

// Fungsi untuk menampilkan daftar grup
async function listGroups(m, conn, usedPrefix, args) {
  try {
    const groups = await conn.groupFetchAllParticipating();
    const groupList = Object.values(groups);

    if (args.length === 0) {
      const list = groupList.map((group, index) => {
        const waktuDibuat = formatTime(group.creation);
        const batasan = group.restrict ? 'Tutup' : 'Terbuka';
        const totalAnggota = group.participants?.length || 0;
        return `➤ ${index + 1}. ${group.subject}\n   ID: ${group.id}\n   Dibuat: ${waktuDibuat}\n   Status: ${batasan} | Anggota: ${totalAnggota}`;
      }).join('\n\n');
      
      await conn.reply(m.chat, 
        `🤖 *Bot saat ini tergabung dalam ${groupList.length} grup.*\n\n📋 *Daftar Grup:*\n\n${list}\n\n` +
        `ℹ️ Gunakan perintah *${usedPrefix}listgc [nomor]* untuk melihat detail grup tertentu.`, 
        m
      );
    } else if (args.length === 1 && /^\d+$/.test(args[0])) {
      const index = parseInt(args[0]) - 1;
      if (index >= 0 && index < groupList.length) {
        const group = groupList[index];
        const jumlahSuperAdmin = group.participants?.filter(p => p.admin === 'superadmin').length || 0;
        const jumlahAdmin = group.participants?.filter(p => p.admin === 'admin').length || 0;
        const daftarAdmin = group.participants?.filter(p => p.admin === 'admin').map(a => `   - ${a.id.replace(/(\d+)@.+/, '@$1')}`).join('\n') || '      Tidak ada admin';
        const daftarSuperAdmin = group.participants?.filter(p => p.admin === 'superadmin').map(a => `   - ${a.id.replace(/(\d+)@.+/, '@$1')}`).join('\n') || '      Tidak ada superadmin';
        const info = `📌 *Detail Grup Nomor ${index + 1}*\n\n` +
            `   ➤ Nama Grup: ${group.subject}\n` +
            `   ➤ ID Grup: ${group.id}\n` +
            `   ➤ Pemilik Grup: ${group.owner?.replace(/(\d+)@.+/, '@$1') || 'Tidak diketahui'}\n` +
            `   ➤ Waktu Dibuat: ${formatTime(group.creation)}\n` +
            `   ➤ Deskripsi: ${group.desc || 'Tidak ada deskripsi'}\n` +
            `   ➤ Batasan Pengaturan: ${group.restrict ? 'Ya' : 'Tidak'}\n` +
            `   ➤ Pengumuman: ${group.announce ? 'Ya' : 'Tidak'}\n` +
            `   ➤ Total Anggota: ${group.participants?.length || 0}\n` +
            `   ➤ Jumlah Superadmin: ${jumlahSuperAdmin}\n` +
            `   ➤ Daftar Superadmin:\n${daftarSuperAdmin}\n` +
            `   ➤ Jumlah Admin: ${jumlahAdmin}\n` +
            `   ➤ Daftar Admin:\n${daftarAdmin}\n` +
            `   ➤ Durasi Pesan Sementara: ${formatDuration(group.ephemeralDuration) || 'Tidak diatur'}\n` +
            `   ➤ Status: ${blacklistGroups.includes(group.id) ? '🚫 BLACKLISTED' : '✅ ACTIVE'}`;
        await m.reply(info, null, {
            contextInfo: {
                mentionedJid: group.participants?.map((v) => v.id) || []
            }
        });
      } else {
        await conn.reply(m.chat, '❌ *Grup dengan nomor urutan tersebut tidak ditemukan.*', m);
      }
    } else {
      await conn.reply(m.chat, 
        `❌ *Format perintah salah.*\n\nℹ️ *Gunakan:*\n` +
        `- *${usedPrefix}listgc* untuk melihat daftar grup.\n` +
        `- *${usedPrefix}listgc [nomor]* untuk melihat detail grup tertentu.`, 
        m
      );
    }
  } catch (error) {
    console.error('Error in listGroups:', error);
    await conn.reply(m.chat, '❌ Terjadi kesalahan saat mengambil daftar grup', m);
  }
}

// Fungsi untuk menambahkan grup ke blacklist
async function addBlacklist(m, conn, text) {
  if (!text) {
    return conn.reply(m.chat, `Contoh: ${usedPrefix}blacklistgc 1,2,3`, m);
  }

  const groupNumbers = text.split(',').map(num => parseInt(num.trim()));
  const allGroups = await conn.groupFetchAllParticipating();
  const groupList = Object.values(allGroups);
  
  let added = 0;
  let alreadyExists = 0;
  let invalid = 0;
  
  for (const num of groupNumbers) {
    if (isNaN(num)) {
      invalid++;
      continue;
    }
    
    const index = num - 1;
    if (index >= 0 && index < groupList.length) {
      const groupId = groupList[index].id;
      if (!blacklistGroups.includes(groupId)) {
        blacklistGroups.push(groupId);
        added++;
      } else {
        alreadyExists++;
      }
    } else {
      invalid++;
    }
  }
  
  let reply = '';
  if (added > 0) reply += `✅ Berhasil menambahkan ${added} grup ke blacklist\n`;
  if (alreadyExists > 0) reply += `⚠️ ${alreadyExists} grup sudah ada di blacklist\n`;
  if (invalid > 0) reply += `❌ ${invalid} nomor grup tidak valid`;
  
  await conn.reply(m.chat, reply.trim(), m);
}

// Fungsi untuk menampilkan daftar blacklist
async function showBlacklist(m, conn) {
  if (blacklistGroups.length === 0) {
    return conn.reply(m.chat, '📭 Tidak ada grup dalam blacklist', m);
  }
  
  try {
    const allGroups = await conn.groupFetchAllParticipating();
    const groupList = Object.values(allGroups);
    const blacklisted = groupList.filter(g => blacklistGroups.includes(g.id));
    
    if (blacklisted.length === 0) {
      return conn.reply(m.chat, '📭 Tidak ada grup dalam blacklist', m);
    }
    
    const list = blacklisted.map((group, index) => {
      return `➤ ${index + 1}. ${group.subject}\n   ID: ${group.id}`;
    }).join('\n\n');
    
    await conn.reply(m.chat, `🚫 *Daftar Grup Blacklisted (${blacklisted.length})*\n\n${list}`, m);
  } catch (error) {
    console.error('Error in showBlacklist:', error);
    await conn.reply(m.chat, '❌ Terjadi kesalahan saat mengambil daftar blacklist', m);
  }
}

// Fungsi untuk menghapus grup dari blacklist
async function removeBlacklist(m, conn, text) {
  if (!text) {
    return conn.reply(m.chat, `Contoh: ${usedPrefix}delblacklistgc 1`, m);
  }

  const num = parseInt(text.trim());
  if (isNaN(num)) {
    return conn.reply(m.chat, 'Harap masukkan nomor yang valid', m);
  }
  
  const allGroups = await conn.groupFetchAllParticipating();
  const groupList = Object.values(allGroups);
  const index = num - 1;
  
  if (index >= 0 && index < groupList.length) {
    const groupId = groupList[index].id;
    const idx = blacklistGroups.indexOf(groupId);
    if (idx !== -1) {
      blacklistGroups.splice(idx, 1);
      return conn.reply(m.chat, `✅ Berhasil menghapus grup dari blacklist`, m);
    }
    return conn.reply(m.chat, 'ℹ️ Grup tidak ditemukan dalam blacklist', m);
  }
  
  conn.reply(m.chat, '❌ Nomor grup tidak valid', m);
}

// Helper functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function uploadImage(content) {
  try {
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", new Blob([content.toArrayBuffer()], { type: "image/png" }), crypto.randomBytes(5).toString("hex") + ".png");

    const response = await fetch("https://catbox.moe/user/api.php", { 
      method: "POST", 
      body: formData,
      timeout: 30000
    });
    
    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.error('Upload image error:', error);
    throw error;
  }
}

function formatTime(timestamp) {
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Unknown';
  }
}

function formatDuration(seconds) {
  if (!seconds) return 'Tidak diatur';
  
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  
  return parts.join(' ') || `${seconds} detik`;
}

handler.help = [
  'share <caption>', 'Broadcast pesan ke semua grup',
  'listbcgc', 'Melihat daftar grup',
  'blacklistgc <nomor>', 'Menambahkan grup ke blacklist',
  'listblacklistgc', 'Melihat daftar grup blacklist',
  'delblacklistgc <nomor>', 'Menghapus grup dari blacklist'
];
handler.tags = ['owner'];
handler.command = /^(share|jpm|bcgc|broadcast|listbcgc|blacklistgc|listblacklistgc|delblacklistgc)$/i;
handler.rowner = true;

export default handler;