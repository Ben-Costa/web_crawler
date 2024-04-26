const { JSDOM } = require('jsdom')

async function crawlPage(currentURL){
    console.log('Crawling: ' + currentURL)
    try{
        const resp = await fetch(currentURL)
        console.log(await resp.text())

        if(resp.status > 399){
            console.log("Error with fetch, code: " + resp.status + "for page: " + currentURL)
            return
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log("non-html response: " + contentType+ " for: "+ currentURL)
            return
        }

    }catch(err){
        console.log("error fetching: "+ currentURL )
    }

}

//Strip out and normalize domain from website string
function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1) 
    }
    return hostPath
}   

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        if(linkElement.href.slice(0, 1) === '/'){
            //relative url
            try{
                const urlObj = new URL(baseURL + linkElement.href)
                urls.push(urlObj.href)
            }catch (err){
                console.log(`Error with URL: ${err.message}`)
            }
        } else{
            //absolute
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            }catch (err){
                console.log(`Error with URL: ${err.message}`)
            }
        }
    }
    return urls
}

module.exports ={
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}