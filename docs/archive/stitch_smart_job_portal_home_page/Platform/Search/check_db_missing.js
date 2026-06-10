const fs = require('fs');
const data = JSON.parse(fs.readFileSync('e:/Desktop/Antigravity/Final Sem Project Anti/stitch_smart_job_portal_home_page/DB/DB.json', 'utf8'));

data.forEach((job) => {
    if (!job.title) console.log(`Job ${job.id} missing title`);
    if (!job.company) console.log(`Job ${job.id} missing company`);
    if (!job.location) console.log(`Job ${job.id} missing location`);
    if (!job.type) console.log(`Job ${job.id} missing type`);
});

console.log("Checked all jobs for missing required string fields.");