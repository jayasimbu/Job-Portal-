tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#2b8cee",
                        "background-light": "#f6f7f8",
                        "background-dark": "#101922",
                    },
                    fontFamily: {
                        "display": ["Manrope", "Noto Sans", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" },
                },
            },
        }

// Simple script to sync scroll between the two resume panels
        const panels = document.querySelectorAll('.custom-scrollbar');
        if (panels.length >= 2) {
            const [panel1, panel2] = panels; // Assuming first two are the resume panels in the main content
            
            // Flag to prevent recursive scroll events
            let isScrolling = false;

            panel1.addEventListener('scroll', (e) => {
                if (!isScrolling) {
                    isScrolling = true;
                    panel2.scrollTop = panel1.scrollTop;
                    setTimeout(() => isScrolling = false, 10);
                }
            });

            panel2.addEventListener('scroll', (e) => {
                if (!isScrolling) {
                    isScrolling = true;
                    panel1.scrollTop = panel2.scrollTop;
                    setTimeout(() => isScrolling = false, 10);
                }
            });
        }