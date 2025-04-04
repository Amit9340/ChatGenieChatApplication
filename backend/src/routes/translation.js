// import express from "express";
// import axios from "axios";

// const router = express.Router();

// router.post("/translate", async (req, res) => {  // ✅ Change from `/translate` to `/`
//     const { text, target } = req.body;

//     if (!text || !target) {
//         return res.status(400).json({ error: "Missing text or target language" });
//     }

//     try {
//         const response = await axios.get(
//             `https://translate.google.com/m?sl=auto&tl=${target}&q=${encodeURIComponent(text)}`
//         );
//         const translatedText = response.data; // Scraping response (may need processing)

//         res.json({ translatedText });
//     } catch (error) {
//         console.error("Translation error:", error);
//         res.status(500).json({ error: "Translation failed" });
//     }
// });

// export default router;


// import express from "express";
// import axios from "axios";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { text, target } = req.body;

//   if (!text || !target) {
//     return res.status(400).json({ error: "Missing text or target language" });
//   }

//   try {
//     // Use LibreTranslate or other API for translation
//     const response = await axios.post("https://libretranslate.com/translate", {
//       q: text,
//       source: "auto",
//       target: target,
//       format: "text"
//     });

//     const translatedText = response.data.translatedText;

//     res.json({ translatedText });
//   } catch (error) {
//     console.error("Translation error:", error);
//     res.status(500).json({ error: "Translation failed" });
//   }
// });

// export default router;



import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";  // ✅ Use Cheerio to extract text

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, target } = req.body;

  if (!text || !target) {
    return res.status(400).json({ error: "Missing text or target language" });
  }

  try {
    const url = `https://translate.google.com/m?sl=auto&tl=${target}&q=${encodeURIComponent(text)}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const translatedText = $("div.result-container").text().trim(); // ✅ Extract translation

    if (!translatedText) {
      return res.status(500).json({ error: "Translation failed" });
    }

    res.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
