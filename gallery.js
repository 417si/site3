const WORKER_URL = "https://notion-proxy.417kota-2.workers.dev";

async function loadGallery() {
    try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();
        const gallery = document.getElementById("gallery");
        
        // モーダル要素の取得
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImg");
        const closeBtn = document.querySelector(".close");

        data.results.forEach(page => {
            const imageProp = page.properties.Image;
            const linkProp = page.properties.Link;
            const userProp = page.properties.UserID;

            // 画像URLがない場合はスキップ
            if (!imageProp || !imageProp.url) return;
            const imgUrl = imageProp.url;

            // カード作成
            const card = document.createElement("div");
            card.className = "gallery-item";

            // 画像作成
            const img = document.createElement("img");
            img.src = imgUrl;
            img.loading = "lazy";
            
            // 画像クリックでモーダル表示
            img.onclick = function() {
                modal.style.display = "flex";
                modalImg.src = this.src;
            };

            // ユーザーID表示
            const userDisplay = document.createElement("div");
            userDisplay.className = "user-id";
            const userIdText = userProp?.rich_text[0]?.plain_text || "Unknown User";
            userDisplay.textContent = userIdText.startsWith('@') ? userIdText : `@${userIdText}`;

            // ボタン作成
            const btn = document.createElement("a");
            btn.href = linkProp?.url || "#";
            btn.target = "_blank";
            btn.rel = "noopener";
            btn.textContent = "元ポストを見る";
            btn.className = "post-button";

            // 組み立て
            card.appendChild(img);
            card.appendChild(userDisplay);
            card.appendChild(btn);
            gallery.appendChild(card);
        });

        // モーダルを閉じる処理（バツボタン、または背景クリック）
        closeBtn.onclick = () => modal.style.display = "none";
        modal.onclick = (e) => {
            if (e.target === modal || e.target === closeBtn) {
                modal.style.display = "none";
            }
        };

    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
    }
}

loadGallery();