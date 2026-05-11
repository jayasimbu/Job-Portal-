import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str):
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print(f"[EMAIL_DEBUG] SMTP credentials missing. Skipping email to {to_email}")
            print(f"[EMAIL_DEBUG] Subject: {subject}")
            print(f"[EMAIL_DEBUG] Content: {html_content[:100]}...")
            return

        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(html_content, "html"))

        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            print(f"[EMAIL_INFO] Successfully sent email to {to_email}")
        except Exception as e:
            print(f"[EMAIL_ERROR] Failed to send email to {to_email}: {str(e)}")

    @staticmethod
    def send_verification_email(email: str, token: str):
        verification_link = f"{settings.VERIFICATION_URL}?token={token}"
        subject = "LINKUP1 - Verify Your Email"
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb;">Welcome to LINKUP1!</h2>
                    <p>Thank you for signing up. Please verify your email address to activate your account.</p>
                    <a href="{verification_link}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #666;">{verification_link}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8em; color: #999;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </body>
        </html>
        """
        EmailService.send_email(email, subject, html)

    @staticmethod
    def send_password_reset_email(email: str, token: str):
        reset_link = f"{settings.RESET_PASSWORD_URL}?token={token}"
        subject = "LINKUP1 - Reset Your Password"
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #dc2626;">Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to choose a new one.</p>
                    <a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #666;">{reset_link}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8em; color: #999;">If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
            </body>
        </html>
        """
        EmailService.send_email(email, subject, html)

    @staticmethod
    def send_status_update_email(email: str, candidate_name: str, job_title: str, new_status: str):
        status_display = {
            "shortlisted": ("🎉 You've Been Shortlisted!", "#16a34a", "Great news! The hiring team has shortlisted you."),
            "rejected": ("Application Update", "#dc2626", "Unfortunately, the team has decided to move forward with other candidates."),
            "interview_scheduled": ("📅 Interview Scheduled", "#2563eb", "An interview has been scheduled for you. Please check the portal for details."),
            "reviewing": ("👀 Under Review", "#ca8a04", "Your application is currently being reviewed by the hiring team."),
        }
        title, color, detail = status_display.get(new_status, ("Status Update", "#6b7280", f"Your application status has been updated to: {new_status}"))
        subject = f"LINKUP — {title} for {job_title}"
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: {color};">{title}</h2>
                    <p>Hi {candidate_name},</p>
                    <p>{detail}</p>
                    <div style="background: #f8fafc; border-left: 4px solid {color}; padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
                        <strong>Role:</strong> {job_title}<br/>
                        <strong>New Status:</strong> {new_status.replace('_', ' ').title()}
                    </div>
                    <a href="http://localhost:5173/jobseeker/applications" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Portal</a>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8em; color: #999;">This is an automated notification from LINKUP.</p>
                </div>
            </body>
        </html>
        """
        EmailService.send_email(email, subject, html)
