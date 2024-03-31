const puppeteer = require('puppeteer');

puppeteer.launch(
  //puppeteerの設定を記載します。
  {   // headlessモードの設定 trueの場合,ヘッドレスで起動
      // 動作確認のため、falseに設定
      headless: false,
      // 動作確認のため、puppeteerの操作を遅延させる設定  
      slowMo: 100,
      // Chromeのビューポート設定  
      defaultViewport: {
        width: 1320,height: 1080
     },
  
  //  自分のChromeプロファイルを利用したい場合は設定。設定しない場合デフォルトのChromeが起動
  //  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  //  userDataDir: 'C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\User Data',
  
  }
//上記設定後にブラウザを起動
).then(async browser => {
  //Googleのホームページに移動。
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
  //表示
  newsList.forEach(async news => {
    console.log(news);
    //await page.click("a[href='" + news + "']");
  });

  //指定した記事をクリック
  //await page.click("a[href='https://news.yahoo.co.jp/articles/3baa7c0ce541bcb53c54d1dd76ca46f125c812a7']");
  //記事のタイトルを取得
  //await page.title();
  //const element = await page.$(".sc-fIYNhG");
  // 要素が存在する場合
  //if (element) {
    // 要素のテキストを取得
    //const text = await page.evaluate((elm) => elm.textContent, element);
    //ret = text;
    //console.log(ret);
  //} else {
    // 要素が見つからない場合、エラーメッセージ
    //ret = "Element not found";
  //}
  //ブラウザを閉じる。
  await browser.close();
});