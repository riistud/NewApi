const cheerio = require("cheerio");
const axios = require("axios");

async function BSearch(query) {
   try {
      let { data: m } = await axios.get(`https://www.bilibili.tv/id/search-result?q=${encodeURIComponent(query)}`, {
         headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/122.0.0.0 Safari/537.36"
         }
      });

      let $ = cheerio.load(m);
      const results = [];

      $("li.section__list__item").each((index, element) => {
         const title = $(element).find(".highlights__text--active").text().trim() || "Tidak ada judul";
         const videoLink = $(element).find(".bstar-video-card__cover-link").attr("href") || "";
         const thumbnail = $(element).find(".bstar-video-card__cover-img img").attr("src") || "";
         const views = $(element).find(".bstar-video-card__desc--normal").text().trim() || "Tidak tersedia";
         const creatorName = $(element).find(".bstar-video-card__nickname").text().trim() || "Tidak diketahui";
         const creatorLink = $(element).find(".bstar-video-card__nickname").attr("href") || "";
         const duration = $(element).find(".bstar-video-card__cover-mask-text").text().trim() || "Tidak ada durasi";

         results.push({
            title,
            videoLink: videoLink ? `https://www.bilibili.tv${videoLink}` : "",
            thumbnail,
            views,
            creatorName,
            creatorLink: creatorLink ? `https://www.bilibili.tv${creatorLink}` : "",
            duration
         });
      });

      return results.length > 0 ? results : [{ message: "Tidak ada hasil yang ditemukan." }];
   } catch (error) {
      console.error("Error while fetching search results:", error);
      return [];
   }
}

module.exports = { BSearch };