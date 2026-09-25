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
if (!q) return reply("කරුණාකර AI එකෙන් ඇසීමට ප්‍රශ්නයක් ඇතුළත් කරන්න. (උදා: .ai hello)")

// ක්‍රමය 1: සැමවිටම ක්‍රියාකාරී Sandip Baruwal ChatGPT API එක භාවිතා කිරීම
let data = await fetchJson(`https://onrender.com{encodeURIComponent(q)}`)

if (data && data.answer) {
    return reply(`${data.answer}`)
} else {
    return reply("කණගාටුයි, AI සේවාව මේ මොහොතේ කාර්යබහුලයි. කරුණාකර සුළු මොහොතකින් නැවත උත්සාහ කරන්න.")
}

}catch(e){
console.log(e)
reply(`Error: ${e.message || e}`)
}
})
