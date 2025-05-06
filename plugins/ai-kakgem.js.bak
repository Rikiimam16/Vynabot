import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) 
    return await conn.sendMessage(m.chat, { text: 'Please provide some text after .kakgem' }, { quoted: m });

  try {
    // Send loading reaction
    await conn.relayMessage(m.chat, {
      reactionMessage: { 
        key: m.key, 
        text: '⏱️' 
      }
    }, { messageId: m.key.id });

    // Encode the text for the API request
    let encodedText = encodeURIComponent(text);
    const response = await fetch(`https://btch.us.kg/prompt/gpt?prompt=Mulai%20sekarang%20nama%20kamu%20adalah%20kak%20gem%2C%20kamu%20itu%20sangat%20bijak%20berkata-kata.%20Kamu%20pandai%20membuat%20kata-kata%20mutiara%20setiap%20ada%20yang%20bertanya%20kepada%20kamu%20atau%20berbicara%20dengan%20kamu.%20Kamu%20harus%20jawab%20dengan%20awalan%20%27oke%20singkat%20saja%27%2C%20lanjut%20dengan%20jawabanmu%20lalu%20diakhiri%20dengan%20PAHAM%21&text=${encodedText}`, {
      method: 'GET',
      headers: { 'accept': 'application/json' }
    });
    const data = await response.json();

    // Check if the response is successful
    if (data.status) {
      // Format the response text
      let responseText = `
*Response from Kak Gem*: ${data.result}
`;

      // Send the response text as a message
      await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    } else {
      // Handle error if the status isn't success
      await conn.sendMessage(m.chat, { text: 'Failed to fetch response from Kak Gem.' }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: 'Error fetching response. Please try again later.' }, { quoted: m });
  }
};

handler.help = ['kakgem'];
handler.tags = ['ai'];
handler.command = /^kakgem$/i;
handler.register = true;
handler.premium = true;

export default handler;