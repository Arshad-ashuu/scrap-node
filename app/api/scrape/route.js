// app/api/scrape/route.js
import puppeteer from 'puppeteer';

const scrapeAmazon = async (searchQuery) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  
  const url = `https://www.amazon.in/s?k=${searchQuery}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.sg-col-inner')).map(product => {
      const title = product.querySelector('.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal')?.textContent?.trim();
      const image = product.querySelector('.s-image')?.getAttribute('src');
      const price = product.querySelector('.a-price-whole')?.textContent?.trim();
      const from = "amazon"
      return { title, price, image,from };
    }).filter(p => p.title && p.price);
  });
  
  results.push(...products.slice(0, 8)); // Limit to first 4 products
  
  await browser.close();
  
  return results;
};

const scrapeSouledStore = async (searchQuery) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  
  const url = `https://www.thesouledstore.com/search?q=${searchQuery}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(product => {
      const title = product.querySelector('h5.text-left')?.innerText.trim();
      const image = product.querySelector('img')?.getAttribute('src');
      const price = product.querySelector('.offer')?.textContent?.trim();
      const from = "souledstore"
      return { title, price, image,from };
    }).filter(p => p.title && p.price );
  });

  results.push(...products.slice(0, 8)); // Limit to first 4 products
  
  await browser.close();
  
  return results;
};

const scrapeShoppersStop = async (searchQuery) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  
  const url = `https://www.shoppersstop.com/search/result?q=${searchQuery}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.bg-transparent')).map(product => {
      const title = product.querySelector('.line-clamp-2')?.innerText.trim();
      const price = product.querySelector('.mt-2 .text-xs.text-black')?.innerText.trim();
      const image = product.querySelector('img[alt="product card"]')?.src;
      const from = "ShoppersStop"
      return { title, price, image,from };
    }).filter(p => p.title && p.price);
  });

  results.push(...products.slice(0, 8)); // Limit to first 4 products
  
  await browser.close();
  
  return results;
};

export async function POST(request) {
  const { query } = await request.json();
  
  try {
    // Run all scraping functions concurrently
    const [amazonResults, souledStoreResults, shoppersStopResults] = await Promise.all([
      scrapeAmazon(query),
      scrapeSouledStore(query),
      scrapeShoppersStop(query)
    ]);

    // Combine all results into one array
    const combinedResults = [
      ...amazonResults,
      ...souledStoreResults,
      ...shoppersStopResults,
    ];

    return new Response(JSON.stringify(combinedResults), { status: 200 });
    
  } catch (error) {
    console.error('Error during scraping:', error);
    return new Response(JSON.stringify({ error: 'Failed to scrape data' }), { status: 500 });
  }
}

