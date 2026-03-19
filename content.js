chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== "scrape") return;

  const scrapeType = request.scrapeType;

  const title = document.title;

  const headings = [...document.querySelectorAll("h1, h2, h3")]
    .map((el) => el.innerText.trim())
    .filter((text) => text);

  const links = [...document.querySelectorAll("a")]
    .map((a) => ({
      text: a.innerText.trim() || "No text",
      href: a.href
    }))
    .filter((link) => link.href);

  const images = [...document.querySelectorAll("img")]
    .map((img) => ({
      alt: img.alt || "No alt text",
      src: img.src
    }))
    .filter((img) => img.src);

  let result = {};

  if (scrapeType === "title") {
    result = {
      type: "title",
      url: location.href,
      title: title
    };
     } else if (scrapeType === "headings") {
    result = {
      type: "headings",
      url: location.href,
      count: headings.length,
      headings: headings
    };
