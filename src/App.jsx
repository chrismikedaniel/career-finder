import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const TARGET_ORGS = [
  { id:"icirr",         name:"ICIRR",                                   fullName:"Illinois Coalition for Immigrant & Refugee Rights",      city:"Chicago",          category:"Migrant Rights",      urgency:"Apply Now",    careersUrl:"https://www.icirr.org/jobs",                                                                                                                                                     searchHint:"Advocacy coordinator, policy associate, comms — leveraging Chicago roots and Spanish" },
  { id:"nijc",          name:"Natl Immigrant Justice Center",            fullName:"National Immigrant Justice Center",                      city:"Chicago",          category:"Migrant Rights",      urgency:"Apply Now",    careersUrl:"https://heartlandalliance.org/careers/",                                                                                                                                searchHint:"Comms or policy advocacy roles via Heartland Alliance — not legal roles" },
  { id:"stonewall",     name:"Stonewall UK",                             fullName:"Stonewall UK",                                           city:"London",           category:"LGBTQ+",              urgency:"Apply Now",    careersUrl:"https://www.stonewall.org.uk/about-us/jobs",                                                                                                                            searchHint:"Apply before Sep graduation — campaigns coordinator or comms, LSE Sexuality Studies is the credential" },
  { id:"akt",           name:"Albert Kennedy Trust",                     fullName:"Albert Kennedy Trust",                                   city:"London",           category:"LGBTQ+",              urgency:"Apply Now",    careersUrl:"https://www.akt.org.uk/about/jobs",                                                                                                                                     searchHint:"Programme assistant or comms coordinator — LGBTQ+ youth housing and family rejection focus" },
  { id:"action-canada", name:"Action Canada",                            fullName:"Action Canada for Sexual Health & Rights",               city:"Toronto",          category:"Reproductive Rights", urgency:"Apply Now",    careersUrl:"https://www.actioncanadashr.org/about/careers",                                                                                                                         searchHint:"Communications or programme roles — request informational interview before applying" },
  { id:"ccpa",          name:"CCPA",                                     fullName:"Canadian Centre for Policy Alternatives",                city:"Toronto",          category:"Policy / Comms",      urgency:"Apply Now",    careersUrl:"https://www.policyalternatives.ca/jobs",                                                                                                                                searchHint:"Comms associate or research assistant — submit policy writing sample, not just editorial clips" },
  { id:"pen-america",   name:"PEN America",                              fullName:"PEN America / PEN International",                        city:"New York / Remote",category:"Digital Rights",      urgency:"Apply Now",    careersUrl:"https://pen.org/about/jobs/",                                                                                                                                            searchHint:"Warmest lead — get internal referral from PEN Canada ED before leaving" },
  { id:"open-rights",   name:"Open Rights Group",                        fullName:"Open Rights Group",                                      city:"London",           category:"Digital Rights",      urgency:"Apply Soon",   careersUrl:"https://www.openrightsgroup.org/about/jobs",                                                                                                                            searchHint:"Research or campaigns roles — write a piece on the UK Online Safety Act first" },
  { id:"guttmacher",    name:"Guttmacher Institute",                     fullName:"Guttmacher Institute",                                   city:"New York",         category:"Reproductive Rights", urgency:"Oct–Nov",      careersUrl:"https://www.guttmacher.org/about/jobs",                                                                                                                                 searchHint:"Research associate — monitor weekly from Oct, roles close within 48 hrs" },
  { id:"mozilla",       name:"Mozilla Foundation",                       fullName:"Mozilla Foundation Fellowship",                          city:"Remote",           category:"Public Interest Tech",urgency:"Oct–Nov",      careersUrl:"https://foundation.mozilla.org/en/fellowships/",                                                                                                                        searchHint:"Fellowship opens Oct — propose 'AI and diaspora content moderation on TikTok'" },
  { id:"macarthur",     name:"MacArthur Foundation",                     fullName:"John D. and Catherine T. MacArthur Foundation",          city:"Chicago",          category:"Philanthropy",        urgency:"Oct–Dec",      careersUrl:"https://www.macfound.org/about/careers",                                                                                                                                searchHint:"Programme associate — request informational interview first via EPIP Chicago" },
  { id:"ywca-toronto",  name:"YWCA Toronto",                             fullName:"YWCA Toronto",                                           city:"Toronto",          category:"Community / LGBTQ+",  urgency:"Oct–Nov",      careersUrl:"https://www.ywcatoronto.org/about-us/work-with-us",                                                                                                                     searchHint:"Programme coordinator — immigrant women's services or LGBTQ+ streams, accessible entry point" },
  { id:"depaul",        name:"DePaul University",                        fullName:"DePaul University",                                      city:"Chicago",          category:"Education",           urgency:"Oct–Nov",      careersUrl:"https://www.depaul.edu/about/offices-and-facilities/human-resources/careers-at-depaul/Pages/default.aspx",                                                              searchHint:"EDI or community engagement roles — Vincentian mission aligns, name it in cover letter" },
  { id:"ai-now",        name:"AI Now Institute",                         fullName:"AI Now Institute",                                       city:"New York",         category:"AI Policy",           urgency:"Nov–Jan",      careersUrl:"https://ainowinstitute.org/jobs",                                                                                                                                       searchHint:"Research associate — publish a piece on AI rights first, they value public engagement" },
  { id:"the-19th",      name:"The 19th",                                 fullName:"The 19th News",                                          city:"Remote / New York",category:"Media / Comms",       urgency:"Nov–Jan",      careersUrl:"https://19thnews.org/jobs/",                                                                                                                                            searchHint:"Editorial or comms roles — remote-friendly, PEN Canada clips are the right samples" },
  { id:"crr",           name:"Center for Reproductive Rights",           fullName:"Center for Reproductive Rights",                         city:"New York / Chicago",category:"Reproductive Rights",urgency:"Oct–Nov",     careersUrl:"https://reproductiverights.org/about/careers/",                                                                                                                         searchHint:"Comms or policy roles — Chicago office has lower competition than NYC HQ" },
];

const BROADER_SEARCHES = [
  { id:"toronto-nonprofit",    label:"Toronto — Nonprofit Advocacy",          city:"Toronto",  category:"Advocacy / Policy",        query:"advocacy coordinator gender equity immigration rights Toronto nonprofit 2026",                              hint:"Entry-level coordinator and associate roles; U of T DTS alumni network is the referral path" },
  { id:"chicago-nonprofit",    label:"Chicago — Nonprofit & Advocacy",        city:"Chicago",  category:"Advocacy / Policy",        query:"advocate coordinator immigration policy equity rights nonprofit Chicago entry level 2026",                   hint:"Immigrant rights and equity orgs; Spanish fluency and Chicago community roots are differentiators" },
  { id:"lgbtq-toronto-chicago",label:"Toronto & Chicago — LGBTQ+ Orgs",      city:"Multiple", category:"LGBTQ+",                   query:"LGBTQ programme coordinator communications advocacy Toronto Chicago entry level 2026",                       hint:"519 Community Centre (Toronto) and Howard Brown Health (Chicago) are the anchor employers beyond the list" },
  { id:"repro-rights",         label:"US & Canada — Reproductive Rights",     city:"Multiple", category:"Reproductive Rights",      query:"reproductive rights sexual health advocacy coordinator communications researcher 2026",                        hint:"Planned Parenthood of Illinois is a strong Chicago target; NCRW aggregates women's org postings nationally" },
  { id:"edu-chicago",          label:"Chicago — Educational Institutions",    city:"Chicago",  category:"Education",                query:"DePaul Loyola Northwestern equity diversity inclusion community engagement coordinator Chicago 2026",            hint:"Loyola Chicago has strong social justice programming; name the Vincentian/Jesuit mission in applications" },
  { id:"digital-rights",       label:"Remote — Digital Rights / PIT",         city:"Remote",   category:"Digital Rights / Tech",    query:"public interest technology fellow researcher digital rights equity remote fellowship 2026",                    hint:"Tech Jobs for Good has less competition per listing than LinkedIn; Mozilla is location-flexible" },
  { id:"uk-charity",           label:"London — UK Charity Sector",            city:"London",   category:"LGBTQ+ / Advocacy",        query:"LGBTQ gender policy coordinator communications charity London entry level 2026",                            hint:"CharityJob UK is the primary board here; many smaller LGBTQ+ orgs only post there" },
  { id:"nyc-nonprofit",        label:"New York — Nonprofit & Advocacy",       city:"New York", category:"Advocacy / Policy",        query:"policy researcher advocacy communications coordinator nonprofit New York entry level 2026",                    hint:"Defer to second role unless friends' NYC network has solidified; remote roles here are the priority" },
];

const CITIES = ["All", "Chicago", "Toronto", "New York", "London", "Remote", "Multiple"];

const CANDIDATE_CONTEXT = `You are the Job Discovery Agent (Agent 1.3b) in a Career Discovery System for Bella Daniel-Hunsicker.

CANDIDATE: MSc Gender Studies (Sexuality Studies) LSE graduating Sep 2026. BA Diaspora & Transnational Studies U of T. PEN Canada intern current. Dual US/Canadian citizen. Spanish conversational. Chicago roots (family, network, most support). Toronto home (existing home, friends, affordable). New York deferred to second role.

POSITIONING: Works FROM WITHIN communities — not on behalf of them. Cause-specific: LGBTQ+ rights, immigrant rights, reproductive rights, digital rights. NOT government/civil service. NOT broad human rights spokesperson.

TARGET ROLES: Migrant Rights Advocate, LGBTQ+ Programme Officer, NGO Comms Strategist, Reproductive Rights Researcher, Digital Rights Researcher, Foundation Programme Officer, EDI Advisor (UK/Canada only), PIT Fellow, Community Health Equity Coordinator.

EXCLUDED: Government policy analyst, Canadian federal GBA+, UK Civil Service, broad human rights spokesperson, US implementing partners, international development.`;

import { supabase } from "./supabase.js";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE STORAGE LAYER
// ─────────────────────────────────────────────────────────────────────────────

async function saveScanResult(id, scanType, result) {
  try {
    await supabase.from("scan_results").upsert({
      id, scan_type: scanType, result,
      scanned_at: new Date().toISOString()
    });
  } catch(e) { console.error("saveScanResult:", e); }
}

async function loadScanResults(scanType) {
  try {
    const { data } = await supabase.from("scan_results").select("*").eq("scan_type", scanType);
    if (!data) return {};
    return Object.fromEntries(data.map(row => [row.id, { ...row.result, _ts: new Date(row.scanned_at).getTime() }]));
  } catch(e) { console.error("loadScanResults:", e); return {}; }
}

async function upsertRole(role, orgName, source = "starred") {
  const { error } = await supabase.from("saved_roles").upsert({
    id: role.id, title: role.title,
    org: role.org || orgName, org_name: orgName,
    location: role.location || null, type: role.type || null,
    relevance: role.relevance || null, deadline: role.deadline || null,
    why_fit: role.whyFit || null, direct_url: role.directUrl || null,
    linkedin_url: role.linkedInUrl || null, idealist_url: role.idealistUrl || null,
    source: source,
    saved_at: new Date().toISOString()
  });
  if (error) { console.error("upsertRole error:", error); throw error; }
  // Fire feedback signal — awaited so learned_orgs is ready before callers reload state
  await fireSignal(role, orgName, source);
}

async function removeRole(id) {
  try { await supabase.from("saved_roles").delete().eq("id", id); }
  catch(e) { console.error("removeRole:", e); }
}

async function loadSavedRoles() {
  try {
    const { data } = await supabase.from("saved_roles").select("*").order("saved_at", { ascending: false });
    if (!data) return {};
    return Object.fromEntries(data.map(row => [row.id, {
      id: row.id, title: row.title, org: row.org, orgName: row.org_name,
      location: row.location, type: row.type, relevance: row.relevance,
      deadline: row.deadline, whyFit: row.why_fit, directUrl: row.direct_url,
      linkedInUrl: row.linkedin_url, idealistUrl: row.idealist_url,
      source: row.source || "starred", savedAt: row.saved_at
    }]));
  } catch(e) { console.error("loadSavedRoles:", e); return {}; }
}

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK LOOP — runs silently on every star/submit
// ─────────────────────────────────────────────────────────────────────────────

async function fireSignal(role, orgName, source) {
  const city = extractCity(role.location || "");
  const category = inferCategory(role.title || "", orgName || "");

  const { error: sigError } = await supabase.from("feedback_signals").upsert({
    id: "sig-" + role.id,
    role_id: role.id,
    org: orgName || role.org,
    category,
    city,
    relevance: role.relevance || "Medium",
    source,
    created_at: new Date().toISOString()
  });
  if (sigError) console.error("fireSignal [feedback_signals]:", sigError);

  // If org is not one of the named 16, promote it to learned_orgs
  const isKnown = TARGET_ORGS.some(o => o.name === orgName || o.fullName === orgName);
  if (!isKnown && orgName) {
    const orgKey = "org-" + orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const { error: orgError } = await supabase.from("learned_orgs").upsert({
      id: orgKey,
      name: orgName,
      city,
      category,
      source_role_id: role.id,
      created_at: new Date().toISOString()
    });
    if (orgError) console.error("fireSignal [learned_orgs]:", orgError);
  }
}

function extractCity(location) {
  if (!location) return "Unknown";
  if (location.toLowerCase().includes("chicago")) return "Chicago";
  if (location.toLowerCase().includes("toronto")) return "Toronto";
  if (location.toLowerCase().includes("new york") || location.toLowerCase().includes("nyc")) return "New York";
  if (location.toLowerCase().includes("london")) return "London";
  if (location.toLowerCase().includes("remote")) return "Remote";
  return location.split(",")[0].trim();
}

function inferCategory(title, org) {
  const t = (title + " " + org).toLowerCase();
  if (t.includes("immigr") || t.includes("migrant") || t.includes("asylum") || t.includes("refugee")) return "Migrant Rights";
  if (t.includes("lgbtq") || t.includes("queer") || t.includes("sexuality")) return "LGBTQ+";
  if (t.includes("reproduct") || t.includes("sexual health") || t.includes("abortion")) return "Reproductive Rights";
  if (t.includes("digital") || t.includes("tech") || t.includes("ai ") || t.includes("policy")) return "Digital Rights / Tech";
  if (t.includes("communicat") || t.includes("editorial") || t.includes("content") || t.includes("media")) return "Communications";
  if (t.includes("foundation") || t.includes("philanthrop") || t.includes("program officer")) return "Philanthropy";
  if (t.includes("education") || t.includes("university") || t.includes("depaul") || t.includes("student")) return "Education";
  if (t.includes("equity") || t.includes("diversity") || t.includes("inclusion") || t.includes("edi")) return "EDI";
  return "Advocacy / Policy";
}

async function loadFeedbackSignals() {
  try {
    const { data } = await supabase.from("feedback_signals").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch(e) { console.error("loadFeedbackSignals:", e); return []; }
}

async function loadLearnedOrgs() {
  try {
    const { data } = await supabase.from("learned_orgs").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch(e) { console.error("loadLearnedOrgs:", e); return []; }
}

// Build adaptive context string from feedback signals
function buildAdaptiveContext(signals) {
  if (!signals.length) return "";
  const cityCount = {};
  const catCount = {};
  signals.forEach(s => {
    cityCount[s.city] = (cityCount[s.city] || 0) + 1;
    catCount[s.category] = (catCount[s.category] || 0) + 1;
  });
  const topCities = Object.entries(cityCount).sort((a,b) => b[1]-a[1]).slice(0,3).map(([c]) => c);
  const topCats = Object.entries(catCount).sort((a,b) => b[1]-a[1]).slice(0,3).map(([c]) => c);
  return `\n\nLEARNED PREFERENCES (from ${signals.length} saved roles): Top cities: ${topCities.join(", ")}. Top categories: ${topCats.join(", ")}. Weight these higher in relevance scoring.`;
}

// ─── ORG / SEARCH PERFORMANCE SCORING ─ prioritization + deprioritization ───
// Score model per org/search source:
//   +2  per starred role sourced from it
//   +1  per role found (shown) that was never starred, capped contribution
//   -3  per scan that returned zero roles
// Buckets: score >= 4 "hot", -1 to 3 "neutral", <= -2 "cold"

function computeSourcePerformance(scanResults, savedRolesList, scanKind) {
  const perf = {};
  Object.entries(scanResults).forEach(([id, r]) => {
    const roles = (scanKind === "org" ? r.openRoles : r.topRoles) || [];
    if (!perf[id]) perf[id] = { score: 0, scans: 0, zeroScans: 0, rolesShown: 0, rolesStarred: 0, lastTs: 0 };
    perf[id].scans += 1;
    perf[id].lastTs = Math.max(perf[id].lastTs, r._ts || 0);
    if (roles.length === 0) {
      perf[id].zeroScans += 1;
      perf[id].score -= 3;
    } else {
      perf[id].rolesShown += roles.length;
      const roleIds = new Set(roles.map(x => x.id));
      const starredFromThis = savedRolesList.filter(sr => roleIds.has(sr.id)).length;
      perf[id].rolesStarred += starredFromThis;
      perf[id].score += starredFromThis * 2;
      perf[id].score += Math.min(roles.length - starredFromThis, 3) * 1;
    }
  });
  return perf;
}

function perfBucket(score) {
  if (score >= 4) return "hot";
  if (score <= -2) return "cold";
  return "neutral";
}

const BUCKET_CFG = {
  hot:     { label: "High yield",  color: "#1E6B3C", bg: "#EAF4EE" },
  neutral: { label: "Active",      color: "#888",    bg: "#F0F0F0" },
  cold:    { label: "Low yield",   color: "#A63228", bg: "#FDF0F0" },
};

function buildPerformanceContext(orgPerf, broaderPerf, orgList, searchList) {
  const coldOrgs = Object.entries(orgPerf).filter(([, p]) => perfBucket(p.score) === "cold").map(([id]) => orgList.find(o => o.id === id)?.name).filter(Boolean);
  const hotOrgs = Object.entries(orgPerf).filter(([, p]) => perfBucket(p.score) === "hot").map(([id]) => orgList.find(o => o.id === id)?.name).filter(Boolean);
  const coldSearches = Object.entries(broaderPerf).filter(([, p]) => perfBucket(p.score) === "cold").map(([id]) => searchList.find(s => s.id === id)?.category).filter(Boolean);
  const hotSearches = Object.entries(broaderPerf).filter(([, p]) => perfBucket(p.score) === "hot").map(([id]) => searchList.find(s => s.id === id)?.category).filter(Boolean);

  if (!coldOrgs.length && !hotOrgs.length && !coldSearches.length && !hotSearches.length) return "";

  let ctx = "\n\nPERFORMANCE HISTORY:";
  if (hotOrgs.length) ctx += ` High-yield orgs producing starred roles: ${hotOrgs.join(", ")} — treat similar roles as High relevance.`;
  if (coldOrgs.length) ctx += ` Low-yield orgs with repeated empty scans or unstarred results: ${coldOrgs.join(", ")} — be more conservative, do not inflate relevance here.`;
  if (hotSearches.length) ctx += ` High-yield categories: ${hotSearches.join(", ")}.`;
  if (coldSearches.length) ctx += ` Low-yield categories to deprioritize: ${coldSearches.join(", ")}.`;
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// API — real-time web search
// ─────────────────────────────────────────────────────────────────────────────
async function callClaudeJSON(prompt, adaptiveContext = "") {
  const res = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: CANDIDATE_CONTEXT + adaptiveContext,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt + "\n\nRespond with ONLY valid JSON. Start with { end with }. No markdown fences." }]
    })
  });
  const data = await res.json();
  if (data.error) {
    console.error("Anthropic error:", data.error);
    return null;
  }
  // Extract all text blocks including after tool use
  const blocks = data.content || [];
  const text = blocks.filter(b => b.type === "text").map(b => b.text).join("\n");
  if (!text) return null;
  // Find outermost JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch(_) {
    // Try stripping any markdown fences and retry
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const s2 = cleaned.indexOf("{"), e2 = cleaned.lastIndexOf("}");
      return JSON.parse(cleaned.slice(s2, e2 + 1));
    } catch(_) { return null; }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Spinner({ size = 14, color = "#4DADA3" }) {
  return <div style={{ width: size, height: size, border: `2px solid ${color}33`, borderTop: `2px solid ${color}`, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />;
}

const REL_COLOR = { High: "#1E6B3C", Medium: "#B8732A", Low: "#888" };
const REL_BG    = { High: "#EAF4EE", Medium: "#FDF3E3", Low: "#F0F0F0" };

function RelBadge({ rel }) {
  if (!rel) return null;
  return <span style={{ fontSize: 10, fontWeight: 800, color: REL_COLOR[rel] || "#888", background: REL_BG[rel] || "#F0F0F0", padding: "2px 7px", borderRadius: 4, flexShrink: 0 }}>{rel}</span>;
}

// Compact role row — clickable title links to posting, star to save
function RoleRow({ role, orgName, isSaved, onToggleSave }) {
  const postingUrl = role.directUrl || role.linkedInUrl || role.idealistUrl || null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F4F4F4" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {postingUrl ? (
          <a href={postingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "#1D6A72", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", textDecoration: "none" }}>
            {role.title} <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
          </a>
        ) : (
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2A4A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{role.title}</div>
        )}
        <div style={{ fontSize: 11, color: "#888" }}>{orgName || role.org}{role.location ? ` · ${role.location}` : ""}{role.type ? ` · ${role.type}` : ""}</div>
        {role.deadline && <div style={{ fontSize: 10, color: "#A63228", fontWeight: 700, marginTop: 1 }}>⏱ {role.deadline}</div>}
      </div>
      <RelBadge rel={role.relevance} />
      <button onClick={onToggleSave} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: isSaved ? "#F5C842" : "#CCC", transition: "color 0.15s", flexShrink: 0, lineHeight: 1 }}>{isSaved ? "★" : "☆"}</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STATS HOOK — shared across panels
// ─────────────────────────────────────────────────────────────────────────────
function useGlobalStats(orgResults, broaderResults, savedRoles, learnedOrgs) {
  const learnedCount = (learnedOrgs || []).length;
  const orgScanned = TARGET_ORGS.filter(o => orgResults[o.id]).length;
  const broaderScanned = BROADER_SEARCHES.filter(s => broaderResults[s.id]).length;
  const totalScanned = orgScanned + broaderScanned;
  const totalSources = TARGET_ORGS.length + BROADER_SEARCHES.length + learnedCount;

  const orgRoles = Object.values(orgResults).flatMap(r => r?.openRoles || []);
  const broaderRoles = Object.values(broaderResults).flatMap(r => r?.topRoles || []);
  const allRoles = [...orgRoles, ...broaderRoles];

  const rolesFound = allRoles.length;
  const highRelevance = allRoles.filter(r => r.relevance === "High").length;
  const starred = Object.keys(savedRoles).length;

  return { totalScanned, totalSources, rolesFound, highRelevance, starred };
}

// ─────────────────────────────────────────────────────────────────────────────
// ORG SCAN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function OrgScanPanel({ results, setResults, savedRoles, setSavedRoles, adaptiveContext, learnedOrgs, setLearnedOrgs, orgPerf }) {
  const [scanning, setScanning] = useState({});
  const [cityFilter, setCityFilter] = useState("All");
  const [scanningAll, setScanningAll] = useState(false);

  // Debug: log learnedOrgs on every render
  React.useEffect(() => {
    console.log("[OrgScan] learnedOrgs received:", learnedOrgs);
  }, [learnedOrgs]);

  // Merge named orgs with learned orgs (deduped by name)
  const namedNames = new Set(TARGET_ORGS.map(o => o.name.toLowerCase()));
  const learnedOrgRows = (learnedOrgs || [])
    .filter(lo => !namedNames.has(lo.name.toLowerCase()))
    .map(lo => ({
      id: `learned-${lo.id}`,
      name: lo.name,
      fullName: lo.name,
      city: lo.city || "Unknown",
      category: lo.category || "Advocacy",
      urgency: "Check now",
      careersUrl: `https://www.google.com/search?q=${encodeURIComponent(lo.name + " careers jobs")}`,
      searchHint: `Discovered via saved roles — ${lo.category || "advocacy"} focus`,
      isLearned: true
    }));

  const allOrgs = [...TARGET_ORGS, ...learnedOrgRows];
  const allCities = ["All", ...Array.from(new Set(allOrgs.map(o => o.city.split(" / ")[0])))];

  const filteredUnsorted = allOrgs.filter(o =>
    cityFilter === "All" || o.city === cityFilter || o.city.startsWith(cityFilter)
  );

  // Sort: hot (high yield) first, cold (low yield) last, neutral/unscanned in between
  const filtered = [...filteredUnsorted].sort((a, b) => {
    const scoreA = orgPerf?.[a.id]?.score ?? 0;
    const scoreB = orgPerf?.[b.id]?.score ?? 0;
    return scoreB - scoreA;
  });

  const handleSave = useCallback(async (roleId, role, orgName, shouldSave) => {
    if (shouldSave) {
      await upsertRole(role, orgName);
      setSavedRoles(prev => ({ ...prev, [roleId]: { ...role, orgName, savedAt: new Date().toISOString() } }));
      loadLearnedOrgs().then(orgs => setLearnedOrgs(orgs));
    } else {
      await removeRole(roleId);
      setSavedRoles(prev => { const { [roleId]: _, ...rest } = prev; return rest; });
    }
  }, [setSavedRoles, setLearnedOrgs]);

  const scanOrg = async (org) => {
    setScanning(p => ({ ...p, [org.id]: true }));
    const orgId = org.id;
    const scannedAt = new Date().toISOString();
    const liUrl = "https://www.linkedin.com/jobs/search/?keywords=" + encodeURIComponent(org.fullName) + "&location=" + encodeURIComponent(org.city);
    const idUrl = "https://www.idealist.org/en/jobs?q=" + encodeURIComponent(org.name) + "&location=" + encodeURIComponent(org.city);
    const prompt = `Search the web NOW for CURRENT job openings at ${org.fullName} in ${org.city}. Search: "${org.fullName} jobs 2026" and "${org.fullName} careers openings". Only report roles actually found — do not invent openings.

Return JSON:
{
  "orgId": "${orgId}",
  "scannedAt": "${scannedAt}",
  "hiringStatus": "Active or Selective or No current openings or Unknown",
  "openRoles": [
    {
      "id": "role-${orgId}-1",
      "title": "Exact role title",
      "type": "Full-time or Contract or Fellowship or Part-time",
      "location": "${org.city}",
      "salary": null,
      "deadline": "deadline if found or null",
      "relevance": "High or Medium or Low",
      "whyFit": "1 sentence specific to Bella",
      "linkedInUrl": "${liUrl}",
      "idealistUrl": "${idUrl}",
      "directUrl": "direct URL if found or null"
    }
  ],
  "hiringCycleNote": "One sentence on hiring cycle or upcoming openings"
}`;
    try {
      const data = await callClaudeJSON(prompt, adaptiveContext);
      // Always save — even empty result — so timestamp persists
      const result = data || {
        orgId,
        scannedAt,
        hiringStatus: "No current openings",
        openRoles: [],
        hiringCycleNote: "No current openings found via live search. Check the careers page directly."
      };
      const updated = { ...results, [org.id]: { ...result, _ts: Date.now() } };
      setResults(updated);
      await saveScanResult(org.id, "org", result);
    } catch(e) {
      console.error(e);
      // Save a fallback so the row doesn't reset
      const fallback = { orgId, scannedAt, hiringStatus: "Error", openRoles: [], hiringCycleNote: "Scan error — try again.", _ts: Date.now() };
      const updated = { ...results, [org.id]: fallback };
      setResults(updated);
      await saveScanResult(org.id, "org", fallback);
    }
    setScanning(p => ({ ...p, [org.id]: false }));
  };

  const scanAll = async () => {
    setScanningAll(true);
    for (const org of filtered) {
      await scanOrg(org);
    }
    setScanningAll(false);
  };

  return (
    <div>
      {/* City filter + scan all */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        {allCities.map(c => (
          <button key={c} onClick={() => setCityFilter(c)} style={{
            padding: "5px 11px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${cityFilter === c ? "#1B2A4A" : "#DDD"}`,
            background: cityFilter === c ? "#1B2A4A" : "#FFF",
            color: cityFilter === c ? "#FFF" : "#666"
          }}>{c}</button>
        ))}
        <button onClick={scanAll} disabled={scanningAll} style={{
          marginLeft: "auto", padding: "6px 14px", borderRadius: 6, fontWeight: 700, fontSize: 11,
          cursor: scanningAll ? "not-allowed" : "pointer", fontFamily: "inherit",
          border: "1.5px solid #1D6A72", background: "#E8F4F5", color: "#1D6A72",
          display: "flex", alignItems: "center", gap: 5
        }}>
          {scanningAll ? <><Spinner size={11} /><span>Scanning all…</span></> : `🔍 Scan all ${filtered.length}`}
        </button>
      </div>

      {/* Org rows */}
      {filtered.map(org => {
        const r = results[org.id];
        const isScanning = scanning[org.id];
        const roles = r?.openRoles || [];
        const rolesFound = roles.length;
        const highCount = roles.filter(x => x.relevance === "High").length;

        return (
          <div key={org.id} style={{ border: "1.5px solid #E4E4E4", borderRadius: 9, overflow: "hidden", marginBottom: 8 }}>
            {/* Org header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: r ? "#FAFAFA" : "#FFF" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A" }}>{org.name}</div>
                  {org.isLearned && <span style={{ fontSize: 9, fontWeight: 800, color: "#5B4DB8", background: "#F0EEFF", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Learned</span>}
                  {(() => {
                    const p = orgPerf?.[org.id];
                    if (!p || p.scans === 0) return null;
                    const bucket = perfBucket(p.score);
                    if (bucket === "neutral") return null;
                    const cfg = BUCKET_CFG[bucket];
                    return <span style={{ fontSize: 9, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>;
                  })()}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>{org.city} · {org.category}</div>
                {org.searchHint && <div style={{ fontSize: 11, color: "#777", marginTop: 2, lineHeight: 1.4 }}>{org.searchHint}</div>}
              </div>

              {/* Last run + results summary */}
              {r && !isScanning && (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: "#AAA" }}>
                    {new Date(r._ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })} {new Date(r._ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: rolesFound > 0 ? "#1E6B3C" : "#888" }}>
                    {rolesFound > 0 ? `${rolesFound} role${rolesFound > 1 ? "s" : ""} · ${highCount} high` : "No openings found"}
                  </div>
                </div>
              )}

              {/* Scan button */}
              <button onClick={() => scanOrg(org)} disabled={isScanning} style={{
                padding: "5px 10px", borderRadius: 6, fontWeight: 700, fontSize: 11,
                cursor: isScanning ? "not-allowed" : "pointer", fontFamily: "inherit",
                border: `1.5px solid ${r ? "#DDD" : "#1D6A72"}`,
                background: r ? "#F7F7F7" : "#E8F4F5",
                color: r ? "#888" : "#1D6A72",
                display: "flex", alignItems: "center", gap: 5, flexShrink: 0
              }}>
                {isScanning ? <><Spinner size={11} /><span>Scanning…</span></> : r ? "Re-scan" : "🔍 Scan"}
              </button>
            </div>

            {/* Roles — compact rows */}
            {!isScanning && roles.length > 0 && (
              <div style={{ padding: "4px 14px 8px" }}>
                {roles.map(role => (
                  <RoleRow
                    key={role.id}
                    role={role}
                    orgName={org.name}
                    isSaved={!!savedRoles[role.id]}
                    onToggleSave={() => handleSave(role.id, role, org.name, !savedRoles[role.id])}
                  />
                ))}
              </div>
            )}

            {/* Scanning state */}
            {isScanning && (
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #F0F0F0" }}>
                <Spinner />
                <span style={{ fontSize: 11, color: "#888" }}>Searching live for current openings…</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BROADER SEARCH PANEL
// ─────────────────────────────────────────────────────────────────────────────
function BroaderSearchPanel({ results, setResults, savedRoles, setSavedRoles, adaptiveContext, broaderPerf, setLearnedOrgs }) {
  const [running, setRunning] = useState({});
  const [cityFilter, setCityFilter] = useState("All");
  const [runningAll, setRunningAll] = useState(false);

  const filteredUnsorted = BROADER_SEARCHES.filter(s =>
    cityFilter === "All" || s.city === cityFilter || s.city.includes(cityFilter)
  );

  // Sort: hot (high yield) first, cold (low yield) last
  const filtered = [...filteredUnsorted].sort((a, b) => {
    const scoreA = broaderPerf?.[a.id]?.score ?? 0;
    const scoreB = broaderPerf?.[b.id]?.score ?? 0;
    return scoreB - scoreA;
  });

  const handleSave = useCallback(async (roleId, role, orgName, shouldSave) => {
    if (shouldSave) {
      await upsertRole(role, orgName);
      setSavedRoles(prev => ({ ...prev, [roleId]: { ...role, orgName, savedAt: new Date().toISOString() } }));
      loadLearnedOrgs().then(orgs => setLearnedOrgs(orgs));
    } else {
      await removeRole(roleId);
      setSavedRoles(prev => { const { [roleId]: _, ...rest } = prev; return rest; });
    }
  }, [setSavedRoles, setLearnedOrgs]);

  const runSearch = async (search) => {
    setRunning(p => ({ ...p, [search.id]: true }));
    const searchId = search.id;
    const runAt = new Date().toISOString();
    const liUrl = "https://www.linkedin.com/jobs/search/?keywords=" + encodeURIComponent(search.query.split(" ").slice(0, 5).join("+"));
    const idUrl = "https://www.idealist.org/en/jobs?q=" + encodeURIComponent(search.query.split(" ").slice(0, 4).join("+"));
    const prompt = `Search the web NOW for current job openings: "${search.query}". Find REAL postings on Idealist, LinkedIn, Charity Village, and org websites. Only include roles outside the 16 named target orgs (ICIRR, Stonewall, Guttmacher, Action Canada, CCPA, PEN America, AKT, NIJC, Mozilla, MacArthur, YWCA Toronto, DePaul, AI Now, The 19th, CRR, Open Rights Group). Do not invent roles.

Return JSON:
{
  "searchId": "${searchId}",
  "runAt": "${runAt}",
  "marketNote": "One sentence on what you found",
  "topRoles": [
    {
      "id": "broad-${searchId}-1",
      "title": "Exact role title",
      "org": "Real org name",
      "location": "City or Remote",
      "type": "Full-time or Contract or Fellowship or Part-time",
      "salary": null,
      "deadline": "deadline if found or null",
      "relevance": "High or Medium or Low",
      "whyFit": "1 sentence specific to Bella",
      "directUrl": "actual URL or null",
      "linkedInUrl": "${liUrl}",
      "idealistUrl": "${idUrl}"
    }
  ]
}`;
    try {
      const data = await callClaudeJSON(prompt, adaptiveContext);
      const result = data || {
        searchId,
        runAt,
        marketNote: "No roles found via live search. Try the direct job board links above.",
        topRoles: []
      };
      const updated = { ...results, [search.id]: { ...result, _ts: Date.now() } };
      setResults(updated);
      await saveScanResult(search.id, "broader", result);
    } catch(e) {
      console.error(e);
      const fallback = { searchId, runAt, marketNote: "Search error — try again.", topRoles: [], _ts: Date.now() };
      const updated = { ...results, [search.id]: fallback };
      setResults(updated);
      await saveScanResult(search.id, "broader", fallback);
    }
    setRunning(p => ({ ...p, [search.id]: false }));
  };

  const runAll = async () => {
    setRunningAll(true);
    for (const s of filtered) {
      await runSearch(s);
    }
    setRunningAll(false);
  };

  return (
    <div>
      {/* City filter + run all */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        {CITIES.map(c => (
          <button key={c} onClick={() => setCityFilter(c)} style={{
            padding: "5px 11px", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px solid ${cityFilter === c ? "#1B2A4A" : "#DDD"}`,
            background: cityFilter === c ? "#1B2A4A" : "#FFF",
            color: cityFilter === c ? "#FFF" : "#666"
          }}>{c}</button>
        ))}
        <button onClick={runAll} disabled={runningAll} style={{
          marginLeft: "auto", padding: "6px 14px", borderRadius: 6, fontWeight: 700, fontSize: 11,
          cursor: runningAll ? "not-allowed" : "pointer", fontFamily: "inherit",
          border: "1.5px solid #1D6A72", background: "#E8F4F5", color: "#1D6A72",
          display: "flex", alignItems: "center", gap: 5
        }}>
          {runningAll ? <><Spinner size={11} /><span>Running all…</span></> : `🔍 Run all ${filtered.length}`}
        </button>
      </div>

      {filtered.map(search => {
        const r = results[search.id];
        const isRunning = running[search.id];
        const roles = r?.topRoles || [];
        const highCount = roles.filter(x => x.relevance === "High").length;

        return (
          <div key={search.id} style={{ border: "1.5px solid #E4E4E4", borderRadius: 9, overflow: "hidden", marginBottom: 8 }}>
            {/* Search header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: r ? "#FAFAFA" : "#FFF" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A" }}>{search.label}</div>
                  {(() => {
                    const p = broaderPerf?.[search.id];
                    if (!p || p.scans === 0) return null;
                    const bucket = perfBucket(p.score);
                    if (bucket === "neutral") return null;
                    const cfg = BUCKET_CFG[bucket];
                    return <span style={{ fontSize: 9, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>;
                  })()}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>{search.city} · {search.category}</div>
                {search.hint && <div style={{ fontSize: 11, color: "#777", marginTop: 2, lineHeight: 1.4 }}>{search.hint}</div>}
              </div>

              {r && !isRunning && (
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: "#AAA" }}>
                    {new Date(r._ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })} {new Date(r._ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: roles.length > 0 ? "#1E6B3C" : "#888" }}>
                    {roles.length > 0 ? `${roles.length} role${roles.length > 1 ? "s" : ""} · ${highCount} high` : "No roles found"}
                  </div>
                </div>
              )}

              <button onClick={() => runSearch(search)} disabled={isRunning} style={{
                padding: "5px 10px", borderRadius: 6, fontWeight: 700, fontSize: 11,
                cursor: isRunning ? "not-allowed" : "pointer", fontFamily: "inherit",
                border: `1.5px solid ${r ? "#DDD" : "#1D6A72"}`,
                background: r ? "#F7F7F7" : "#E8F4F5",
                color: r ? "#888" : "#1D6A72",
                display: "flex", alignItems: "center", gap: 5, flexShrink: 0
              }}>
                {isRunning ? <><Spinner size={11} /><span>Searching…</span></> : r ? "Re-run" : "🔍 Search"}
              </button>
            </div>

            {/* Role rows */}
            {!isRunning && roles.length > 0 && (
              <div style={{ padding: "4px 14px 8px" }}>
                {roles.map(role => (
                  <RoleRow
                    key={role.id}
                    role={{ ...role, orgName: role.org }}
                    orgName={role.org}
                    isSaved={!!savedRoles[role.id]}
                    onToggleSave={() => handleSave(role.id, role, role.org, !savedRoles[role.id])}
                  />
                ))}
              </div>
            )}

            {isRunning && (
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #F0F0F0" }}>
                <Spinner />
                <span style={{ fontSize: 11, color: "#888" }}>Searching live job boards…</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVED ROLES PANEL
// ─────────────────────────────────────────────────────────────────────────────
const BELLA_EMAIL = "bella@danielhunsicker.com";

function buildEmailLink(role) {
  const org = role.orgName || role.org || "";
  const postingUrl = role.directUrl || role.linkedInUrl || role.idealistUrl || "";
  const subject = encodeURIComponent(`Check this out — ${role.title} at ${org}`);
  const body = encodeURIComponent(
`Hi Bella,

Came across this one and thought of you. Worth a look.

${role.title}
${org}
${role.location || ""}${role.type ? ` · ${role.type}` : ""}${role.deadline ? `\nDeadline: ${role.deadline}` : ""}

${postingUrl ? `Link: ${postingUrl}` : "No direct link — check their careers page."}

${role.whyFit ? `Why I think it fits:\n${role.whyFit}` : ""}

No pressure. Let me know what you think.

Love,
Dad`
  );
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(BELLA_EMAIL)}&su=${subject}&body=${body}`;
}

function SavedRoleRow({ role, onRemove }) {
  const postingUrl = role.directUrl || role.linkedInUrl || role.idealistUrl || null;
  const emailLink = buildEmailLink(role);

  return (
    <div style={{ border: "1.5px solid #E4E4E4", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
      {/* Role info */}
      <div style={{ padding: "10px 14px", background: "#FAFAFA" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2A4A" }}>{role.title}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
              {role.orgName || role.org}{role.location ? ` · ${role.location}` : ""}{role.type ? ` · ${role.type}` : ""}
            </div>
            {role.deadline && <div style={{ fontSize: 10, color: "#A63228", fontWeight: 700, marginTop: 2 }}>⏱ {role.deadline}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: REL_COLOR[role.relevance] || "#888", background: REL_BG[role.relevance] || "#F0F0F0", padding: "2px 7px", borderRadius: 4 }}>{role.relevance}</span>
            <button onClick={onRemove} title="Remove from saved" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#F5C842", lineHeight: 1 }}>★</button>
          </div>
        </div>
        {role.whyFit && (
          <div style={{ fontSize: 11, color: "#666", marginTop: 6, lineHeight: 1.5, fontStyle: "italic" }}>{role.whyFit}</div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 0, borderTop: "1px solid #ECECEC" }}>
        {postingUrl ? (
          <a href={postingUrl} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 12px", fontSize: 12, fontWeight: 700, color: "#1D6A72",
            background: "#E8F4F5", textDecoration: "none", borderRight: "1px solid #ECECEC"
          }}>
            <span>🔗</span> View Posting
          </a>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "9px 12px", fontSize: 12, color: "#BBB", background: "#F7F7F7", borderRight: "1px solid #ECECEC" }}>
            No link available
          </div>
        )}
        <button
          onClick={() => { window.open(emailLink, "_blank"); }}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 12px", fontSize: 12, fontWeight: 700, color: "#1B2A4A",
            background: "#FFF", border: "none", cursor: "pointer", fontFamily: "inherit"
          }}
        >
          <span>✉️</span> Email to Bella
        </button>
      </div>
    </div>
  );
}

function SavedPanel({ savedRoles, setSavedRoles }) {
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState("");

  const savedList = Object.values(savedRoles).sort((a, b) => {
    const o = { High: 0, Medium: 1, Low: 2 };
    return (o[a.relevance] ?? 3) - (o[b.relevance] ?? 3);
  });

  const handleRemove = useCallback(async (roleId) => {
    await removeRole(roleId);
    setSavedRoles(prev => { const { [roleId]: _, ...rest } = prev; return rest; });
  }, [setSavedRoles]);

  const handleExport = () => {
    const payload = {
      agentVersion: "1.3b-v16", exportedAt: new Date().toISOString(),
      savedRoles: savedList.map(r => ({ id: r.id, title: r.title, org: r.orgName || r.org, location: r.location, type: r.type, relevance: r.relevance, deadline: r.deadline, directUrl: r.directUrl || null })),
      signal: "HS-1.3b-01: Saved roles from live scan — input to Agent 1.4"
    };
    const json = JSON.stringify(payload, null, 2);
    setExportText(json);
    setShowExport(true);
  };

  if (!savedList.length) return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>★</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#888" }}>No saved roles yet</div>
      <div style={{ fontSize: 12, marginTop: 6, color: "#AAA" }}>Star roles from Org Scan or Broader Search</div>
    </div>
  );

  const high = savedList.filter(r => r.relevance === "High");
  const other = savedList.filter(r => r.relevance !== "High");

  return (
    <div>
      {/* Summary bar */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#F5C842", fontFamily: "monospace", marginRight: 8 }}>{savedList.length}</div>
        <div style={{ fontSize: 12, color: "#888" }}>saved roles</div>
        <div style={{ marginLeft: 12, fontSize: 11, color: "#AAA" }}>Emails send to {BELLA_EMAIL}</div>
        <button onClick={handleExport} style={{ marginLeft: "auto", padding: "7px 14px", borderRadius: 7, border: "none", background: "#1B2A4A", color: "#FFF", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Export for Agent 1.4</button>
      </div>

      {high.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#1E6B3C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>High Relevance</div>
          {high.map(r => <SavedRoleRow key={r.id} role={r} onRemove={() => handleRemove(r.id)} />)}
        </>
      )}

      {other.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "14px 0 8px" }}>Other Saved</div>
          {other.map(r => <SavedRoleRow key={r.id} role={r} onRemove={() => handleRemove(r.id)} />)}
        </>
      )}

      {showExport && (
        <div style={{ marginTop: 20, background: "#1B2A4A", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9BB4D4", marginBottom: 8 }}>Click inside to select all, then copy (⌘A / ⌘C)</div>
          <textarea readOnly value={exportText} onFocus={e => e.target.select()} onClick={e => e.target.select()}
            style={{ width: "100%", height: 180, padding: "10px 12px", borderRadius: 7, border: "1.5px solid #4DADA3", fontSize: 10, fontFamily: "monospace", color: "#7ECEC8", background: "rgba(0,0,0,0.3)", lineHeight: 1.5, resize: "vertical" }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD POSTING PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AddPostingPanel({ savedRoles, setSavedRoles, setSignals, setLearnedOrgs }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDecompose = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    setResult(null);
    setErrorMsg("");
    const roleId = "user-" + Date.now();
    try {
      const prompt = `Search the web and fetch this job posting URL: ${url.trim()}

Decompose it into structured role data for Bella Daniel-Hunsicker's job search.

Return JSON:
{
  "id": "${roleId}",
  "title": "Exact job title",
  "org": "Organisation name",
  "location": "City or Remote",
  "type": "Full-time or Part-time or Contract or Fellowship",
  "salary": "Salary range if listed or null",
  "deadline": "Application deadline if listed or null",
  "relevance": "High or Medium or Low based on Bella's profile",
  "whyFit": "1-2 sentences on why this fits Bella specifically — reference her LSE MSc, PEN Canada, DTS BA, Spanish, Chicago/Toronto connections",
  "howToApply": "Specific application instructions from the posting",
  "directUrl": "${url.trim()}",
  "linkedInUrl": null,
  "idealistUrl": null,
  "source": "user_submitted"
}`;
      const data = await callClaudeJSON(prompt);
      if (data && data.title) {
        setResult(data);
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Couldn't parse the posting. Try a direct job listing URL.");
      }
    } catch(e) {
      setStatus("error");
      setErrorMsg("Something went wrong. Check the URL and try again.");
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await upsertRole(result, result.org, "user_submitted");
      setSavedRoles(prev => ({ ...prev, [result.id]: { ...result, orgName: result.org, savedAt: new Date().toISOString() } }));
      const [updatedSignals, updatedOrgs] = await Promise.all([
        loadFeedbackSignals(),
        loadLearnedOrgs()
      ]);
      setSignals(updatedSignals);
      setLearnedOrgs(updatedOrgs);
      setUrl("");
      setResult(null);
      setStatus("idle");
    } catch(e) {
      setStatus("error");
      setErrorMsg("Save failed: " + (e?.message || "database error. Check console for details."));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1B2A4A", marginBottom: 4 }}>Add a Job Posting</div>
        <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
          Found a role outside the app? Paste the posting URL below. The system will decompose it, assess fit for Bella, and add it to saved roles — feeding the learning loop.
        </div>
      </div>

      {/* URL input */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleDecompose()}
          placeholder="https://..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1.5px solid #DDD", fontSize: 13, color: "#333" }}
        />
        <button onClick={handleDecompose} disabled={status === "loading" || !url.trim()} style={{
          padding: "10px 18px", borderRadius: 8, border: "none",
          background: status === "loading" ? "#CCC" : "#1B2A4A",
          color: "#FFF", fontSize: 13, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0
        }}>
          {status === "loading" ? <><Spinner size={14} color="#FFF" /><span>Analysing…</span></> : "Analyse Posting"}
        </button>
      </div>

      {/* Error */}
      {status === "error" && (
        <div style={{ background: "#FDF0F0", border: "1.5px solid #A63228", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#A63228" }}>
          {errorMsg}
        </div>
      )}

      {/* Result preview */}
      {status === "success" && result && (
        <div style={{ border: "1.5px solid #1E6B3C", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: "#1B2A4A", padding: "12px 16px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#FFF" }}>{result.title}</div>
            <div style={{ fontSize: 12, color: "#7A9CC4", marginTop: 2 }}>{result.org} · {result.location} · {result.type}</div>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {result.salary && <div style={{ fontSize: 12, color: "#555" }}>Salary: {result.salary}</div>}
            {result.deadline && <div style={{ fontSize: 12, color: "#A63228", fontWeight: 700 }}>Deadline: {result.deadline}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: REL_COLOR[result.relevance] || "#888", background: REL_BG[result.relevance] || "#F0F0F0", padding: "2px 8px", borderRadius: 4 }}>{result.relevance}</span>
            </div>
            {result.whyFit && (
              <div style={{ background: "#EAF4EE", borderLeft: "3px solid #1E6B3C", borderRadius: "0 6px 6px 0", padding: "8px 12px", fontSize: 12, color: "#333", lineHeight: 1.6 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#1E6B3C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Why this fits Bella</div>
                {result.whyFit}
              </div>
            )}
            {result.howToApply && (
              <div style={{ background: "#FDF3E3", borderLeft: "3px solid #B8732A", borderRadius: "0 6px 6px 0", padding: "8px 12px", fontSize: 12, color: "#333", lineHeight: 1.6 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#B8732A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>How to apply</div>
                {result.howToApply}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={handleSave} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#1E6B3C", color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ★ Save to Roles
              </button>
              <button onClick={() => { setStatus("idle"); setResult(null); setUrl(""); }} style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #DDD", background: "#FFF", color: "#888", fontSize: 13, cursor: "pointer" }}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      {status === "idle" && (
        <div style={{ background: "#F7F7F7", borderRadius: 8, padding: "14px 16px", fontSize: 12, color: "#777", lineHeight: 1.7 }}>
          <strong style={{ color: "#1B2A4A" }}>How it works:</strong> Paste any job posting URL — Idealist, LinkedIn, an org's own careers page, anywhere. The system fetches the posting, extracts the role details, assesses fit for Bella's specific profile, and adds it to saved roles. It also updates the learning signals so future scans weight similar roles higher.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHTS PANEL
// ─────────────────────────────────────────────────────────────────────────────
function InsightsPanel({ signals, savedRoles, learnedOrgs, orgPerf, broaderPerf }) {
  const savedList = Object.values(savedRoles);
  const totalSaved = savedList.length;
  const userSubmitted = savedList.filter(r => r.source === "user_submitted").length;

  // City breakdown
  const cityCount = {};
  signals.forEach(s => { cityCount[s.city] = (cityCount[s.city] || 0) + 1; });
  const cities = Object.entries(cityCount).sort((a,b) => b[1]-a[1]);
  const topCity = cities[0]?.[0] || "—";

  // Category breakdown
  const catCount = {};
  signals.forEach(s => { catCount[s.category] = (catCount[s.category] || 0) + 1; });
  const cats = Object.entries(catCount).sort((a,b) => b[1]-a[1]);
  const topCat = cats[0]?.[0] || "—";

  // Relevance breakdown
  const relCount = { High: 0, Medium: 0, Low: 0 };
  savedList.forEach(r => { if (relCount[r.relevance] !== undefined) relCount[r.relevance]++; });

  // Org breakdown
  const orgCount = {};
  savedList.forEach(r => { const o = r.orgName || r.org; orgCount[o] = (orgCount[o] || 0) + 1; });
  const topOrgs = Object.entries(orgCount).sort((a,b) => b[1]-a[1]).slice(0,5);

  const Bar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "#555", fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 800 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "#E8E8E8", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${(value/max)*100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );

  if (!totalSaved && !signals.length) return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "#AAA" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#888" }}>No insights yet</div>
      <div style={{ fontSize: 12, marginTop: 6 }}>Save roles or run scans to start building your search picture</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { label: "Roles Saved", value: totalSaved, color: "#1B2A4A", bg: "#F0F3F8" },
          { label: "User Added", value: userSubmitted, color: "#5B4DB8", bg: "#F0EEFF" },
          { label: "Top City", value: topCity, color: "#1E6B3C", bg: "#EAF4EE" },
          { label: "Top Category", value: topCat.split(" ")[0], color: "#B8732A", bg: "#FDF3E3" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1.2, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* City distribution */}
      {cities.length > 0 && (
        <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A", marginBottom: 14 }}>City Focus</div>
          {cities.map(([city, count]) => (
            <Bar key={city} label={city} value={count} max={cities[0][1]} color="#1D6A72" />
          ))}
          <div style={{ fontSize: 11, color: "#AAA", marginTop: 8 }}>
            {topCity} is driving the search — scans are being weighted toward this city.
          </div>
        </div>
      )}

      {/* Category distribution */}
      {cats.length > 0 && (
        <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A", marginBottom: 14 }}>Category Focus</div>
          {cats.map(([cat, count]) => (
            <Bar key={cat} label={cat} value={count} max={cats[0][1]} color="#1E6B3C" />
          ))}
        </div>
      )}

      {/* Relevance breakdown */}
      <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A", marginBottom: 14 }}>Relevance Breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "High", value: relCount.High, color: "#1E6B3C", bg: "#EAF4EE" },
            { label: "Medium", value: relCount.Medium, color: "#B8732A", bg: "#FDF3E3" },
            { label: "Low", value: relCount.Low, color: "#888", bg: "#F0F0F0" },
          ].map(r => (
            <div key={r.label} style={{ background: r.bg, borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: r.color, fontFamily: "monospace" }}>{r.value}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top orgs */}
      {topOrgs.length > 0 && (
        <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A", marginBottom: 14 }}>Most Active Orgs</div>
          {topOrgs.map(([org, count]) => (
            <div key={org} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #F4F4F4" }}>
              <div style={{ flex: 1, fontSize: 13, color: "#333", fontWeight: 600 }}>{org}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1D6A72", background: "#E8F4F5", padding: "2px 8px", borderRadius: 4 }}>{count} role{count > 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      )}

      {/* Source performance — prioritization / deprioritization */}
      {(Object.keys(orgPerf || {}).length > 0 || Object.keys(broaderPerf || {}).length > 0) && (
        <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A", marginBottom: 4 }}>Source Performance</div>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 12, lineHeight: 1.5 }}>
            Orgs and searches are automatically prioritized or deprioritized based on starred roles versus empty or ignored scans. Nothing is ever removed — low-yield sources just sink to the bottom of their list.
          </div>
          {(() => {
            const orgRows = Object.entries(orgPerf || {}).map(([id, p]) => ({ id, name: TARGET_ORGS.find(o => o.id === id)?.name || id, ...p, kind: "Org" }));
            const searchRows = Object.entries(broaderPerf || {}).map(([id, p]) => ({ id, name: BROADER_SEARCHES.find(s => s.id === id)?.label || id, ...p, kind: "Search" }));
            const allRows = [...orgRows, ...searchRows].sort((a,b) => b.score - a.score);
            if (!allRows.length) return null;
            return allRows.map(row => {
              const bucket = perfBucket(row.score);
              const cfg = BUCKET_CFG[bucket];
              return (
                <div key={row.kind + row.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #F4F4F4" }}>
                  <div style={{ flex: 1, fontSize: 13, color: "#333", fontWeight: 600 }}>{row.name}</div>
                  <div style={{ fontSize: 10, color: "#AAA" }}>{row.kind}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{row.rolesStarred || 0} starred · {row.rolesShown || 0} shown{row.zeroScans ? ` · ${row.zeroScans} empty` : ""}</div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: "2px 8px", borderRadius: 4 }}>{cfg.label}</span>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Learned orgs */}
      {learnedOrgs.length > 0 && (
        <div style={{ background: "#F0EEFF", border: "1.5px solid #5B4DB8", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#5B4DB8", marginBottom: 6 }}>Orgs Discovered via Saved Roles</div>
          <div style={{ fontSize: 12, color: "#777", marginBottom: 12, lineHeight: 1.5 }}>
            These organisations surfaced through broader searches or user-submitted postings. They've been added to your learning signals.
          </div>
          {learnedOrgs.map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #E4DCFF" }}>
              <div style={{ flex: 1, fontSize: 13, color: "#333", fontWeight: 600 }}>{o.name}</div>
              <div style={{ fontSize: 11, color: "#5B4DB8" }}>{o.city} · {o.category}</div>
            </div>
          ))}
        </div>
      )}

      {/* Adaptive context preview */}
      {signals.length > 0 && (
        <div style={{ background: "#1B2A4A", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#4DADA3", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Active Learning Signal ({signals.length} signals)
          </div>
          <div style={{ fontSize: 12, color: "#7A9CC4", lineHeight: 1.6 }}>
            Next scan will be weighted toward <strong style={{ color: "#FFF" }}>{topCity}</strong> and <strong style={{ color: "#FFF" }}>{topCat}</strong> based on your saved roles. Relevance scoring is being calibrated to your actual selections.
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("orgscan");
  const [orgResults, setOrgResults] = useState({});
  const [broaderResults, setBroaderResults] = useState({});
  const [savedRoles, setSavedRoles] = useState({});
  const [signals, setSignals] = useState([]);
  const [learnedOrgs, setLearnedOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const [org, broader, saved, sigs, lorgs] = await Promise.all([
        loadScanResults("org"),
        loadScanResults("broader"),
        loadSavedRoles(),
        loadFeedbackSignals(),
        loadLearnedOrgs()
      ]);
      setOrgResults(org);
      setBroaderResults(broader);
      setSavedRoles(saved);
      setSignals(sigs);
      setLearnedOrgs(lorgs);
      setLoading(false);
    }
    init();
  }, []);

  const adaptiveContext = buildAdaptiveContext(signals);
  const stats = useGlobalStats(orgResults, broaderResults, savedRoles, learnedOrgs);

  const savedRolesList = Object.values(savedRoles);
  const orgPerf = computeSourcePerformance(orgResults, savedRolesList, "org");
  const broaderPerf = computeSourcePerformance(broaderResults, savedRolesList, "broader");
  const perfContext = buildPerformanceContext(orgPerf, broaderPerf, TARGET_ORGS, BROADER_SEARCHES);
  const fullAdaptiveContext = adaptiveContext + perfContext;

  const tabs = [
    { key: "orgscan",  label: "Org Scan" },
    { key: "broader",  label: "Broader Search" },
    { key: "saved",    label: `Saved ★ ${stats.starred > 0 ? stats.starred : ""}` },
    { key: "add",      label: "+ Add Posting" },
    { key: "insights", label: "Insights" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F4F4F2", fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button,input,textarea{font-family:inherit}
        @keyframes spin{to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#CCC;border-radius:3px}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#1B2A4A", padding: "16px 20px 0" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* App name + tagline */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPCEtLSBOYXZ5IGNpcmNsZSAtLT4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMCIgZmlsbD0iIzFCMkE0QSIvPgogIDwhLS0gVGVhbCBkYXNoZWQgcmluZyAtLT4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNERBREEzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUgMyIvPgogIDwhLS0gTm9ydGggc3Bpa2UgKHRlYWwsIHRhbGwpIC0tPgogIDxwb2x5Z29uIHBvaW50cz0iMzIsOCAzNiwyNiAzMiwyMiAyOCwyNiIgZmlsbD0iIzREQURBMyIvPgogIDwhLS0gU291dGggbnViIChtdXRlZCkgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSIzMiw1NiAzNSw0MCAzMiw0NCAyOSw0MCIgZmlsbD0iIzVBN0ZBQSIvPgogIDwhLS0gRWFzdCBudWIgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSI1NiwzMiA0MCwyOSA0NCwzMiA0MCwzNSIgZmlsbD0iIzVBN0ZBQSIvPgogIDwhLS0gV2VzdCBudWIgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSI4LDMyIDI0LDM1IDIwLDMyIDI0LDI5IiBmaWxsPSIjNUE3RkFBIi8+CiAgPCEtLSBHb2xkIGNlbnRlciBkb3QgLS0+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iNCIgZmlsbD0iI0Y1Qzg0MiIvPgo8L3N2Zz4K" alt="Career Discovery System logo" style={{ width: 36, height: 36, flexShrink: 0 }}/>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#FFF", marginBottom: 3, letterSpacing: "-0.01em" }}>Job Posting Discovery Agent</h1>
              </div>
              <p style={{ fontSize: 11, color: "#5A7FAA" }}>Bella Daniel-Hunsicker · LGBTQ+ · Immigrant Rights · Reproductive Rights · Digital Rights</p>
            </div>

            {/* Global stats strip */}
            <div style={{ display: "flex", gap: 16, flexShrink: 0, alignItems: "center" }}>
              {[
                { label: "Scanned", value: `${stats.totalScanned}/${stats.totalSources}`, color: "#FFF" },
                { label: "Roles found", value: stats.rolesFound, color: "#FFF" },
                { label: "High relevance", value: stats.highRelevance, color: "#4DADA3" },
                { label: "Starred", value: stats.starred, color: "#F5C842" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "#4A6FA5", marginTop: 2, whiteSpace: "nowrap" }}>{s.label}</div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DADA3", animation: "spin 3s linear infinite" }} />
                <span style={{ fontSize: 9, color: "#4DADA3", fontWeight: 700, whiteSpace: "nowrap" }}>Live search</span>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 2, borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: "9px 14px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12,
                background: "transparent", color: tab === t.key ? "#FFF" : "#5A7FAA",
                borderBottom: tab === t.key ? "2px solid #4DADA3" : "2px solid transparent",
                marginBottom: -2, transition: "all 0.15s", whiteSpace: "nowrap"
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "18px 20px 32px" }}>
        {tab === "orgscan" && (
          <OrgScanPanel
            results={orgResults} setResults={setOrgResults}
            savedRoles={savedRoles} setSavedRoles={setSavedRoles}
            adaptiveContext={fullAdaptiveContext}
            learnedOrgs={learnedOrgs} setLearnedOrgs={setLearnedOrgs}
            orgPerf={orgPerf}
          />
        )}
        {tab === "broader" && (
          <BroaderSearchPanel
            results={broaderResults} setResults={setBroaderResults}
            savedRoles={savedRoles} setSavedRoles={setSavedRoles}
            adaptiveContext={fullAdaptiveContext}
            broaderPerf={broaderPerf} setLearnedOrgs={setLearnedOrgs}
          />
        )}
        {tab === "saved" && (
          <SavedPanel savedRoles={savedRoles} setSavedRoles={setSavedRoles} />
        )}
        {tab === "add" && (
          <AddPostingPanel
            savedRoles={savedRoles} setSavedRoles={setSavedRoles}
            setSignals={setSignals} setLearnedOrgs={setLearnedOrgs}
          />
        )}
        {tab === "insights" && (
          <InsightsPanel
            signals={signals} savedRoles={savedRoles}
            learnedOrgs={learnedOrgs}
            orgPerf={orgPerf} broaderPerf={broaderPerf}
          />
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid #E4E4E4", padding: "14px 20px", textAlign: "center", background: "#FFF" }}>
        <div style={{ fontSize: 11, color: "#BBB" }}>
          Career Discovery System · v16 &nbsp;·&nbsp; © {new Date().getFullYear()} &nbsp;·&nbsp; Built for Bella Daniel-Hunsicker
        </div>
      </div>

    </div>
  );
}
