const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('e:/Desktop/Antigravity/Final Sem Project Anti/stitch_smart_job_portal_home_page/DB/DB.json', 'utf8'));
    const jobs = Array.isArray(data) ? data : (data.jobs || []);

    jobs.forEach((job, index) => {
        if (job.title && typeof job.title !== 'string') console.log(`Job ${job.id} non-string title`);
        if (job.company && typeof job.company !== 'string') console.log(`Job ${job.id} non-string company`);
        if (job.location && typeof job.location !== 'string') console.log(`Job ${job.id} non-string location`);
        if (job.salary && typeof job.salary !== 'string') console.log(`Job ${job.id} non-string salary:`, job.salary);
        if (job.type && typeof job.type !== 'string') console.log(`Job ${job.id} non-string type`);
        if (job.industry && typeof job.industry !== 'string') console.log(`Job ${job.id} non-string industry`);
    });
    console.log("Checked all jobs for type safety.");
} catch (e) {
    console.error(e);
}