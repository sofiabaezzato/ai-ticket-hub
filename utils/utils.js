export function sanitizeDomain(domain) {
    return domain
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-') // Replace disallowed chars
        .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}