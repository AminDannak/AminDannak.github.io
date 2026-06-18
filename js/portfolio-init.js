import { loadResumeData, renderPortfolio } from "./render-portfolio.js";

loadResumeData()
    .then((data) => {
        renderPortfolio(data);
        window.dispatchEvent(new CustomEvent("portfolio:rendered"));
    })
    .catch((error) => {
        console.error(error);
        document.body.innerHTML =
            "<main style='padding:2rem;font-family:system-ui'>Failed to load resume data. Check resume.json.</main>";
    });
