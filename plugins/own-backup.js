import fs from 'fs';
import archiver from 'archiver';

// Function to convert bytes into a readable size format
function formatBytes(bytes, decimalPlaces = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimalPlaces < 0 ? 0 : decimalPlaces;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

let handler = async (m, { conn, isOwner, command, text }) => {
  
  if (global.conn.user.jid !== conn.user.jid) return;

  conn.sendMessage(m.chat, {react: {text: '🔓', key: m.key}});

  const fake = {
    key: {
      participant: '6282389924037@s.whatsapp.net',
      remoteJid: '6282389924037@s.whatsapp.net'
    },
    message: { conversation: await style('Backup Script', 5) }
  };

  let backupZip = 'VynaaAI(10.21).zip';
  const output = fs.createWriteStream(backupZip);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', async function() {
    let cap = 'Proses pengarsipan selesai. ' + formatBytes(archive.pointer());
    console.log(cap);
    await conn.sendFile(global.info.nomerown + '@s.whatsapp.net', backupZip, backupZip, cap, fake);
    await m.react('✅');
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });
  
  archive.pipe(output);
  archive.glob('**/*', {
    ignore: ['node_modules/**', 'VynaaAI(10.21).zip'] // Mengecualikan file di dalam folder plugins
  });

  archive.finalize();
  await conn.delay(10000);
  await fs.unlinkSync(backupZip);
};

handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = /^(backup)$/i;
handler.rowner = true;

export default handler;