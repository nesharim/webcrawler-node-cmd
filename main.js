const { argv, exit } = require("node:process");
const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  if (argv.length === 2) {
    console.error("One argument needs to be provided");
    exit(1);
  }

  if (argv.length > 3) {
    console.error("Only one argument needs to be provided");
    exit(1);
  }

  console.log(`Starting the crawler for base url ${argv[2]}`);
  const pages = await crawlPage(argv[2]);
  console.log(pages);

  printReport(pages);
}

main();
