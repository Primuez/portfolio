// @ts-nocheck
/**
 * Shared Contact & CRM Lead Processing Engine
 * Zero-dependency ES Module for Vercel Serverless, Cloudflare Workers, and Vite Dev Middleware.
 */

const DEFAULT_TG_TOKEN = '8949248305:AAHE9e6k42tIAz3VqkKEcqa4iZ-2ynrC0bk';
const DEFAULT_TG_CHAT_ID = "5770087778";
const DEFAULT_ZEPTO_KEY = "Zoho-enczapikey PHtE6r1cEOu5gm4soUIBt6fqQMLwNYMm+elmKAVCs4xFDfAHHU1drdEpljOwrh58VfZFHfadno5u4rPP5++CLWruY29ND2qyqK3sx/VYSPOZsbq6x00Ys1kTf0fUUYTrc9Ro0CXXv9bZNA==";
const ZEPTO_API_URL = "https://api.zeptomail.in/v1.1/email";

export function escapeMarkdown(text) {
  if (!text) return "";
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

export function qualifyLead({ budgetRange, projectDescription, serviceType }) {
  const desc = (projectDescription || "").toLowerCase();
  const budget = (budgetRange || "").toLowerCase();

  let score = 50;
  let tier = "WARM";

  // Budget signals
  if (
    budget.includes("50k") ||
    budget.includes("600") ||
    budget.includes("20k") ||
    budget.includes("250") ||
    budget.includes("retainer") ||
    budget.includes("fractional")
  ) {
    score += 35;
  } else if (budget.includes("micro") || budget.includes("< ₹5k") || budget.includes("< $60")) {
    score -= 25;
  }

  // Urgency & high-intent keywords
  if (/(urgent|asap|immediately|turant|ready to pay|hire|invoice|this week|start now|emergency)/i.test(desc)) {
    score += 20;
  }

  // Technical stack depth
  if (/(n8n|agent|swarm|webhook|api|langgraph|hermes|composio|voice|automation|database|pipeline|fal\.ai|suno|docker|vps)/i.test(desc)) {
    score += 15;
  }

  // Low-intent / freebie signals
  if (/(free trial|cheap|student project|college assignment|seekhna hai|homework)/i.test(desc)) {
    score -= 30;
  }

  if (score >= 70) {
    tier = "HOT";
  } else if (score < 40) {
    tier = "COLD";
  } else {
    tier = "WARM";
  }

  return { tier, score: Math.max(10, Math.min(100, score)) };
}

export function renderWelcomeEmail({ fullName, serviceType, budgetRange }) {
  const rawTpl = '<!DOCTYPE html>\n<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta http-equiv="X-UA-Compatible" content="IE=edge">\n  <meta name="x-apple-disable-message-reformatting">\n  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">\n  <meta name="color-scheme" content="dark">\n  <meta name="supported-color-schemes" content="dark light">\n  <title>Inquiry Received - @Primuez</title>\n  <!--[if mso]>\n  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>\n  <style>\n    table, td, div, h1, h2, h3, h4, p, a, span { font-family: Arial, Helvetica, sans-serif !important; }\n  </style>\n  <![endif]-->\n  <style>\n    html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #08090d; }\n    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }\n    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }\n    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }\n    a { text-decoration: none; }\n    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }\n    u + #body a { color: inherit; text-decoration: none; }\n\n    @media only screen and (max-width: 620px) {\n      .container { width: 100% !important; }\n      .px { padding-left: 20px !important; padding-right: 20px !important; }\n      .h1 { font-size: 24px !important; line-height: 30px !important; }\n      .stack { display: block !important; width: 100% !important; }\n      .stack-gap { padding-bottom: 12px !important; }\n      .btn a { display: block !important; }\n      .hide-mobile { display: none !important; }\n    }\n  </style>\n</head>\n\n<body id="body" style="margin:0; padding:0; background-color:#08090d; font-family:-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color:#e2e8f0;">\n\n  <!-- Hidden preheader (inbox preview text) -->\n  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">\n    Your request for {{ $(\'On form submission\').item.json.serviceType }} is in priority review. Skip the queue by booking a quick call.\n    &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;\n  </div>\n\n  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#08090d" style="background-color:#08090d;">\n    <tr>\n      <td align="center" style="padding:32px 12px;">\n\n        <!--[if mso]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="600"><tr><td><![endif]-->\n\n        <!-- MAIN CONTAINER -->\n        <table role="presentation" class="container" border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#0e1117" style="width:600px; max-width:600px; background-color:#0e1117; border:1px solid #1e293b; border-radius:16px;">\n\n          <!-- TOP ACCENT BAR -->\n          <tr>\n            <td height="4" bgcolor="#3b82f6" style="height:4px; line-height:4px; font-size:0; background-color:#3b82f6; border-radius:16px 16px 0 0;">&nbsp;</td>\n          </tr>\n\n          <!-- BRAND ROW -->\n          <tr>\n            <td class="px" style="padding:28px 40px 0 40px;" align="center">\n              <span style="font-size:15px; font-weight:800; letter-spacing:2px; color:#ffffff; text-transform:uppercase;">@Primuez</span>\n            </td>\n          </tr>\n\n          <!-- HERO -->\n          <tr>\n            <td class="px" align="center" style="padding:20px 40px 8px 40px;">\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">\n                <tr>\n                  <td align="center" bgcolor="#14213d" style="background-color:#14213d; border:1px solid #2b4a85; border-radius:999px; padding:7px 16px; font-size:11px; font-weight:700; color:#60a5fa; letter-spacing:1px; text-transform:uppercase;">\n                    &#9889; Fast Lane &nbsp;&bull;&nbsp; Priority Review\n                  </td>\n                </tr>\n              </table>\n\n              <h1 class="h1" style="margin:22px 0 10px 0; font-size:28px; line-height:34px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">\n                Inquiry Received Successfully\n              </h1>\n              <p style="margin:0; font-size:15px; line-height:24px; color:#94a3b8;">\n                Thanks <strong style="color:#ffffff;">{{ $(\'On form submission\').item.json.FullName }}</strong> &#10024; &mdash; your request is officially in review. Let&rsquo;s build something exceptional.\n              </p>\n            </td>\n          </tr>\n\n          <!-- SERVICE CARD -->\n          <tr>\n            <td class="px" style="padding:24px 40px 8px 40px;">\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#151d2e" style="background-color:#151d2e; border:1px solid #334155; border-left:4px solid #3b82f6; border-radius:12px;">\n                <tr>\n                  <td style="padding:22px 24px;">\n                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.2px; color:#60a5fa; font-weight:700; padding-bottom:6px;">Requested Architecture</div>\n                    <div style="font-size:19px; line-height:26px; font-weight:700; color:#ffffff; padding-bottom:14px;">\n                      {{ $(\'On form submission\').item.json.serviceType }}\n                    </div>\n\n                    <!-- Mini details -->\n                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #2a3750;">\n                      <tr>\n                        <td class="stack stack-gap" width="50%" valign="top" style="padding:14px 8px 0 0;">\n                          <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:700; padding-bottom:3px;">Name</div>\n                          <div style="font-size:14px; color:#e2e8f0; font-weight:600;">{{ $(\'On form submission\').item.json.FullName }}</div>\n                        </td>\n                        <td class="stack" width="50%" valign="top" style="padding:14px 0 0 8px;">\n                          <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:700; padding-bottom:3px;">Budget Range</div>\n                          <div style="font-size:14px; color:#e2e8f0; font-weight:600;">{{ $(\'On form submission\').item.json.budgetRange }}</div>\n                        </td>\n                      </tr>\n                    </table>\n\n                    <p style="margin:16px 0 0 0; font-size:14px; line-height:23px; color:#cbd5e1;">\n                      I&rsquo;m currently reviewing the scope, requirements, and the best possible execution path so this is built properly from day one.\n                    </p>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- WHAT HAPPENS NEXT -->\n          <tr>\n            <td class="px" style="padding:24px 40px 8px 40px;">\n              <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.2px; font-weight:700; color:#60a5fa; padding-bottom:12px;">What happens next</div>\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">\n                <tr>\n                  <td width="32" valign="top" style="padding-bottom:12px;">\n                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="24" height="24" align="center" bgcolor="#1e3a6e" style="width:24px; height:24px; background-color:#1e3a6e; border-radius:12px; font-size:12px; font-weight:700; color:#93c5fd; line-height:24px;">1</td></tr></table>\n                  </td>\n                  <td valign="top" style="padding-bottom:12px; font-size:14px; line-height:22px; color:#cbd5e1;"><strong style="color:#ffffff;">Scope review</strong> &mdash; I go through your requirements and constraints.</td>\n                </tr>\n                <tr>\n                  <td width="32" valign="top" style="padding-bottom:12px;">\n                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="24" height="24" align="center" bgcolor="#1e3a6e" style="width:24px; height:24px; background-color:#1e3a6e; border-radius:12px; font-size:12px; font-weight:700; color:#93c5fd; line-height:24px;">2</td></tr></table>\n                  </td>\n                  <td valign="top" style="padding-bottom:12px; font-size:14px; line-height:22px; color:#cbd5e1;"><strong style="color:#ffffff;">Personal reply</strong> &mdash; you get a tailored response with next steps.</td>\n                </tr>\n                <tr>\n                  <td width="32" valign="top">\n                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td width="24" height="24" align="center" bgcolor="#1e3a6e" style="width:24px; height:24px; background-color:#1e3a6e; border-radius:12px; font-size:12px; font-weight:700; color:#93c5fd; line-height:24px;">3</td></tr></table>\n                  </td>\n                  <td valign="top" style="font-size:14px; line-height:22px; color:#cbd5e1;"><strong style="color:#ffffff;">Kickoff</strong> &mdash; we align on the plan and start building.</td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- EXPERTISE TAGS -->\n          <tr>\n            <td class="px" align="center" style="padding:20px 40px 8px 40px; font-size:0; line-height:0;">\n              <span style="display:inline-block; margin:3px; background-color:#1a2333; color:#a5b4c8; font-size:11px; line-height:14px; font-weight:600; padding:6px 11px; border-radius:6px; border:1px solid #334155;">AI Automation</span>\n              <span style="display:inline-block; margin:3px; background-color:#1a2333; color:#a5b4c8; font-size:11px; line-height:14px; font-weight:600; padding:6px 11px; border-radius:6px; border:1px solid #334155;">n8n Systems</span>\n              <span style="display:inline-block; margin:3px; background-color:#1a2333; color:#a5b4c8; font-size:11px; line-height:14px; font-weight:600; padding:6px 11px; border-radius:6px; border:1px solid #334155;">Workflow Architecture</span>\n              <span style="display:inline-block; margin:3px; background-color:#1a2333; color:#a5b4c8; font-size:11px; line-height:14px; font-weight:600; padding:6px 11px; border-radius:6px; border:1px solid #334155;">AI Agents</span>\n              <span style="display:inline-block; margin:3px; background-color:#1a2333; color:#a5b4c8; font-size:11px; line-height:14px; font-weight:600; padding:6px 11px; border-radius:6px; border:1px solid #334155;">Scalable Infrastructure</span>\n            </td>\n          </tr>\n\n          <!-- SKIP THE QUEUE -->\n          <tr>\n            <td class="px" style="padding:20px 40px 32px 40px;">\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#131a26" style="background-color:#131a26; border:1px solid #27406e; border-radius:12px;">\n                <tr>\n                  <td align="center" style="padding:28px 24px;">\n                    <h3 style="margin:0 0 8px 0; font-size:19px; line-height:26px; font-weight:800; color:#ffffff;">&#9889; Skip The Queue</h3>\n                    <p style="margin:0 0 22px 0; font-size:14px; line-height:22px; color:#94a3b8;">\n                      Want to move faster? Jump straight into a planning session instead of waiting on an email chain.\n                    </p>\n\n                    <!-- Bulletproof primary button -->\n                    <table role="presentation" class="btn" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">\n                      <tr>\n                        <td align="center" bgcolor="#3b82f6" style="border-radius:10px; background-color:#3b82f6;">\n                          <!--[if mso]>\n                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://cal.com/prime-s/30min" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="20%" stroke="f" fillcolor="#3b82f6">\n                            <w:anchorlock/>\n                            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">&#128197; 30-min Scope Call</center>\n                          </v:roundrect>\n                          <![endif]-->\n                          <!--[if !mso]><!-- -->\n                          <a href="https://cal.com/prime-s/30min" target="_blank" style="display:inline-block; padding:14px 34px; font-size:15px; line-height:20px; font-weight:700; color:#ffffff; background-color:#3b82f6; border-radius:10px; text-decoration:none;">\n                            &#128197; 30-min Scope Call\n                          </a>\n                          <!--<![endif]-->\n                        </td>\n                      </tr>\n                    </table>\n\n                    <!-- Secondary link -->\n                    <p style="margin:16px 0 0 0; font-size:13px; line-height:20px;">\n                      <a href="https://cal.com/prime-s/15min" target="_blank" style="color:#60a5fa; font-weight:600; text-decoration:underline;">&#9749; Prefer a quick chat? Book 15 min</a>\n                    </p>\n\n                    <!-- Direct contact -->\n                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px; border-top:1px solid #243049;">\n                      <tr>\n                        <td align="center" style="padding-top:18px; font-size:13px; line-height:24px; color:#94a3b8;">\n                          Or connect directly<br>\n                          <a href="tel:+917024637099" style="color:#ffffff; font-weight:700; text-decoration:underline;">+91 70246 37099</a>\n                          &nbsp;<span style="color:#475569;">&bull;</span>&nbsp;\n                          <a href="https://wa.me/917024637099" target="_blank" style="color:#34d399; font-weight:700; text-decoration:none;">&#128172; WhatsApp</a>\n                        </td>\n                      </tr>\n                    </table>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- BUILT BY @PRIMUEZ -->\n          <tr>\n            <td class="px" style="padding:28px 40px 8px 40px; border-top:1px solid #1e293b;">\n              <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.2px; font-weight:700; color:#60a5fa;">Built By @Primuez</div>\n              <h4 style="margin:6px 0 6px 0; font-size:17px; line-height:24px; font-weight:700; color:#ffffff;">AI Systems, SaaS Products &amp; Automation Infrastructure</h4>\n              <p style="margin:0 0 16px 0; font-size:13px; line-height:20px; color:#94a3b8;">\n                Beyond client projects, I build AI systems, scalable SaaS products, workflow automation infrastructure, and production-grade backend ecosystems.\n              </p>\n            </td>\n          </tr>\n\n          <!-- Portfolio card -->\n          <tr>\n            <td class="px" style="padding:0 40px 10px 40px;">\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0b0f17" style="background-color:#0b0f17; border:1px solid #1e293b; border-left:3px solid #3b82f6; border-radius:8px;">\n                <tr>\n                  <td style="padding:14px 18px;">\n                    <div style="font-size:10px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:1px;">Portfolio</div>\n                    <a href="https://primuez.in" target="_blank" style="font-size:15px; line-height:24px; font-weight:700; color:#ffffff; text-decoration:none;">primuez.in &rarr;</a>\n                    <div style="font-size:12px; line-height:18px; color:#94a3b8; padding-top:2px;">AI workflows, n8n automation systems, APIs, AI agents, and scalable backend execution.</div>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- PrimuezSure card -->\n          <tr>\n            <td class="px" style="padding:0 40px 10px 40px;">\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0b0f17" style="background-color:#0b0f17; border:1px solid #1e293b; border-left:3px solid #8b5cf6; border-radius:8px;">\n                <tr>\n                  <td style="padding:14px 18px;">\n                    <div style="font-size:10px; font-weight:700; color:#8b5cf6; text-transform:uppercase; letter-spacing:1px;">SaaS Product</div>\n                    <a href="https://primuezsure.primuez.in" target="_blank" style="font-size:15px; line-height:24px; font-weight:700; color:#ffffff; text-decoration:none;">PrimuezSure &rarr;</a>\n                    <div style="font-size:12px; line-height:18px; color:#94a3b8; padding-top:2px;">AI-powered workflow automation and scalable infrastructure systems.</div>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- InkTwin card -->\n          <tr>\n            <td class="px" style="padding:0 40px 10px 40px;">\n              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0b0f17" style="background-color:#0b0f17; border:1px solid #1e293b; border-left:3px solid #10b981; border-radius:8px;">\n                <tr>\n                  <td style="padding:14px 18px;">\n                    <div style="font-size:10px; font-weight:700; color:#10b981; text-transform:uppercase; letter-spacing:1px;">SaaS Product</div>\n                    <a href="https://inktwin.primuez.in" target="_blank" style="font-size:15px; line-height:24px; font-weight:700; color:#ffffff; text-decoration:none;">InkTwin &rarr;</a>\n                    <div style="font-size:12px; line-height:18px; color:#94a3b8; padding-top:2px;">Intelligent AI-assisted creative tooling and content workflow systems.</div>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n\n          <!-- Resume link -->\n          <tr>\n            <td class="px" align="right" style="padding:6px 40px 28px 40px;">\n              <a href="https://primuez.in/documents/resume.pdf" target="_blank" style="font-size:12px; color:#7c8ba1; text-decoration:underline;">&#128196; Engineering Credentials &amp; Verified Architecture Record (PDF)</a>\n            </td>\n          </tr>\n\n          <!-- WHILE YOU WAIT -->\n          <tr>\n            <td class="px" align="center" bgcolor="#0b0f17" style="padding:24px 40px; background-color:#0b0f17; border-top:1px solid #1e293b;">\n              <p style="margin:0 0 10px 0; font-size:13px; line-height:21px; color:#94a3b8;">\n                &#128293; <strong style="color:#e2e8f0;">While you wait&hellip;</strong> explore advanced n8n workflows, AI automation systems, and real-world agent architecture tutorials on the channel.\n              </p>\n              <a href="https://youtube.com/@primuez" target="_blank" style="font-size:13px; font-weight:700; color:#ef4444; text-decoration:none;">&#9654; Watch Latest Videos &rarr;</a>\n            </td>\n          </tr>\n\n          <!-- FOOTER -->\n          <tr>\n            <td class="px" align="center" bgcolor="#08090d" style="padding:26px 40px 28px 40px; background-color:#08090d; border-top:1px solid #1e293b; border-radius:0 0 16px 16px;">\n              <p style="margin:0 0 4px 0; font-size:14px; font-weight:700; color:#ffffff;">@Primuez</p>\n              <p style="margin:0 0 12px 0; font-size:12px; line-height:18px; color:#64748b;">AI Automation Architect &bull; n8n Systems Builder &bull; Workflow Infrastructure</p>\n              <p style="margin:0; font-size:11px; line-height:18px; color:#64748b;">\n                <a href="tel:+917024637099" style="color:#7c8ba1; text-decoration:underline;">+91 70246 37099</a>\n                &nbsp;|&nbsp;\n                <a href="https://primuez.in" style="color:#7c8ba1; text-decoration:underline;">primuez.in</a>\n                &nbsp;|&nbsp;\n                <a href="https://primuezsure.primuez.in" style="color:#7c8ba1; text-decoration:underline;">PrimuezSure</a>\n                &nbsp;&bull;&nbsp;\n                <a href="https://inktwin.primuez.in" style="color:#7c8ba1; text-decoration:underline;">InkTwin</a>\n              </p>\n            </td>\n          </tr>\n\n        </table>\n        <!-- /MAIN CONTAINER -->\n\n        <!--[if mso]></td></tr></table><![endif]-->\n\n      </td>\n    </tr>\n  </table>\n\n</body>\n</html>';
  return rawTpl
    .replaceAll("{{\ \$(\x27On form submission\x27).item.json.FullName\ }}", fullName || "there")
    .replaceAll("{{\ \$(\x27On form submission\x27).item.json.serviceType\ }}", serviceType || "AI Automation & Systems Architecture")
    .replaceAll("{{\ \$(\x27On form submission\x27).item.json.budgetRange\ }}", budgetRange || "Selected Tier");
}

export async function sendTelegramLeadAlert(lead, qualification, env = {}) {
  const token = env.TELEGRAM_BOT_TOKEN || (typeof process !== "undefined" && process.env?.TELEGRAM_BOT_TOKEN) || DEFAULT_TG_TOKEN;
  const chatId = env.TELEGRAM_HOME_CHANNEL || (typeof process !== "undefined" && process.env?.TELEGRAM_HOME_CHANNEL) || DEFAULT_TG_CHAT_ID;

  const rawPhone = String(lead.phone || "").trim();
  const cleanPhone = rawPhone.replace(/[^\d+]/g, "").replace(/^91(?=\d{10})/, "+91");
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace("+", "")}` : "";

  let tierHeader = "⚡ ⚠️ *WARM LEAD*";
  if (qualification.tier === "HOT") {
    tierHeader = "🚨 🔥 *HOT LEAD! CALL NOW*";
  } else if (qualification.tier === "COLD") {
    tierHeader = "❄️ *COLD LEAD (Nurture)*";
  }

  const lines = [
    `${tierHeader} (Score: ${qualification.score}/100)`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${escapeMarkdown(lead.fullName || "Anonymous")}`,
    `📧 *Email:* [${lead.email}](mailto:${lead.email})`,
    `📱 *WhatsApp:* [${lead.phone}](${waLink})`,
    `💬 *Preferred Contact:* ${escapeMarkdown(lead.contactMethod || "WhatsApp")}`,
    `🌐 *Timezone:* ${escapeMarkdown(lead.timeZone || "IST")}`,
    ``,
    `💼 *Service:* ${escapeMarkdown(lead.serviceType || "Custom AI Architecture")}`,
    `💰 *Budget Range:* ${escapeMarkdown(lead.budgetRange || "₹5k-₹20k")}`,
    `⏳ *Timeline:* ${escapeMarkdown(lead.deadline || "Flexible")}`,
    `🔑 *Has API Keys:* ${escapeMarkdown(lead.apiKeys || "Yes")}`,
    `📍 *Found Via:* ${escapeMarkdown(lead.source || "@Primuez video")}`,
    lead.company ? `🏢 *Company / Web:* ${escapeMarkdown(lead.company)}` : null,
    lead.formSource ? `🔖 *Form Source:* ${escapeMarkdown(lead.formSource)}` : null,
    ``,
    `📝 *Project Brief:*`,
    `> ${escapeMarkdown(lead.projectDescription || "No additional description provided.")}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `⚡ *One-Tap Quick Actions:*`,
    waLink ? `• [Chat on WhatsApp](${waLink})` : null,
    `• [Email Lead](mailto:${lead.email}?subject=Re:%20Project%20Scope%20Discussion%20-%20Primuez)`,
    `• CRM Sheet: [Open CRM](https://docs.google.com/spreadsheets/d/1xkur1wJ07bkzbQFGQRaV_K7pkEW1NtWenGLAlfTTQdw/edit)`
  ].filter(Boolean);

  const payload = {
    chat_id: chatId,
    text: lines.join("\n"),
    parse_mode: "Markdown",
    disable_web_page_preview: true
  };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

export async function sendWelcomeEmailOutbound(lead, env = {}) {
  const zeptoKey = env.ZEPTO_API_KEY || (typeof process !== "undefined" && process.env?.ZEPTO_API_KEY) || DEFAULT_ZEPTO_KEY;

  const htmlBody = renderWelcomeEmail({
    fullName: lead.fullName,
    serviceType: lead.serviceType,
    budgetRange: lead.budgetRange,
    projectDescription: lead.projectDescription
  });

  const payload = {
    from: {
      address: "contact@primuez.in",
      name: "Rahul Kasturiya | Primuez"
    },
    to: [
      {
        email_address: {
          address: lead.email,
          name: lead.fullName || "Valued Client"
        }
      }
    ],
    reply_to: [
      {
        address: "primuez5@gmail.com",
        name: "Rahul Kasturiya"
      }
    ],
    subject: `Hi ${lead.fullName || ""} — Inquiry Received [Priority Queue]`,
    htmlbody: htmlBody
  };

  const res = await fetch(ZEPTO_API_URL, {
    method: "POST",
    headers: {
      "Authorization": zeptoKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

export async function processContactSubmission(formData, env = {}) {
  const {
    fullName,
    email,
    phone,
    contactMethod = "WhatsApp",
    timeZone = "IST",
    serviceType = "n8n workflow build",
    budgetRange = "₹5k – ₹20k / $60 – $250",
    projectDescription = "",
    deadline = "Flexible",
    apiKeys = "Yes",
    source = "@Primuez video",
    company = "",
    formSource = "portfolio-primuez.in"
  } = formData || {};

  if (!fullName || !email || !projectDescription) {
    return {
      success: false,
      error: "Missing required fields: fullName, email, and projectDescription are required."
    };
  }

  const lead = {
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone || "").trim(),
    contactMethod,
    timeZone,
    serviceType,
    budgetRange,
    projectDescription: String(projectDescription).trim(),
    deadline,
    apiKeys,
    source,
    company: String(company || "").trim(),
    formSource
  };

  const qualification = qualifyLead(lead);

  // Parallel delivery: Telegram alert + ZeptoMail welcome email
  const [tgResult, emailResult] = await Promise.allSettled([
    sendTelegramLeadAlert(lead, qualification, env),
    sendWelcomeEmailOutbound(lead, env)
  ]);

  const telegramSuccess = tgResult.status === "fulfilled" && tgResult.value?.ok;
  const emailSuccess = emailResult.status === "fulfilled" && (emailResult.value?.message === "OK" || emailResult.value?.data);

  return {
    success: true,
    qualification,
    delivery: {
      telegram: telegramSuccess,
      telegramRaw: tgResult.status === "fulfilled" ? tgResult.value : tgResult.reason,
      email: emailSuccess,
      emailRaw: emailResult.status === "fulfilled" ? emailResult.value : emailResult.reason
    }
  };
}
