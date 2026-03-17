const fs = require('fs');

const data = JSON.parse(fs.readFileSync('e:/Desktop/Antigravity/Final Sem Project Anti/stitch_smart_job_portal_home_page/DB/DB.json', 'utf8'));

const state = {
    allJobs: data,
    filters: {
        keyword: '',
        location: '',
        minMatch: 0,
        jobTypes: [],
        salaryMin: 0,
        industries: [],
        extPlatform: 'All Platforms'
    }
};

state.allJobs.forEach(job => {

    if (job.id === 1 || job.id === 4) {
        const {
            keyword,
            location,
            minMatch,
            jobTypes,
            salaryMin,
            industries,
            extPlatform
        } = state.filters;
        const matchesKeyword = !keyword || (job.title && job.title.toLowerCase().includes(keyword.toLowerCase())) || (job.company && job.company.toLowerCase().includes(keyword.toLowerCase()));
        const matchesLocation = !location || (job.location && job.location.toLowerCase().includes(location.toLowerCase()));
        const matchesAi = (job.matchScore || 0) >= minMatch;
        const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.type);
        const matchesIndustry = industries.length === 0 || (!job.industry && !!job.isExternal) || industries.includes(job.industry);
        const matchesPlatform = extPlatform === 'All Platforms' || !job.isExternal || job.platform === extPlatform;
        let jobSalaryMin = 0;
        if (job.salary) {
            const match = job.salary.match(/(\d+)/);
            if (match) jobSalaryMin = parseInt(match[1]);
        }
        const matchesSalary = jobSalaryMin >= salaryMin;

        console.log(`Job ${job.id}: K[${matchesKeyword}] L[${matchesLocation}] AI[${matchesAi}] JT[${matchesJobType}] I[${matchesIndustry}] S[${matchesSalary}] P[${matchesPlatform}]`);
        console.log(`Overall: ${matchesKeyword && matchesLocation && matchesAi && matchesJobType && matchesIndustry && matchesSalary && matchesPlatform}`);
    }
});