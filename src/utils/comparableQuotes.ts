export function getComparableQuotes(
    randomQuote: any,
    quotesWithLikes: any[],
    options = { byAuthor: true, byLikes: true }
) {
    let comparable: typeof quotesWithLikes = [];

    // By author first
    if (options.byAuthor) {
        comparable = quotesWithLikes.filter(
            (q) => q.author === randomQuote.author && q.id !== randomQuote.id
        );
    }

    // By likes if not enough found
    if (options.byLikes && comparable.length < 3) {
        const tolerance = 2; // ±2 likes difference
        const more = quotesWithLikes.filter(
            (q) =>
                q.id !== randomQuote.id &&
                q.likes >= randomQuote.likes - tolerance &&
                q.likes <= randomQuote.likes + tolerance
        );
        comparable = [...comparable, ...more];
    }

    // Return max 3 comparable
    return comparable.slice(0, 3);
}
