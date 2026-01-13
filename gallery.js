const WORKER_URL = "https://notion-proxy.417kota-2.workers.dev";
let allData = []; // 全データを保持
let currentPage = 1;
const itemsPerPage = 18; // 1ページあたりの件数

async function loadGallery() {
    try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();
        allData = data.results; // データを保存
        
        renderPage(1); // 最初のページを表示
    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
    }
}

function renderPage(page) {
    currentPage = page;
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // 前の表示をクリア

    // 表示するデータの範囲を計算
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = allData.slice(startIndex, endIndex);

    // モーダル要素
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");

    pageData.forEach(page => {
        const imageProp = page.properties.Image;
        const linkProp = page.properties.Link;
        const userProp = page.properties.UserID;

        if (!imageProp || !imageProp.url) return;

        const card = document.createElement("div");
        card.className = "gallery-item";

        const img = document.createElement("img");
        img.src = imageProp.url;
        img.loading = "lazy";
        img.onclick = () => {
            modal.style.display = "flex";
            modalImg.src = img.src;
        };

        const userDisplay = document.createElement("div");
        userDisplay.className = "user-id";
        const userIdText = userProp?.rich_text[0]?.plain_text || "Unknown User";
        userDisplay.textContent = userIdText.startsWith('@') ? userIdText : `@${userIdText}`;

        const btn = document.createElement("a");
        btn.href = linkProp?.url || "#";
        btn.target = "_blank";
        btn.textContent = "元ポストを見る";
        btn.className = "post-button";

        card.appendChild(img);
        card.appendChild(userDisplay);
        card.appendChild(btn);
        gallery.appendChild(card);
    });

    createPagination(); // ページネーションボタンを作成
    window.scrollTo(0, 0); // ページ切り替え時に上へ戻る
}

function createPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // クリア

    const totalPages = Math.ceil(allData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "page-btn" + (i === currentPage ? " active" : "");
        btn.onclick = () => renderPage(i);
        paginationContainer.appendChild(btn);
    }
}

// モーダルを閉じる処理（初期化時に一度だけ設定）
document.querySelector(".close").onclick = () => document.getElementById("imageModal").style.display = "none";
document.getElementById("imageModal").onclick = (e) => {
    if (e.target.id === "imageModal") e.target.style.display = "none";
};

loadGallery();
