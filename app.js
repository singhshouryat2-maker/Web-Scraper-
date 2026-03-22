const urlInput = document.getElementById("urlInput");
const scrapeBtn = document.getElementById("scrapeBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const scrapeType = document.getElementById("scrapeType");
const resultBox = document.getElementById("result");
const statusBox = document.getElementById("status");

let latestData = null;

function setStatus(message) {
  statusBox.textContent = message;
}

function setResult(data) {
  latestData = data;
  resultBox.textContent = JSON.stringify(data, null, 2);
}

function scrapeContent(html, type) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const data = {
    timestamp: new Date().toISOString(),
    url: urlInput.value,
    type: type
  };

  switch (type) {
    case "title":
      data.title = doc.title;
      break;

    case "headings":
      data.headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
        (h) => ({
          level: h.tagName,
          text: h.textContent.trim()
        })
      );
      break;

    case "links":
      data.links = Array.from(doc.querySelectorAll("a")).map((a) => ({
        text: a.textContent.trim(),
        href: a.getAttribute("href")
      }));
      break;

    case "images":
      data.images = Array.from(doc.querySelectorAll("img")).map((img) => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
        title: img.getAttribute("title")
      }));
      break;

    case "all":
    default:
      data.title = doc.title;
      data.headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
        (h) => ({
          level: h.tagName,
          text: h.textContent.trim()
        })
      );
      data.links = Array.from(doc.querySelectorAll("a")).map((a) => ({
        text: a.textContent.trim(),
        href: a.getAttribute("href")
      }));
      data.images = Array.from(doc.querySelectorAll("img")).map((img) => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
        title: img.getAttribute("title")
      }));
      data.meta = Array.from(doc.querySelectorAll("meta")).map((meta) => ({
        name: meta.getAttribute("name"),
        content: meta.getAttribute("content")
      }));
      break;
  }

  return data;
}

scrapeBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    setStatus("Please enter a URL.");
    return;
  }

  try {
    setStatus("Fetching page...");
    scrapeBtn.disabled = true;

    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&json=callback`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch URL");
    }

    const data = await response.json();

    if (data.status && data.status.code !== 200) {
      throw new Error("Failed to fetch URL");
    }

    setStatus("Scraping page...");

    const scrapedData = scrapeContent(data.contents, scrapeType.value);
    setResult(scrapedData);
    setStatus("Scraping complete.");
  } catch (error) {
    setStatus("Error: " + error.message);
    resultBox.textContent = error.message;
  } finally {
    scrapeBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    if (!latestData) {
      setStatus("Nothing to copy.");
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(latestData, null, 2));
    setStatus("Result copied to clipboard.");
  } catch (error) {
    setStatus("Copy failed.");
  }
});

downloadBtn.addEventListener("click", () => {
  if (!latestData) {
    setStatus("Nothing to download.");
    return;
  }

  const blob = new Blob([JSON.stringify(latestData, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scraped-data.json";
  a.click();

  URL.revokeObjectURL(url);
  setStatus("Download started.");
});

clearBtn.addEventListener("click", () => {
  latestData = null;
  resultBox.textContent = "No data yet.";
  setStatus("Cleared.");
});
