const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: 'col3neg',
    alias: ['shani', 'downvideo'],
    category: 'download',
    desc: 'Downloads video links from col3neg.com',
    async asyncExecute(conn, msg, args, { reply, prefix, command }) {
        // පරිශීලකයා ලින්ක් එකක් එවා ඇත්දැයි බැලීම
        if (!args[0]) return reply(`⚠️ කරුණාකර ලින්ක් එකක් ඇතුළත් කරන්න!\n\n💡 උදාහරණ: ${prefix}${command} https://col3neg.com...`);
        
        const url = args[0];
        if (!url.includes('col3neg.com')) return reply('❌ මෙය වලංගු Col3neg ලින්ක් එකක් නොවේ.');

        await reply('🔄 කරුණාකර රැඳී සිටින්න, වීඩියෝ ලින්ක් එක පරික්ෂා කරමින් පවතී...');

        try {
            // වෙබ් පිටුවේ HTML දත්ත ලබා ගැනීම
            const { data } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const \$ = cheerio.load(data);
            
            // iframe ටැග් එකෙන් වීඩියෝ සබැඳිය සෙවීම
            let videoUrl = '';
            \$('iframe').each((i, elem) => {
                const src = \$(elem).attr('src');
                if (src) {
                    videoUrl = src;
                    return false; // සොයාගත් පසු ලූප් එක නතර කරයි
                }
            });

            if (videoUrl) {
                // ලින්ක් එක // වලින් පටන් ගන්නේ නම් https එකතු කිරීම
                if (videoUrl.startsWith('//')) {
                    videoUrl = 'https:' + videoUrl;
                }

                const responseText = `✅ *වීඩියෝව සොයාගන්නා ලදී!*\n\n🔗 *වීඩියෝ ලින්ක් එක:* ${videoUrl}\n\nමෙම ලින්ක් එක ක්ලික් කර ඔබට වීඩියෝව බාගත කරගත හැක.`;
                
                return await reply(responseText);
            } else {
                return await reply('❌ කණගාටුයි, මෙම පිටුවෙන් සෘජු වීඩියෝ සබැඳියක් සොයාගත නොහැකි විය.');
            }

        } catch (e) {
            console.error(e);
            return await reply('🔺 කිසියම් දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න.');
        }
    }
};
