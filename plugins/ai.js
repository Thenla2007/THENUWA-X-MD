const config = require('../config')
const {cmd , commands} = require('../command')
const { fetchJson } = require('../lib/functions')

cmd({
    pattern: "ai",
    alias: ["gpt","bot"], 
    react: "📑",
    desc: "ai chat.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
// 1. පරිශීලකයා ප්‍රශ්නයක් ඇතුළත් කර නැතිනම් පණිවිඩයක් පෙන්වීම
if (!q) return reply("කරුණාකර AI එකෙන් ඇසීමට ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .ai hello)")

// 2. API එකෙන් Response එක ලබා ගැනීම
let data = await fetchJson(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)

// 3. API Response එක ඇතුළේ result හෝ response ලෙස දත්ත ඇත්දැයි බැලීම (undefined වීම වැළැක්වීමට)
let aiResponse = data.result || data.response || data.data || data.message;

if (aiResponse) {
    return reply(`${aiResponse}`)
} else {
    // API එකෙන් text එකක් ආවේ නැතිනම් සම්පූර්ණ JSON එක stringify කර පෙන්වීම (Debug කරගැනීමට)
    return reply(JSON.stringify(data))
}

}catch(e){
console.log(e)
reply(`Error: ${e.message || e}`)
}
})
