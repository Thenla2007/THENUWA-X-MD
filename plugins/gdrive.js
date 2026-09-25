const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "gdrive",
    alias: ["gdl", "gdriveDl"],
    react: "🗂️",
    desc: "Download Google Drive files and upload directly",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the prompt (Google Drive URL) is provided
        if (!q) {
            return reply("*❌ Please provide a valid Google Drive file URL!*\nExample: `.gdrive <URL>`");
        }

        // Validate URL (basic check)
        if (!q.startsWith("https://drive.google.com/file/d/")) {
            return reply("*❌ Invalid Google Drive file URL!*");
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/gdrive?url=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 200 || !data.success) return reply("❌ Failed to fetch the Google Drive file.");

        const fileInfo = {
            name: data.name || 'Unknown File',
            downloadLink: data.download_link || '',
            thumbnail: "https://i.ibb.co/PS5DZdJ/Chat-GPT-Image-Mar-30-2025-12-53-39-PM.png" // Thumbnail URL
        };

        if (!fileInfo.downloadLink) return reply("❌ No download link found for this file.");

        // Newsletter context info
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: 120363403804248705@newsletter'',
                newsletterName: "THENUWA XMD",
                serverMessageId: 143,
            },
        };

        let desc = `
╔══✦❘༻ *THENUWA XMD* ༺❘✦══╗
┇  📂 *𝗚𝗢𝗢𝗚𝗟𝗘 𝗗𝗥𝗜𝗩𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥* 📂
┇╭───────────────────
┇│•📁 𝗙𝗶𝗹𝗲 𝗡𝗮𝗺𝗲: ${fileInfo.name} 
┇│•🌐 𝗟𝗶𝗻𝗸: ${q}
╰─・─・─・─・─・─・─・─╯
╭━✦❘༻ 𝗙𝗜𝗟𝗘 𝗜𝗡𝗙𝗢 ༺❘✦━╮
│•🔗 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗟𝗜𝗡𝗞: ${fileInfo.downloadLink}
╰━✦❘༻ *THENUWA XMD* ༺❘✦━╯
> POWERED BY THENUWA XMD `;

        // Send the description and thumbnail image
        await conn.sendMessage(from, {
            image: { url: fileInfo.thumbnail },
            caption: desc,
            contextInfo: newsletterContext
        }, { quoted: mek });

        // Download the file from the Google Drive link as a buffer
        const fileResponse = await axios.get(fileInfo.downloadLink, { responseType: 'arraybuffer' });

        // Convert the buffer to a stream
        const fileBuffer = Buffer.from(fileResponse.data, 'binary');
        const fileStream = fs.createWriteStream(path.join(__dirname, 'tempFile'));

        // Write buffer to file
        fs.writeFileSync(path.join(__dirname, 'tempFile'), fileBuffer);

        // Send the file as a document
        await conn.sendMessage(from, { document: { url: path.join(__dirname, 'tempFile') }, mimetype: 'application/octet-stream', fileName: fileInfo.name }, { quoted: mek });

        // Clean up the temporary file
        fs.unlinkSync(path.join(__dirname, 'tempFile'));

    } catch (e) {
        console.error("Error fetching Google Drive file:", e);
        reply("⚠️ Error fetching the Google Drive file.");
    }
});
