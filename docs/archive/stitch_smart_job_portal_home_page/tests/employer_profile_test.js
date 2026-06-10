const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Mock Employer User Data
  const mockUser = {
      name: "Acme Corp",
      email: "acme@example.com",
      role: "employer",
      industry: "Technology",
      company_size: "51-200 employees",
      headquarters: "San Jose, CA"
  };

  // Pre-load local storage
  await page.evaluateOnNewDocument((user) => {
    localStorage.setItem('user', JSON.stringify(user));
  }, mockUser);

  try {
      console.log('Navigating to Employer Company Profile...');
      const targetPath = path.resolve(__dirname, './Employer/Profile/employer_company_profile.html');
      await page.goto(`file://${targetPath}`);
  
      // Wait for React/DOM to settle
      await page.waitForTimeout(1000);
      
      console.log('--- Verifying Data Pre-fill ---');
      const companyName = await page.$eval('#profile-company-name', el => el.value);
      console.log(`Pre-filled Company Name: ${companyName}`);
      if (companyName !== 'Acme Corp') throw new Error("Company name didn't pre-fill");

      const sizeVal = await page.$eval('#profile-company-size', el => el.value);
      console.log(`Pre-filled Size: ${sizeVal}`);
      if (sizeVal !== '51-200 employees') throw new Error("Size didn't pre-fill");

      console.log('--- Verifying Culture & Benefits Interaction ---');
      // Click Add Culture button
      // We have to mock `prompt()` since Puppeteer blocks it natively if not handled
      page.on('dialog', async dialog => {
          if(dialog.type() === 'prompt') {
              await dialog.accept('Remote First');
          } else if (dialog.type() === 'alert') {
              console.log(`Alert shown: ${dialog.message()}`);
              await dialog.accept();
          } else {
              await dialog.dismiss();
          }
      });

      await page.click('#add-culture-btn');
      await page.waitForTimeout(500);

      const cultureTags = await page.$$eval('#culture-benefits-container > div > span', elements => elements.map(el => el.textContent));
      console.log(`Culture tags found: ${cultureTags.join(', ')}`);
      if(!cultureTags.includes('Remote First')) throw new Error('Culture tag failed to add');


      console.log('--- Verifying Input Empty Placeholders ---');
      const websiteValue = await page.$eval('#profile-website', el => el.value);
      console.log(`Website value is: "${websiteValue}"`); // Should be empty

      console.log('--- Typing into fields ---');
      await page.type('#profile-website', 'https://acmecorp.com');
      
      console.log('--- Simulating Save ---');
      
      // Need a live server for the fetch request to succeed, but we will mock fetch to avoid actual DB writes in this DOM test
      await page.evaluate(() => {
          window.fetch = async (url, options) => {
              console.log(`Intercepted fetch to: ${url}`);
              const body = JSON.parse(options.body);
              console.log(`Payload Website: ${body.website}`);
              console.log(`Payload Culture: ${body.culture_benefits.join(', ')}`);
              return { ok: true, json: async () => ({ message: "Mock Success" }) };
          };
      });

      await page.click('#save-profile-btn');
      await page.waitForTimeout(1000);

      console.log("TEST PASSED!");
  } catch (err) {
      console.error("TEST FAILED:", err);
  } finally {
      await browser.close();
  }
})();
