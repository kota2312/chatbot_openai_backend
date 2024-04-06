const puppeteer = require('puppeteer');

puppeteer.launch({
    headless: false,
    slowMo: 100,
    defaultViewport: {
        width: 1320,
          height: 1080
    },
    //  自分のChromeプロファイルを利用したい場合は設定。設定しない場合デフォルトのChromeが起動
    //  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    //  userDataDir: 'C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\User Data',
}).then(async browser => {
    const page = await browser.newPage();
    
    await page.goto('https://news.yahoo.co.jp/');
    const itemSelector = 'section#uamods-topics ul > li > a'
    const newsList = await page.evaluate((itemSelector) => {
        const news = [];
        const nodes = document.querySelectorAll(itemSelector);
        nodes.forEach(node => {
            news.push(node.href);
        })
        return news;
    }, itemSelector);

    for (let i = 0; i < newsList.length; i++) {
        const newsUrl = newsList[i];
        console.log("Navigating to:", newsUrl);
        await page.goto(newsUrl);
        let detailSelector = '#uamods-pickup > div[class*="sc-"] > div[class*="sc-"] > a[href*="yahoo"]';
        const newsDetail = await page.evaluate((detailSelector) => {
            const details = [];
            const detailNodes = document.querySelectorAll(detailSelector);
            detailNodes.forEach(detailNode => {
                details.push(detailNode.href);
            })
            return details;
        }, detailSelector);

        for (let j = 0; j < newsDetail.length; j++) {
            const detailUrl = newsDetail[j];
            await page.goto(detailUrl);
        }
        const title = await page.title();
        console.log("Title:", title);

        const newsTextElement = await page.$('div[class*="article_body"] > div[class*="sc-"] > p[class*="sc-"]');
        const newsText = await page.evaluate(element => element.innerText, newsTextElement);
        console.log(newsText);
    }
    //await browser.close();

    const express = require('express')
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))
        app.post('/', function(req, res) {
            console.log(req.body)
            console.log(req.body.name)
            res.json({ "hello": "taro" });
            });

        app.listen(3000, console.log('Server listening port 3000'))
});