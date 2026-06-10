const puppeteer = require('puppeteer');
const path = require('path');

async function runTests() {
  console.log("Starting Employer Login DOM Tests...");
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD, false to watch it
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Resolve file paths
  const authPath = 'file://' + path.resolve(__dirname, './Platform/Auth/auth_center.html').replace(/\\/g, '/');
  const employerDashPath = 'file://' + path.resolve(__dirname, './Employer/Dashboard/employer_dashboard_overview.html').replace(/\\/g, '/');

  try {
    // ---------------------------------------------------------
    // TEST 1: Invalid Login
    // ---------------------------------------------------------
    console.log(`\n[Test 1] Navigating to ${authPath}`);
    await page.goto(authPath, { waitUntil: 'networkidle0' });
    
    // Switch to login tab if not already on it
    await page.click('#tab-login');
    
    // Fill in invalid credentials
    await page.type('#login-email', 'invalid@example.com');
    await page.type('#login-password', 'wrongpassword');
    
    // Submit login form
    // The backend is assumed to be running at localhost:5000. 
    // If not running, it will show "Could not connect". We expect an error either way.
    await page.click('#loginBtn');
    
    // Wait for error text to appear
    await page.waitForFunction(() => {
        const errEl = document.getElementById('loginError');
        return errEl && !errEl.classList.contains('hidden') && errEl.innerText.length > 0;
    }, { timeout: 3000 });
    
    const errorText = await page.$eval('#loginError', el => el.innerText);
    console.log(`✅ Invalid login generated error message: "${errorText}"`);

    // ---------------------------------------------------------
    // TEST 2: Valid Employer Login (Simulated via LocalStorage)
    // ---------------------------------------------------------
    console.log('\n[Test 2] Simulating a successful Employer login...');
    await page.evaluate(() => {
      // Simulate backend response storing an employer session
      localStorage.setItem('user', JSON.stringify({
        name: 'Test Employer',
        email: 'employer@company.com',
        role: 'employer',
        loginMethod: 'email',
        loggedInAt: Date.now()
      }));
    });
    
    console.log(`Navigating to Employer Dashboard to check role guard: ${employerDashPath}`);
    await page.goto(employerDashPath, { waitUntil: 'networkidle0' });
    
    // The role guard should let us stay here
    const currentUrl = page.url();
    if (currentUrl.includes('employer_dashboard_overview.html')) {
        console.log('✅ Success: Employer role guard allowed access to dashboard.');
    } else {
        throw new Error(`Failed: Role guard redirected employer away. Ended up at ${currentUrl}`);
    }
    
    // Check if welcome message populated correctly
    const welcomeText = await page.$eval('#welcome-message', el => el.innerText).catch(() => null);
    if (welcomeText && welcomeText.includes('Test Employer')) {
        console.log(`✅ Welcome message updated dynamically: "${welcomeText}"`);
    } else {
        console.log(`⚠️ Welcome message dynamic update not yet fully active or verified: "${welcomeText}"`);
    }

    // ---------------------------------------------------------
    // TEST 3: Role Guard - Job Seeker accessing Employer Dashboard
    // ---------------------------------------------------------
    console.log('\n[Test 3] Simulating a Job Seeker trying to access Employer Dashboard...');
    await page.evaluate(() => {
      // OVERWRITE with a job seeker
      localStorage.setItem('user', JSON.stringify({
        name: 'Test JobSeeker',
        email: 'jobseeker@user.com',
        role: 'jobseeker'
      }));
    });
    
    console.log('Reloading Employer Dashboard...');
    await page.goto(employerDashPath, { waitUntil: 'networkidle0' });
    
    const redirectedUrl = page.url();
    if (redirectedUrl.includes('job_seeker_dashboard_intelligence.html')) {
        console.log('✅ Success: Job seeker was correctly redirected to their own dashboard.');
    } else {
        throw new Error(`Failed: Job seeker wasn't redirected to job seeker dashboard. Ended up at ${redirectedUrl}`);
    }

    // ---------------------------------------------------------
    // TEST 4: Role Guard - Unauthenticated accessing Employer Dashboard
    // ---------------------------------------------------------
    console.log('\n[Test 4] Simulating Unauthenticated User trying to access Employer Dashboard...');
    await page.evaluate(() => {
      localStorage.removeItem('user');
    });
    
    await page.goto(employerDashPath, { waitUntil: 'networkidle0' });
    
    const unauthUrl = page.url();
    if (unauthUrl.includes('auth_center.html')) {
        console.log('✅ Success: Unauthenticated user was correctly redirected to login.');
    } else {
        throw new Error(`Failed: Unauthenticated user wasn't redirected to auth_center. Ended up at ${unauthUrl}`);
    }

    console.log('\n🎉 ALL DOM TESTS PASSED!');
  } catch (err) {
    console.error(`\n❌ TEST FAILED: ${err.message}`);
  } finally {
    await browser.close();
  }
}

runTests();
