/**
 * Converts lightweight markup to HTML:
 * - **bold** → <strong>
 * - [text](url) → <a href="url">
 */
export function formatRichText(text) {
    if (!text) return "";

    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return escaped
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function formatRichTextResume(text) {
    if (!text) return "";

    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
