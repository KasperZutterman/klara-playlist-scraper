const puppeteer = require('puppeteer');
const KLARA_PLAYLIST_URL = (DAY) => `https://klara.be/playlists/dagoverzicht/${DAY}/`;
const DAY = `2020-01-01`;

/**
   * @method main
   */
async function main() {
    /* Initiate the Puppeteer browser */
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    /* Go to the Klara playlist page and wait for it to load */
    await page.goto(KLARA_PLAYLIST_URL(DAY), { waitUntil: 'domcontentloaded' });

    /* Run javascript inside of the page */
    let data = await page.evaluate(() => {
        let res = [];
        let songs = Array.from(document.querySelectorAll("ul > li"));
        for (i = 0; i < songs.length; i++) {
            res.push(songs[i].innerHTML);
        }    
        return res;    
    });

    res = [];
    for( i=0; i < data.length; i++) {
        let obj = {};
        try {obj.starttime = data[i].match('<span class="starttime">(.*?)<\/span>')[1];} catch {obj.starttime = ""}
        try {obj.artist = data[i].match('<span class="artist">(.*?)<\/span>')[1];} catch {obj.artist = ""}
        try {obj.title = data[i].match('<span class="title">(.*?)<\/span>')[1];} catch {obj.title = ""}
        try {obj.time = data[i].match('<span class="time">(.*?)<\/span>')[1];} catch {obj.time = ""}
        try {obj.composer = data[i].match('<span class="composer">(.*?)<\/span>')[1];} catch {obj.composer = ""}
        try {obj.label = data[i].match('<span class="label">(.*?)<\/span>')[1];} catch {obj.label = ""}
        res.push(obj);
    }
    //console.log(res);

    await browser.close();
    return res;
};

main();

/**
 *
 * utils
 *
 */
function fileString(ts) {
    const year = ts.getUTCFullYear();
    const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = ts
      .getUTCDate()
      .toString()
      .toString()
      .padStart(2, '0');
    const name = `${year}-${month}-${day}`;
    return name;
  }
