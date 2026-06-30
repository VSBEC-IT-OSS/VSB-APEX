# app/utils/email.py
"""
Email utility using Gmail SMTP (App Password).
Completely free — 500 emails/day via Gmail.

Required .env vars:
  MAIL_USERNAME=your_gmail@gmail.com
  MAIL_PASSWORD=xxxx xxxx xxxx xxxx   # 16-char Google App Password
  MAIL_FROM=VSB-APEX <your_gmail@gmail.com>
  FRONTEND_URL=https://your-frontend.vercel.app
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def _send(to: str, subject: str, html_body: str) -> None:
    """Low-level SMTP send via Gmail."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = settings.mail_from
    msg["To"]      = to
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(settings.mail_username, settings.mail_password)
        server.sendmail(settings.mail_username, to, msg.as_string())


def send_password_reset_email(to: str, name: str, reset_token: str) -> None:
    """Send a password-reset link to the user's email."""
    reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px;">
      <h2 style="color:#6366f1;">VSB-APEX — Password Reset</h2>
      <p>Hi <strong>{name}</strong>,</p>
      <p>We received a request to reset your password. Click the button below — this link expires in <strong>15 minutes</strong>.</p>
      <p style="text-align:center; margin: 32px 0;">
        <a href="{reset_url}"
           style="background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
      </p>
      <p style="color:#888; font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#aaa;font-size:12px;">VSB Engineering College • APEX Academic Platform</p>
    </div>
    """
    _send(to, "Reset your VSB-APEX password", html)


def send_dept_change_notification_to_admin(admin_email: str, requester_name: str, requested_dept: str) -> None:
    """Notify super admin of a pending department change request."""
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px;">
      <h2 style="color:#6366f1;">VSB-APEX — Department Change Request</h2>
      <p><strong>{requester_name}</strong> has requested a department change to <strong>{requested_dept}</strong>.</p>
      <p>Please log in to the Admin Panel to review and approve or reject this request.</p>
      <p style="text-align:center; margin: 32px 0;">
        <a href="{settings.frontend_url}/admin"
           style="background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
          Open Admin Panel
        </a>
      </p>
    </div>
    """
    _send(admin_email, f"Dept Change Request: {requester_name} → {requested_dept}", html)
