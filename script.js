const dataApi = {
  "Orderkuota Gateway": [
    { name: "Create Payment", method: "GET", link: "/api/orkut/createpayment?apikey=&amount=&codeqr=" },
    { name: "Cek Status", method: "GET", link: "/api/orkut/cekstatus?apikey=&merchant=&keyorkut=" }
  ],
  "Downloader": [
    { name: "Tiktok", method: "GET", link: "/api/download/tiktokdl?url=" },
    { name: "Facebook", method: "GET", link: "/api/download/fbdl?url=" },
    { name: "Instagram", method: "GET", link: "/api/download/igdl?url=" },
    { name: "Ytmp3", method: "GET", link: "/api/download/ytmp3?url=" },
    { name: "Ytmp4", method: "GET", link: "/api/download/ytmp4?url=" },
    { name: "Capcut", method: "GET", link: "/api/download/capcut?url=" },
    { name: "Doodstream", method: "GET", link: "/api/download/doodstream?url=" },
    { name: "Google Drive", method: "GET", link: "/api/download/gdrive?url=" },
    { name: "Pinterest Video", method: "GET", link: "/api/search/pinterest?q=" },
    { name: "Soundcloud", method: "GET", link: "/api/download/pindlvid?url=" },
    { name: "Snackvideo", method: "GET", link: "/api/download/snackvideo?url=" },
    { name: "XNXX", method: "GET", link: "/api/download/xnxxdl?url=" }
  ],
  "Openai": [
    { name: "Openai", method: "GET", link: "/api/ai/openai?msg=" },
    { name: "Openai Prompt", method: "GET", link: "/api/ai/openai-prompt?prompt=&msg=" },
    { name: "Blackbox", method: "GET", link: "/api/ai/blackbox?msg=" },
    { name: "DeepSeek", method: "GET", link: "/api/ai/openai?msg=" },
    { name: "GPT 4", method: "GET", link: "/api/ai/gpt4?text=" },
    { name: "GPT 3.5 Turbo", method: "GET", link: "/api/ai/gpt-3-5-turbo?text=" },
    { name: "Gemini", method: "GET", link: "/api/ai/gemini?text=" },
    { name: "Sim Simipta", method: "GET", link: "/api/ai/simsimi?msg=" }
  ],
  "Tools": [
    { name: "Tinyurl", method: "GET", link: "/api/tools/tinyurl?url=" },
    { name: "Isgd", method: "GET", link: "/api/tools/isgd?url=" },
    { name: "Safelinku", method: "GET", link: "/api/tools/safelinku?url=" },
    { name: "Nik Parser", method: "GET", link: "/api/search/nik?ktp=" }
  ],
  "Search": [
    { name: "Bstation", method: "GET", link: "/api/search/bstation?q=" },
    { name: "Google Image", method: "GET", link: "/api/search/gimage?q=" },
    { name: "Pinterest", method: "GET", link: "/api/search/pinterest?q=" },
    { name: "Playstore", method: "GET", link: "/api/search/playstore?q=" },
    { name: "Fdroid", method: "GET", link: "/api/search/fdroid?q=" },
    { name: "Youtube Search", method: "GET", link: "/api/search/ytsearch?q=" },
    { name: "Happymod", method: "GET", link: "/api/search/happymod?q=" },
    { name: "Sfilemobi", method: "GET", link: "/api/search/sfile?q=" },
    { name: "Tiktok Search", method: "GET", link: "/api/search/tiktoksearch?q=" },
    { name: "NPM Search", method: "GET", link: "/api/search/npm?q=" },
    { name: "XNXX Search", method: "GET", link: "/api/search/xnxx?q=" },
    { name: "Lyrics", method: "GET", link: "/api/search/lyrics?q=" },
    { name: "Subdomain Finder", method: "GET", link: "/api/search/subdomain?url=" }
  ],
  "Sosmed Stalk": [
    { name: "Tiktok", method: "GET", link: "/api/tools/tiktokstalk?user=" },
    { name: "Instagram", method: "GET", link: "/api/tools/igstalk?username=" },
    { name: "Github", method: "GET", link: "/api/tools/githubstalk?user=" },
    { name: "NPM", method: "GET", link: "/api/tools/npmstalk?pkgname=" },
    { name: "Youtube", method: "GET", link: "/api/tools/youtubestalk?user=" }
  ],
  "Image Creator": [
    { name: "Brat", method: "GET", link: "/api/imagecreator/bratgenerator?text=" },
    { name: "Pornhub", method: "GET", link: "/api/imagecreator/pornhub?text1=&text2=" },
    { name: "Remini", method: "GET", link: "/api/imagecreator/remini?url=" },
    { name: "Removebg", method: "GET", link: "/api/imagecreator/removebg?url=" },
    { name: "Upscale", method: "GET", link: "/api/imagecreator/upscale?url=" },
    { name: "Quotely", method: "GET", link: "/api/imagecreator/qc?text=&fotoUrl=&nama=" }
  ]
};

const kategoriList = document.getElementById("kategoriList");
const kontenApi = document.getElementById("kontenApi");
const totalApi = document.getElementById("totalApi");
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

let total = 0;

for (const kategori in dataApi) {
  const li = document.createElement("li");
  li.textContent = kategori;
  li.addEventListener("click", () => {
    document.getElementById(kategori).scrollIntoView({ behavior: "smooth" });
  });
  kategoriList.appendChild(li);

  const card = document.createElement("div");
  card.className = "card";
  card.id = kategori;
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = kategori;
  card.appendChild(title);

  dataApi[kategori].forEach(api => {
    total++;
    const ep = document.createElement("div");
    ep.className = "endpoints";
    ep.innerHTML = `
      <span class="method">${api.method}</span>
      <span class="name">${api.name}</span>
      <a class="try-btn" href="${api.link}" target="_blank">TRY</a>
    `;
    card.appendChild(ep);
  });

  kontenApi.appendChild(card);
}

totalApi.textContent = total;

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768 && 
      !sidebar.contains(e.target) && 
      !toggleSidebar.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});