export function extractPaymentReference(url: string): string | null {
  try {
    const parsed = new URL(url);
    return (
      parsed.searchParams.get('reference') ??
      parsed.searchParams.get('trxref') ??
      parsed.searchParams.get('ref')
    );
  } catch {
    const match = url.match(/[?&](?:reference|trxref|ref)=([^&]+)/i);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

export async function verifyPaymentWithRetry(
  verify: (reference: string) => Promise<unknown>,
  reference: string,
  attempts = 3,
  delayMs = 1500
): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await verify(reference);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}
