const handler = async (m, { conn, command, usedPrefix }) => {
  const islamicClues = [
    { name: "Nabi Muhammad", clue: "Nabi terakhir dan rasul penutup dalam Islam." },
    { name: "Al-Qur'an", clue: "Kitab suci umat Islam yang diturunkan kepada Nabi Muhammad." },
    { name: "Ka'bah", clue: "Bangunan suci yang menjadi kiblat umat Islam dalam shalat." },
    { name: "Shalat", clue: "Ibadah wajib yang dilakukan lima kali sehari oleh umat Islam." },
    { name: "Haji", clue: "Ibadah ke Tanah Suci yang merupakan rukun Islam kelima." },
    { name: "Zakat", clue: "Kewajiban memberikan sebagian harta untuk yang berhak menerimanya." },
    { name: "Ramadhan", clue: "Bulan suci di mana umat Islam berpuasa selama sebulan penuh." },
    { name: "Jibril", clue: "Malaikat yang menyampaikan wahyu kepada para nabi." },
    { name: "Masjid", clue: "Tempat ibadah umat Islam yang sering digunakan untuk shalat berjamaah." },
    { name: "Surga", clue: "Tempat balasan bagi orang-orang yang beriman dan beramal saleh." },
    { name: "Puasa", clue: "Menahan diri dari makan, minum, dan hal-hal tertentu sejak terbit fajar hingga terbenam matahari." },
  ];

  if (!conn.tebakIslam) conn.tebakIslam = {};

  if (m.sender in conn.tebakIslam) {
    m.reply("Kamu masih punya pertanyaan yang belum selesai!");
    return;
  }

  const randomClue = islamicClues[Math.floor(Math.random() * islamicClues.length)];
  conn.tebakIslam[m.sender] = {
    answer: randomClue.name.toLowerCase(),
    timeout: setTimeout(() => {
      delete conn.tebakIslam[m.sender];
      m.reply(`Waktu habis! Jawabannya adalah *${randomClue.name}*.`);
    }, 30 * 1000), // 30 detik
  };

  m.reply(
    `*Tebakkan Islam*\n\nClue: ${randomClue.clue}\n\nKetik jawabanmu dalam waktu 30 detik!`
  );
};

handler.before = async (m, { conn }) => {
  if (!conn.tebakIslam || !(m.sender in conn.tebakIslam)) return;

  const game = conn.tebakIslam[m.sender];
  if (m.text.toLowerCase() === game.answer) {
    clearTimeout(game.timeout);
    delete conn.tebakIslam[m.sender];
    m.reply(`Selamat! Jawaban kamu benar: *${game.answer}*.`);
  } else {
    m.reply("Jawaban salah! Coba lagi.");
  }
};

handler.help = ["tebakkanislam"];
handler.tags = ["game"];
handler.command = /^(tebakkanislam|tebakislam)$/i;
handler.limit = false;

export default handler;