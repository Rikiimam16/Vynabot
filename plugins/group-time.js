/*
SCRIPT BY © VYNAA VALERIE
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie
•• (github.com/VynaaValerie)
*/

let handler = async (m, { conn, isAdmin, isOwner, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    throw false;
  }

  // Interpret group setting action
  const isClose = {
    open: "not_announcement",
    buka: "not_announcement",
    on: "not_announcement",
    1: "not_announcement",
    close: "announcement",
    tutup: "announcement",
    off: "announcement",
    0: "announcement",
  }[args[0]?.toLowerCase()];

  if (!isClose) {
    const exampleText = `*Contoh Penggunaan:*
1. .grouptime open 1J  
   Untuk membuka grup selama 1 jam.

2. .grouptime close 1J  
   Untuk menutup grup selama 1 jam.`;

    await conn.sendMessage(
      m.chat,
      { text: exampleText },
      {
        quoted: m,
        mentions: await conn.parseMention(exampleText),
        contextInfo: { forwardingScore: 99999, isForwarded: true },
      }
    );
    throw false;
  }

  // Parse timeout duration
  const timeInput = args[1];
  let timeoutDuration;

  if (timeInput) {
    const duration = parseInt(timeInput.slice(0, -1));
    const unit = timeInput.slice(-1).toLowerCase();

    const unitMap = {
      d: 86400000,
      j: 3600000,
      m: 60000,
      s: 1000,
    };

    timeoutDuration = unitMap[unit] ? duration * unitMap[unit] : null;
  }

  if (!timeoutDuration) {
    return await conn.sendMessage(
      m.chat,
      { text: 'Format waktu tidak valid. Gunakan angka diikuti dengan huruf *d* (hari), *j* (jam), *m* (menit), atau *s* (detik).' },
      { quoted: m }
    );
  }

  // Update group settings
  try {
    await conn.groupSettingUpdate(m.chat, isClose);
    m.reply(
      `Sukses ${
        isClose === "announcement" ? "menutup" : "membuka"
      } grup${timeoutDuration ? `, grup akan berubah kembali setelah *${clockString(timeoutDuration)}*` : ""}.`
    );

    // Revert group settings after timeout
    if (timeoutDuration) {
      setTimeout(async () => {
        const revertAction = isClose === "announcement" ? "not_announcement" : "announcement";
        await conn.groupSettingUpdate(m.chat, revertAction);
        conn.reply(
          m.chat,
          `Grup telah ${revertAction === "announcement" ? "ditutup" : "dibuka"} kembali!`
        );
      }, timeoutDuration);
    }
  } catch (e) {
    m.reply("Gagal memperbarui pengaturan grup. Pastikan bot adalah admin.");
  }
};

handler.help = ["grouptime"];
handler.tags = ["group"];
handler.command = /^(grouptime|gctime)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;

function clockString(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

/*
Keterangan Waktu:
d - hari (day)
j - jam (hour)
m - menit (minute)
s - detik (second)
*/