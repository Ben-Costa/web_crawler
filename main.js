const {crawlPage} = require('./crawl.js')
function main() {
    if(process.argv.length <3){
        console.log("No website provided")
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log("Too many CLI's provided")
        process.exit(1)
    }

    const baseURL = process.argv[2]
    console.log("Crawling: " + baseURL)
    crawlPage(baseURL)
}   

main()