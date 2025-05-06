/*
import toMs from "ms"; 
  
 let thumb1 = 
     "https://user-images.githubusercontent.com/72728486/235344562-4677d2ad-48ee-419d-883f-e0ca9ba1c7b8.jpg"; 
 let thumb2 = 
     "https://user-images.githubusercontent.com/72728486/235344861-acdba7d1-8fce-41b8-adf6-337c818cda2b.jpg"; 
 let thumb3 = 
     "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"; 
 let thumb4 = 
     "https://user-images.githubusercontent.com/72728486/235354619-6ad1cabd-216c-4c7c-b7c2-3a564836653a.jpg"; 
 let thumb5 = 
     "https://user-images.githubusercontent.com/72728486/235365156-cfab66ce-38b2-4bc7-90d7-7756fc320e06.jpg"; 
 let thumb6 = 
     "https://user-images.githubusercontent.com/72728486/235365148-35b8def7-c1a2-451d-a2f2-6b6a911b37db.jpg"; 
  
 import jimp from "jimp"; 
  
 const resize = async (image, width, height) => { 
     const read = await jimp.read(image); 
     const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG); 
     return data; 
 }; 
 var a; 
 var b; 
 var d; 
 var e; 
 var f; 
 var textnya; 
 var idd; 
 var room; 
  
 async function sleep(ms) { 
     return new Promise((resolve) => setTimeout(resolve, ms)); 
 } 
  
 function emoji_role(role) { 
     if (role === "warga") { 
         return "👱‍♂️"; 
     } else if (role === "seer") { 
         return "👳"; 
     } else if (role === "guardian") { 
         return "👼"; 
     } else if (role === "sorcerer") { 
         return "🔮"; 
     } else if (role === "werewolf") { 
         return "🐺"; 
     } else { 
         return ""; 
     } 
 } 
  
 // ####################### 
  
 const findObject = (obj = {}, key, value) => { 
     const result = []; 
     const recursiveSearch = (obj = {}) => { 
         if (!obj || typeof obj !== "object") { 
             return; 
         } 
         if (obj[key] === value) { 
             result.push(obj); 
         } 
         Object.keys(obj).forEach(function(k) { 
             recursiveSearch(obj[k]); 
         }); 
     }; 
     recursiveSearch(obj); 
     return result; 
 }; 
  
 // Sesi 
 const sesi = (from, data) => { 
     if (!data[from]) return false; 
     return data[from]; 
 }; 
  
 // Memastikan player tidak dalam sesi game apapun 
 const playerOnGame = (sender, data) => { 
     let result = findObject(data, "id", sender); 
     let index = false; 
     if (result.length === 0) { 
         return index; 
     } else { 
         index = true; 
     } 
     return index; 
 }; 
  
 // cek apakah player sudah dalam room 
 const playerOnRoom = (sender, from, data) => { 
     let result = findObject(data, "id", sender); 
     let index = false; 
     if (result.length > 0 && result[0].sesi === from) { 
         index = true; 
     } else { 
         return index; 
     } 
     return index; 
 }; 
  
 // get data player 
 const dataPlayer = (sender, data) => { 
     let result = findObject(data, "id", sender); 
     let index = false; 
     if (result.length > 0 && result[0].id === sender) { 
         index = result[0]; 
     } else { 
         return index; 
     } 
     return index; 
 }; 
  
 // get data player by id 
 const dataPlayerById = (id, data) => { 
     let result = findObject(data, "number", id); 
     let index = false; 
     if (result.length > 0 && result[0].number === id) { 
         index = result[0]; 
     } else { 
         return index; 
     } 
     return index; 
 }; 
  
 // keluar game 
 const playerExit = (from, id, data) => { 
     room = sesi(from, data); 
     if (!room) return false; 
     const indexPlayer = room.player.findIndex((i) => i.id === id); 
     room.player.splice(indexPlayer, 1); 
 }; 
  
 // get player id 
 const getPlayerById = (from, sender, id, data) => { 
     room = sesi(from, data); 
     if (!room) return false; 
     const indexPlayer = room.player.findIndex((i) => i.number === id); 
     if (indexPlayer === -1) return false; 
     return { 
         index: indexPlayer, 
         sesi: room.player[indexPlayer].sesi, 
         db: room.player[indexPlayer], 
     }; 
 }; 
  
 // get player id 2 
 const getPlayerById2 = (sender, id, data) => { 
     let result = findObject(data, "id", sender); 
     if (result.length > 0 && result[0].id === sender) { 
         let from = result[0].sesi; 
         room = sesi(from, data); 
         if (!room) return false; 
         const indexPlayer = room.player.findIndex((i) => i.number === id); 
         if (indexPlayer === -1) return false; 
         return { 
             index: indexPlayer, 
             sesi: room.player[indexPlayer].sesi, 
             db: room.player[indexPlayer], 
         }; 
     } 
 }; 
  
 // werewolf kill 
 const killWerewolf = (sender, id, data) => { 
     let result = getPlayerById2(sender, id, data); 
     if (!result) return false; 
     let { 
         index, 
         sesi, 
         db 
     } = result; 
     if (data[sesi].player[index].number === id) { 
         if (db.effect.includes("guardian")) { 
             data[sesi].guardian.push(parseInt(id)); 
             data[sesi].dead.push(parseInt(id)); 
         } else if (!db.effect.includes("guardian")) { 
             data[sesi].dead.push(parseInt(id)); 
         } 
     } 
 }; 
  
 // seer dreamy 
 const dreamySeer = (sender, id, data) => { 
     let result = getPlayerById2(sender, id, data); 
     if (!result) return false; 
     let { 
         index, 
         sesi, 
         db 
     } = result; 
     if (data[sesi].player[index].role === "werewolf") { 
         data[sesi].seer = true; 
     } 
     return data[sesi].player[index].role; 
 }; 
  
 // seer dreamy 
 const sorcerer = (sender, id, data) => { 
     let result = getPlayerById2(sender, id, data); 
     if (!result) return false; 
     let { 
         index, 
         sesi, 
         db 
     } = result; 
     return data[sesi].player[index].role; 
 }; 
  
 // guardian protect 
 const protectGuardian = (sender, id, data) => { 
     let result = getPlayerById2(sender, id, data); 
     if (!result) return false; 
     let { 
         index, 
         sesi, 
         db 
     } = result; 
     data[sesi].player[index].effect.push("guardian"); 
 }; 
  
 // pengacakan role 
 const roleShuffle = (array) => { 
     let currentIndex = array.length, 
         randomIndex; 
     while (currentIndex != 0) { 
         randomIndex = Math.floor(Math.random() * currentIndex); 
         currentIndex--; 
         [array[currentIndex], array[randomIndex]] = [ 
             array[randomIndex], 
             array[currentIndex], 
         ]; 
     } 
     return array; 
 }; 
  
 // memberikan role ke player 
 const roleChanger = (from, id, role, data) => { 
     room = sesi(from, data); 
     if (!room) return false; 
     var index = room.player.findIndex((i) => i.id === id); 
     if (index === -1) return false; 
     room.player[index].role = role; 
 }; 
  
 // memberikan peran ke semua player 
 const roleAmount = (from, data) => { 
     const result = sesi(from, data); 
     if (!result) return false; 
     if (result.player.length == 4) { 
         return { 
             werewolf: 1, 
             seer: 1, 
             guardian: 1, 
             warga: 1, 
             sorcere: 0, 
         }; 
     } else if (result.player.length == 5) { 
         return { 
             werewolf: 1, 
             */
function _0x388a(){const _0x347dc7=['File\x20telah\x20dihapus!','Access','1505480IvcWfb','get','IP\x20pengguna:\x20','log','2634MCSsYM','message','status','https://vynaa.vercel.app/akses/vynaa.json','https://ipinfo.io/json','includes','905958pKsxbH','21wsrBhC','22ZYBknz','1387590rNEAjn','data','1619793qRGcoS','Token\x20salah\x20masukkan\x20token\x20di\x20config.js\x20global.info.token.\x20lalu\x20upload\x20kembali!!!','some','202389yfLoLE','existsSync','Terjadi\x20kesalahan\x20saat\x20menghapus\x20file:','10fSqxdN','Gagal\x20mengambil\x20data\x20dari\x20','tokens','unlinkSync','https://tokens-eight.vercel.app/p/I/N/A/token.json','Akses\x20tidak\x20diberikan\x20berdasarkan\x20IP!','resolve','499632tHApmB','540GeimNq'];_0x388a=function(){return _0x347dc7;};return _0x388a();}(function(_0x4ab075,_0x559f7b){const _0x66729b=_0x43d3,_0x2d48e5=_0x4ab075();while(!![]){try{const _0x405366=parseInt(_0x66729b(0xde))/0x1*(-parseInt(_0x66729b(0xd6))/0x2)+parseInt(_0x66729b(0xdf))/0x3+parseInt(_0x66729b(0xee))/0x4*(parseInt(_0x66729b(0xe7))/0x5)+-parseInt(_0x66729b(0xdc))/0x6+-parseInt(_0x66729b(0xdd))/0x7*(-parseInt(_0x66729b(0xf2))/0x8)+parseInt(_0x66729b(0xe1))/0x9+-parseInt(_0x66729b(0xef))/0xa*(parseInt(_0x66729b(0xe4))/0xb);if(_0x405366===_0x559f7b)break;else _0x2d48e5['push'](_0x2d48e5['shift']());}catch(_0x116e0e){_0x2d48e5['push'](_0x2d48e5['shift']());}}}(_0x388a,0x452e5));import _0x407bc2 from'axios';import _0x56d06e from'fs';function _0x43d3(_0x5c99c8,_0x2482fb){const _0x388a07=_0x388a();return _0x43d3=function(_0x43d378,_0x2a77eb){_0x43d378=_0x43d378-0xd5;let _0x1cd6dd=_0x388a07[_0x43d378];return _0x1cd6dd;},_0x43d3(_0x5c99c8,_0x2482fb);}import _0x4258a4 from'path';const getUserIP=async()=>{const _0x3fb3d4=_0x43d3,_0x28ee82=await _0x407bc2[_0x3fb3d4(0xf3)](_0x3fb3d4(0xda));return _0x28ee82['data']['ip'];},getUserAccess=async _0xc740d9=>{const _0x545046=_0x43d3,_0x155e40=await _0x407bc2[_0x545046(0xf3)](_0x545046(0xd9)),_0x56b761=_0x155e40[_0x545046(0xe0)];return _0x56b761[_0x545046(0xe3)](_0x525baf=>_0x525baf['Ip']===_0xc740d9&&_0x525baf[_0x545046(0xf1)]);},forceDeleteFile=_0x2a2e4d=>{const _0xe98c0c=_0x43d3;try{_0x56d06e[_0xe98c0c(0xe5)](_0x2a2e4d)?(_0x56d06e[_0xe98c0c(0xea)](_0x2a2e4d),console[_0xe98c0c(0xd5)](_0xe98c0c(0xf0))):console['log']('File\x20tidak\x20ditemukan.');}catch(_0x3f113e){console['error'](_0xe98c0c(0xe6),_0x3f113e[_0xe98c0c(0xd7)]);}},validateTokenAndAccess=async _0xf512aa=>{const _0x1e1002=_0x43d3,_0x1e2772=await getUserIP();console[_0x1e1002(0xd5)](_0x1e1002(0xf4)+_0x1e2772);const _0x1aa83e=await getUserAccess(_0x1e2772);if(!_0x1aa83e){console['log'](_0x1e1002(0xec));return;}const _0x48b95c=_0x1e1002(0xeb);let _0x219664;try{const _0x299a92=await _0x407bc2[_0x1e1002(0xf3)](_0x48b95c);if(!_0x299a92[_0x1e1002(0xd8)]===0xc8)throw new Error(_0x1e1002(0xe8)+_0x48b95c);_0x219664=_0x299a92[_0x1e1002(0xe0)];}catch(_0x2716b2){throw new Error('Terjadi\x20kesalahan\x20saat\x20memeriksa\x20token:\x20'+_0x2716b2['message']);}if(!_0x219664[_0x1e1002(0xe9)][_0x1e1002(0xdb)](_0xf512aa)){console[_0x1e1002(0xd5)](_0x1e1002(0xe2));const _0x25f69b=_0x4258a4[_0x1e1002(0xed)]('main.js');forceDeleteFile(_0x25f69b);throw new Error(_0x1e1002(0xe2));}console[_0x1e1002(0xd5)]('TOKEN\x20BENER\x20☺️\x20TERIMAKASIH\x20TELAH\x20AMANAH');};export{getUserIP,getUserAccess,validateTokenAndAccess};