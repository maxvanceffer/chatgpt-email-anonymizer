const EMAIL_REGEX = /(?<![A-Za-z0-9._%+-])([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?![A-Za-z0-9._%+-])/gi;

export function scanEmails(text: string): string[] {
  if (!text) return [];

  if (!text.includes("@")) {
    return [];
  }

  const found = new Set<string>();
  let m: RegExpExecArray | null;

  EMAIL_REGEX.lastIndex = 0;

  while ((m = EMAIL_REGEX.exec(text)) !== null) {
    const email = (m[1] || m[0]).toLowerCase();
    found.add(email);
  }

  return Array.from(found);
}

export function anonymizeEmails(text: string, emails: string[]): string {
    if (!text || !emails || emails.length === 0) return text;

    let result = text;

    emails.forEach((raw) => {
        const email = raw.toLowerCase();
        if (!email) return;

        const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const re = new RegExp(escaped, "gi");
        result = result.replace(re, "[EMAIL_ADDRESS]");
    });

    return result;
}
