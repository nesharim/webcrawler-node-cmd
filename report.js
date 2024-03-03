function printReport(pages) {
  console.log("Generating report ....");
  const sortedPageLinks = Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .reduce((sortedObj, [a, b]) => {
      return {
        ...sortedObj,
        [a]: b,
      };
    }, {});
  console.log(sortedPageLinks);
  for (const url in sortedPageLinks) {
    console.log(`Found ${sortedPageLinks[url]} internal links to ${url}`);
  }
}

module.exports = {
  printReport,
};
