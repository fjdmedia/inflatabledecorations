"""Generate 3-page FJMedia-branded upgrade proposal PDF for Inflatable Decorations."""

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, HRFlowable, Flowable,
)
from reportlab.pdfgen import canvas
from pathlib import Path

# ---------- Brand ----------
NAVY = HexColor("#0F1E3A")
NAVY_SOFT = HexColor("#1A2E54")
GOLD = HexColor("#C9A961")
GOLD_SOFT = HexColor("#E6D4AA")
INK = HexColor("#1A1A1A")
MUTED = HexColor("#5A5A5A")
CREAM = HexColor("#F8F5EF")
ACCENT_BG = HexColor("#F2EDE2")
RULE = HexColor("#D8CDB5")
PAGE_W, PAGE_H = LETTER

OUT_DIR = Path(r"C:/Users/diazc/OneDrive/Desktop/FJDMedia/Websites/inflatabledecorations/Assets/Docs")
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_PATH = OUT_DIR / "Upgrade-Proposal-Inflatable-Decorations.pdf"

ss = getSampleStyleSheet()

# ---------- Styles ----------
EYEBROW = ParagraphStyle("Eyebrow", parent=ss["Normal"], fontName="Helvetica-Bold",
                        fontSize=9, leading=12, textColor=GOLD, alignment=TA_LEFT, spaceAfter=6)
EYEBROW_WHITE = ParagraphStyle("EW", parent=EYEBROW, textColor=GOLD)
H_COVER = ParagraphStyle("HC", parent=ss["Title"], fontName="Helvetica-Bold",
                        fontSize=42, leading=48, textColor=white, alignment=TA_LEFT, spaceAfter=10)
H_COVER_SUB = ParagraphStyle("HCS", parent=ss["Normal"], fontName="Helvetica",
                            fontSize=13, leading=19, textColor=HexColor("#BFD0E8"), alignment=TA_LEFT)
H1 = ParagraphStyle("H1", parent=ss["Heading1"], fontName="Helvetica-Bold",
                   fontSize=24, leading=30, textColor=NAVY, alignment=TA_LEFT, spaceAfter=8)
H2 = ParagraphStyle("H2", parent=ss["Heading2"], fontName="Helvetica-Bold",
                   fontSize=15, leading=20, textColor=NAVY, alignment=TA_LEFT, spaceAfter=4)
BODY = ParagraphStyle("Body", parent=ss["Normal"], fontName="Helvetica",
                     fontSize=10.5, leading=16, textColor=INK, alignment=TA_LEFT, spaceAfter=8)
BODY_LEDE = ParagraphStyle("Lede", parent=BODY, fontSize=11.5, leading=17, textColor=NAVY_SOFT)
BODY_MUTED = ParagraphStyle("BM", parent=BODY, textColor=MUTED, fontSize=10, leading=14)
META_LABEL = ParagraphStyle("ML", parent=ss["Normal"], fontName="Helvetica-Bold",
                           fontSize=8, leading=11, textColor=MUTED, letterSpacing=1)
META_VALUE = ParagraphStyle("MV", parent=ss["Normal"], fontName="Helvetica",
                           fontSize=10.5, leading=14, textColor=INK)
CARD_NUM = ParagraphStyle("CN", parent=ss["Normal"], fontName="Helvetica-Bold",
                         fontSize=26, leading=26, textColor=GOLD, alignment=TA_CENTER)
CARD_TITLE = ParagraphStyle("CT", parent=ss["Normal"], fontName="Helvetica-Bold",
                           fontSize=11.5, leading=15, textColor=NAVY, spaceAfter=3)
CARD_BODY = ParagraphStyle("CB", parent=ss["Normal"], fontName="Helvetica",
                          fontSize=9.8, leading=13.5, textColor=MUTED)
PULL_QUOTE = ParagraphStyle("PQ", parent=ss["Normal"], fontName="Helvetica-Oblique",
                           fontSize=13, leading=19, textColor=NAVY,
                           leftIndent=18, spaceBefore=4, spaceAfter=10)
TAG = ParagraphStyle("Tag", parent=ss["Normal"], fontName="Helvetica-Bold",
                    fontSize=8, leading=11, textColor=white, alignment=TA_CENTER)


# ---------- Page decorations ----------

def draw_header(canv, doc, label):
    w, h = LETTER
    canv.setStrokeColor(GOLD)
    canv.setLineWidth(1.2)
    canv.line(0.65 * inch, h - 0.55 * inch, w - 0.65 * inch, h - 0.55 * inch)
    canv.setFont("Helvetica-Bold", 10.5)
    canv.setFillColor(NAVY)
    canv.drawString(0.65 * inch, h - 0.42 * inch, "FJMEDIA")
    canv.setFont("Helvetica", 9)
    canv.setFillColor(MUTED)
    canv.drawRightString(w - 0.65 * inch, h - 0.42 * inch, label)


def draw_footer(canv, doc, pagenum):
    w, h = LETTER
    canv.setStrokeColor(RULE)
    canv.setLineWidth(0.4)
    canv.line(0.65 * inch, 0.55 * inch, w - 0.65 * inch, 0.55 * inch)
    canv.setFont("Helvetica", 8)
    canv.setFillColor(MUTED)
    canv.drawString(0.65 * inch, 0.38 * inch, "fjmedia.ca  .  James Diaz  .  Winnipeg, MB")
    canv.setFillColor(GOLD)
    canv.drawCentredString(w / 2, 0.38 * inch, f"{pagenum:02d}")


def on_cover(canv, doc):
    w, h = LETTER
    # Full navy top band
    canv.setFillColor(NAVY)
    canv.rect(0, h - 5.3 * inch, w, 5.3 * inch, fill=1, stroke=0)
    # Diagonal gold accent strip
    canv.setFillColor(GOLD)
    canv.rect(0, h - 5.38 * inch, w, 0.08 * inch, fill=1, stroke=0)
    # Subtle gold corner accents
    canv.setStrokeColor(GOLD_SOFT)
    canv.setLineWidth(0.6)
    # Top-right diagonal mark
    canv.line(w - 1.3 * inch, h - 0.9 * inch, w - 0.9 * inch, h - 1.3 * inch)
    canv.line(w - 1.0 * inch, h - 0.9 * inch, w - 0.6 * inch, h - 1.3 * inch)
    # Brand strip
    canv.setStrokeColor(GOLD)
    canv.setLineWidth(1.2)
    canv.line(0.65 * inch, h - 0.55 * inch, w - 0.65 * inch, h - 0.55 * inch)
    canv.setFont("Helvetica-Bold", 11)
    canv.setFillColor(white)
    canv.drawString(0.65 * inch, h - 0.42 * inch, "FJMEDIA")
    canv.setFont("Helvetica", 9.5)
    canv.setFillColor(HexColor("#BFD0E8"))
    canv.drawRightString(w - 0.65 * inch, h - 0.42 * inch,
                         "Upgrade Picks  .  For Inflatable Decorations")
    # Footer
    canv.setStrokeColor(RULE)
    canv.setLineWidth(0.4)
    canv.line(0.65 * inch, 0.55 * inch, w - 0.65 * inch, 0.55 * inch)
    canv.setFont("Helvetica", 8)
    canv.setFillColor(MUTED)
    canv.drawString(0.65 * inch, 0.38 * inch, "fjmedia.ca  .  James Diaz  .  Winnipeg, MB")
    canv.setFillColor(GOLD)
    canv.drawCentredString(w / 2, 0.38 * inch, "01")


def on_page2(canv, doc):
    draw_header(canv, doc, "Upgrade Picks  .  For Inflatable Decorations")
    draw_footer(canv, doc, doc.page)


def on_page3(canv, doc):
    draw_header(canv, doc, "Upgrade Picks  .  For Inflatable Decorations")
    draw_footer(canv, doc, doc.page)


class GoldMark(Flowable):
    """Small centered gold square accent."""
    def __init__(self, size=6, spaceBefore=0, spaceAfter=6):
        Flowable.__init__(self)
        self.size = size
        self.spaceBefore = spaceBefore
        self.spaceAfter = spaceAfter
        self.width = size
        self.height = size + spaceAfter

    def draw(self):
        self.canv.setFillColor(GOLD)
        self.canv.rect(0, self.spaceAfter, self.size, self.size, fill=1, stroke=0)


def number_card(num, title, body, bg=CREAM):
    """A numbered item card with colored left rail."""
    num_p = Paragraph(num, CARD_NUM)
    title_p = Paragraph(title, CARD_TITLE)
    body_p = Paragraph(body, CARD_BODY)
    inner = Table(
        [[num_p, [title_p, body_p]]],
        colWidths=[0.7 * inch, 5.6 * inch],
    )
    inner.setStyle(TableStyle([
        ("VALIGN", (0, 0), (0, 0), "MIDDLE"),
        ("VALIGN", (1, 0), (1, 0), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 2.5, GOLD),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, RULE),
    ]))
    return inner


# ---------- Build doc ----------

doc = SimpleDocTemplate(
    str(OUT_PATH), pagesize=LETTER,
    leftMargin=0.65 * inch, rightMargin=0.65 * inch,
    topMargin=0.85 * inch, bottomMargin=0.75 * inch,
    title="FJMedia - Upgrade Picks - Inflatable Decorations",
    author="James Diaz - FJMedia",
)

story = []

# ========== PAGE 1: COVER ==========
# Top navy zone content — placed via manual spacer positioning

story.append(Spacer(1, 0.5 * inch))
story.append(Paragraph("A FEW UPGRADE PICKS", ParagraphStyle(
    "ce", parent=EYEBROW, textColor=GOLD, fontSize=10, spaceAfter=16)))
story.append(Paragraph("Stuff I can add<br/>to your site.", H_COVER))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "I dug into what other balloon studios are doing online.<br/>"
    "Here's the short list of bits I can tack onto yours.",
    H_COVER_SUB))

# Spacer to push the lower content below the navy band
story.append(Spacer(1, 2.35 * inch))

# Pull-quote style intro on cream zone
story.append(GoldMark())
story.append(Paragraph(
    "Three mockups look great. What they're missing is the little trust + content stuff "
    "the bigger studios use to actually convert inquiries.",
    PULL_QUOTE))
story.append(Spacer(1, 12))

# Meta card block — 3 columns
meta = [
    [Paragraph("FOR", META_LABEL),
     Paragraph("FROM", META_LABEL),
     Paragraph("DATE", META_LABEL)],
    [Paragraph("Inflatable Decorations<br/>Winnipeg, MB", META_VALUE),
     Paragraph("James @ FJMedia<br/>Your website guy", META_VALUE),
     Paragraph("April 2026", META_VALUE)],
]
meta_tbl = Table(meta, colWidths=[2.3 * inch, 2.3 * inch, 2.3 * inch])
meta_tbl.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, 0), 10),
    ("TOPPADDING", (0, 1), (-1, 1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("LINEABOVE", (0, 0), (-1, 0), 0.5, RULE),
    ("LINEBELOW", (0, -1), (-1, -1), 0.5, RULE),
]))
story.append(meta_tbl)

story.append(Spacer(1, 16))
story.append(Paragraph(
    "<b>How to use this:</b> flip through the 10 picks on the next page. "
    "Text me the numbers you want and I'll fold them into whichever design you go with. "
    "Skip whatever - the site works fine as-is.",
    BODY))

story.append(PageBreak())

# ========== PAGE 2: THE 10 PICKS ==========
story.append(Paragraph("THE 10 PICKS", EYEBROW))
story.append(Paragraph("Pick any, all, or none of 'em.", H1))
story.append(HRFlowable(width="30%", thickness=1.2, color=GOLD, spaceBefore=2, spaceAfter=14))

story.append(Paragraph(
    "Ranked roughly by how much each moves the needle. First few are the biggest wins.",
    BODY_MUTED))
story.append(Spacer(1, 8))

items = [
    ("01", "FAQ section (10 Qs)",
     "Drop-down with everything people ask - lead time, deposit, setup/teardown, "
     "biodegradable, minimum order, color matching, insurance, rain plan. Saves you a "
     "ton of repeat DMs and helps SEO."),
    ("02", "'Starting at $25/ft' pricing line",
     "One small line under Services. Sounds backwards, but publishing a floor filters "
     "bargain hunters and makes serious buyers lean in. Industry's #1 conversion move."),
    ("03", "Photo mockup promise",
     "'Every custom install comes with a mockup before I build.' Kills the biggest worry "
     "people have - 'what if it doesn't look like I pictured?'"),
    ("04", "'What's included' on each pricing tier",
     "Each tier gets 3-4 bullets: balloon count, install time, setup included, mockup "
     "included, recommended lead time. Answers 'what do I actually get?' silently."),
    ("05", "50% deposit note",
     "One line: '50% deposit locks in your date. Balance due 7 days before the event.' "
     "Sets the rule up front so it's not awkward during the quote."),
    ("06", "Urgency line near the CTA",
     "'Most weekends book 4-6 weeks out - last-minute still welcome.' Nudges fence-sitters "
     "without feeling pushy."),
    ("07", "Service area + travel fee line",
     "'Winnipeg + 30km - travel fees beyond, I'll quote up front.' Saves you time on "
     "out-of-radius inquiries."),
    ("08", "Sticky book-now bar on mobile",
     "Little bar at the bottom of phones - 'Book Your Date' + a DM shortcut. Most traffic "
     "is mobile, this keeps the CTA in reach no matter where they scroll."),
    ("09", "Insurance + venues line",
     "'Fully insured . approved at most Winnipeg venues . COI available.' Unlocks "
     "corporate and venue bookings - they often need proof before confirming."),
    ("10", "Teardown in the Process section",
     "Update step 3 to explicitly say 'I come back and strike after your event' - so "
     "delivery, install, styling AND teardown are all in. Small detail, big trust."),
]

for num, title, body in items:
    story.append(number_card(num, title, body))
    story.append(Spacer(1, 4))

story.append(PageBreak())

# ========== PAGE 3: BUNDLES + CLOSER ==========
story.append(Paragraph("SHORTCUTS", EYEBROW))
story.append(Paragraph("Or just grab a bundle.", H1))
story.append(HRFlowable(width="30%", thickness=1.2, color=GOLD, spaceBefore=2, spaceAfter=14))

story.append(Paragraph(
    "Don't feel like picking? Reply with one of these and I'll run with it.",
    BODY_MUTED))
story.append(Spacer(1, 10))

# Four bundle cards — 2x2 grid
def bundle_card(name, tag, picks, bg=CREAM, tag_bg=GOLD):
    name_p = Paragraph(f"<b>{name}</b>",
                       ParagraphStyle("bn", parent=ss["Normal"], fontName="Helvetica-Bold",
                                      fontSize=13, leading=16, textColor=NAVY))
    tag_p = Paragraph(tag, TAG)
    picks_p = Paragraph(picks,
                        ParagraphStyle("bp", parent=ss["Normal"], fontName="Helvetica",
                                       fontSize=10.5, leading=14, textColor=INK, spaceBefore=6))
    tag_tbl = Table([[tag_p]], colWidths=[0.9 * inch])
    tag_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), tag_bg),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    inner = Table([[name_p], [tag_tbl], [picks_p]], colWidths=[3.1 * inch])
    inner.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (0, 0), 14),
        ("TOPPADDING", (0, 1), (0, 1), 4),
        ("TOPPADDING", (0, 2), (0, 2), 6),
        ("BOTTOMPADDING", (0, 2), (0, 2), 14),
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 2.5, GOLD),
    ]))
    return inner


b1 = bundle_card("My Pick", "RECOMMENDED",
                 "#1 FAQ, #2 Pricing line, #3 Mockup promise, #5 Deposit, "
                 "#6 Urgency, #8 Mobile bar")
b2 = bundle_card("Bare Minimum", "STARTER",
                 "#1 FAQ, #3 Mockup promise, #8 Mobile bar", tag_bg=NAVY_SOFT)
b3 = bundle_card("Corporate Gigs", "UNLOCK",
                 "#4 What's included, #7 Service area, #9 Insurance + venues",
                 tag_bg=NAVY_SOFT)
b4 = bundle_card("All Of It", "FULL SEND",
                 "1 through 10 - makes sense if your site is your main booking channel")

grid = Table([[b1, b2], [Spacer(1, 14), Spacer(1, 14)], [b3, b4]],
             colWidths=[3.35 * inch, 3.35 * inch])
grid.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.append(grid)

story.append(Spacer(1, 34))

# Big closer block
story.append(HRFlowable(width="100%", thickness=0.4, color=RULE, spaceBefore=0, spaceAfter=14))
story.append(Paragraph("HOW TO REPLY", EYEBROW))
story.append(Paragraph("DM me the numbers and I'll drop them in.",
                       ParagraphStyle("cl", parent=H2, fontSize=18, leading=24, textColor=NAVY,
                                      spaceAfter=8)))
story.append(Paragraph(
    "Like - '1, 2, 3, 8' or just 'my pick' or 'all of it.' Whatever. No pressure - "
    "the site works fine as-is either way.",
    BODY))

story.append(Spacer(1, 20))

# Signature / contact footer block
contact_box = Table([
    [Paragraph("<b>James Diaz</b>",
               ParagraphStyle("sig1", parent=ss["Normal"], fontName="Helvetica-Bold",
                              fontSize=12, leading=16, textColor=NAVY))],
    [Paragraph("FJMedia - one-man web + brand studio",
               ParagraphStyle("sig2", parent=ss["Normal"], fontName="Helvetica",
                              fontSize=10, leading=14, textColor=MUTED))],
    [Spacer(1, 6)],
    [Paragraph("diazcjames@gmail.com  .  fjmedia.ca  .  Winnipeg, MB",
               ParagraphStyle("sig3", parent=ss["Normal"], fontName="Helvetica",
                              fontSize=10, leading=13, textColor=INK))],
], colWidths=[6.9 * inch])
contact_box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), CREAM),
    ("LINEBEFORE", (0, 0), (0, -1), 2.5, GOLD),
    ("LEFTPADDING", (0, 0), (-1, -1), 16),
    ("RIGHTPADDING", (0, 0), (-1, -1), 16),
    ("TOPPADDING", (0, 0), (0, 0), 14),
    ("BOTTOMPADDING", (0, -1), (-1, -1), 14),
]))
story.append(contact_box)

# ---------- Build with distinct per-page decorators ----------
def on_later(canv, doc):
    pagenum = doc.page
    draw_header(canv, doc, "Upgrade Picks  .  For Inflatable Decorations")
    draw_footer(canv, doc, pagenum)


doc.build(story, onFirstPage=on_cover, onLaterPages=on_later)

print(f"PDF generated: {OUT_PATH}")
print(f"Size: {OUT_PATH.stat().st_size / 1024:.1f} KB")
