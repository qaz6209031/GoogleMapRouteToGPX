export interface FeedbackInput {
  rating: number | null;
  message: string | null;
  email: string | null;
}

/**
 * Insert a feedback row into Supabase via its REST API.
 * Uses the secret key, so this must only run server-side.
 */
export async function saveFeedback(feedback: FeedbackInput): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SECRET_KEY environment variables must be set"
    );
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/feedback`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(feedback),
  });

  if (!res.ok) {
    throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  }
}
