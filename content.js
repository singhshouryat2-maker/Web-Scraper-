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
  } else if (scrapeType === "links") {
    result = {
      type: "links",
      url: location.href,
      count: links.length,
      links: links
    };
  } else if (scrapeType === "images") {
    result = {
      type: "images",
      url: location.href,
      count: images.length,
      images: images
    };
  } else if (scrapeType === "all") {
    result = {
      type: "all",
      url: location.href,
      title: title,
      headingsCount: headings.length,
      headings: headings,
      linksCount: links.length,
      links: links,
      imagesCount: images.length,
      images: images
    };
  }

  sendResponse(result);
