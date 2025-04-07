const axios = require("axios");

// TinyURL Shortener
async function shortUrl(links) {
  try {
    const res = await axios.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(links));
    return res.data.toString();
  } catch (error) {
    throw new Error("TinyURL Error: " + error.message);
  }
}

// is.gd Shortener
async function shortUrl2(links) {
  try {
    const res = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(links)}`);
    return res.data;
  } catch (error) {
    throw new Error("is.gd Error: " + error.message);
  }
}

// SafelinkU Shortener
async function safelinku(url, alias = "", passcode = "") {
  try {
    const response = await axios.post(
      "https://safelinku.com/api/v1/links",
      {
        url: url,
        alias: alias,
        passcode: passcode
      },
      {
        headers: {
          Authorization: "Bearer 2955189a3b3916acaa24c32b3a1b0b897280266f",
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("SafelinkU Error: " + (error.response?.data?.message || error.message));
  }
}

module.exports = { shortUrl, shortUrl2, safelinku };