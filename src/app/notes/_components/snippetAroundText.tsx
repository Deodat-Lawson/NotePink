export function getSnippetAroundMatch(
    content: string,
    term: string,
    snippetRadius = 50
): string {
    // We’ll do a simple first-match approach:
    const lowerContent = content.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const matchIndex = lowerContent.indexOf(lowerTerm);

    // If no match, return empty string or some fallback
    if (matchIndex === -1) return "";

    // Calculate snippet start/end
    const start = Math.max(0, matchIndex - snippetRadius);
    const end = Math.min(content.length, matchIndex + lowerTerm.length + snippetRadius);

    // Extract snippet and trim
    let snippet = content.substring(start, end).trim();

    // Add leading ellipsis if we cut off the beginning
    if (start > 0) {
        snippet = "…" + snippet;
    }
    // Add trailing ellipsis if we cut off the end
    if (end < content.length) {
        snippet = snippet + "…";
    }

    return snippet;
}