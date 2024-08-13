const apiKey = '25324631c27e4e8dab0fa993a5c425de';
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageNumberDisplay = document.getElementById("page-number");

const defaultImageUrl = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

let currentPage = 1;
const pageSize = 8; // Number of articles per page

async function fetchNews(query = "", page = 1) {
  try {
    const apiUrl = query 
      ? `https://newsapi.org/v2/everything?q=${query}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`
      : `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;
      
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching news", error);
    return [];
  }
}

function displayBlogs(articles) {
  blogContainer.innerHTML = "";
  articles.forEach((article) => {
    if (!article.title || article.title === "[Removed]") {
      return;
    }

    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage || defaultImageUrl;
    img.alt = article.title || "No title available";

    const title = document.createElement("h2");
    const truncatedTitle = article.title.length > 50 ? article.title.slice(0, 50) + "..." : article.title;
    title.textContent = truncatedTitle;

    const description = document.createElement("p");
    const articleDescription = article.description || "Click to view description";
    const truncatedDesc = articleDescription.length > 120 ? articleDescription.slice(0, 120) + "..." : articleDescription;
    description.textContent = truncatedDesc;

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    blogContainer.appendChild(blogCard);
  });
}

async function updatePage(query = "") {
  const articles = await fetchNews(query, currentPage);
  displayBlogs(articles);

  // Update pagination controls
  pageNumberDisplay.textContent = `Page ${currentPage}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = articles.length < pageSize;
}

searchButton.addEventListener("click", async () => {
  currentPage = 1; // Reset to the first page on a new search
  const query = searchField.value.trim();
  await updatePage(query);
});

prevButton.addEventListener("click", async () => {
  if (currentPage > 1) {
    currentPage--;
    const query = searchField.value.trim();
    await updatePage(query);
  }
});

nextButton.addEventListener("click", async () => {
  currentPage++;
  const query = searchField.value.trim();
  await updatePage(query);
});

// Initialize with random news
(async () => {
  await updatePage();
})();
