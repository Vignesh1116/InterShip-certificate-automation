from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.colors import HexColor
import qrcode
import os
from datetime import datetime

# Resolve paths relative to the project root (parent of backend/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(PROJECT_ROOT, "assets")
CERTS_DIR = os.path.join(PROJECT_ROOT, "certificates")

def draw_background(c, width, height):
    # Colors
    dark_blue = HexColor("#001F3F") # Deeper Navy
    gold = HexColor("#D4AF37") # Premium Gold
    
    # White Background
    c.setFillColor(HexColor("#FFFFFF"))
    c.rect(0, 0, width, height, fill=1, stroke=0)
    
    # Elegant Top Right Curve
    c.setFillColor(dark_blue)
    p = c.beginPath()
    p.moveTo(width, height)
    
    c.setFillColor(gold)
    p = c.beginPath()
    p.moveTo(width - 300, height)
    p.curveTo(width - 200, height - 50, width - 100, height - 150, width, height - 250)
    p.lineTo(width, height - 280)
    p.curveTo(width - 120, height - 170, width - 230, height - 70, width - 350, height)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

    # Bottom Left Corner
    c.setFillColor(dark_blue)
    p = c.beginPath()
    p.moveTo(0, 0)
    p.lineTo(300, 0)
    p.curveTo(200, 50, 100, 150, 0, 250)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    
    c.setFillColor(gold)
    p = c.beginPath()
    p.moveTo(300, 0)
    p.curveTo(200, 50, 100, 150, 0, 250)
    p.lineTo(0, 280)
    p.curveTo(120, 170, 230, 70, 350, 0)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

    # Bottom Center ribbon
    c.setFillColor(dark_blue)
    p = c.beginPath()
    ribbon_w = 400
    ribbon_h = 40
    start_x = (width - ribbon_w) / 2
    p.moveTo(start_x, 0)
    p.lineTo(start_x + ribbon_w, 0)
    p.lineTo(start_x + ribbon_w, ribbon_h)
    p.curveTo(width/2 + 100, ribbon_h + 10, width/2 - 100, ribbon_h + 10, start_x, ribbon_h)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

    # Ribbon text
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(HexColor("#FFFFFF"))
    c.drawCentredString(width/2, 15, "Building Skills | Delivering Solutions | Creating Futures")

def generate_certificate(student, cert_id, role, start_date, end_date):
    os.makedirs(CERTS_DIR, exist_ok=True)
    file_path = os.path.join(CERTS_DIR, f"{cert_id}.pdf")
    
    width, height = landscape(A4)
    c = canvas.Canvas(file_path, pagesize=landscape(A4))
    
    # 1. Background
    draw_background(c, width, height)
    
    # 2. Top Left: Logo & Company Name
    logo_path = os.path.join(PROJECT_ROOT, "frontend", "public", "Magizh Tech Logo.png")
    
    if os.path.exists(logo_path):
        # Draw the wide logo image
        c.drawImage(logo_path, 45, height - 120, width=200, height=65, preserveAspectRatio=True)
    else:
        # Emergency Fallback if image not found in primary path
        c.setFillColor(HexColor("#4F46E5"))
        c.roundRect(60, height - 110, 50, 50, 10, fill=1, stroke=0)
        c.setFillColor(HexColor("#FFFFFF"))
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(85, height - 90, "M")
        c.setFont("Times-Bold", 28)
        c.setFillColor(HexColor("#00153B"))
        c.drawString(135, height - 80, "Magizh Technologies")
    
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(HexColor("#666666"))
    c.drawString(108, height - 105, "CERTIFICATE PLATFORM")
    
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#666666"))
    c.drawString(108, height - 108, "www.magizhtechnologies.com")
    
    # 3. Top Right: Certificate ID
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(HexColor("#666666"))
    c.drawRightString(width - 60, height - 90, "CERTIFICATE ID")
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 60, height - 110, cert_id)
    
    # 4. Center Titles
    c.setFont("Times-Bold", 42)
    c.setFillColor(HexColor("#B8860B")) # Gold
    c.drawCentredString(width/2, height - 200, "CERTIFICATE")
    
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(HexColor("#00153B"))
    c.drawCentredString(width/2, height - 235, "OF INTERNSHIP")
    
    # Decorative lines
    c.setStrokeColor(HexColor("#00153B"))
    c.setLineWidth(1)
    c.line(width/2 - 150, height - 228, width/2 - 90, height - 228)
    c.line(width/2 + 90, height - 228, width/2 + 150, height - 228)

    # 5. Content
    c.setFont("Helvetica", 14)
    c.setFillColor(HexColor("#333333"))
    c.drawCentredString(width/2, height - 280, "This is to certify that")
    
    # Student Name
    c.setFont("Times-BoldItalic", 42)
    c.setFillColor(HexColor("#00153B"))
    c.drawCentredString(width/2, height - 330, student.name)
    
    c.setStrokeColor(HexColor("#CCCCCC"))
    c.setDash(2, 2)
    c.line(width/2 - 150, height - 340, width/2 + 150, height - 340)
    c.setDash()
    
    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor("#333333"))
    c.drawCentredString(width/2, height - 370, "has successfully completed the Internship Program in")
    
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(width/2, height - 390, f"{role} at Magizh Technologies.")
    
    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#555555"))
    c.drawCentredString(width/2, height - 415, f"The internship duration was from {start_date} to {end_date}.")
    
    desc = "During the internship, the candidate was found to be diligent, hardworking"
    desc2 = "and committed. We wish the candidate all the best for future endeavors."
    c.drawCentredString(width/2, height - 435, desc)
    c.drawCentredString(width/2, height - 450, desc2)

    # 6. QR Code
    frontend_url = os.environ.get("FRONTEND_URL", "http://172.20.51.74:3000")
    qr_data = f"{frontend_url}/verify?id={cert_id}"
    qr = qrcode.QRCode(version=1, box_size=10, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr_img_data = qr.make_image(fill_color="black", back_color="white")
    qr_path = os.path.join(CERTS_DIR, f"{cert_id}_qr.png")
    qr_img_data.save(qr_path)
    
    c.drawImage(qr_path, width - 110, 150, width=70, height=70)
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#666666"))
    c.drawCentredString(width - 75, 135, "Scan to Verify")
    c.drawCentredString(width - 75, 125, "this Certificate")

    # 7. Bottom Left: Intern ID & Date
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(HexColor("#666666"))
    c.drawString(180, 120, "INTERN ID")
    c.setFont("Helvetica", 10)
    c.drawString(180, 105, student.internship_id)
    
    c.setFont("Helvetica-Bold", 9)
    c.drawString(380, 120, "DATE OF ISSUE")
    c.setFont("Helvetica", 10)
    issue_date_str = datetime.now().strftime("%d %B %Y")
    c.drawString(380, 105, issue_date_str)
    
    # 8. Signature
    sig_path = os.path.join(ASSETS_DIR, "signature.png")
    if os.path.exists(sig_path):
        c.drawImage(sig_path, width - 280, 100, width=140, height=45, mask='auto')
    else:
        c.setFont("Times-Italic", 18)
        c.drawCentredString(width - 210, 105, "Gokulakrishnan")

    c.setStrokeColor(HexColor("#B8860B"))
    c.setLineWidth(1)
    c.line(width - 280, 95, width - 140, 95)
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(HexColor("#00153B"))
    c.drawCentredString(width - 210, 80, "Gokulakrishnan")
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#666666"))
    c.drawCentredString(width - 210, 68, "Founder & Director")
    c.drawCentredString(width - 210, 56, "Magizh Technologies")

    # 9. Gold Seal/Badge (Left side)
    c.setFillColor(HexColor("#B8860B"))
    c.circle(120, height/2 - 30, 45, fill=1, stroke=0)
    c.setFillColor(HexColor("#00153B"))
    c.circle(120, height/2 - 30, 40, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(120, height/2 - 20, "EXCELLENCE")
    c.drawCentredString(120, height/2 - 30, "INNOVATION")
    c.drawCentredString(120, height/2 - 40, "COMMITMENT")
    
    c.setFillColor(HexColor("#B8860B"))
    c.setFont("Helvetica", 14)
    c.drawCentredString(120, height/2 + 2, "\u2605 \u2605 \u2605")
    
    c.save()
    return file_path
