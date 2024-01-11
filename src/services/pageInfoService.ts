export async function parseWebsiteTitle(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    return titleMatch ? titleMatch[1] : null;
  } catch (error) {
    return null;
  }
}
