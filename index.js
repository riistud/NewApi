require("./settings.js")
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require("axios")
const { getBuffer, fetchJson } = require('./function/function.js')  
const { groq } = require("./function/openai.js")
const { stalk } = require("node-tiklydown")
const { setTimeout: sleep } = require('timers/promises');
const fetch = require("node-fetch")
const { PlayStore } = require('./function/playstore.js') 
const { snackvideo } = require("./function/snackvideo.js")
const { pxpic } = require("./function/removebg.js")
const { fdroid } = require('./function/fdroid.js') 
const { BSearch } = require('./function/bstation.js') 
const { doodS } = require('./function/doodstream.js')
const { SimSimi } = require('./function/simsimi.js')
const { blackbox } = require('./function/blackbox.js')
const { xnxxdl, xnxxsearch } = require('./function/xnxxdl.js')
const { ttSearch } = require('./function/tiktoksearch.js') 
const { souncloudDl } = require('./function/soundcloud.js') 
const { lirikLagu } = require('./function/liriklagu.js') 
const { ephoto } = require('./function/pornhub.js') 
const { YtMp3, YtMp4, Search } = require('./function/youtube.js') 
const scp = require("caliph-api")
const { pinterest2, pinterest } = require('./function/pinterest.js') 
const { pindlVideo } = require('./function/pindl.js') 
const scp2 = require("imon-videos-downloader")
const { googleImage } = require('./function/gimage.js') 
const { githubstalk } = require('./function/githubstalk.js') 
const { youtubeStalk } = require('./function/ytstalk.js') 
const { fbdl } = require('./function/facebook.js') 
const { shortUrl, shortUrl2 } = require('./function/tinyurl.js') 
const { remini } = require('./function/remini.js')
const { igdl } = require('./function/instagram.js') 
const { chatbot } = require('./function/gpt.js')
const { DeepSeek } = require('./function/deepseek.js')
const { uploaderImg } = require('./function/uploadImage.js');
const { NikParser } = require('nik-parser');
const { tiktokdl } = require('./function/tiktok.js') 
const {
  convertCRC16,
  generateTransactionId,
  generateExpirationTime,
  elxyzFile,
  generateQRIS,
  createQRIS,
  checkQRISStatus
} = require('./function/orkut.js') 

const dns = require("dns").promises;
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "function")));
app.use(bodyParser.raw({ limit: '50mb', type: '*/*' }))
async function getSubdomains(domain) {
    try {
        const res = await axios.get(`https://crt.sh/?q=%25.${domain}&output=json`);
        const subdomains = new Set(res.data.map(entry => entry.name_value));
        return [...subdomains];
    } catch (err) {
        return [];
    }
}

// API Endpoint
app.get("/api/search/subdomain", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Parameter 'url' wajib diisi!" });

    try {
        const subdomains = await getSubdomains(url);

        // Membuat subdomains dalam bentuk array terstruktur
        const formattedSubdomains = subdomains.map(subdomain => subdomain.replace(/\n/g, ''));

        const result = {
            creator: "RiiCODE",
            data: url,
            subdomains: formattedSubdomains
        };

        // Menggunakan JSON.stringify dengan indentasi 2 untuk pretty print
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 2));  // pretty print dengan indentasi 2
    } catch (err) {
        res.status(500).json({ error: "Gagal mendapatkan subdomain" });
    }
})

app.get('/api/search/nik=:nik', (req, res) => {
    const { nik } = req.params;

    if (!nik) {
        return res.status(400).json({ error: 'NIK diperlukan' });
    }

    try {
        const parsedNik = new NikParser(nik);

        if (!parsedNik.isValid()) {
            return res.status(400).json({ error: 'NIK tidak valid' });
        }

        res.json({
            creator: RiiCODE,
            result:, 
            valid: parsedNik.isValid(),
            provinsi: { id: parsedNik.provinceId(), nama: parsedNik.province() },
            kabupatenKota: { id: parsedNik.kabupatenKotaId(), nama: parsedNik.kabupatenKota() },
            kecamatan: { id: parsedNik.kecamatanId(), nama: parsedNik.kecamatan() },
            kodePos: parsedNik.kodepos(),
            jenisKelamin: parsedNik.kelamin(),
            tanggalLahir: parsedNik.lahir(),
            kodeUnik: parsedNik.uniqcode(),
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses NIK' });
    }
});

app.get('/api/orkut/createpayment', async (req, res) => {
    const { apikey, amount } = req.query;
    if (!apikey) {
    return res.json("Isi Parameter Apikey.");
    }
    const check = global.apikey
    if (!check.includes(apikey)) return res.json("Apikey Tidak Valid!.")
    if (!amount) {
    return res.json("Isi Parameter Amount.")
    }
    const { codeqr } = req.query;
    if (!codeqr) {
    return res.json("Isi Parameter CodeQr menggunakan qris code kalian.");
    }
    try {
        const qrData = await createQRIS(amount, codeqr);
        res.json({ status: true, creator: global.creator, result: qrData });        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



app.get('/api/orkut/cekstatus', async (req, res) => {
    const { merchant, keyorkut } = req.query;
        if (!merchant) {
        return res.json("Isi Parameter Merchant.")
    }
    if (!keyorkut) {
        return res.json("Isi Parameter Keyorkut.");
    }
    try {
        const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
        const response = await axios.get(apiUrl);
        const result = await response.data;
                // Check if data exists and get the latest transaction
        const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;
                if (latestTransaction) {
            res.json(latestTransaction);
        } else {
            res.json({ message: "No transactions found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
})


app.get("/api/ai/openai-prompt", async (req, res) => {
    const { prompt, msg } = req.query;
    if (!prompt || !msg) return res.json("Isi Parameternya!");

    try {
        var anu = await groq(`${msg}`, `${prompt}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator,
        result: anu.respon
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.respon     
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/openai", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await groq(`${msg}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator,
        result: anu.respon
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.respon     
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/blackbox", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await blackbox(`${msg}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/simsimi", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await SimSimi(`${msg}`)
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/deepseek", async (req, res) => {
    const { msg } = req.query;
    if (!msg) return res.json("Isi Parameternya!");

    try {
        var anu = await DeepSeek(`${msg}`, true)
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/gpt4", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

    try {
        var anu = await chatbot.send(`${text}`)
        if (!anu?.choices[0]?.message?.content) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.choices[0].message.content
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/ai/gpt-3-5-turbo", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

    try {
        var anu = await chatbot.send(`${text}`, "gpt-3.5-turbo")
        if (!anu?.choices[0]?.message?.content) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.choices[0].message.content
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})


app.get("/api/ai/gemini", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

try {
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCPlGoKHoePXhHIaI7TLUESYgExSiB5XbI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = text

const result = await model.generateContent(prompt);
const anu = await result.response.text()
       
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})


app.get("/api/download/fbdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await fbdl(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/snackvideo", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await snackvideo(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/xnxxdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await xnxxdl(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu.result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/igdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await igdl(`${url}`)
        res.json(anu)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/tiktokdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await tiktokdl.fetchData(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            result: anu     
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/ytmp3", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await YtMp3(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            metadata: anu.details, 
            download: anu.downloads        
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/ytmp4", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await YtMp4(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            metadata: anu.details, 
            download: anu.downloads        
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/doodstream", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await doodS(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            result: anu   
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/soundcloud", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await souncloudDl.process(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu       
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/gdrive", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await scp2.GDLink(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/download/pindlvid", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await pindlVideo(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/download/capcut", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await scp2.capcut(`${url}`)
        res.json({
            status: true,
            creator: global.creator,
            result: anu.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/imagecreator/remini", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await remini(image, "enhance")
      await res.set("Content-Type", "image/png")
      await res.send(result)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/removebg", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await pxpic.create(image, "removebg")
      res.json({
            status: true,
            creator: global.creator,
            result: result.resultImageUrl
        });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/upscale", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await pxpic.create(image, "upscale")
      res.json({
            status: true,
            creator: global.creator,
            result: result.resultImageUrl
        });
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/bratgenerator", async (req, res) => {
    try {     
      const { text } = req.query
      if (!text) return res.json("Isi Parameternya!");
      const image = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${text}`)
      if (!image) res.json("Error!")
      await res.set("Content-Type", "image/png")
      await res.send(image)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/tinyurl", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      if (!url.startsWith("https://")) res.json("Link tautan tidak valid!")
      const result = await shortUrl(url)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      link: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/isgd", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      if (!url.startsWith("https://")) res.json("Link tautan tidak valid!")
      const result = await shortUrl2(url)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      link: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/igstalk", async (req, res) => {
const { username } = req.query
if (!username) return res.json("Isi Parameternya!")
const ig = require("./function/igstalk.js")
const anu = await ig.stalk(username)
if (anu.metadata) {
res.json({
      status: true, 
      creator: global.creator, 
      result: anu.metadata
})
} else {
res.json({
      status: false, 
      creator: global.creator, 
      result: {}
})
}
})

app.get("/api/tools/npmstalk", async (req, res) => {
const { pkgname } = req.query
if (!pkgname) return res.json("Isi Parameternya!")

async function npmstalk(packageName) {
  let stalk = await axios.get("https://registry.npmjs.org/"+packageName)
  let versions = stalk.data.versions
  let allver = Object.keys(versions)
  let verLatest = allver[allver.length-1]
  let verPublish = allver[0]
  let packageLatest = versions[verLatest]
  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestDependencies: Object.keys(packageLatest.dependencies).length,
    publishDependencies: Object.keys(versions[verPublish].dependencies).length,
    publishTime: stalk.data.time.created,
    latestPublishTime: stalk.data.time[verLatest]
  }
}

const anu = await npmstalk(pkgname)
if (anu) {
res.json({
      status: true, 
      creator: global.creator, 
      result: anu
})
} else {
res.json({
      status: false, 
      creator: global.creator, 
      result: {}
})
}
})

app.get("/api/tools/tiktokstalk", async (req, res) => {
    try {     
      const { user } = req.query
      if (!user) return res.json("Isi Parameternya!");
      const result = await stalk(user).then(res => res.data)
      if (!result) return res.json("Error!");
      let value = {
      nama: result.user.nickname, 
      user: result.user.uniqueId, 
      bio: result.user.signature, 
      privatemode: result.user.privateAccount,
      profile: result.user.avatarMedium, 
      followers: result.stats.followerCount, 
      following: result.stats.followingCount
      }
      res.json({
      status: true, 
      creator: global.creator, 
      result: value
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/githubstalk", async (req, res) => {
    try {     
      const { user } = req.query
      if (!user) return res.json("Isi Parameternya!");
      const result = await githubstalk(user).then(res => res)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/tools/youtubestalk", async (req, res) => {
    try {     
      const { user } = req.query
      if (!user) return res.json("Isi Parameternya!");
      const result = await youtubeStalk(user)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.post("/api/tools/upload", async (req, res) => {
    try {     
      const image = req.body
      if (!image) return res.send("POST METHOD!")
      const result = await uploaderImg(image)
      if (!result.status) return res.send("Image Tidak Ditemukan!")
      return res.json(result)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/pterodactyl/listpanel", async (req, res) => {
    try {     
let { egg, nestid, loc, domain, ptla, ptlc } = req.query
if (!egg || !nestid || !loc || !domain || !ptla || !ptlc) return res.json("Isi Parameternya!")
domain = "https://" + domain
let listnya = []
let f = await fetch(domain + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + ptla
}
})
let res2 = await f.json();
let servers = res2.data;
if (servers.length < 1) return res.json("Tidak ada server panel!");
for (let server of servers) {
let s = server.attributes
let f3 = await fetch(domain + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + ptlc
}
})
let data = await f3.json();
let status = data.attributes ? data.attributes.current_state : s.status;
await listnya.push({
Id: s.id, 
Nama: s.name, 
Ram: `${s.limits.memory == 0 ? "Unlimited" : s.limits.memory.toString().length > 4 ? s.limits.memory.toString().split("").slice(0,2).join("") + "GB" : s.limits.memory.toString().length < 4 ? s.limits.memory.toString().charAt(1) + "GB" : s.limits.memory.toString().charAt(0) + "GB"}`, 
Cpu: `${s.limits.cpu == 0 ? "Unlimited" : s.limits.cpu.toString() + "%"}`, 
Disk: `${s.limits.disk == 0 ? "Unlimited" : s.limits.disk.length > 3 ? s.limits.disk.toString().charAt(1) + "GB" : s.limits.disk.toString().charAt(0) + "GB"}`, 
Created: `${s.created_at.split("T")[0]}`
})
}
res.json({
status: true, 
creator: global.creator,
totalserver: listnya.length.toString(),
result: listnya
})
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/pinterest", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await pinterest2(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/xnxx", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await xnxxsearch(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result.result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/npm", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let anuan = await fetch(`http://registry.npmjs.com/-/v1/search?text=axios`)
	let { objects } = await anuan.json()
	let result = await objects.map(({ package: pkg }) => {
		return `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`
	})
      if (!result.length) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.get("/api/search/sfile", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await scp.search.sfile(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result.result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/playstore", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await PlayStore(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/fdroid", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await fdroid.search(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/bstation", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await BSearch(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.get("/api/search/happymod", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      let result = await scp.search.happymod(q)
      result = result.result.map((e) => {
      return { icon: e.thumb, name: e.title, link: e.link }
     })
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/gimage", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await googleImage(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.get("/api/search/ytsearch", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await Search(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/tiktoksearch", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await ttSearch(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/search/lyrics", async (req, res) => {
    try {     
      const { q } = req.query
      if (!q) return res.json("Isi Parameternya!");
      const result = await lirikLagu(q)
      if (!result) return res.json("Error!");
      res.json({
      status: true, 
      creator: global.creator, 
      result: result
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/pornhub", async (req, res) => {
    try {     
      const { text1, text2 } = req.query
      if (!text1 || !text2) return res.json("Isi Parameternya!");
      const image = await ephoto(text1, text2)
      if (!image) res.json("Error!")
      res.json({
      status: true, 
      creator: global.creator, 
      result: image
      })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

app.get("/api/imagecreator/qc", async (req, res) => {
    try {     
      const { text, fotoUrl, nama } = req.query
      if (!text || !nama || !fotoUrl) return res.json("Isi Parameternya!");
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#000000",
  "width": 812,
  "height": 968,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": nama,
        "photo": {
          "url": fotoUrl
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
        const response = axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
}).then(async (res) => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
  return buffer
})
      if (!response) res.json("Error!")
      await res.set("Content-Type", "image/png")
      await res.send(response)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})


app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Error");
});


app.use((req, res, next) => {
res.send("Hello World :)")
});


app.listen(PORT, () => {
  console.log(`Server Telah Berjalan > http://localhost:${PORT}`)
})



