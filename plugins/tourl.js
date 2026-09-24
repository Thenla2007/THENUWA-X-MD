const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "img2url", "url"],
  react: "🖇️",
  desc: "Convert an image to a URL using imgbb.",
  category: "utility",
  use: ".tourl",
  filename: __filename
}, async (conn, mek, m, { from, quoted, reply, sender, pushname }) => {
  try {
    // pushname එක parameter එකක් විදිහට ඉහත දී ඇති නිසා කෙලින්ම ලබාගත හැක
    const activePushname = pushname || m.pushName || 'User';
    
    const targetMessage = m.quoted ? m.quoted : m;
    const mimeType = (targetMessage.msg || targetMessage).mimetype || '';
    
    console.log("Image mime type: ", mimeType);

    if (!mimeType || !mimeType.startsWith("image")) {
      throw "🌻 Please reply to an image.";
    }

    // 1. පින්තූරය Buffer එකක් ලෙස බාගත කරගැනීම
    const imageBuffer = await targetMessage.download();
    
    // 2. එය ImgBB වෙත යැවීමට Base64 බවට හැරවීම
    const base64Image = imageBuffer.toString('base64');

    const apiKey = "039d17094c870b8147d2688d957c4b56"; 
    const targetUrl = "https://api.imgbb.com/1/upload?key=" + apiKey;
    
    // 3. ImgBB වෙත පින්තූරය යැවීම
    const response = await axios({
      method: 'post',
      url: targetUrl,
      data: {
        image: base64Image
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
      }]
    });

    if (!response.data || !response.data.data || !response.data.data.url) {
      throw "❌ Failed to upload the file.";
    }

    const uploadedUrl = response.data.data.url;

    // DENETH-MD Newsletter Context එක සහ මෙන්ෂන් කිරීම්
    const contextSettings = {
      'mentionedJid': [sender, m.sender],
      'forwardingScore': 999,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': '120363292876277898@newsletter',
        'newsletterName': "THENUVA XMD",
        'serverMessageId': 143
      }
    };

    // ලස්සන මෙනු කැප්ෂන් එකක් සෑදීම
    let captionText = `*👋 HELLOW...${pushname || 'User'}* ❤️ Welcome to CYBER X THENULA

   *📸 Image Uploaded Successfully!*

╭┈───────────────•* ⚡
│  ◦ 📂 *File Size* : ${(imageBuffer.length / 1024).toFixed(2)} KB
│  ◦ 🖇️ *URL* : ${uploadedUrl}
╰┈───────────────•* 🎉

> © ⚡POWERED by CYBER THENUVA`;

    // 4. ඔයා එවපු අලුත්ම DENETH-MD Logo එක සමඟ සෙන්ඩ් කිරීම
    await conn.sendMessage(from, {
      'image': { url: "https://catbox.moe" }, // ඔයා එවපු ලෝගෝවට යාවත්කාලීන කරන ලදි
      'caption': captionText,
      'contextInfo': contextSettings
    }, { quoted: mek });

  } catch (error) {
    reply("Error: " + error);
    console.error("Error occurred:", error);
  }
});
