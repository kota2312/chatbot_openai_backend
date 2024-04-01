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
        const title = await page.title();
        console.log("Title:", title);
        // ここで記事の情報を取得する処理を追加する
    }
  await browser.close();
});