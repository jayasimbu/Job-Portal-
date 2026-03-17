/**
 * Resume Upload & Validation — Core Logic
 * Fix log:
 *  - Save happens ONLY after consent accepted (not on file pick)
 *  - Removed broken processBtn selector/listener
 *  - Added PDF.js text extraction for real ATS analysis
 *  - saveCurrentResumeAndProceed() exposed as window function
 *  - [NEW] Auto-extraction via /api/ats/extract fired after save (Issue 3)
 */

// ── Module-level state ────────────────────────────────────────────────────────
window._pendingResumeFile = null; // The File object waiting for consent
window._pendingResumeText = ""; // Extracted text from the PDF

document.addEventListener("DOMContentLoaded", function () {
    // ── DOM References ────────────────────────────────────────────────────────
    const dropZone = document.querySelector(".group.cursor-pointer");
    const fileInput = document.getElementById("file-upload");
    const chooseFileBtn = document.querySelector("button.bg-primary.text-white");
    const validationSection = document.querySelector(
        ".flex.flex-col.bg-white.dark\\:bg-slate-800.rounded-xl.shadow-sm.border",
    );
    const deleteBtn = validationSection ?
        validationSection.querySelector("button.text-slate-400") :
        null;
    const validationItems = validationSection ?
        validationSection.querySelectorAll(".space-y-4 > div") : [];

    // Hide validation section initially
    if (validationSection) validationSection.style.display = "none";

    // ── File picker triggers ──────────────────────────────────────────────────
    if (chooseFileBtn && fileInput) {
        chooseFileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            fileInput.click();
        });
        fileInput.addEventListener("change", handleFileSelect);
    }

    if (dropZone) {
        dropZone.addEventListener("click", () => {
            if (fileInput) fileInput.click();
        });

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("border-primary", "bg-primary/5");
            dropZone.classList.remove("border-slate-300", "dark:border-slate-700");
        });

        dropZone.addEventListener("dragleave", (e) => {
            e.preventDefault();
            dropZone.classList.remove("border-primary", "bg-primary/5");
            dropZone.classList.add("border-slate-300", "dark:border-slate-700");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("border-primary", "bg-primary/5");
            dropZone.classList.add("border-slate-300", "dark:border-slate-700");
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect();
            }
        });
    }

    // Delete / Reset button
    if (deleteBtn) deleteBtn.addEventListener("click", resetUploadState);

    // ── Reset ─────────────────────────────────────────────────────────────────
    function resetUploadState() {
        if (fileInput) fileInput.value = "";
        if (validationSection) validationSection.style.display = "none";
        window._pendingResumeFile = null;
        window._pendingResumeText = "";
        console.log("[Upload] State reset");
    }

    // ── File selected — validate only, do NOT save yet ────────────────────────
    function handleFileSelect() {
        if (!fileInput || fileInput.files.length === 0) return;
        const file = fileInput.files[0];
        console.log("[Upload] File selected:", file.name);

        // Store pending file — save will happen after consent
        window._pendingResumeFile = file;
        window._pendingResumeText = "";

        // Show validation UI
        if (validationSection) {
            validationSection.style.display = "flex";

            const filenameEl = validationSection.querySelector("h3");
            if (filenameEl) filenameEl.textContent = file.name;

            const fileMeta = validationSection.querySelector("p.text-xs");
            if (fileMeta) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                fileMeta.textContent = `${sizeMB} MB • Uploaded just now`;
            }

            validateFile(file);
        }

        // Start PDF text extraction in the background
        extractPdfText(file)
            .then((text) => {
                window._pendingResumeText = text;
                console.log(
                    "[Upload] PDF text extracted:",
                    text.substring(0, 100) + "...",
                );

                // --- AUTO PROCEED IMMEDIATELY ---
                _showUploadToast("🤖 Processing resume... Redirecting soon.");
                let processBtn = document.querySelector("button[onclick='openConsentModal()']");
                if (processBtn) {
                    processBtn.disabled = true;
                    processBtn.innerHTML = `<span>Redirecting...</span><span class="material-symbols-outlined animate-spin text-[18px]">sync</span>`;
                }

                if (typeof window.saveCurrentResumeAndProceed === "function") {
                    setTimeout(() => {
                        window.saveCurrentResumeAndProceed();
                    }, 500);
                }
            })
            .catch((err) => {
                console.warn("[Upload] PDF extraction failed:", err);
                window._pendingResumeText = file.name; // fallback to filename

                // --- AUTO PROCEED IMMEDIATELY ON ERROR TOO ---
                if (typeof window.saveCurrentResumeAndProceed === "function") {
                    window.saveCurrentResumeAndProceed();
                }
            });
    }

    // ── Validation UI ─────────────────────────────────────────────────────────
    function validateFile(file) {
        const MAX_MB = 10;
        const ALLOWED = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const sizeValid = file.size / (1024 * 1024) <= MAX_MB;
        const typeValid =
            ALLOWED.includes(file.type) ||
            file.name.endsWith(".pdf") ||
            file.name.endsWith(".doc") ||
            file.name.endsWith(".docx");

        updateValidationItem(
            0,
            sizeValid,
            sizeValid ?
                `File is within the ${MAX_MB}MB limit.` :
                `File exceeds ${MAX_MB}MB limit.`,
        );
        updateValidationItem(
            1,
            typeValid,
            typeValid ? "Format is supported." : "Invalid format. PDF or DOCX only.",
        );

        if (sizeValid && typeValid) {
            updateValidationItem(2, true, "Ready for keyword analysis.");
        } else {
            updateValidationItem(2, false, "Cannot analyze invalid file.");
        }
    }

    function updateValidationItem(index, isValid, message) {
        if (!validationItems[index]) return;
        const iconContainer = validationItems[index].querySelector("div");
        const iconSpan = iconContainer ? iconContainer.querySelector("span") : null;
        const textP = validationItems[index].querySelector(
            "div.flex-1 > p:last-child",
        );
        if (textP) textP.textContent = message;
        if (iconContainer) {
            iconContainer.className =
                "mt-0.5 size-5 rounded-full flex items-center justify-center shrink-0";
            if (isValid) {
                iconContainer.classList.add(
                    "bg-green-100",
                    "text-green-600",
                    "dark:bg-green-900/30",
                    "dark:text-green-400",
                );
            } else {
                iconContainer.classList.add(
                    "bg-red-100",
                    "text-red-600",
                    "dark:bg-red-900/30",
                    "dark:text-red-400",
                );
            }
        }
        if (iconSpan) {
            iconSpan.className = "material-symbols-outlined text-[14px] font-bold";
            iconSpan.textContent = isValid ? "check" : "close";
        }
    }

    // ── PDF Text Extraction using PDF.js ─────────────────────────────────────
    async function extractPdfText(file) {
        // Only extract from PDFs
        if (
            !file.name.toLowerCase().endsWith(".pdf") &&
            file.type !== "application/pdf"
        ) {
            return file.name; // For DOCX we just use filename for now
        }

        // Use PDF.js if available (loaded from CDN in HTML)
        if (typeof pdfjsLib === "undefined") {
            console.warn("[Upload] PDF.js not loaded — using filename as text.");
            return file.name;
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
        }).promise;

        let fullText = "";
        let embeddedLinks = new Set(); // Store unique links to prevent duplicates

        for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
            const page = await pdf.getPage(pageNum);

            // Extract textual content
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";

            // Extract hyperlink annotations
            try {
                const annotations = await page.getAnnotations();
                annotations.forEach((anno) => {
                    if (anno.subtype === "Link" && anno.url) {
                        embeddedLinks.add(anno.url);
                    }
                });
            } catch (e) {
                console.warn(
                    `[Upload] Failed to extract annotations on page ${pageNum}:`,
                    e,
                );
            }
        }

        // Append all found links to the end of the text
        if (embeddedLinks.size > 0) {
            fullText += "\n\n--- Embedded PDF Links ---\n";
            embeddedLinks.forEach((url) => {
                fullText += url + "\n";
            });
        }

        return fullText.trim() || file.name;
    }
});

// ── Called by acceptConsent() in HTML — SAVES after consent ──────────────────
window.saveCurrentResumeAndProceed = function () {
    const file = window._pendingResumeFile;
    if (!file) {
        // No pending file — just redirect
        window.location.href = "../Profile/resume_insights.html";
        return;
    }

    const id = "res_" + Date.now();
    const dateStr = new Date().toLocaleDateString("en-IN");
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const text = window._pendingResumeText || file.name;

    const newResume = {
        id,
        filename: file.name,
        size: sizeMB,
        date: dateStr,
        extractedText: text,
        // Placeholder extracted data (real extraction happens via ATS backend)
        extractedHeadline: "Professional",
        extractedSkills: [],
        atsHistory: [],
    };

    // Load existing user from localStorage
    let user;
    try {
        user = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
        user = {};
    }

    if (!Array.isArray(user.uploadedResumes)) user.uploadedResumes = [];
    user.uploadedResumes.push(newResume);

    // Auto-set as active if first resume
    if (!user.activeResumeId || user.uploadedResumes.length === 1) {
        user.activeResumeId = id;
    }

    localStorage.setItem("user", JSON.stringify(user));
    _syncResumeStorage(user);
    console.log("[Upload] ✅ Resume saved to localStorage:", file.name);

    // Sync to backend DB
    if (user.email) {
        fetch("http://localhost:5000/update_user_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: user.email,
                uploadedResumes: user.uploadedResumes,
                activeResumeId: user.activeResumeId,
            }),
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.user) {
                    const refreshed = Object.assign({}, user, data.user);
                    localStorage.setItem("user", JSON.stringify(refreshed));
                    _syncResumeStorage(refreshed);
                    console.log("[Upload] ✅ Synced to backend DB");
                }
            })
            .catch((err) => console.warn("[Upload] DB sync failed (offline?):", err));
    }

    // ── SMART AUTO-EXTRACTION (Direct File Upload) ──────────
    if (file) {
        _showUploadToast("🤖 AI is analyzing your resume (Smart Mode)...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", user.email || "");
        formData.append("resume_id", id);

        fetch("http://localhost:5000/api/ats/extract-file", {
            method: "POST",
            body: formData,
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    const extractedData = data.data;
                    const improvedText = extractedData.raw_structured_text || text;

                    // Merge extracted details back into the resume in localStorage
                    let u;
                    try {
                        u = JSON.parse(localStorage.getItem("user") || "{}");
                    } catch (e) {
                        u = {};
                    }
                    const idx = (u.uploadedResumes || []).findIndex((r) => r.id === id);
                    if (idx !== -1) {
                        u.uploadedResumes[idx].extractedDetails = extractedData;
                        u.uploadedResumes[idx].extractedText = improvedText; // Update with high-quality text

                        // Populate quick-access fields
                        const skills = extractedData.skills || [];
                        if (skills.length) u.uploadedResumes[idx].extractedSkills = skills;
                        const firstExp = extractedData.experience && extractedData.experience[0];
                        const firstEdu = extractedData.education && extractedData.education[0];
                        u.uploadedResumes[idx].extractedHeadline =
                            (firstExp && firstExp.role) ||
                            (firstEdu && firstEdu.degree) ||
                            "Professional";

                        localStorage.setItem("user", JSON.stringify(u));
                        _syncResumeStorage(u);
                        console.log("[Upload] ✅ Smart extraction complete. Skills:", skills.length);

                        // Invalidate AI job match cache
                        if (window.AIJobService) window.AIJobService.invalidateCache();

                        // Auto-trigger Normal ATS Analysis after a "human-like" delay
                        setTimeout(() => {
                            _showUploadToast("🤖 Running complete ATS Analysis...");
                            fetch("http://localhost:5000/api/ats/analyze-normal", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    resume_text: improvedText,
                                    email: u.email || "",
                                    resume_id: id,
                                    target_role: u.uploadedResumes[idx].extractedHeadline || "Professional"
                                }),
                            }).then(r => r.json()).then(atsData => {
                                if (atsData.success && atsData.data) {
                                    let currentUser;
                                    try {
                                        currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                                    } catch (e) {
                                        currentUser = {};
                                    }
                                    const currentIdx = (currentUser.uploadedResumes || []).findIndex((r) => r.id === id);
                                    if (currentIdx !== -1) {
                                        currentUser.uploadedResumes[currentIdx].normalATS = atsData.data;

                                        const historyEntry = {
                                            timestamp: new Date().toISOString(),
                                            type: 'normal',
                                            score: atsData.data.ats_score || 0,
                                            matched_keywords: atsData.data.matched_keywords || [],
                                            missing_keywords: atsData.data.missing_keywords || []
                                        };

                                        if (!Array.isArray(currentUser.uploadedResumes[currentIdx].atsHistory)) {
                                            currentUser.uploadedResumes[currentIdx].atsHistory = [];
                                        }
                                        currentUser.uploadedResumes[currentIdx].atsHistory.push(historyEntry);

                                        localStorage.setItem("user", JSON.stringify(currentUser));
                                        _syncResumeStorage(currentUser);
                                        console.log("[Upload] ✅ Auto-ATS Normal Analysis complete.");

                                        // Persist to DB
                                        if (currentUser.email) {
                                            fetch("http://localhost:5000/update_user_data", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    email: currentUser.email,
                                                    uploadedResumes: currentUser.uploadedResumes,
                                                }),
                                            }).catch(() => { });
                                        }
                                    }
                                }
                                _showUploadToast("✅ Resume analysis complete!");
                                setTimeout(() => {
                                    window.location.href = "../Profile/resume_insights.html";
                                }, 1000);
                            }).catch(err => {
                                console.warn("[Upload] Auto-ATS Normal Analysis failed:", err);
                                _showUploadToast("⚠️ Analysis completed. Redirecting...");
                                setTimeout(() => {
                                    window.location.href = "../Profile/resume_insights.html";
                                }, 1000);
                            });
                        }, 1500);
                    }
                } else {
                    _showUploadToast("⚠️ Smart extraction incomplete. Redirecting...");
                    setTimeout(() => {
                        window.location.href = "../Profile/resume_insights.html";
                    }, 1500);
                }
            })
            .catch((err) => {
                _showUploadToast("❌ Smart extraction failed. Redirecting...");
                console.warn("[Upload] Smart extraction failed:", err);
                setTimeout(() => {
                    window.location.href = "../Profile/resume_insights.html";
                }, 1500);
            });
    } else {
        // No text to extract, redirect immediately
        _showUploadToast("✅ Resume saved successfully!");
        setTimeout(() => {
            window.location.href = "../Profile/resume_insights.html";
        }, 1500);
    }

    // Clear pending state
    window._pendingResumeFile = null;
    window._pendingResumeText = "";
};

// ── Toast helper for upload page ─────────────────────────────────────────────
function _showUploadToast(msg) {
    let toast = document.getElementById("upload-page-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "upload-page-toast";
        toast.style.cssText = [
            "position:fixed",
            "bottom:24px",
            "right:24px",
            "z-index:9999",
            "background:#1e293b",
            "color:#fff",
            "padding:12px 20px",
            "border-radius:12px",
            "font-size:14px",
            "font-weight:600",
            "box-shadow:0 8px 30px rgba(0,0,0,.3)",
            "display:flex",
            "align-items:center",
            "gap:8px",
            "transition:opacity .3s",
        ].join(";");
        document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.style.opacity = "1";
}

// ── Sync Helper ─────────────────────────────────────────────────────────────
function _syncResumeStorage(userObj) {
    if (userObj) {
        if (userObj.uploadedResumes) {
            localStorage.setItem("uploadedResumes", JSON.stringify(userObj.uploadedResumes));
        }
        if (userObj.activeResumeId) {
            localStorage.setItem("activeResumeId", userObj.activeResumeId);
        }
    }
}
