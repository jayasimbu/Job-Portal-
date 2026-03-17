const puppeteer = require('puppeteer');
const path = require('path');

async function testEmployerDashboard() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Capture page console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    try {
        const filePath = path.resolve(__dirname, './Employer/Dashboard/employer_dashboard_overview.html');
        const fileUrl = 'file://' + filePath;
        console.log(`Navigating to: ${fileUrl}`);

        // Set local storage for the mock employer user BEFORE navigating
        await page.evaluateOnNewDocument(() => {
            localStorage.setItem('user', JSON.stringify({
                email: 'employer@techflow.inc',
                role: 'employer',
                name: 'TechFlow Inc.'
            }));
        });

        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        // Wait a bit just in case
        await new Promise(r => setTimeout(r, 2000));

        // Verify the dynamic data
        const stats = await page.evaluate(() => {
            return {
                welcome: document.getElementById('welcome-message')?.textContent,
                activeJobs: document.getElementById('stat-active-jobs')?.textContent,
                totalApplicants: document.getElementById('stat-total-applicants')?.textContent,
                interviews: document.getElementById('stat-interviews-scheduled')?.textContent,
                recentJobsCount: document.querySelectorAll('#recent-jobs-tbody tr')?.length,
                topCandidatesCount: document.querySelectorAll('#top-candidates-list > div')?.length
            };
        });

        console.log('--- DASHBOARD DATA ---');
        console.log(stats);
        
        const fs = require('fs');
        fs.writeFileSync('test_output.json', JSON.stringify(stats, null, 2));

        if (stats.recentJobsCount > 0 && stats.activeJobs !== '--') {
            console.log("✅ Dynamic employer dashboard rendering is SUCCESSFUL.");
        } else {
            console.log("❌ Dynamic employer dashboard rendering FAILED. Stats:", stats);
        }

    } catch (e) {
        console.error("Test failed: ", e);
    } finally {
        await browser.close();
    }
}

testEmployerDashboard();
