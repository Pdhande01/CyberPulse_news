const API_KEY = "b4b20a4912ff4a318d5d2dbbe91eeaee";
    const BASE_URL = "https://newsapi.org/v2/top-headlines";
    const grid = document.getElementById("grid");
    const categoryContainer = document.getElementById("categoryContainer");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const themeToggle = document.getElementById("themeToggle");

    function showLoader() {
      grid.innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
    }

    function showMessage(text, type = "info") {
      grid.innerHTML = `<div class="message ${type === "error" ? "error" : ""}">${text}</div>`;
    }

    async function fetchNews(category = "technology", query = "") {
      showLoader();
      try {
        let url = `${BASE_URL}?country=us&pageSize=12&apiKey=${API_KEY}`;
        if (category) url += `&category=${category}`;
        if (query) url += `&q=${encodeURIComponent(query)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();

        if (data.status !== "ok" || !data.articles.length) {
          showMessage("No results found.");
          return;
        }

        grid.innerHTML = data.articles
          .map(
            (article) => `
          <div class="card">
            <img src="${
              article.urlToImage || "https://via.placeholder.com/300x160?text=No+Image"
            }" alt="news image">
            <h3>${article.title}</h3>
            <p>${article.description || ""}</p>
            <div class="meta">${article.source.name || "Unknown Source"} — ${new Date(
              article.publishedAt
            ).toLocaleDateString()}</div>
            <a class="read-btn" href="${article.url}" target="_blank">Read More</a>
          </div>
        `
          )
          .join("");
      } catch (err) {
        console.error(err);
        showMessage("⚠️ Failed to load news. Check your internet or API key.", "error");
      }
    }

    fetchNews();

    categoryContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      fetchNews(btn.dataset.category);
    });

    searchBtn.addEventListener("click", () => {
      const q = searchInput.value.trim();
      if (!q) {
        searchInput.focus();
        return;
      }
      fetchNews("", q);
    });

    // 🌙 Dark Mode
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });