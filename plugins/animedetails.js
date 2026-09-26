const { cmd } = require("../command");
const { getep } = require("darksadasyt-anime");

cmd(
  {
    pattern: "animedetails",
    react: "🎭",
    desc: "Get Anime Details and Episodes",
    category: "anime",
    filename: __filename,
  },

  async (
    robin,
    mek,
    m,
    {
      from,
      q,
      sender,
      reply
    }
  ) => {

    try {

      if (!q) {
        return reply("*Please provide an anime link.* 🎭");
      }

      // Newsletter context
      const contextInfo = {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363292876277898@newsletter",
          newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
          serverMessageId: 143
        }
      };

      // Get anime details
      const data = await getep(q);

      // Check API response
      if (!data) {
        return reply(
          "❌ *Anime API Error*\n\n" +
          "API එකෙන් response එකක් ලැබුණේ නැහැ."
        );
      }

      const result = data.result;
      const episodeList = data.results;

      // Check anime details
      if (!result) {
        console.log("Anime API Response:", data);

        return reply(
          "❌ *Anime Details Error*\n\n" +
          "Anime details ලබාගන්න බැරි වුණා."
        );
      }

      // Make sure episode list is an array
      const episodes = Array.isArray(episodeList)
        ? episodeList
        : [];

      // Anime details
      let detailsMessage =
        `🎬 *ANIME DETAILS* 🎬\n\n` +
        `📌 *Title:* ${result.title || "Unknown"}\n` +
        `📅 *Release Date:* ${result.date || "Unknown"}\n` +
        `⭐ *IMDb Rating:* ${result.imdb || "N/A"}\n` +
        `🎥 *Total Episodes:* ${result.epishodes || episodes.length || "N/A"}\n` +
        `🖼️ *Image:* ${result.image || "N/A"}\n\n`;

      // Episodes
      detailsMessage += `🎬 *EPISODES* 🎬\n\n`;

      if (episodes.length === 0) {

        detailsMessage +=
          "❌ Episode list එකක් හම්බ වුණේ නැහැ.";

      } else {

        episodes.forEach((episode, index) => {

          const epNumber =
            episode.episode ||
            episode.ep ||
            index + 1;

          const epUrl =
            episode.url ||
            episode.link ||
            "N/A";

          detailsMessage +=
            `📺 *Episode ${epNumber}*\n` +
            `🔗 ${epUrl}\n\n`;
        });
      }

      // Send message
      await robin.sendMessage(
        from,
        {
          text: detailsMessage,
          contextInfo: contextInfo
        },
        {
          quoted: mek
        }
      );

    } catch (e) {

      console.error("ANIME DETAILS ERROR:", e);

      return reply(
        "❌ *Anime Details Error*\n\n" +
        `${e.message || "Unknown error"}`
      );
    }
  }
);
