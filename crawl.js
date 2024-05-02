const { JSDOM } = require('jsdom')

//todo
//1. get recurssive code to work
//2. test external website
//3. add in time delay
//4. add in limit for how deep
//5. add in nested display


async function crawlPage(baseURL, currentURL, pages){
    
    console.log(currentURL)
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if( baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log('Crawling: ' + currentURL)
    let htmlBody = ""
    try{
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            console.log("Error with fetch, code: " + resp.status + "for page: " + currentURL)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log("non-html response: " + contentType+ " for: "+ currentURL)
            return pages
        }
        
        htmlBody = await resp.text()
        const url_list = getURLsFromHTML(htmlBody, baseURL)
        console.log(url_list)
        for(const newxtURL of url_list){
            pages = await crawlPage(baseURL, newxtURL, pages)
        }
        
        return pages

    }catch(err){
        console.log(err)
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