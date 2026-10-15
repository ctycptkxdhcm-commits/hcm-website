// Gửi email liên hệ qua SMTP (Hostinger: smtp.hostinger.com, cổng 465, SSL).
import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
  return transporter;
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function sendContactMail(data) {
  const t = getTransporter();
  const rows = [
    ['Họ tên', data.name],
    ['Điện thoại', data.phone],
    ['Email', data.email],
    ['Dịch vụ quan tâm', data.service || '—'],
    ['Nội dung', data.message]
  ];

  if (!t) {
    // Chưa cấu hình SMTP: ghi log để không mất yêu cầu khi chạy thử
    console.warn('[contact] SMTP chưa cấu hình — yêu cầu liên hệ:', Object.fromEntries(rows));
    return { delivered: false };
  }

  await t.sendMail({
    from: `"Website HCM" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO || process.env.SMTP_USER,
    replyTo: data.email,
    subject: `[Website] Yêu cầu tư vấn từ ${data.name}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html: `<table cellpadding="8" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="border:1px solid #ddd;background:#f6f4ef"><b>${k}</b></td><td style="border:1px solid #ddd">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('')}</table>`
  });
  return { delivered: true };
}
