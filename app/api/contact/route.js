import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function redirectToContact(request, status) {
  return NextResponse.redirect(
    new URL(`/contact?status=${status}`, request.url),
    { status: 303 },
  );
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const website = String(form.get("website") ?? "").trim();

    // Return a normal success response to bots that fill the hidden field.
    if (website) {
      return redirectToContact(request, "success");
    }

    if (
      !name ||
      name.length > 100 ||
      !EMAIL_PATTERN.test(email) ||
      email.length > 254 ||
      !message ||
      message.length > 5000
    ) {
      return redirectToContact(request, "error");
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO ?? "contact@percolia.com";

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");
      return redirectToContact(request, "error");
    }

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Percolia <contact@mail.percolia.com>",
        to: [recipient],
        reply_to: email,
        subject: `Nouveau message de ${name.replace(/[\r\n]/g, " ")}`,
        text: [
          `Nom : ${name}`,
          `Email : ${email}`,
          "",
          "Message :",
          message,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected the contact email:", response.status);
      return redirectToContact(request, "error");
    }

    return redirectToContact(request, "success");
  } catch (error) {
    console.error("Contact form error:", error);
    return redirectToContact(request, "error");
  }
}
