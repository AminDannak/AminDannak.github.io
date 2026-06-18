import { formatRichText } from "./format.js";

const ICONS = {
    phone: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    email: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    github: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
    linkedin: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
};

function renderAccordionItem({ title, meta, bodyHtml, openByDefault, className }) {
    const openAttr = openByDefault ? " open" : "";
    return `
        <details class="accordion ${className}"${openAttr}>
            <summary>
                <div class="accordion-head">
                    <span class="accordion-title">${title}</span>
                    <span class="accordion-meta">${meta}</span>
                </div>
                <span class="accordion-chevron" aria-hidden="true"></span>
            </summary>
            <div class="accordion-body">
                ${bodyHtml}
            </div>
        </details>`;
}

function renderHighlights(highlights) {
    return `<ul>${highlights.map((item) => `<li>${formatRichText(item)}</li>`).join("")}</ul>`;
}

export function renderPortfolio(data) {
    const { profile, meta, summary, skills, experience, projects, publications, contributions } = data;

    document.title = profile.name;

    const headerEl = document.getElementById("site-header");
    headerEl.innerHTML = `
        <div class="container">
            <h1>${profile.name}</h1>
            <h2 class="job">${profile.title}</h2>
            <div class="contact-info">
                <a href="${profile.phoneHref}">
                    ${ICONS.phone}
                    ${profile.phone}
                </a>
                <a href="mailto:${profile.email}">
                    ${ICONS.email}
                    ${profile.email}
                </a>
                ${profile.contacts.map((contact) => {
                    const icon = contact.type === "virgool"
                        ? `<img src="${contact.icon}" alt="virgool logo" class="icon" width="24" height="24" />`
                        : ICONS[contact.type];
                    return `<a href="${contact.url}" target="_blank" rel="noopener noreferrer">${icon}${contact.label}</a>`;
                }).join("")}
            </div>
            <a href="${meta.pdfFilename}" download class="download-btn">
                <svg class="download-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Resume
            </a>
        </div>`;

    const aboutEl = document.getElementById("about-section");
    aboutEl.innerHTML = `
        <div>
            <img src="./${profile.image}" class="about-image" alt="${profile.name}"/>
        </div>
        <div>
            <h2>About Me</h2>
            ${summary.portfolio.map((paragraph) => `<p>${formatRichText(paragraph)}</p>`).join("")}
        </div>`;

    const skillsEl = document.getElementById("skills-section");
    skillsEl.innerHTML = `
        <h2>Skills</h2>
        <div class="skills-groups">
            ${skills.portfolio.map((group) => `
                <div class="skills-group">
                    <h3 class="skills-group-title">${group.category}</h3>
                    <ul class="skills-list">
                        ${group.items.map((item) => `<li>${item}</li>`).join("")}
                    </ul>
                </div>`).join("")}
        </div>`;

    const experienceEl = document.getElementById("experience-section");
    experienceEl.innerHTML = `
        <h2>Work Experience</h2>
        ${experience.map((job) => {
            const companyLine = job.companyDescription
                ? `<p class="company">${job.companyDescription}</p>`
                : "";
            return renderAccordionItem({
                title: job.portfolioTitle,
                meta: job.portfolioMeta,
                bodyHtml: `${companyLine}${renderHighlights(job.highlights)}`,
                openByDefault: job.openByDefault,
                className: "experience-item",
            });
        }).join("")}`;

    const projectsEl = document.getElementById("projects-section");
    projectsEl.innerHTML = `
        <h2>Projects</h2>
        ${projects.map((project) => {
            let bodyHtml = "";
            if (project.techLine) {
                bodyHtml += `<p class="tech-line">${project.techLine}</p>`;
            }
            if (project.body) {
                bodyHtml += `<p>${formatRichText(project.body)}</p>`;
            }
            if (project.highlights) {
                bodyHtml += `<ul>${project.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>`;
            }
            return renderAccordionItem({
                title: project.title,
                meta: project.meta,
                bodyHtml,
                openByDefault: project.openByDefault,
                className: "project-item",
            });
        }).join("")}`;

    const publicationsEl = document.getElementById("publications-section");
    publicationsEl.innerHTML = `
        <h2>Publications &amp; Content Creation</h2>
        ${publications.map((item) => renderAccordionItem({
            title: item.title,
            meta: item.meta,
            bodyHtml: `<p>${formatRichText(item.body)}</p>`,
            openByDefault: false,
            className: "project-item",
        })).join("")}`;

    const contributionsEl = document.getElementById("contributions-section");
    contributionsEl.innerHTML = `
        <h2>Open Source Contributions</h2>
        ${contributions.map((item) => `
            <div class="project-item">
                <h3>${item.title}</h3>
                <p>${item.body}</p>
            </div>`).join("")}`;
}

export async function loadResumeData() {
    const response = await fetch("./resume.json");
    if (!response.ok) {
        throw new Error(`Failed to load resume.json (${response.status})`);
    }
    return response.json();
}
