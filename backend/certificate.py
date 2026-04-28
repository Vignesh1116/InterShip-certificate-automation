from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import landscape, A4
import qrcode, os, datetime


def generate_certificate(student, cert_id, role, start_date, end_date):
    os.makedirs("certificates", exist_ok=True)
    file_path = f"certificates/{cert_id}.pdf"
    
    # Use landscape A4
    page_width, page_height = landscape(A4)
    doc = SimpleDocTemplate(file_path, pagesize=landscape(A4), 
                            leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    
    # Custom Styles for Premium Look
    title_style = styles["Title"]
    title_style.fontSize = 32
    title_style.textColor = "#1a237e" # Dark Blue
    title_style.spaceAfter = 30

    normal_style = styles["Normal"]
    normal_style.fontSize = 14
    normal_style.leading = 20
    normal_style.alignment = 1 # Center

    # QR Code
    qr = qrcode.make(f"http://localhost:8000/verify/{cert_id}")
    qr_path = f"certificates/{cert_id}_qr.png"
    qr.save(qr_path)

    elements = []

    # Border Drawing (using a spacer with a frame or drawing on canvas is complex, 
    # but we can add a Table with a border as a wrapper if needed. 
    # For simplicity and "wow", let's focus on layout first)

    # Logo
    elements.append(Image("../assets/logo.png", width=180, height=70))
    elements.append(Spacer(1, 40))

    # Title
    elements.append(Paragraph("<b>CERTIFICATE OF INTERNSHIP</b>", title_style))
    elements.append(Spacer(1, 20))

    # Content
    content = f"""
    <br/><br/>
    This is to certify that<br/>
    <font size="24" color="#d32f2f"><b>{student.name}</b></font><br/><br/>
    Internship ID: <b>{student.internship_id}</b><br/><br/>
    has successfully completed their internship as<br/>
    <font size="18"><b>{role}</b></font><br/><br/>
    from <b>{start_date}</b> to <b>{end_date}</b><br/><br/><br/>
    """
    elements.append(Paragraph(content, normal_style))

    # Footer section (Signature and QR)
    # Using a Table to align signature and QR side by side
    from reportlab.platypus import Table, TableStyle
    from reportlab.lib import colors

    sig_img = Image("../assets/signature.png", width=120, height=40)
    qr_img = Image(qr_path, width=70, height=70)
    
    footer_data = [
        [sig_img, "" , qr_img],
        [Paragraph("<b>Gokulakrishnan</b><br/>Founder & CEO<br/>Magizh Technologies", styles["Normal"]), "", 
         Paragraph(f"<b>ID: {cert_id}</b><br/>Issue Date: {datetime.date.today()}", styles["Normal"])]
    ]
    
    footer_table = Table(footer_data, colWidths=[250, 150, 250])
    footer_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (0,1), 'CENTER'),
        ('ALIGN', (2,0), (2,1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    elements.append(Spacer(1, 40))
    elements.append(footer_table)

    # Build PDF
    doc.build(elements)

    return file_path