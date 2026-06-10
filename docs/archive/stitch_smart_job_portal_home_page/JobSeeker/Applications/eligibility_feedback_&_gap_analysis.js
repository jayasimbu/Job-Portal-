tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#2b8cee",
                        "background-light": "#f6f7f8",
                        "background-dark": "#101922",
                        "gap-warning": "#f97316", // Soft orange for gaps
                        "gap-bg": "#ffedd5", // Very light orange background
                    },
                    fontFamily: {
                        "display": ["Manrope", "sans-serif"],
                        "body": ["Noto Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
                },
            },
        }