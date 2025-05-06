import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [query] = text.split("|");
  if (!query) throw `*Contoh penggunaan:* ${usedPrefix}${command} ⧼query⧽`;

  try {
    let response = await fetch(`https://api.agatz.xyz/api/spotify?message=${encodeURIComponent(query)}`, {
      headers: { 'accept': 'application/json' },
    });
    let data = await response.json();

    if (data.status !== 200 || !data.data.length) {
      throw 'Tidak ada hasil ditemukan untuk pencarian ini.';
    }

    let caption = `— *Spotify Search Results*

_Here are some tracks based on your search for "${query}":_\n\n`;

    data.data.forEach((track, index) => {
      caption += `• *Track ${track.trackNumber}:* ${track.trackName}\n`;
      caption += `  Artist: ${track.artistName}\n`;
      caption += `  Album: ${track.albumName}\n`;
      caption += `  Duration: ${track.duration}\n`;
      caption += `  Listen: ${track.externalUrl}\n\n`;
    });

    m.reply(caption);
  } catch (err) {
    m.reply(`Error: ${err.message}`);
  }
};

handler.help = ['spotifysearch'];
handler.tags = ['search'];
handler.command = /^(spotifysearch)$/i;
handler.register = true;
handler.premium = false;
handler.limit = true;

export default handler;

/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/