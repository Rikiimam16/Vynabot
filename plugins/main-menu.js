import fs from 'fs';
import moment from 'moment-timezone';

let menuFormat = {
  header: '*%category*',
  body: ' » %cmd',
  footer: '',
  after: '> © ' + global.info.namebot,
};

let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {
  // Current date and time in Asia/Jakarta timezone
  const time = moment().tz('Asia/Jakarta');
  const displayDate = time.format('dddd, DD MMMM YYYY');
  const displayTime = `Time: ${time.format('HH:mm:ss')}`;

  // Define categories
  let tags = {
        general: 'G e n e r a l',
    premium: 'P R E M I U M',
    main: 'M a i n',
    fun: 'F U N',
    pushkontak: 'P u s h',
    ai: 'A I',
    downloader: 'D O W N L O A D E R',
    search: 'S E A R C H',
    store: 'S t o r e',
    owner: 'O w n e r',
    islami: 'I S L A M I',
    game: 'G A M E',
    rpg: 'R P G',
    group: 'G r o u p',
    tools: 'T O O L S',
    info: 'I N F O',
  };

  // Handle `.menulist` command
  if (command === 'menulist') {
    let menuListText = `━━━━━━━━━━━━━━━━━━━━
*Available Menus*
━━━━━━━━━━━━━━━━━━━━
`;

    menuListText += Object.keys(tags)
      .map((tag) => `- ${_p}menu ${tag}`)
      .join('\n');

    menuListText += `\n━━━━━━━━━━━━━━━━━━━━`;

    // Send menu list
    return conn.sendMessage(m.chat, {
      text: menuListText,
      contextInfo: {
        externalAdReply: {
          title: 'Menu List',
          body: global.info.namebot,
          thumbnailUrl: global.url.thumbnail,
          sourceUrl: global.info.sgc,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });
  }

  // Default `.menu` functionality
  let help = Object.values(global.plugins)
    .filter((plugin) => plugin.tags && plugin.help)
    .map((plugin) => ({
      help: plugin.help,
      tags: plugin.tags,
      command: plugin.command,
    }));

  // Determine requested tag
  let requestedTag = args[0] ? args[0].toLowerCase() : null;

  // Build menu text
  let menuText = `
━━━━━━━━━━━━━━━━━━━━
*Time Information*
━━━━━━━━━━━━━━━━━━━━
Name: ${m.pushName || 'Unknown'}
Date: ${displayDate}
${displayTime}
━━━━━━━━━━━━━━━━━━━━
`;

  if (requestedTag && tags[requestedTag]) {
    // If a specific tag is requested
    let categoryHeader = menuFormat.header.replace('%category', tags[requestedTag]);

    // Filter commands by tag
    let commands = help
      .filter((plugin) => plugin.tags.includes(requestedTag))
      .map((plugin) => {
        if (Array.isArray(plugin.help)) {
          return plugin.help
            .map((h) => menuFormat.body.replace('%cmd', `${_p}${h}`))
            .join('\n');
        } else {
          return menuFormat.body.replace('%cmd', `${_p}${plugin.help}`);
        }
      })
      .join('\n');

    menuText += `${categoryHeader}\n${commands}`;
  } else {
    // Build menu for all tags
    menuText += Object.keys(tags)
      .map((tag) => {
        let categoryHeader = menuFormat.header.replace('%category', tags[tag]);

        let commands = help
          .filter((plugin) => plugin.tags.includes(tag))
          .map((plugin) => {
            if (Array.isArray(plugin.help)) {
              return plugin.help
                .map((h) => menuFormat.body.replace('%cmd', `${_p}${h}`))
                .join('\n');
            } else {
              return menuFormat.body.replace('%cmd', `${_p}${plugin.help}`);
            }
          })
          .join('\n');

        return [categoryHeader, commands].filter((v) => v).join('\n');
      })
      .join('\n\n'); // Separate categories
  }

  // Add footer and final text
  menuText += `\n━━━━━━━━━━━━━━━━━━━━
${menuFormat.footer}\n${menuFormat.after}`;

  // Send menu to user
  await conn.sendMessage(m.chat, {
    text: menuText,
    contextInfo: {
      externalAdReply: {
        title: global.info.author,
        body: global.info.namebot,
        thumbnailUrl: global.url.thumbnail,
        sourceUrl: global.url.sgc,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  });

  // Send audio from the system folder
  const audioFiles = [
    './system/pinaa1.mp3',
    './system/pinaa2.mp3',
    './system/pinaa3.mp3',
  ];

  // Choose a random audio file
  const randomAudioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

  // Send audio file to user
  await conn.sendFile(m.chat, randomAudioFile, 'audio.mp3', null, m, true, {
    type: 'audioMessage',
    ptt: true,
  });
};

// Metadata handler
handler.help = ['menulist'];
handler.tags = ['general'];
handler.command = /^(menu|allmenu|menulist)$/i;
handler.register = false;

export default handler;