import { formatRichTextResume } from "./format.js";

function renderExperienceHeader(job) {
    return `
        <div class="resume-job-header">
            <span class="resume-role">${job.resumeRole}</span>
            <span class="resume-company">${job.resumeCompany}, ${job.resumeLocation}</span>
            <span class="resume-dates">${job.resumeDates}</span>
        </div>`;
}

export function renderResume(data, root = document.getElementById("resume-root")) {
    const { profile, summary, skills, experience, resumeContributions, education } = data;

    const contactLine = profile.resumeContacts.map((contact) => {
        if (contact.type === "link") {
            return `<a href="${contact.url}">${contact.label}</a>`;
        }
        return `<span>${contact.value}</span>`;
    }).join('<span class="resume-contact-sep">|</span>');

    const resumeJobs = experience.filter((job) => job.includeInResume);

    root.innerHTML = `
        <header class="resume-header">
            <h1 class="resume-name">${profile.name}</h1>
            <p class="resume-title">${profile.titleResume}</p>
            <p class="resume-location">${profile.location}</p>
            <p class="resume-contact">${contactLine}</p>
        </header>

        <section class="resume-section">
            <h2 class="resume-section-title">Professional Summary</h2>
            <p class="resume-summary">${formatRichTextResume(summary.resume)}</p>
        </section>

        <section class="resume-section">
            <h2 class="resume-section-title">Skills</h2>
            <ul class="resume-skills">
                ${skills.resume.map((group) => `
                    <li><strong>${group.category}:</strong> ${group.items}</li>
                `).join("")}
            </ul>
        </section>

        <section class="resume-section">
            <h2 class="resume-section-title">Work Experience</h2>
            ${resumeJobs.map((job, index) => {
                const description = job.resumeCompanyDescription || job.companyDescription;
                const descriptionHtml = description
                    ? `<p class="resume-company-desc">${description}</p>`
                    : "";
                return `
                    <article class="resume-job${index > 0 ? " resume-job-spaced" : ""}">
                        ${renderExperienceHeader(job)}
                        ${descriptionHtml}
                        <ul class="resume-bullets">
                            ${job.highlights.map((item) => `<li>${formatRichTextResume(item)}</li>`).join("")}
                        </ul>
                    </article>`;
            }).join("")}
        </section>

        <section class="resume-section">
            <h2 class="resume-section-title">Contributions and Teaching</h2>
            <ul class="resume-bullets">
                ${resumeContributions.map((item) => `
                    <li>${item.text} <strong>${item.year}</strong></li>
                `).join("")}
            </ul>
        </section>

        <section class="resume-section">
            <h2 class="resume-section-title">Education</h2>
            ${education.map((item) => `
                <p class="resume-education">
                    <strong>${item.degree}</strong> at ${item.institution}. ${item.dates}
                </p>
            `).join("")}
        </section>`;

    document.title = `${profile.name} — Resume`;
}

export async function loadResumeData() {
    if (window.__RESUME_DATA__) {
        return window.__RESUME_DATA__;
    }

    const response = await fetch("./resume.json");
    if (!response.ok) {
        throw new Error(`Failed to load resume.json (${response.status})`);
    }
    return response.json();
}
