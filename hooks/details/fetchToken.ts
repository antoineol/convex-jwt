export async function fetchToken() {
    // Use absolute URL to avoid URL parsing errors in server-side contexts
    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/auth/token`);
    if (!response.ok) {
        throw new Error("Failed to fetch token");
    }
    const data = await response.json() as { token: string };
    return data.token;
}