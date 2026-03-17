document.addEventListener("DOMContentLoaded", function() {
    const tabsHTML = `
    <div class="sticky top-[72px] lg:top-[80px] z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-[960px] mx-auto px-4 flex gap-6 overflow-x-auto" style="-ms-overflow-style: none; scrollbar-width: none;">
            <style>
                #about-tabs-container .overflow-x-auto::-webkit-scrollbar { display: none; }
            </style>
            <a href="../../Platform/Intelligence/about_the_intelligence_platform.html" class="section-link py-4 text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent whitespace-nowrap transition-all hover:text-blue-600" data-path="about_the_intelligence_platform">About</a>
            <a href="#" class="section-link py-4 text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent whitespace-nowrap transition-all hover:text-blue-600" data-path="platform_privacy_policy">Privacy Policy</a>
            <a href="#" class="section-link py-4 text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent whitespace-nowrap transition-all hover:text-blue-600" data-path="terms_&_conditions_of_service">Terms of Service</a>
            <a href="#" class="section-link py-4 text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent whitespace-nowrap transition-all hover:text-blue-600" data-path="help_center_&_faq_accordion">Help Center</a>
            <a href="#" class="section-link py-4 text-sm font-bold text-slate-500 dark:text-slate-400 border-b-2 border-transparent whitespace-nowrap transition-all hover:text-blue-600" data-path="contact_support_&_inquiry">Contact Support</a>
        </div>
    </div>
    `;

    const container = document.getElementById("about-tabs-container");
    if (container) {
        container.innerHTML = tabsHTML;

        // Highlight active tab
        const currentPath = window.location.pathname;
        const links = container.querySelectorAll('.section-link');

        links.forEach(link => {
            const dataPath = link.getAttribute('data-path');
            if (currentPath.includes(dataPath)) {
                link.classList.add('text-blue-600', 'border-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
                link.classList.remove('text-slate-500', 'border-transparent', 'dark:text-slate-400');
            }
        });
    }
});