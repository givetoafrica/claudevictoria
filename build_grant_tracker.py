#!/usr/bin/env python3
"""Build the Give to Africa grant pipeline tracker (government + multilateral + foundation)."""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

OUT = "/home/user/claudevictoria/Give-to-Africa-Grant-Pipeline-2026.xlsx"

FONT = "Arial"

HDR_FILL = PatternFill("solid", fgColor="1F3864")
HDR_FONT = Font(name=FONT, size=10, bold=True, color="FFFFFF")
BODY_FONT = Font(name=FONT, size=10)
BODY_TOP = Alignment(vertical="top", wrap_text=True)

FILL_URGENT = PatternFill("solid", fgColor="FCE4D6")   # deadline inside 60 days
FILL_OPEN = PatternFill("solid", fgColor="E2EFDA")     # open / rolling
FILL_CAL = PatternFill("solid", fgColor="FFF2CC")      # closed, next cycle
FILL_LOW = PatternFill("solid", fgColor="F2F2F2")      # low priority / not eligible

THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

HEADERS = [
    "Priority",
    "Grant / Funder Name",
    "Funder Type",
    "Status",
    "Amount or Ceiling",
    "Deadline",
    "Eligibility Notes",
    "Program Fit (Give to Africa)",
    "Website",
    "Program Contact Email",
    "Phone",
    "Link (source checked)",
    "Recommended Next Step",
    "Verification",
]

# Priority, Name, Type, Status, Amount, Deadline, Eligibility, Fit, Website, Email, Phone, Link, Next step, Verification
ROWS = [
    # ---------------- TIME-SENSITIVE ----------------
    [
        "1 - Time-sensitive",
        "U.S. Dept. of State, Bureau of Democracy, Human Rights & Labor (DRL) - Track 2.0 Peacebuilding and Dialogue Support (DFOP0019287)",
        "U.S. Government (federal)",
        "OPEN - closes in ~2 weeks",
        "Not published in the announcement summary; projects run 24 months or less. No cost share required.",
        "Aug 13, 2026, 11:59pm ET",
        "U.S. or foreign not-for-profit organizations, think tanks, and civil society / NGOs. Give to Africa's 501(c)(3) status qualifies.",
        "WEAK program fit. DRL names Armenia/Azerbaijan, Cambodia/Thailand and DRC/Rwanda as target areas - not Ghana or West Africa. Only worth pursuing if Give to Africa can credibly front a DRC/Rwanda civil-society dialogue partner.",
        "state.gov",
        "not publicly listed (submission handled through the NOFO on grants.gov)",
        "not publicly listed",
        "https://www.state.gov/notice-of-funding-opportunity-nofo-track-2-0-peacebuilding-and-dialogue-support",
        "Read the full NOFO before investing time. Skip unless a DRC/Rwanda partner is already in hand - the geographic mismatch makes this a long shot.",
        "Deadline and eligibility confirmed via State Dept listing",
    ],
    [
        "1 - Time-sensitive",
        "International Finance Corporation (IFC) - Agritech Modernization Grant 2026",
        "Multilateral (World Bank Group)",
        "OPEN",
        "$100,000 - $2,500,000",
        "Oct 10, 2026",
        "Agribusinesses, cooperatives and agritech firms operating in Sub-Saharan Africa / South Asia with proven smallholder-farmer linkages. Likely needs MDF Ghana or a shea cooperative as the applicant entity, with Give to Africa as technical/fiscal partner.",
        "Climate Resilience Program / MDF Ghana shea butter factories. Eligible uses reportedly include equipment and technology procurement, capacity building, and climate/ESG-aligned investment - which maps onto both the factory build-out and the PPE procurement push.",
        "ifc.org",
        "not publicly listed",
        "not publicly listed",
        "https://www.globalsouthopportunities.com/2026/06/18/grant-24/",
        "VERIFY FIRST via ifc.org directly before spending any time on this - see Verification column. If genuine, it is the single best dollar-for-dollar fit on this list for the shea factory work.",
        "NEEDS VERIFICATION - SCAM RISK. Fraudulent sites impersonating IFC grant programs are documented. Confirm the call exists on an official ifc.org / ifcgrants.org page before applying, and never pay a fee.",
    ],

    # ---------------- OPEN / ROLLING ----------------
    [
        "2 - Open / rolling",
        "Global Fund for Community Foundations (GFCF) - Fostering Community Philanthropy small grants",
        "Foundation (intermediary funder)",
        "OPEN - rolling, no deadline",
        "$7,000 - $20,000",
        "Rolling - concept notes accepted at any time",
        "Community philanthropy organizations based in Africa, Asia, Middle East, CEE, or Latin America - including national public foundations, women's funds, and grassroots grantmakers. Two-stage process: concept note first, full application by invitation.",
        "STRONGEST fit on this list for YENDAA and Fiscal Sponsorship. GFCF funds exactly the thing Give to Africa is building - infrastructure that moves resources to locally led African organizations. The 'philanthropy, technology and innovation' positioning line was written for this funder.",
        "https://www.globalfundcf.org",
        "info@globalfundcf.org",
        "not publicly listed",
        "https://www2.fundsforngos.org/latest-funds-for-ngos/apply-for-small-grants-to-foster-community-philanthropy/",
        "Submit a concept note within the next 2 weeks. Lead with YENDAA as African-led giving infrastructure and the November fiscal-sponsorship cohort as proof of local-resource mobilization. Small dollar amount, but it opens a door to a network of community philanthropy funders.",
        "Grant range, rolling process and email confirmed across multiple listings",
    ],
    [
        "2 - Open / rolling",
        "U.S. Embassy Ghana - Ambassador's Special Self-Help (ASSH) Program",
        "U.S. Government (embassy small grants)",
        "OPEN - annual cycle, confirm current window",
        "$1,000 - $12,000 (awards typically $2,000 - $10,000)",
        "Annual cycle - current 2026 window not published online; email the coordinator to confirm",
        "Applicant must be a non-profit, NGO or CBO registered with the Government of Ghana, or a community association formed at least a year before applying. Give to Africa cannot apply directly - MDF Ghana or a shea cooperative must be the applicant. Requires substantial community contribution (labor, materials, land, expertise).",
        "Climate Resilience / MDF Ghana. A 12-month, community-led shea processing or PPE project is precisely the profile ASSH funds, and the required community contribution is already covered by the existing 80/20 split and 4-to-1 government match.",
        "https://gh.usembassy.gov/ambassadors-special-self-help-program/",
        "AccraSelfHelp@state.gov",
        "not publicly listed",
        "https://gh.usembassy.gov/ambassadors-special-self-help-program/",
        "Email AccraSelfHelp@state.gov this week asking when the next window opens, and have MDF Ghana ready as the named applicant. Small award, but a U.S. Embassy grant is a credential worth more than $12,000 in later proposals.",
        "Amounts and eligibility confirmed; current-cycle deadline NOT confirmed - the embassy page has not published a 2026 date",
    ],
    [
        "2 - Open / rolling",
        "U.S. Embassy Ghana - Public Diplomacy Section Annual Program Statement (APS)",
        "U.S. Government (embassy small grants)",
        "WATCH - last confirmed cycle closed, reissued annually",
        "$15,000 - $100,000 (range from the most recently confirmed cycle)",
        "Not currently posted - APS is normally reissued each fiscal year",
        "Registered non-profits, NGOs, academic institutions and civil society organizations. Two-step: Statement of Interest first, full proposal by invitation. U.S.-based organizations have been eligible in prior Ghana cycles.",
        "Education & Workforce Development - the Bradford University African Philanthropy Studies curriculum is a natural APS project (educational exchange, capacity building, U.S.-Ghana institutional linkage).",
        "https://gh.usembassy.gov/education-culture/public-affairs-small-grants/",
        "PASAccraGrant@state.gov",
        "not publicly listed",
        "https://gh.usembassy.gov/education-culture/public-affairs-small-grants/public-diplomacy-section-annual-program-statement-request-for-statements-of-interest/",
        "Email PASAccraGrant@state.gov to ask when the FY2027 APS will be issued and to be added to any notification list. Draft the Bradford curriculum Statement of Interest now so it is ready the day the APS posts.",
        "Email address and prior-cycle funding range confirmed; no open 2026 call found",
    ],
    [
        "2 - Open / rolling",
        "U.S. African Development Foundation (USADF)",
        "U.S. Government (independent federal agency)",
        "OPEN - country-specific calls issued periodically",
        "Up to $250,000",
        "Varies by country call - check usadf.gov for the current Ghana call",
        "Applicant must be a 100% African-owned enterprise, cooperative, producer group or processor in an eligible country. Give to Africa is NOT directly eligible - the shea cooperative or MDF Ghana would be the grantee, with Give to Africa providing proposal and compliance support.",
        "Climate Resilience / MDF Ghana. USADF's core business is exactly this: agricultural processors and women's producer groups building local value addition. Shea processing is squarely on-mission.",
        "https://usadf.gov",
        "not publicly listed (each country call names its own submission address)",
        "not publicly listed",
        "https://usadf.gov/resources",
        "Confirm whether Ghana is in the current eligible-country list, then position the shea cooperative as applicant. Even at partner-support level this is the largest realistic U.S. government award on this list.",
        "NEEDS VERIFICATION - sources conflict on whether Ghana is currently an eligible USADF country. One country list omitted Ghana; another listed it. Confirm with USADF directly before building a proposal.",
    ],
    [
        "2 - Open / rolling",
        "UN Women's Peace & Humanitarian Fund (WPHF) - Rapid Response Window",
        "Multilateral (UN)",
        "OPEN",
        "Not published in the summary reviewed",
        "Concept notes accepted through Dec 31, 2026",
        "International and regional NGOs partnering under the Rapid Response Window, in ODA-eligible countries with active peace processes.",
        "WEAK fit. Ghana has no active peace process, so the window's core criterion is not met. Listed only for completeness on the multilateral side.",
        "https://wphfund.org",
        "not publicly listed",
        "not publicly listed",
        "https://wphfund.org/call-for-proposals-for-rapid-response-window-i-rngo-partners/",
        "Deprioritize unless Give to Africa adds programming in a conflict-affected country. Revisit only if the portfolio shifts.",
        "Window and closing date confirmed; grant size not confirmed",
    ],
    [
        "2 - Open / rolling",
        "African Water Facility (AWF, hosted by the African Development Bank) - 2026 Call for Proposals",
        "Multilateral (AfDB)",
        "OPEN - applications accepted on a rolling basis",
        "Up to EUR 1,000,000 (some listings cite a EUR 5,000,000 ceiling for larger projects)",
        "Rolling",
        "Eligible recipients are AfDB regional member countries, public institutions, water/sanitation implementing agencies, utilities, and regional or basin organizations. A U.S. 501(c)(3) is NOT a listed eligible recipient.",
        "WEAK fit as a direct applicant. Possible only as a named implementing partner to a Ghanaian public agency or basin organization on a climate-resilient water component of the shea communities work.",
        "https://www.africanwaterfacility.org",
        "not publicly listed",
        "not publicly listed",
        "https://www.africanwaterfacility.org/en/eligibility-criteria",
        "Do not pursue directly. Keep on file in case a Ghanaian public-sector partner wants a water/sanitation component added to the shea community work.",
        "Eligibility categories and rolling process confirmed; exact ceiling inconsistent across sources",
    ],

    # ---------------- CALENDAR / NEXT CYCLE ----------------
    [
        "3 - Calendar for next cycle",
        "UNDP / GEF Small Grants Programme (SGP) Ghana",
        "Multilateral (UNDP / Global Environment Facility)",
        "CLOSED - annual, reopens approx. Feb-Mar",
        "Up to $30,000 per initiative",
        "2026 round closed Mar 13, 2026 (window ran Feb 23 - Mar 13). Expect a similar window in 2027.",
        "Local Ghanaian NGOs/non-profits with valid Registrar General's Department and Social Welfare certificates, or CBOs / social enterprises recognized by the District Assembly and Ghana EPA. MDF Ghana would be the applicant; Give to Africa cannot apply directly.",
        "EXCELLENT strategic fit. The 2026 priority geography was the Black Volta Basin - Wa-West (Upper West), Bole, Sawla-Tuna-Kalba and Central Gonja (Savannah Region) - which is the same northern Ghana shea-gathering belt the MDF Ghana partnership already works in. Focus areas include sustainable agriculture and community-based conservation.",
        "https://www.undp.org/ghana",
        "not publicly listed (proposal guidelines and template are posted with each call on the UNDP Ghana site)",
        "not publicly listed",
        "https://www.undp.org/ghana/press-releases/2026-call-proposals-gef-small-grant-programme-ghana",
        "Put a calendar reminder for early February 2027. Confirm now that MDF Ghana's Registrar General and Social Welfare certificates are current - that paperwork is the usual disqualifier, and it takes months to fix.",
        "Amount, deadline, eligibility and priority districts confirmed across multiple listings",
    ],
    [
        "3 - Calendar for next cycle",
        "Canada Fund for Local Initiatives (CFLI) - Ghana",
        "Foreign government (Global Affairs Canada)",
        "CLOSED - annual, reopens approx. Feb-Apr",
        "CAD $25,000 - $45,000 average per project (CAD $200,000 total Ghana envelope)",
        "2026 round closed May 10, 2026. Expect the 2027 call around Feb-Apr 2027.",
        "Broad and unusually favorable: local NGOs and non-profits, local academic institutions, AND international non-governmental organizations working on local development activities. Give to Africa appears eligible to apply directly.",
        "2026 Ghana themes were democratic governance / human rights and peace & security, with gender equality as a cross-cutting theme. Themes rotate year to year - if a 2027 theme touches women's economic empowerment or climate, the MDF Ghana shea work fits cleanly.",
        "https://www.international.gc.ca/world-monde/funding-financement/cfli-fcil/ghana.aspx?lang=eng",
        "ghanacfli@international.gc.ca",
        "not publicly listed",
        "https://www.international.gc.ca/world-monde/funding-financement/cfli-fcil/ghana.aspx?lang=eng",
        "Email ghanacfli@international.gc.ca now to ask to be notified when the 2027 call opens, and ask what the 2027 thematic priorities will be. This is one of the few government funders on this list where Give to Africa can be the direct applicant.",
        "Amounts, deadline, eligibility and contact email confirmed",
    ],
    [
        "3 - Calendar for next cycle",
        "Common Fund for Commodities (CFC) - Annual Call for Proposals",
        "Multilateral (intergovernmental commodity body)",
        "CLOSED - 28th call closed Apr 1, 2026; watch for the 29th",
        "Up to $1,500,000 (regular) / $300,000 (fast-track) - note: primarily LOANS and debt instruments, not pure grants",
        "28th call closed Apr 1, 2026",
        "SMEs, cooperatives, social enterprises, NGOs and public/private entities based or operating in one of 101 CFC member countries (Ghana is a member). Requires a minimum 3-year operating history and a financially viable project.",
        "Strong thematic fit for the shea value chain. CFC's stated priorities include local value addition, regenerative agriculture and women's entrepreneurship - the shea butter factory model hits all three. Be aware the instrument is mostly debt, so this suits the revenue-generating factory rather than grant-funded programming.",
        "https://www.common-fund.org",
        "not publicly listed",
        "not publicly listed",
        "https://www.common-fund.org/call-for-proposals",
        "Watch for the 29th call announcement. Before applying, decide whether MDF Ghana's factory model can service debt - if not, this is the wrong instrument regardless of fit.",
        "Amounts, deadline, eligibility and instrument type confirmed",
    ],
    [
        "3 - Calendar for next cycle",
        "United Nations Democracy Fund (UNDEF)",
        "Multilateral (UN)",
        "CLOSED - annual window, 2026 round not yet announced",
        "Up to $300,000 per project (two-year projects)",
        "Annual window, historically about a month long (a recent round ran Nov 1-30)",
        "Civil society organizations and NGOs promoting democracy; preference for countries in democratic transition and consolidation, least developed countries, and low/middle-income countries.",
        "Moderate fit. Would need to be framed around civil-society strengthening - the fiscal sponsorship program and YENDAA's transparency/verification infrastructure for African-led organizations is the most credible angle.",
        "https://www.un.org/democracyfund/en",
        "not publicly listed",
        "not publicly listed",
        "https://www.un.org/democracyfund/en/apply-for-funding",
        "Check the UNDEF site monthly from October onward. The window is short and there is no extension, so a draft concept must exist before it opens.",
        "Grant ceiling and eligibility confirmed; 2026 round dates not yet published",
    ],
    [
        "3 - Calendar for next cycle",
        "Dana Foundation - 2026 Grants Programme",
        "Foundation",
        "NEEDS VERIFICATION - sources give conflicting deadlines",
        "EUR 50,000 - EUR 150,000 per organization (sources differ)",
        "Conflicting: one source says May 5, 2026 (passed); another says Dec 31, 2026",
        "Locally led and governed organizations in low- or middle-income countries, generally with annual budgets under EUR 500,000, working across multiple dimensions of poverty at once.",
        "Moderate fit. 'Locally led and governed' may exclude a U.S.-headquartered 501(c)(3) - but it is a strong fit for the African organizations in the fiscal sponsorship cohort, which is itself a pitchable angle.",
        "not confirmed",
        "not publicly listed",
        "not publicly listed",
        "https://africanngos.org/2026/06/09/african-ngo-funding-opportunities-june-july-2026/",
        "Verify the real deadline and whether a U.S.-based sponsor is eligible before investing effort. If only locally led orgs qualify, redirect this to fiscal sponsorship cohort members.",
        "NEEDS VERIFICATION - deadline and grant size both inconsistent across sources; funder's own site not confirmed",
    ],

    # ---------------- LOW PRIORITY / CLOSED ----------------
    [
        "4 - Low priority",
        "UN Women - Spotlight Initiative Africa Regional Programme (SIARP) 2.0",
        "Multilateral (UN)",
        "CLOSED - deadline was today",
        "$110,000 - $548,000 (27-month projects, Oct 2026 - Dec 2028)",
        "Jul 27, 2026, 5pm East Africa Time",
        "CSOs, women's rights organizations, coalitions and networks operating at continental, regional, sub-regional or multi-country level in Africa, with demonstrated gender-equality programming experience.",
        "Would have been a good multi-country fit given the cross-border structure, but the thematic focus (ending violence against women and girls, SRHR, survivor services) sits outside Give to Africa's four programs.",
        "https://africa.unwomen.org",
        "not publicly listed",
        "not publicly listed",
        "https://africa.unwomen.org/en/programme-implementation/2026/06/call-for-proposals-for-civil-society-partnerships-for-implementation-of-the-spotlight-initiative-africa-regional-programme-siarp-20",
        "Missed for this cycle. Worth tracking UN Women Africa's calls generally - the multi-country eligibility structure suits Give to Africa's cross-border model better than most funders'.",
        "Amounts, deadline and eligibility confirmed",
    ],
    [
        "4 - Low priority",
        "USDA Foreign Agricultural Service - Food for Progress FY2026",
        "U.S. Government (federal)",
        "CLOSED for FY2026",
        "$28,000,000 - $35,000,000 per award (up to $226M total)",
        "Closed Jul 6, 2026",
        "Governments, intergovernmental organizations, PVOs, non-profit agricultural organizations and cooperatives, NGOs, universities, and other private entities. Award sizes require major institutional capacity.",
        "Poor fit at current scale. FY2026 priority countries were Bangladesh, Bolivia, Ecuador, Morocco, the Philippines, Sri Lanka and Thailand - Ghana was not among them.",
        "https://www.fas.usda.gov/programs/food-progress",
        "not publicly listed",
        "not publicly listed",
        "https://www.fas.usda.gov/newsroom/usda-publishes-fy-2026-notices-funding-opportunity-food-progress",
        "Not viable now - award sizes are far above Give to Africa's current capacity and Ghana is off the priority list. Revisit only as a sub-awardee to a large prime.",
        "Amounts, deadline and priority countries confirmed",
    ],
    [
        "4 - Low priority",
        "USDA Foreign Agricultural Service - McGovern-Dole International Food for Education FY2026",
        "U.S. Government (federal)",
        "CLOSED for FY2026",
        "Not published in the summary reviewed (multi-million, multi-year)",
        "Closed Jun 22, 2026",
        "Non-profits, cooperatives, universities and similar entities. Non-priority countries are accepted but rarely funded.",
        "Poor fit. FY2026 priority countries in West Africa were Guinea (Conakry) and Liberia - not Ghana. Education focus is school feeding and child nutrition, not workforce development.",
        "https://www.fas.usda.gov",
        "not publicly listed",
        "not publicly listed",
        "https://www.fas.usda.gov/newsroom/stakeholder-notice-usda-publishes-fy-2026-notice-funding-opportunity-mcgovern-dole-program",
        "Skip. Listed so the FY2027 priority-country announcement can be checked - if Ghana is added, reassess.",
        "Deadline and priority countries confirmed",
    ],
    [
        "4 - Low priority",
        "Segal Family Foundation",
        "Foundation",
        "NOT OPEN - invitation only",
        "$10,000 - $100,000+ (averaging approx. $50,000; approx. $15M granted annually)",
        "No deadline - does not accept unsolicited applications",
        "Grassroots African-led organizations in education, youth empowerment and social entrepreneurship. Grantees come through referral only.",
        "Very strong mission fit (trust-based philanthropy for African-led organizations) but there is no application route. This is a relationship-building target, not a proposal target.",
        "https://www.segalfamilyfoundation.org",
        "not publicly listed",
        "not publicly listed",
        "https://www.segalfamilyfoundation.org/what-we-do/invest/grantmaking/",
        "Do not submit a proposal - it will not be read. Instead, map who in Give to Africa's network already holds a Segal relationship and pursue a warm referral. Their African-led portfolio overlaps heavily with YENDAA's target causes.",
        "Referral-only model and grant range confirmed",
    ],
]


def build():
    wb = Workbook()

    # ---------- Sheet 1: pipeline ----------
    ws = wb.active
    ws.title = "Grant Pipeline"

    title = ws.cell(row=1, column=1)
    title.value = "Give to Africa - Grant Pipeline (Government, Multilateral & Foundation) | Research run July 27, 2026"
    title.font = Font(name=FONT, size=12, bold=True, color="1F3864")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(HEADERS))
    ws.row_dimensions[1].height = 22

    for col, header in enumerate(HEADERS, start=1):
        c = ws.cell(row=2, column=col, value=header)
        c.font = HDR_FONT
        c.fill = HDR_FILL
        c.alignment = Alignment(vertical="center", wrap_text=True)
        c.border = BORDER
    ws.row_dimensions[2].height = 30

    fill_for = {
        "1 - Time-sensitive": FILL_URGENT,
        "2 - Open / rolling": FILL_OPEN,
        "3 - Calendar for next cycle": FILL_CAL,
        "4 - Low priority": FILL_LOW,
    }

    for i, row in enumerate(ROWS, start=3):
        band = fill_for[row[0]]
        for col, val in enumerate(row, start=1):
            c = ws.cell(row=i, column=col, value=val)
            c.font = BODY_FONT
            c.alignment = BODY_TOP
            c.border = BORDER
            if col == 1:
                c.fill = band
                c.font = Font(name=FONT, size=10, bold=True)
            if col == 4:
                c.fill = band
            if col == 14 and isinstance(val, str) and val.startswith("NEEDS VERIFICATION"):
                c.font = Font(name=FONT, size=10, bold=True, color="C00000")
        ws.row_dimensions[i].height = 96

    widths = [17, 34, 20, 20, 26, 20, 40, 44, 26, 26, 16, 40, 40, 30]
    for col, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(col)].width = w

    ws.freeze_panes = "B3"
    ws.auto_filter.ref = f"A2:{get_column_letter(len(HEADERS))}{2 + len(ROWS)}"

    # ---------- Sheet 2: how to use ----------
    ws2 = wb.create_sheet("How to Use + Method")

    def put(r, c, val, bold=False, size=10, color="000000", wrap=True):
        cell = ws2.cell(row=r, column=c, value=val)
        cell.font = Font(name=FONT, size=size, bold=bold, color=color)
        cell.alignment = Alignment(vertical="top", wrap_text=wrap)
        return cell

    put(1, 1, "How to use this tracker", bold=True, size=12, color="1F3864")

    put(3, 1, "Priority bands", bold=True)
    bands = [
        ("1 - Time-sensitive", "Deadline inside the next ~75 days. Act on these first.", "FCE4D6"),
        ("2 - Open / rolling", "No deadline or a distant one - you can apply whenever you are ready.", "E2EFDA"),
        ("3 - Calendar for next cycle", "Closed now, but recurring and worth a calendar reminder. Several of these are the best strategic fits on the list.", "FFF2CC"),
        ("4 - Low priority", "Closed, ineligible, or poor program fit. Documented so the same ground is not re-searched next quarter.", "F2F2F2"),
    ]
    r = 4
    for label, meaning, color in bands:
        c = put(r, 1, label, bold=True)
        c.fill = PatternFill("solid", fgColor=color)
        put(r, 2, meaning)
        r += 1

    r += 1
    put(r, 1, "Contact information policy", bold=True)
    r += 1
    put(r, 1, "\"not publicly listed\"")
    put(r, 2, "Means the email or phone was looked for and is genuinely not published on the funder's site or the official grant listing. No contact detail in this file was guessed or constructed - every address shown appears in a published source.")
    ws2.row_dimensions[r].height = 46
    r += 2

    put(r, 1, "Verification column", bold=True)
    r += 1
    put(r, 1, "\"confirmed\"")
    put(r, 2, "Amount, deadline and eligibility were consistent across the sources checked.")
    r += 1
    put(r, 1, "\"NEEDS VERIFICATION\"", bold=True)
    c = put(r, 2, "Sources conflicted or the funder's own page could not be reached. Confirm directly with the funder before investing proposal time. Read the IFC Agritech row carefully - fraudulent sites impersonating IFC grant programs are documented, so verify that call on ifc.org itself and never pay a fee to apply.")
    ws2.row_dimensions[r].height = 60
    r += 2

    put(r, 1, "Counts (as researched July 27, 2026)", bold=True)
    r += 1
    for label, crit in [
        ("Total opportunities tracked", None),
        ("Time-sensitive", "1 - Time-sensitive"),
        ("Open / rolling", "2 - Open / rolling"),
        ("Calendar for next cycle", "3 - Calendar for next cycle"),
        ("Low priority", "4 - Low priority"),
    ]:
        put(r, 1, label)
        n = len(ROWS) if crit is None else sum(1 for row in ROWS if row[0] == crit)
        cell = ws2.cell(row=r, column=2, value=n)
        cell.font = Font(name=FONT, size=10, bold=(crit is None))
        r += 1

    r += 1
    put(r, 1, "What the research found", bold=True)
    r += 1
    notes = [
        "The U.S. federal pipeline for Africa development work is unusually thin right now. The open federal calls found are either geographically mismatched (DRL Track 2.0 targets Armenia/Azerbaijan, Cambodia/Thailand, DRC/Rwanda) or far above current scale (USDA Food for Progress at $28-35M per award, with Ghana off the FY2026 priority list).",
        "The realistic government money for Give to Africa is embassy-level and partner-fronted: the U.S. Embassy Accra Self-Help and Public Diplomacy programs, USADF, and Canada's CFLI. Three of those four require a Ghana-registered applicant, which makes MDF Ghana the applicant of record and Give to Africa the technical and compliance partner. That structure is worth formalizing before the next cycle opens.",
        "The strongest geographic match found is the UNDP/GEF Small Grants Programme Ghana, whose 2026 priority districts (Wa-West, Bole, Sawla-Tuna-Kalba, Central Gonja) are the same northern Ghana shea belt the MDF Ghana partnership already operates in. It closed in March; the 2027 window is the one to prepare for.",
        "Canada's CFLI Ghana is the notable exception on eligibility - it explicitly accepts international NGOs working on local development, so Give to Africa can apply as itself rather than through a partner.",
        "On the non-government side, the Global Fund for Community Foundations is the single best mission match found and it takes concept notes at any time - a small award, but it funds precisely the community-philanthropy infrastructure YENDAA and the fiscal sponsorship program represent.",
    ]
    for n in notes:
        put(r, 1, "-")
        put(r, 2, n)
        ws2.row_dimensions[r].height = 62
        r += 1

    r += 1
    put(r, 1, "Not yet searched - candidates for the next round", bold=True)
    r += 1
    for n in [
        "African diaspora giving circles and diaspora-led funds",
        "Corporate CSR in shea, cocoa and cotton supply chains (buyers sourcing from northern Ghana)",
        "Mobile-money and fintech corporate giving programs with Ghana operations - the closest commercial analogue to YENDAA",
        "UK, Nordic and German bilateral funds (FCDO, Sida, Norad, GIZ) - GIZ already funds shea-sector work in Ghana through the Global Shea Alliance",
        "Faith-based donor-advised funds and National Christian Foundation cause pages",
    ]:
        put(r, 1, "-")
        put(r, 2, n)
        r += 1

    ws2.column_dimensions["A"].width = 30
    ws2.column_dimensions["B"].width = 108

    wb.save(OUT)
    print(f"wrote {OUT} with {len(ROWS)} opportunities")


if __name__ == "__main__":
    build()
