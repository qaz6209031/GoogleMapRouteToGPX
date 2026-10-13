import { NextRequest, NextResponse } from "next/server";
import { saveFeedback } from "@/lib/feedback-store";
import { isSameOriginRequest } from "@/lib/same-origin";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 320;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Honeypot: real users never see or fill the "website" field
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const rating =
      body.rating === null || body.rating === undefined ? null : body.rating;
    if (
      rating !== null &&
      !(Number.isInteger(rating) && rating >= 1 && rating <= 5)
    ) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim()
        : null;
    if (message && message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    const email =
      typeof body.email === "string" && body.email.trim()
        ? body.email.trim()
        : null;
    if (email && (email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email))) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (rating === null && !message) {
      return NextResponse.json(
        { error: "Please add a rating or a message" },
        { status: 400 }
      );
    }

    await saveFeedback({ rating, message, email });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Failed to save feedback", e);
    return NextResponse.json(
      { error: "Could not send feedback. Please try again later." },
      { status: 500 }
    );
  }
}
