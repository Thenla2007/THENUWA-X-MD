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

// ක්‍රමය 1: Zell API එක නව Parameter එකක් (`query=`) සහිතව උත්සාහ කිරීම
let data = await fetchJson(`https://zellapi.autos{encodeURIComponent(q)}`)

if (data && data.result) {
    return reply(`${data.result}`)
} 

// ක්‍රමය 2: Zell API එක වැඩ නොකළහොත් Blackbox ChatGPT API එක භාවිතා කිරීම
let fallbackData = await fetchJson(`https://giftedtech.my.id{encodeURIComponent(q)}`)
if (fallbackData && fallbackData.results) {
    return reply(`${fallbackData.results}`)
} else {
    return reply("කණගාටුයි, AI සේවාව මේ මොහොතේ කාර්යබහුලයි. පසුව උත්සාහ කරන්න.")
}

}catch(e){
console.log(e)
reply(`Error: ${e.message || e}`)
}
})
