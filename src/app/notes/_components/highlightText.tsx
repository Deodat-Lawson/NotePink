export function highlightTerm(text: string, term: string): (string | JSX.Element)[] {
    if (!term) return [text]; // No search term = no highlighting

    // Create a case-insensitive regex that captures the term in a group.
    const regex = new RegExp(`(${term})`, "gi");

    // Split the text on the matched term, capturing the separators (the matched term).
    // 'split' with a capturing group will return an array that includes the matched group.
    const parts = text.split(regex);

    // Map over the parts and wrap the matched text in <mark>.
    return parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
}