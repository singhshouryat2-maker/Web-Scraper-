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
async function getActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  return tabs[0];
}

scrapeBtn.addEventListener("click", async () => {
  try {
    setStatus("Injecting scraper into current page...");

    const tab = await getActiveTab();

    if (!tab || !tab.id) {
      setStatus("Could not find active tab.");
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    setStatus("Scraping page...");

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "scrape",
        scrapeType: scrapeType.value
      },
      (response) => {
        if (chrome.runtime.lastError) {
          setStatus("Error: " + chrome.runtime.lastError.message);
          return;
        }

        if (!response) {
          setStatus("No response from page.");
          return;
        }

        setResult(response);
        setStatus("Scraping complete.");
      }
    );
  } catch (error) {
    setStatus("Something went wrong.");
    resultBox.textContent = error.message;
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    if (!latestData) {
      setStatus("Nothing to copy.");
      return;
    }}}