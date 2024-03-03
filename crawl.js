const jsdom = require("jsdom");

function normalizeURL(urlString) {
  try {
    const url = new URL(urlString);
    const normalized = url.pathname
      ? `${url.hostname}${url.pathname}`
      : url.hostname;
    return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(htmlBody);
  const allLinks = dom.window.document.querySelectorAll("a");
  return Array.from(allLinks).map((aTag) => {
    const url = new URL(aTag.href, baseURL);
    return url.href;
  });
}

async function crawlPage(baseURL, currentUrl, pages = {}) {
  if (!currentUrl) {
    currentUrl = baseURL;
  }
  const normalizedURL = normalizeURL(currentUrl);
  const baseURLDomain = new URL(baseURL).hostname;
  const currentURLDomain = new URL(currentUrl).hostname;
  if (baseURLDomain !== currentURLDomain) {
    return pages;
  }
  if (pages[normalizedURL]) {
    pages[normalizedURL] = pages[normalizedURL] + 1;
    return pages;
  }
  if (currentUrl === baseURL) {
    pages[normalizedURL] = 0;
  } else {
    pages[normalizedURL] = 1;
  }
  let htmlBody = "";
  try {
    console.log(`crawling ${currentUrl}...`);
    const response = await fetch(currentUrl);
    const status = response.status;
    if (status >= 400) {
      console.error(`Failed with status code: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error("Content type needs to be text/html");
      return pages;
    }
    htmlBody = await response.text();
  } catch (error) {
    console.error(error.message);
    return pages;
  }

  const pageURLs = getURLsFromHTML(htmlBody, currentUrl);
  for (const url of pageURLs) {
    pages = await crawlPage(baseURL, url, pages);
  }
  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
