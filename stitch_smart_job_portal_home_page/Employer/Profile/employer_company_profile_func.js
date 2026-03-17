// Functional logic for employer_company_profile
console.log('Loaded employer_company_profile_func.js');

document.addEventListener('DOMContentLoaded', function() {
    // Populate sidebar with user details
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const sidebarName = document.getElementById('sidebar-user-name');
        const sidebarAvatar = document.getElementById('sidebar-user-avatar');
        
        if (sidebarName && user.name) sidebarName.textContent = user.name;
        if (sidebarAvatar && user.name) {
            sidebarAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
    } catch (e) {
        console.error("Error populating sidebar footer", e);
    }

    const companyData = localStorage.getItem('companyProfile');
    // -------------------------------------------------------------------------
    // 1. Elements
    // -------------------------------------------------------------------------
    const API_BASE_URL = 'http://127.0.0.1:5000';

    // Form Fields
    const companyNameInput = document.getElementById('profile-company-name');
    const websiteInput = document.getElementById('profile-website');
    const industrySelect = document.getElementById('profile-industry');
    const sizeSelect = document.getElementById('profile-company-size');
    const hqInput = document.getElementById('profile-headquarters');
    const aboutInput = document.getElementById('profile-about-us');
    const editorToolbar = document.getElementById('editor-toolbar');

    // Logo
    const logoUploadInput = document.getElementById('logo-upload');
    const logoPreview = document.getElementById('company-logo-preview');
    const logoContainer = document.getElementById('company-logo-container');
    const logoModal = document.getElementById('logo-modal');
    const fullscreenLogo = document.getElementById('fullscreen-logo');
    const closeLogoModal = document.getElementById('close-logo-modal');
    const removeLogoBtn = document.getElementById('remove-logo-btn');
    let currentLogoBase64 = '';

    // Cover Photo
    const coverUploadInput = document.getElementById('cover-upload');
    const editCoverBtn = document.getElementById('edit-cover-btn');
    const coverContainer = document.getElementById('company-cover-container');
    let currentCoverBase64 = '';

    // Culture & Benefits
    const cultureContainer = document.getElementById('culture-benefits-container');
    const addCultureBtn = document.getElementById('add-culture-btn');
    let cultureTags = [];

    // Save Button
    const saveBtn = document.getElementById('save-profile-btn');


    // -------------------------------------------------------------------------
    // 2. Load Existing Data
    // -------------------------------------------------------------------------
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log("Loading user profile data", user);
            
            // Text Inputs
            if (companyNameInput && user.name) companyNameInput.value = user.name;
            if (websiteInput && user.website) websiteInput.value = user.website;
            if (industrySelect && user.industry) industrySelect.value = user.industry;
            if (sizeSelect && user.company_size) sizeSelect.value = user.company_size;
            if (hqInput && user.headquarters) hqInput.value = user.headquarters;
            if (aboutInput && user.about) aboutInput.innerHTML = user.about;

            // Pictures
            if (user.picture) {
                currentLogoBase64 = user.picture;
                logoPreview.src = currentLogoBase64;
            }
            if (user.cover_photo) {
                currentCoverBase64 = user.cover_photo;
                if (coverContainer) {
                    coverContainer.style.backgroundImage = `url(${currentCoverBase64})`;
                }
            }

            // Culture Tags
            if (user.culture_benefits && Array.isArray(user.culture_benefits)) {
                cultureTags = user.culture_benefits;
            }
            renderCultureTags();

        } catch (e) {
            console.error("Error parsing user data from localStorage", e);
        }
    }


    // -------------------------------------------------------------------------
    // 3. Logo Upload & Fullscreen Logic
    // -------------------------------------------------------------------------
    if (logoUploadInput) {
        logoUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                currentLogoBase64 = event.target.result;
                logoPreview.src = currentLogoBase64;
            };
            reader.readAsDataURL(file);
        });
    }

    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening modal
            if (confirm("Are you sure you want to remove the logo?")) {
                currentLogoBase64 = '';
                logoPreview.src = '../../assets/logos/career_auto_logo.png';
                if (logoUploadInput) logoUploadInput.value = '';
                console.log("Logo removed locally");
            }
        });
    }

    if (editCoverBtn && coverUploadInput) {
        editCoverBtn.addEventListener('click', () => {
             console.log("Triggering cover upload");
             coverUploadInput.click();
        });
        
        coverUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                currentCoverBase64 = event.target.result;
                if (coverContainer) {
                    coverContainer.style.backgroundImage = `url(${currentCoverBase64})`;
                    console.log("Cover photo updated locally");
                }
            };
            reader.readAsDataURL(file);
        });
    }

    const removeCoverBtn = document.getElementById('remove-cover-btn');
    if (removeCoverBtn) {
        removeCoverBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to remove the cover photo?")) {
                currentCoverBase64 = '';
                if (coverContainer) {
                    coverContainer.style.backgroundImage = 'none';
                    coverContainer.style.backgroundColor = ''; // Revert to default class colors
                }
                if (coverUploadInput) coverUploadInput.value = '';
                console.log("Cover photo removed locally");
            }
        });
    }

    if (logoContainer && logoModal && fullscreenLogo && closeLogoModal) {
        logoContainer.addEventListener('click', () => {
             // Only open if there's actually a logo or a valid preview
             fullscreenLogo.src = currentLogoBase64 || logoPreview.src;
             logoModal.classList.remove('hidden');
             logoModal.classList.add('flex');
             setTimeout(() => {
                 logoModal.classList.add('opacity-100');
             }, 10);
        });

        closeLogoModal.addEventListener('click', () => {
             logoModal.classList.remove('opacity-100');
             setTimeout(() => {
                 logoModal.classList.remove('flex');
                 logoModal.classList.add('hidden');
             }, 300);
        });

        logoModal.addEventListener('click', (e) => {
             if (e.target === logoModal) closeLogoModal.click();
        });
    }


    // -------------------------------------------------------------------------
    // 4. Rich Text Editor Toolbar Logic
    // -------------------------------------------------------------------------
    if (editorToolbar && aboutInput) {
        editorToolbar.addEventListener('mousedown', (e) => {
            // Use mousedown instead of click to prevent losing focus/selection
            const btn = e.target.closest('.editor-btn');
            if (!btn) return;
            
            e.preventDefault(); // Prevent focus loss from aboutInput
            
            const command = btn.getAttribute('data-command');
            console.log(`Executing editor command: ${command}`);
            
            if (command === 'createLink') {
                const url = prompt('Enter the link URL (e.g. https://google.com):');
                if (url) document.execCommand(command, false, url);
            } else {
                document.execCommand(command, false, null);
            }
            aboutInput.focus();
            updateEditorToolbarState();
        });

        const updateEditorToolbarState = () => {
            const buttons = editorToolbar.querySelectorAll('.editor-btn');
            buttons.forEach(btn => {
                const cmd = btn.getAttribute('data-command');
                if (!cmd || cmd === 'createLink') return;
                
                try {
                    const isActive = document.queryCommandState(cmd);
                    if (isActive) {
                        btn.classList.add('bg-slate-200', 'dark:bg-slate-600');
                    } else {
                        btn.classList.remove('bg-slate-200', 'dark:bg-slate-600');
                    }
                } catch (e) {
                    // Ignore unsupported commands
                }
            });
        };

        aboutInput.addEventListener('keyup', updateEditorToolbarState);
        aboutInput.addEventListener('mouseup', updateEditorToolbarState);
    }

    // -------------------------------------------------------------------------
    // 5. Map Integration Logic (Leaflet)
    // -------------------------------------------------------------------------
    let map;
    let marker;
    const mapContainerElement = document.getElementById('company-map-container');
    if (mapContainerElement) {
        // Prepare Leaflet
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(leafletJS);

        leafletJS.onload = () => {
            const loc = mapContainerElement.getAttribute('data-location') || 'San Francisco';
            console.log(`Initializing map for: ${loc}`);
            
            // Clear existing background image/placeholder content if needed
            mapContainerElement.style.backgroundImage = 'none';
            mapContainerElement.innerHTML = ''; 

            // Initialize map (Default SF if geocoding is omitted for simplicity)
            map = L.map('company-map-container').setView([37.7749, -122.4194], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);
            
            marker = L.marker([37.7749, -122.4194]).addTo(map)
                .bindPopup(`<b>${loc}</b><br>Company HQ`)
                .openPopup();
                
            // Initial Geocode if there's a loaded location
            if (hqInput && hqInput.value) {
                geocodeAndMoveMap(hqInput.value);
            }
        };

        async function geocodeAndMoveMap(locationString) {
            if (!map || !marker || !locationString) return;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    map.setView([lat, lon], 13);
                    marker.setLatLng([lat, lon]);
                    marker.bindPopup(`<b>${locationString}</b><br>Company HQ`).openPopup();
                }
            } catch(e) { console.error("Geocoding failed", e); }
        }

        // Add debounced listener to hqInput
        if (hqInput) {
            let geocodeTimeout;
            hqInput.addEventListener('input', (e) => {
                clearTimeout(geocodeTimeout);
                geocodeTimeout = setTimeout(() => {
                    geocodeAndMoveMap(e.target.value);
                }, 1000);
            });
        }
    }
    
    // -------------------------------------------------------------------------
    // 6. Culture & Benefits UI Logic
    // -------------------------------------------------------------------------
    const newCultureInput = document.getElementById('new-culture-input');
    const addCultureText = document.getElementById('add-culture-text');

    function renderCultureTags() {
        if (!cultureContainer) return;

        // Keep the wrapper at the end
        const wrapper = document.getElementById('add-culture-wrapper');
        
        // Remove existing tags and placeholders (everything before wrapper)
        Array.from(cultureContainer.children).forEach(child => {
            if (child.id !== 'add-culture-wrapper') {
                child.remove();
            }
        });

        // Show placeholder if empty
        if (cultureTags.length === 0) {
            const placeholderTag = document.createElement('div');
            placeholderTag.className = "flex items-center gap-2 h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-sm italic";
            placeholderTag.innerHTML = `<span>e.g. Remote Working</span>`;
            cultureContainer.insertBefore(placeholderTag, wrapper);
        }

        // Re-insert tags
        cultureTags.forEach((tag, index) => {
            const tagEl = document.createElement('div');
            tagEl.className = "flex items-center gap-2 h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm";
            tagEl.innerHTML = `
                <span>${tag}</span>
                <button class="text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center -mr-1 remove-culture-btn" data-index="${index}">
                    <span class="material-symbols-outlined text-[16px]">close</span>
                </button>
            `;
            cultureContainer.insertBefore(tagEl, wrapper);
        });

        // Add remove listeners
        document.querySelectorAll('.remove-culture-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                cultureTags.splice(idx, 1);
                renderCultureTags();
            });
        });
    }

    if (addCultureBtn && newCultureInput) {
        function commitCultureTag() {
            const tagText = newCultureInput.value.trim();
            if (tagText && !cultureTags.includes(tagText)) {
                cultureTags.push(tagText);
            }
            newCultureInput.value = '';
            newCultureInput.classList.add('hidden');
            if (addCultureText) addCultureText.textContent = "Add";
            renderCultureTags();
        }

        addCultureBtn.addEventListener('click', () => {
             if (newCultureInput.classList.contains('hidden')) {
                  newCultureInput.classList.remove('hidden');
                  newCultureInput.focus();
                  if (addCultureText) addCultureText.textContent = "Save";
             } else {
                  commitCultureTag();
             }
        });

        newCultureInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                commitCultureTag();
            } else if (e.key === 'Escape') {
                newCultureInput.classList.add('hidden');
                if (addCultureText) addCultureText.textContent = "Add";
                newCultureInput.value = '';
            }
        });
    }


    // -------------------------------------------------------------------------
    // 5. Save Changes Logic
    // -------------------------------------------------------------------------
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            // Get user email to identify record
            let email = '';
            try {
                const u = JSON.parse(localStorage.getItem('user'));
                if (u && u.email) email = u.email;
            } catch (e) {}

            if (!email) {
                alert("Could not identify the logged in user!");
                return;
            }

            const payload = {
                email: email,
                name: companyNameInput.value.trim(),
                website: websiteInput.value.trim(),
                industry: industrySelect.value,
                company_size: sizeSelect.value,
                headquarters: hqInput.value.trim(),
                about: aboutInput.innerHTML,
                picture: currentLogoBase64,
                cover_photo: currentCoverBase64,
                culture_benefits: cultureTags
            };

            // Switch button to loading state
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Saving...`;
            saveBtn.disabled = true;

            try {
                // Use relative path since it's likely served from the same origin or handled by proxy
                const response = await fetch(`${API_BASE_URL}/update_user_data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (response.ok) {
                    // Update localStorage with new merged fields
                    let u = JSON.parse(localStorage.getItem('user')) || {};
                    // Normalize payload to match user object keys if necessary
                    const updatedFields = {
                        name: payload.name,
                        website: payload.website,
                        industry: payload.industry,
                        company_size: payload.company_size,
                        headquarters: payload.headquarters,
                        about: payload.about,
                        picture: payload.picture,
                        cover_photo: payload.cover_photo,
                        culture_benefits: payload.culture_benefits
                    };
                    u = { ...u, ...updatedFields };
                    localStorage.setItem('user', JSON.stringify(u));

                    alert("Company Profile saved successfully!");
                } else {
                    alert(`Error: ${data.message || data.error || 'Failed to save profile.'}`);
                }
            } catch (err) {
                console.error("Save Error:", err);
                alert("An error occurred while communicating with the server.");
            } finally {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
        });
    }
});
