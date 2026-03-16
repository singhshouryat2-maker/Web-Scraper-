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