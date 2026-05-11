import os
import sys
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_dir))

from core.config import settings
from core.email_service import EmailService

def test_email_sending():
    print("--- SMTP Configuration ---")
    print(f"SMTP_HOST: {settings.SMTP_HOST}")
    print(f"SMTP_PORT: {settings.SMTP_PORT}")
    print(f"SMTP_USER: {settings.SMTP_USER}")
    print(f"SMTP_FROM: {settings.SMTP_FROM}")
    print("--------------------------")
    
    test_email = settings.SMTP_USER # Send to self for testing
    print(f"Sending test email to {test_email}...")
    
    try:
        EmailService.send_email(
            to_email=test_email,
            subject="LINKUP1 - SMTP Connection Test",
            html_content="<h1>Connection Successful!</h1><p>Your SMTP configuration is working correctly.</p>"
        )
        print("Test email sent successully!")
    except Exception as e:
        print(f"Failed to send test email: {str(e)}")

if __name__ == "__main__":
    # Ensure env is loaded or provided
    test_email_sending()
