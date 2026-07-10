import nodemailer from "nodemailer";

/**
 * Sends you an email whenever a recruiter submits the contact form.
 *
 * Uses Gmail's SMTP server via an "App Password" - NOT your normal Gmail
 * password. Generate one at myaccount.google.com/apppasswords (requires
 * 2-Step Verification to be enabled on the Google account first).
 *
 * Required env vars:
 *   EMAIL_USER      - the Gmail address sending the notification
 *   EMAIL_PASS      - the 16-character App Password (not your login password)
 *   EMAIL_TO        - where notifications should be sent (can be the same
 *                      address as EMAIL_USER, or a different inbox)
 *   EMAIL_FROM_NAME - display name on the "from" field, e.g. "Resume Site"
 *
 * If these aren't set, sendContactNotification silently does nothing
 * rather than throwing - a missing email config should never break the
 * actual contact form submission, which is the important part.
 */
const isEmailConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_TO);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * @param {object} contact - the saved Contact document (or plain object
 *   with the same fields) to notify about.
 */
export const sendContactNotification = async (contact) => {
  if (!isEmailConfigured()) {
    console.log("Email not configured (EMAIL_USER/EMAIL_PASS/EMAIL_TO) - skipping notification.");
    return;
  }

  const fromName = process.env.EMAIL_FROM_NAME || "Resume Website";

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #14B8A6;">New recruiter contact</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Recruiter:</td><td>${contact.recruiterName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>${contact.companyName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${contact.workEmail}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${contact.phoneNumber}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Role:</td><td>${contact.jobTitle}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Callback time:</td><td>${contact.preferredCallbackTime || "-"}</td></tr>
      </table>
      <p style="margin-top: 16px;"><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f3f6fb; padding: 12px; border-radius: 8px;">${contact.message}</p>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: contact.workEmail,
      subject: `New recruiter contact: ${contact.recruiterName} (${contact.companyName})`,
      html,
    });
  } catch (error) {
    // A failed email should never fail the contact form submission itself -
    // the submission is already safely saved in MongoDB by this point.
    console.error("Failed to send notification email:", error.message);
  }
};
