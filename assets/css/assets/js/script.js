/* =================================================
   基本設定
================================================= */
const THEME_KEY = "bimibrog-theme";

/* -------------------------------------------------
   ダークモード切替
------------------------------------------------- */
const toggle = document.getElementById('dark-mode-toggle');
const savedTheme = localStorage.getItem(THEME_KEY) || 'light';

document.documentElement.dataset.theme = savedTheme;
toggle.checked = savedTheme === 'dark';

toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
});

/* -------------------------------------------------
   記事データ（サンプル）※実運用時は generate-index.js が生成
------------------------------------------------- */
const posts = [
  {
    slug: "001-rice",
    title: "米の研ぎ方と炊飯（第1回）",
    thumb: "assets/img/placeholder.png",
    excerpt: "米を研いで炊くまでの手順と失敗談を紹介。",
    date: "2024-04-01"
  },
  {
    slug: "002-washing",
    title: "洗濯機のボタンが多すぎて詰んだ",
    thumb: "assets/img/placeholder.png",
    excerpt: "洗濯機の設定が分からず大混乱！",
    date: "2024-04-15"
  }
];

/* -------------------------------------------------
   記事カード描画
------------------------------------------------- */
function renderPosts(list) {
  const container = document.getElementById('posts-container');
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = "post-card";
    card.innerHTML = `
      <a href="posts/${p.slug}.html"><img src="${p.thumb}" alt="${p.title}"></a>
      <div class="content">
        <h2><a href="posts/${p.slug}.html">${p.title}</a></h2>
        <p>${p.excerpt}</p>
        <small>${p.date}</small>
      </div>
    `;
    container.appendChild(card);
  });
}
renderPosts(posts);

/* -------------------------------------------------
   Lunr 検索インデックス構築
------------------------------------------------- */
const idx = lunr(function () {
  this.ref('slug');
  this.field('title');
  this.field('excerpt');
  posts.forEach(p => this.add(p));
});

/* 検索 UI */
const searchInput = document.getElementById('search-input');
const resultsBox = document.getElementById('search-results');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  if (!query) {
    resultsBox.innerHTML = "";
    renderPosts(posts);   // すべて表示
    return;
  }
  const results = idx.search(`*${query}*`);
  const matched = results.map(r => posts.find(p => p.slug === r.ref));
  renderPosts(matched);
});

/* -------------------------------------------------
   (Optional) 生成された index.html の自動更新は
   `generate-index.js` が行います。こちらはブラウザ側だけです。
------------------------------------------------- */
