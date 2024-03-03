const { test, expect } = require("@jest/globals");
const { normalizeURL } = require("./crawl.js");
const { getURLsFromHTML } = require("./crawl.js");

const invalidURLS = ["//boot.com", "", null, undefined, "boots", "https://"];
const validURLSWithPath = [
  "https://blog.boot.dev/path/",
  "https://blog.boot.dev/path",
  "http://blog.boot.dev/path/",
  "http://blog.boot.dev/path",
];
const validURLSWithoutPath = ["https:/blog.boot.dev"];

describe("normalizeURL", () => {
  test("invalid urls should return null", () => {
    for (const invalidUrl of invalidURLS) {
      expect(normalizeURL(invalidUrl)).toBe(null);
    }
  });

  test("is valid urls with path", () => {
    for (let validURL of validURLSWithPath) {
      expect(normalizeURL(validURL)).toBe("blog.boot.dev/path");
    }
  });

  test("is valid urls without path", () => {
    for (const validURL of validURLSWithoutPath) {
      expect(normalizeURL(validURL)).toBe("blog.boot.dev");
    }
  });
});

describe("getURLsFromHTML", () => {
  test("should get all urls from html", () => {
    const absoluteURLs = getURLsFromHTML(
      `<!DOCTYPE html><body><a href="/something-interesting">Learn Backend Development</a></body>`,
      "https://boot.dev",
    );
    expect(absoluteURLs).toEqual(["https://boot.dev/something-interesting"]);
    expect(absoluteURLs).toHaveLength(1);
  });
});
