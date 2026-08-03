import nodemailer from "nodemailer";
import { env } from "../../config/env";

type MailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type AuthMailTemplateInput = {
  previewText: string;
  title: string;
  greetingName: string;
  body: string;
  buttonText: string;
  url: string;
  safetyNote: string;
};

function isMailConfigured(): boolean {
  return env.NODE_ENV !== "test" && Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.MAIL_FROM);
}

function createTransport() {
  if (!isMailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

async function sendMail(input: MailInput): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    return;
  }

  await transport.sendMail({
    from: env.MAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

function buildFrontendUrl(path: string, token: string): string {
  const url = new URL(path, env.FRONTEND_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildAuthMailHtml(input: AuthMailTemplateInput): string {
  const previewText = escapeHtml(input.previewText);
  const title = escapeHtml(input.title);
  const greetingName = escapeHtml(input.greetingName);
  const body = escapeHtml(input.body);
  const buttonText = escapeHtml(input.buttonText);
  const url = escapeHtml(input.url);
  const safetyNote = escapeHtml(input.safetyNote);

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#f4f7fb;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${previewText}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#0f172a;padding:28px 32px;">
                <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#93c5fd;font-weight:700;">ThesiFlow</div>
                <div style="margin-top:8px;font-size:24px;line-height:32px;color:#ffffff;font-weight:700;">${title}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#0f172a;">Xin chào ${greetingName},</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:24px;color:#334155;">${body}</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:12px;background:#0f172a;">
                      <a href="${url}" style="display:inline-block;padding:14px 22px;font-size:15px;line-height:20px;color:#ffffff;text-decoration:none;font-weight:700;border-radius:12px;">${buttonText}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:14px;line-height:22px;color:#64748b;">Nếu nút không hoạt động, copy link này vào trình duyệt:</p>
                <p style="margin:0 0 24px;font-size:13px;line-height:20px;word-break:break-all;color:#2563eb;">${url}</p>
                <div style="border-top:1px solid #e2e8f0;padding-top:18px;">
                  <p style="margin:0;font-size:13px;line-height:20px;color:#64748b;">${safetyNote}</p>
                  <p style="margin:12px 0 0;font-size:13px;line-height:20px;color:#94a3b8;">Email tự động từ ThesiFlow. Vui lòng không trả lời email này.</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendEmailVerificationMail(input: { to: string; fullName: string; token: string }): Promise<void> {
  const url = buildFrontendUrl("/verify-email", input.token);
  await sendMail({
    to: input.to,
    subject: "Xác minh tài khoản ThesiFlow",
    text: `Xin chào ${input.fullName},\n\nMở link sau để xác minh tài khoản ThesiFlow:\n${url}\n\nNếu bạn không tạo tài khoản, hãy bỏ qua email này.`,
    html: buildAuthMailHtml({
      previewText: "Xác minh email để kích hoạt tài khoản ThesiFlow.",
      title: "Xác minh tài khoản",
      greetingName: input.fullName,
      body: "Cảm ơn bạn đã đăng ký ThesiFlow. Vui lòng xác minh địa chỉ email để kích hoạt tài khoản và bắt đầu sử dụng hệ thống.",
      buttonText: "Xác minh email",
      url,
      safetyNote: "Nếu bạn không tạo tài khoản ThesiFlow, hãy bỏ qua email này. Liên kết xác minh chỉ nên được sử dụng bởi chủ sở hữu email.",
    }),
  });
}

async function sendPasswordResetMail(input: { to: string; fullName: string; token: string }): Promise<void> {
  const url = buildFrontendUrl("/reset-password", input.token);
  await sendMail({
    to: input.to,
    subject: "Đặt lại mật khẩu ThesiFlow",
    text: `Xin chào ${input.fullName},\n\nMở link sau để đặt lại mật khẩu ThesiFlow:\n${url}\n\nNếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.`,
    html: buildAuthMailHtml({
      previewText: "Yêu cầu đặt lại mật khẩu ThesiFlow.",
      title: "Đặt lại mật khẩu",
      greetingName: input.fullName,
      body: "Bạn vừa yêu cầu đặt lại mật khẩu ThesiFlow. Nhấn nút bên dưới để tạo mật khẩu mới cho tài khoản của bạn.",
      buttonText: "Đặt lại mật khẩu",
      url,
      safetyNote: "Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu hiện tại của bạn sẽ không thay đổi nếu bạn không mở liên kết.",
    }),
  });
}

export { isMailConfigured, sendEmailVerificationMail, sendPasswordResetMail };
