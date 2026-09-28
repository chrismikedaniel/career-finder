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
  { id:"toronto-nonprofit",    label:"Toronto — Nonprofit Advocacy",          city:"Toronto",  category:"Advocacy / Policy",        query:"advocacy coordinator immigrant rights gender equity community Toronto nonprofit 2026",   hint:"Entry-level coordinator roles — UofT DTS alumni network is the referral path; target Centretown and Parkdale neighbourhood orgs" },
  { id:"chicago-nonprofit",    label:"Chicago — Nonprofit & Advocacy",        city:"Chicago",  category:"Advocacy / Policy",        query:"community advocate coordinator immigration equity rights Chicago nonprofit Spanish bilingual 2026", hint:"Immigrant rights and equity orgs — Spanish fluency and Chicago community roots are key differentiators; target pillar organizations not legal clinics" },
  { id:"lgbtq-toronto-chicago",label:"Toronto & Chicago — LGBTQ+ Orgs",      city:"Multiple", category:"LGBTQ+",                   query:"LGBTQ coordinator communications advocacy Toronto Chicago nonprofit community 2026", hint:"Focus on community-embedded orgs — 519 Community Centre, Rainbow Health Ontario, Howard Brown Health, Gender Creative Kids; avoid legal-only roles" },
  { id:"repro-rights",         label:"US & Canada — Reproductive Rights",     city:"Multiple", category:"Reproductive Rights",      query:"reproductive rights sexual health advocacy coordinator communications researcher 2026",                        hint:"Planned Parenthood of Illinois is a strong Chicago target; NCRW aggregates women's org postings nationally" },
  { id:"edu-chicago",          label:"Chicago — Educational Institutions",    city:"Chicago",  category:"Education",                query:"DePaul Loyola Northwestern equity diversity inclusion community engagement coordinator Chicago 2026",            hint:"Loyola Chicago has strong social justice programming; name the Vincentian/Jesuit mission in applications" },
  { id:"digital-rights",       label:"Remote — Digital Rights / PIT",         city:"Remote",   category:"Digital Rights / Tech",    query:"public interest technology fellow researcher digital rights equity remote fellowship 2026",                    hint:"Tech Jobs for Good has less competition per listing than LinkedIn; Mozilla is location-flexible" },
  { id:"uk-charity",           label:"London — UK Charity Sector",            city:"London",   category:"LGBTQ+ / Advocacy",        query:"LGBTQ gender policy coordinator communications charity London entry level 2026",                            hint:"CharityJob UK is the primary board here; many smaller LGBTQ+ orgs only post there" },
  { id:"nyc-nonprofit",        label:"New York — Nonprofit & Advocacy",       city:"New York", category:"Advocacy / Policy",        query:"policy researcher advocacy communications coordinator nonprofit New York entry level 2026",                    hint:"Defer to second role unless friends' NYC network has solidified; remote roles here are the priority" },
  { id:"chicago-lgbtq",        label:"Chicago — LGBTQ+ Orgs",                city:"Chicago",  category:"LGBTQ+",                   query:"LGBTQ coordinator programs communications advocacy Chicago nonprofit entry level 2026",                       hint:"Howard Brown Health, Center on Halsted, PFLAG Chicago — Spanish fluency is a differentiator for bilingual outreach roles" },
  { id:"chicago-repro",        label:"Chicago — Reproductive Rights",         city:"Chicago",  category:"Reproductive Rights",      query:"reproductive rights sexual health coordinator advocacy communications Chicago Illinois 2026",       hint:"Planned Parenthood of Illinois and Illinois Caucus for Adolescent Health are primary Chicago targets" },
  { id:"chicago-university",   label:"Chicago — University & Research Roles", city:"Chicago",  category:"Education / Research",     query:"program coordinator human rights gender studies Chicago university DePaul Loyola UChicago 2026",           hint:"UChicago Pozen Center, Loyola, DePaul — target human rights, gender studies, and community engagement departments" },
  { id:"chicago-immigrant",    label:"Chicago — Immigrant & Refugee Services",city:"Chicago",  category:"Migrant Rights",           query:"immigrant refugee coordinator outreach advocacy Chicago bilingual Spanish nonprofit 2026",              hint:"Heartland Alliance, Interfaith Action, Resurrection Project — Spanish fluency opens bilingual outreach roles" },
  { id:"toronto-lgbtq",        label:"Toronto — LGBTQ+ & Gender Equity",      city:"Toronto",  category:"LGBTQ+",                   query:"LGBTQ gender equity coordinator communications Toronto nonprofit 2026",                   hint:"519 Community Centre, Rainbow Health Ontario, Egale Canada — UofT DTS network is the referral path" },
  { id:"toronto-immigrant",    label:"Toronto — Immigrant & Settlement Services",city:"Toronto",category:"Migrant Rights",           query:"immigrant settlement coordinator outreach Toronto bilingual Spanish nonprofit 2026",                    hint:"ACCES Employment, Catholic Crosscultural Services, COSTI — DTS BA and Spanish fluency are direct credentials" },
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
  // Resolve org name — never blank
  const resolvedOrg = (role.org && role.org.trim()) || (orgName && orgName.trim()) || "Unknown Org";
  const resolvedOrgName = (orgName && orgName.trim()) || resolvedOrg;

  // Infer category from title + org so it's always populated
  const category = inferCategory(role.title || "", resolvedOrg);

  const { error } = await supabase.from("saved_roles").upsert({
    id: role.id,
    title: role.title || "Untitled Role",
    org: resolvedOrg,
    org_name: resolvedOrgName,
    category: category || "Advocacy",
    location: (role.location && role.location.trim()) || null,
    type: (role.type && role.type.trim()) || "Full-time",
    relevance: (role.relevance && role.relevance.trim()) || "Medium",
    deadline: role.deadline || null,
    why_fit: (role.whyFit && role.whyFit.trim()) || null,
    direct_url: role.directUrl || null,
    linkedin_url: role.linkedInUrl || null,
    idealist_url: role.idealistUrl || null,
    source: source,
    saved_at: new Date().toISOString()
  });
  if (error) { console.error("upsertRole error:", error); throw error; }
  // Fire feedback signal — awaited so learned_orgs is ready before callers reload state
  await fireSignal(role, resolvedOrgName, source);
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
      category: row.category, location: row.location, type: row.type,
      relevance: row.relevance, deadline: row.deadline, whyFit: row.why_fit,
      directUrl: row.direct_url, linkedInUrl: row.linkedin_url, idealistUrl: row.idealist_url,
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
    // If the role came from a user-pasted URL, extract the base careers site domain
    let careersUrl = null;
    if (role.directUrl) {
      try {
        const u = new URL(role.directUrl);
        careersUrl = u.origin + u.pathname.split("/").slice(0, 3).join("/");
      } catch(e) {}
    }
    const { error: orgError } = await supabase.from("learned_orgs").upsert({
      id: orgKey,
      name: orgName,
      city,
      category,
      source_role_id: role.id,
      careers_url: careersUrl,
      created_at: new Date().toISOString()
    });
    if (orgError) console.error("fireSignal [learned_orgs]:", orgError);
  }
}

async function submitThumb(roleId, orgName, thumb, notes) {
  try {
    const { error } = await supabase.from("feedback_signals").upsert({
      id: "thumb-" + roleId,
      role_id: roleId,
      org: orgName,
      category: null,
      city: null,
      relevance: thumb === "up" ? "High" : "Low",
      source: "thumb_" + thumb,
      thumb,
      notes: notes || null,
      created_at: new Date().toISOString()
    });
    if (error) console.error("submitThumb:", error);
  } catch(e) { console.error("submitThumb:", e); }
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

async function loadLearnedSearches() {
  try {
    const { data } = await supabase.from("learned_searches").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch(e) { console.error("loadLearnedSearches:", e); return []; }
}

async function saveLearnedSearch(search) {
  const { error } = await supabase.from("learned_searches").upsert(search);
  if (error) console.error("saveLearnedSearch:", error);
}

async function updateLearnedSearch(id, updates) {
  const { error } = await supabase.from("learned_searches").update(updates).eq("id", id);
  if (error) console.error("updateLearnedSearch:", error);
}

async function saveBrief(brief, signalCount, roleCount) {
  const id = "brief-" + Date.now();
  const { error } = await supabase.from("insights_briefs").insert({
    id,
    content: brief,
    signal_count: signalCount,
    role_count: roleCount,
    created_at: new Date().toISOString()
  });
  if (error) console.error("saveBrief:", error);
  return id;
}

async function loadBriefs(limit = 5) {
  try {
    const { data } = await supabase.from("insights_briefs").select("*")
      .order("created_at", { ascending: false }).limit(limit);
    return data || [];
  } catch(e) { console.error("loadBriefs:", e); return []; }
}

// Build adaptive context string from feedback signals + latest brief
function buildAdaptiveContext(signals, latestBrief) {
  const cityCount = {};
  const catCount = {};
  const thumbUpOrgs = [];
  const thumbDownOrgs = [];
  const thumbNotes = [];

  signals.forEach(s => {
    if (s.city) cityCount[s.city] = (cityCount[s.city] || 0) + 1;
    if (s.category) catCount[s.category] = (catCount[s.category] || 0) + 1;
    if (s.thumb === "up" && s.org) thumbUpOrgs.push(s.org);
    if (s.thumb === "down" && s.org) thumbDownOrgs.push(s.org);
    if (s.notes) thumbNotes.push(s.notes);
  });

  const topCities = Object.entries(cityCount).sort((a,b) => b[1]-a[1]).slice(0,3).map(([c]) => c);
  const topCats = Object.entries(catCount).sort((a,b) => b[1]-a[1]).slice(0,3).map(([c]) => c);

  let ctx = signals.length
    ? `\n\nLEARNED PREFERENCES (from ${signals.length} signals): Top cities: ${topCities.join(", ")}. Top categories: ${topCats.join(", ")}. Weight these higher in relevance scoring.`
    : "";

  if (thumbUpOrgs.length) ctx += ` Explicitly endorsed orgs: ${[...new Set(thumbUpOrgs)].join(", ")} — surface similar roles.`;
  if (thumbDownOrgs.length) ctx += ` Explicitly rejected orgs: ${[...new Set(thumbDownOrgs)].join(", ")} — deprioritize similar roles.`;
  if (thumbNotes.length) ctx += ` User notes on fit: "${thumbNotes.slice(-3).join('" · "')}" — use these to calibrate relevance.`;

  // Fold in the latest intelligence brief's action items
  if (latestBrief?.nextActions) {
    const na = latestBrief.nextActions;
    if (na.scanPriorities?.length) ctx += `\n\nINTELLIGENCE BRIEF — SCAN PRIORITIES: ${na.scanPriorities.join(", ")} — treat these as highest priority targets.`;
    if (na.searchAdjustments?.length) ctx += ` Search adjustments from last brief: ${na.searchAdjustments.join("; ")}.`;
    if (na.gaps?.length) ctx += ` Identified gaps to explore: ${na.gaps.join("; ")} — flag roles in these areas as High relevance.`;
    if (latestBrief.profile?.causes?.length) ctx += ` Current cause focus: ${latestBrief.profile.causes.slice(0,3).join(", ")}.`;
    if (latestBrief.profile?.roleTypes?.length) ctx += ` Role types landing: ${latestBrief.profile.roleTypes.slice(0,3).join(", ")}.`;
    // Thumb down notes drive query tightening
    const downNotes = thumbDownOrgs.length ? `Thumb-down orgs to deprioritize: ${[...new Set(thumbDownOrgs)].join(", ")}.` : "";
    if (downNotes) ctx += ` ${downNotes}`;
  }

  return ctx;
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
var _setApiError = null;
function registerApiErrorHandler(fn) { _setApiError = fn; }

// Simplified Claude call — no web search, just pure synthesis. Used for Insights brief.
async function callClaudePure(prompt) {
  try {
    const res = await fetch("/.netlify/functions/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) {
      const msg = data.error?.message || "";
      const isCredits = msg.toLowerCase().includes("credit") || msg.toLowerCase().includes("balance");
      if (_setApiError) _setApiError(isCredits ? "credits" : "other");
      console.error("callClaudePure error:", data.error);
      return null;
    }
    if (_setApiError) _setApiError(null);
    const blocks = data.content || [];
    const text = blocks.filter(b => b.type === "text").map(b => b.text).join("\n");
    if (!text) return null;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    try { return JSON.parse(text.slice(start, end + 1)); }
    catch(_) { return null; }
  } catch(e) {
    console.error("callClaudePure exception:", e);
    return null;
  }
}

// Fast web search using Haiku — used for broader searches to avoid Sonnet timeout
async function callClaudeHaikuSearch(prompt, adaptiveContext = "") {
  try {
    const res = await fetch("/.netlify/functions/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        system: (adaptiveContext || "") + "\n\nRespond with ONLY valid JSON. Start with { end with }. No markdown fences.",
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) {
      const msg = data.error?.message || "";
      if (_setApiError) _setApiError(msg.includes("credit") ? "credits" : "other");
      console.error("callClaudeHaikuSearch error:", data.error);
      return null;
    }
    if (_setApiError) _setApiError(null);
    const blocks = data.content || [];
    const text = blocks.filter(b => b.type === "text").map(b => b.text).join("\n");
    if (!text) return null;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    try { return JSON.parse(text.slice(start, end + 1)); }
    catch(_) {
      try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        const s2 = cleaned.indexOf("{"), e2 = cleaned.lastIndexOf("}");
        return JSON.parse(cleaned.slice(s2, e2 + 1));
      } catch(_) { return null; }
    }
  } catch(e) {
    console.error("callClaudeHaikuSearch exception:", e);
    return null;
  }
}

async function callClaudeJSON(prompt, adaptiveContext = "") {
  const res = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: CANDIDATE_CONTEXT + adaptiveContext,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt + "\n\nRespond with ONLY valid JSON. Start with { end with }. No markdown fences." }]
    })
  });
  const data = await res.json();
  if (data.error) {
    const msg = data.error?.message || "";
    const isCredits = msg.toLowerCase().includes("credit") || msg.toLowerCase().includes("balance");
    if (_setApiError) _setApiError(isCredits ? "credits" : "other");
    console.error("Anthropic error:", data.error);
    return null;
  }
  if (_setApiError) _setApiError(null); // clear on success
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
function ThumbBar({ roleId, orgName, signals }) {
  // Initialize from persisted signal if one exists for this role
  const existing = (signals || []).find(s => s.id === "thumb-" + roleId);
  const [thumb, setThumb] = useState(existing?.thumb || null);
  const [notes, setNotes] = useState(existing?.notes || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync if signals load after initial render (e.g. on mount)
  useEffect(() => {
    if (existing && !editing) {
      setThumb(existing.thumb || null);
      setNotes(existing.notes || "");
    }
  }, [existing?.thumb, existing?.notes]);

  const handleThumb = (val) => {
    const next = thumb === val ? null : val;
    setThumb(next);
    setEditing(true);
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!thumb) return;
    setSaving(true);
    await submitThumb(roleId, orgName, thumb, notes);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const isLogged = !editing && !!thumb;

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button onClick={() => handleThumb("up")} title="Good fit" style={{
          background: thumb === "up" ? "#EAF4EE" : "none", border: "none", cursor: "pointer",
          fontSize: 14, padding: "2px 5px", borderRadius: 4, lineHeight: 1,
          color: thumb === "up" ? "#1E6B3C" : "#BBB", transition: "all 0.15s",
          opacity: isLogged && thumb !== "up" ? 0.35 : 1
        }}>👍</button>
        <button onClick={() => handleThumb("down")} title="Not a fit" style={{
          background: thumb === "down" ? "#FDF0F0" : "none", border: "none", cursor: "pointer",
          fontSize: 14, padding: "2px 5px", borderRadius: 4, lineHeight: 1,
          color: thumb === "down" ? "#A63228" : "#BBB", transition: "all 0.15s",
          opacity: isLogged && thumb !== "down" ? 0.35 : 1
        }}>👎</button>

        {/* Saved state: show note preview + edit link */}
        {isLogged && notes && (
          <span style={{ fontSize: 10, color: "#888", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            "{notes}"
          </span>
        )}
        {isLogged && (
          <button onClick={() => setEditing(true)} style={{
            fontSize: 10, color: "#5A7FAA", background: "none", border: "none",
            cursor: "pointer", padding: "0 4px", fontFamily: "inherit"
          }}>Edit</button>
        )}

        {/* Editing state: note input + send */}
        {editing && thumb && (
          <>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional note…"
              autoFocus
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{
                flex: 1, fontSize: 11, padding: "3px 7px", borderRadius: 4,
                border: "1px solid #DDD", fontFamily: "inherit", outline: "none",
                color: "#333", background: "#FAFAFA"
              }}
            />
            <button onClick={handleSubmit} disabled={saving} style={{
              fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4,
              border: "none", background: "#1B2A4A", color: "#FFF", cursor: "pointer", fontFamily: "inherit",
              opacity: saving ? 0.6 : 1
            }}>{saving ? "…" : "Save"}</button>
            <button onClick={() => { setEditing(false); setThumb(existing?.thumb || null); setNotes(existing?.notes || ""); }} style={{
              fontSize: 10, color: "#AAA", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
            }}>✕</button>
          </>
        )}

        {saved && <span style={{ fontSize: 10, color: "#1E6B3C", fontWeight: 700 }}>✓ Saved</span>}
      </div>
    </div>
  );
}

function RoleRow({ role, orgName, isSaved, onToggleSave, signals }) {
  const postingUrl = role.directUrl || role.linkedInUrl || role.idealistUrl || null;
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #F4F4F4" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
      <ThumbBar roleId={role.id} orgName={orgName || role.org} signals={signals} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STATS HOOK — shared across panels
// ─────────────────────────────────────────────────────────────────────────────
function useGlobalStats(orgResults, broaderResults, savedRoles, learnedOrgs, orgPerf, broaderPerf) {
  const savedList = Object.values(savedRoles);
  const saved = savedList.length;

  // High yield: sources with score >= 4
  const highYield = Object.values(orgPerf || {}).filter(p => p.score >= 4).length
    + Object.values(broaderPerf || {}).filter(p => p.score >= 4).length;

  // New this week: roles saved in the last 7 days
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = savedList.filter(r => new Date(r.savedAt).getTime() > oneWeekAgo).length;

  return { saved, highYield, newThisWeek };
}

// ─────────────────────────────────────────────────────────────────────────────
// ORG SCAN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function OrgScanPanel({ results, setResults, savedRoles, setSavedRoles, adaptiveContext, learnedOrgs, setLearnedOrgs, orgPerf, signals }) {
  const [scanning, setScanning] = useState({});
  const [cityFilter, setCityFilter] = useState("All");
  const [scanningAll, setScanningAll] = useState(false);

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
      careersUrl: lo.careers_url || `https://www.google.com/search?q=${encodeURIComponent(lo.name + " careers jobs")}`,
      searchHint: lo.careers_url
        ? `Discovered via saved roles — scans ${lo.careers_url}`
        : `Discovered via saved roles — ${lo.category || "advocacy"} focus`,
      isLearned: true
    }));

  const allOrgs = [...TARGET_ORGS, ...learnedOrgRows];
  const allCities = ["All", ...Array.from(new Set(allOrgs.map(o => o.city.split(" / ")[0])))];

  const filteredUnsorted = allOrgs.filter(o =>
    cityFilter === "All" || o.city === cityFilter || o.city.startsWith(cityFilter)
  );

  // Sort order: High Yield → Learned (unscanned) → Neutral → Low Yield
  // Rank: hot=3, learned-unscanned=2, neutral=1, cold=0
  const sortRank = (org) => {
    const perf = orgPerf?.[org.id];
    const score = perf?.score ?? null;
    if (score !== null && perfBucket(score) === "hot") return 3;
    if (org.isLearned && (score === null || perf?.scans === 0)) return 2;
    if (score === null || perfBucket(score) === "neutral") return 1;
    return 0; // cold
  };
  const filtered = [...filteredUnsorted].sort((a, b) => sortRank(b) - sortRank(a));

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
    const careersHint = org.careersUrl && !org.careersUrl.includes("google.com/search")
      ? `Start by checking their known careers page: ${org.careersUrl}. `
      : "";
    const prompt = `Search the web NOW for CURRENT job openings at ${org.fullName} in ${org.city}. ${careersHint}Also search: "${org.fullName} jobs 2026" and "${org.fullName} careers openings". Only report roles actually found with real application URLs — do not invent openings.

IMPORTANT URL RULES:
- directUrl must be a link to the SPECIFIC JOB POSTING (e.g. a Workday, Greenhouse, Lever, or org careers page URL), never a LinkedIn company profile URL
- linkedInUrl must be a LinkedIn JOBS search URL (like ${liUrl}), never a company profile page
- If you cannot find a direct posting URL, leave directUrl as null

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
      "directUrl": "specific job posting URL or null"
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
                    signals={signals}
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
function BroaderSearchPanel({ results, setResults, savedRoles, setSavedRoles, adaptiveContext, broaderPerf, setLearnedOrgs, signals, learnedSearches }) {
  const [running, setRunning] = useState({});
  const [cityFilter, setCityFilter] = useState("All");
  const [runningAll, setRunningAll] = useState(false);

  // Merge hardcoded + learned searches (deduped by id)
  const hardcodedIds = new Set(BROADER_SEARCHES.map(s => s.id));
  const learnedRows = (learnedSearches || [])
    .filter(ls => !hardcodedIds.has(ls.id))
    .map(ls => ({ ...ls, isLearned: true }));
  const allSearches = [...BROADER_SEARCHES, ...learnedRows];

  const allCities = ["All", ...Array.from(new Set(allSearches.map(s => s.city?.split(" / ")?.[0] || s.city).filter(Boolean)))];

  const filteredUnsorted = allSearches.filter(s =>
    cityFilter === "All" || s.city === cityFilter || s.city?.includes(cityFilter)
  );

  // Sort: hot first, learned (unscanned) second, neutral, cold last
  const sortRank = (s) => {
    const perf = broaderPerf?.[s.id];
    const score = perf?.score ?? null;
    if (score !== null && perfBucket(score) === "hot") return 3;
    if (s.isLearned && (score === null || perf?.scans === 0)) return 2;
    if (score === null || perfBucket(score) === "neutral") return 1;
    return 0;
  };
  const filtered = [...filteredUnsorted].sort((a, b) => sortRank(b) - sortRank(a));

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
    const cityEnc = search.city !== "Multiple" ? encodeURIComponent(search.city) : "";
    const kwEnc = encodeURIComponent(search.query.split(" ").slice(0,5).join("+"));
    const liUrl = "https://www.linkedin.com/jobs/search/?keywords=" + kwEnc + (cityEnc ? "&location=" + cityEnc : "");
    const idUrl = "https://www.idealist.org/en/jobs?q=" + kwEnc + (cityEnc ? "&location=" + cityEnc : "");
    const indeedUrl = "https://www.indeed.com/jobs?q=" + kwEnc + (cityEnc ? "&l=" + cityEnc : "");
    const orgHints = search.hint ? search.hint.split("—")[0].split(",").map(s => s.trim()).filter(Boolean) : [];

    const prompt = `You are a job search assistant. Find current open roles for Bella Daniel-Hunsicker (entry to mid-level, nonprofit/advocacy sector).

SEARCH: ${search.label}
KEYWORDS: ${search.query}
CITY: ${search.city}
${orgHints.length ? "CHECK THESE ORGS SPECIFICALLY: " + orgHints.join(", ") : ""}

Instructions:
1. Search Indeed (${indeedUrl}) for current listings
2. Search Idealist (${idUrl}) for current listings  
3. Search each org named above directly (e.g. "Heartland Alliance careers Chicago")
4. Include coordinator, associate, specialist, officer, manager, director-level roles
5. Be inclusive — if it's in the right city and cause area, include it
6. Exclude only: ICIRR, NIJC, Mozilla, MacArthur, YWCA Toronto, DePaul, AI Now, The 19th, CRR, Open Rights Group, PEN America, AKT, Stonewall, Guttmacher, Action Canada, CCPA (scanned separately)

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
      const data = await callClaudeHaikuSearch(prompt, adaptiveContext);
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
                  {search.isLearned && <span style={{ fontSize: 9, fontWeight: 800, color: "#5B4DB8", background: "#F0EEFF", padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Learned</span>}
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
                    signals={signals}
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

function SavedRoleRow({ role, onRemove, signals }) {
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
        <ThumbBar roleId={role.id} orgName={role.orgName || role.org} signals={signals} />
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

function SavedPanel({ savedRoles, setSavedRoles, signals }) {
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
      agentVersion: "1.3b-v40", exportedAt: new Date().toISOString(),
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
          {high.map(r => <SavedRoleRow key={r.id} role={r} onRemove={() => handleRemove(r.id)} signals={signals} />)}
        </>
      )}

      {other.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "14px 0 8px" }}>Other Saved</div>
          {other.map(r => <SavedRoleRow key={r.id} role={r} onRemove={() => handleRemove(r.id)} signals={signals} />)}
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
function AddPostingPanel({ savedRoles, setSavedRoles, setSignals, setLearnedOrgs, signals }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | manual
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  // Manual entry fallback
  const [manual, setManual] = useState({ title: "", org: "", location: "", type: "Full-time", description: "" });

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
      const isBlocked = !data || !data.title
        || data.title.toUpperCase().includes("UNABLE")
        || (data.org || "").toUpperCase().includes("UNABLE")
        || (data.whyFit || "").toUpperCase().includes("UNABLE TO RETRIEVE");

      if (!isBlocked) {
        // Pre-fill manual fields from parsed data so user can edit before saving
        setManual({ title: data.title, org: data.org || "", location: data.location || "", type: data.type || "Full-time", description: data.whyFit || "" });
        setResult(data);
        setStatus("success");
      } else {
        setManual(prev => ({ ...prev }));
        setStatus("manual");
        setErrorMsg("The site blocked automatic analysis. Enter the details manually below.");
      }
    } catch(e) {
      // Blocked or network error — drop into manual entry
      setManual(prev => ({ ...prev }));
      setStatus("manual");
      setErrorMsg("Couldn't reach that URL. Enter the details manually below.");
    }
  };

  const handleManualSave = async () => {
    if (!manual.title || !manual.org) return;
    setStatus("loading");
    const roleId = "user-" + Date.now();

    // Assess fit via Claude if a description was provided
    let whyFit = null;
    let relevance = "Medium";
    if (manual.description.trim()) {
      const assessPrompt = `You are assessing job fit for Bella Daniel-Hunsicker. She has an MSc in Gender/Sexuality Studies from LSE (Sep 2026) and a BA in Diaspora & Transnational Studies from UofT. She works FROM WITHIN communities. Causes: LGBTQ+ rights, immigrant rights, reproductive rights, digital rights. Cities: Toronto (primary), Chicago (second). No government roles.

Role: ${manual.title}
Organisation: ${manual.org}
Location: ${manual.location || "Unknown"}
Description: ${manual.description}

Return JSON only:
{
  "relevance": "High or Medium or Low",
  "whyFit": "1-2 sentences on why this fits Bella specifically — reference her LSE MSc, PEN Canada, DTS BA, Spanish, Chicago/Toronto connections. Be specific."
}`;
      try {
        const assessment = await callClaudePure(assessPrompt);
        if (assessment?.whyFit) {
          whyFit = assessment.whyFit;
          relevance = assessment.relevance || "Medium";
        }
      } catch(e) { console.error("fit assessment failed:", e); }
    }

    const role = {
      id: roleId,
      title: manual.title,
      org: manual.org,
      location: manual.location || "Unknown",
      type: manual.type || "Full-time",
      relevance,
      whyFit,
      directUrl: url.trim() || null,
      linkedInUrl: null,
      idealistUrl: null,
      salary: null,
      deadline: null,
    };
    try {
      await upsertRole(role, manual.org, "user_submitted");
      setSavedRoles(prev => ({ ...prev, [roleId]: { ...role, orgName: manual.org, savedAt: new Date().toISOString() } }));
      const [updatedSignals, updatedOrgs] = await Promise.all([loadFeedbackSignals(), loadLearnedOrgs()]);
      setSignals(updatedSignals);
      setLearnedOrgs(updatedOrgs);
      setUrl(""); setManual({ title: "", org: "", location: "", type: "Full-time", description: "" });
      setStatus("idle"); setErrorMsg("");
    } catch(e) {
      setStatus("manual");
      setErrorMsg("Save failed: " + (e?.message || "database error"));
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

      {/* Error / Manual fallback */}
      {(status === "error" || status === "manual") && (
        <div style={{ background: "#FDF0F0", border: "1.5px solid #A63228", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#A63228", fontWeight: 700, marginBottom: 6 }}>
            {status === "manual" ? "⚠ Couldn't fetch — enter manually" : "⚠ Error"}
          </div>
          <div style={{ fontSize: 12, color: "#A63228", marginBottom: status === "manual" ? 12 : 0 }}>{errorMsg}</div>

          {status === "manual" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { key: "title", label: "Role title *", placeholder: "e.g. Assistant Director, Programs and Events" },
                { key: "org",   label: "Organization *", placeholder: "e.g. University of Chicago" },
                { key: "location", label: "Location", placeholder: "e.g. Chicago, IL" },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 3 }}>{f.label}</div>
                  <input value={manual[f.key]} onChange={e => setManual(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 6, border: "1.5px solid #DDD", fontFamily: "inherit", outline: "none" }}
                  />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 3 }}>Type</div>
                <select value={manual.type} onChange={e => setManual(prev => ({ ...prev, type: e.target.value }))}
                  style={{ fontSize: 12, padding: "7px 10px", borderRadius: 6, border: "1.5px solid #DDD", fontFamily: "inherit", background: "#FFF" }}>
                  {["Full-time","Part-time","Contract","Fellowship"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 3 }}>Role description</div>
                <div style={{ fontSize: 10, color: "#AAA", marginBottom: 4 }}>Paste the job description — Claude will assess fit and generate "Why this fits Bella" automatically.</div>
                <textarea value={manual.description} onChange={e => setManual(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Paste the full job description here…"
                  rows={5}
                  style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 6, border: "1.5px solid #DDD", fontFamily: "inherit", outline: "none", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleManualSave} disabled={!manual.title || !manual.org || status === "loading"}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none",
                    background: manual.title && manual.org ? "#1E6B3C" : "#CCC",
                    color: "#FFF", fontSize: 13, fontWeight: 700, cursor: manual.title && manual.org ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {status === "loading" ? <><Spinner size={13} color="#FFF" /><span>Assessing fit…</span></> : "★ Save to Roles"}
                </button>
                <button onClick={() => { setStatus("idle"); setErrorMsg(""); setManual({ title: "", org: "", location: "", type: "Full-time", description: "" }); }}
                  style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #DDD", background: "#FFF", color: "#888", fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {status === "error" && (
            <button onClick={() => { setStatus("idle"); setErrorMsg(""); }}
              style={{ marginTop: 4, fontSize: 11, padding: "5px 12px", borderRadius: 6, border: "1.5px solid #DDD", background: "#FFF", cursor: "pointer" }}>
              Try again
            </button>
          )}
        </div>
      )}

      {/* Result preview */}
      {status === "success" && result && (
        <div style={{ border: "1.5px solid #1E6B3C", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: "#1B2A4A", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#FFF" }}>{result.title}</div>
              <div style={{ fontSize: 12, color: "#7A9CC4", marginTop: 2 }}>{result.org} · {result.location} · {result.type}</div>
            </div>
            <button onClick={() => setStatus("editing")} style={{ fontSize: 10, fontWeight: 700, color: "#4DADA3", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", flexShrink: 0, marginLeft: 8 }}>Edit</button>
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
            <ThumbBar roleId={result.id} orgName={result.org} signals={signals} />
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

      {/* Edit mode — tweak parsed fields before saving */}
      {status === "editing" && result && (
        <div style={{ border: "1.5px solid #4DADA3", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: "#1B2A4A", padding: "12px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#4DADA3" }}>Edit before saving</div>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { key: "title", label: "Role title" },
              { key: "org", label: "Organization" },
              { key: "location", label: "Location" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 3 }}>{f.label}</div>
                <input value={manual[f.key]} onChange={e => setManual(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 6, border: "1.5px solid #DDD", fontFamily: "inherit", outline: "none" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 3 }}>Type</div>
              <select value={manual.type} onChange={e => setManual(prev => ({ ...prev, type: e.target.value }))}
                style={{ fontSize: 12, padding: "7px 10px", borderRadius: 6, border: "1.5px solid #DDD", fontFamily: "inherit", background: "#FFF" }}>
                {["Full-time","Part-time","Contract","Fellowship"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#666", marginBottom: 3 }}>Role description</div>
              <textarea value={manual.description} onChange={e => setManual(prev => ({ ...prev, description: e.target.value }))}
                rows={3} style={{ width: "100%", fontSize: 12, padding: "7px 10px", borderRadius: 6, border: "1.5px solid #DDD", fontFamily: "inherit", outline: "none", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => {
                setResult(prev => ({ ...prev, title: manual.title, org: manual.org, location: manual.location, type: manual.type, whyFit: manual.description }));
                setStatus("success");
              }} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#1B2A4A", color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ✓ Apply edits
              </button>
              <button onClick={() => setStatus("success")} style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #DDD", background: "#FFF", color: "#888", fontSize: 13, cursor: "pointer" }}>
                Cancel
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
function InsightSection({ title, headline, children, accent = "#1B2A4A", accentBg = "#F0F3F8" }) {
  return (
    <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: accentBg, padding: "12px 18px", borderBottom: "1.5px solid #E4E4E4" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1B2A4A", lineHeight: 1.4 }}>{headline}</div>
      </div>
      <div style={{ padding: "14px 18px" }}>{children}</div>
    </div>
  );
}

function InsightTag({ label, color = "#1D6A72", bg = "#E8F4F5" }) {
  return <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color, background: bg, padding: "3px 9px", borderRadius: 20, marginRight: 6, marginBottom: 6 }}>{label}</span>;
}

function directionIcon(d) { return d === "rising" ? "↑" : d === "falling" ? "↓" : "✦"; }
function directionColor(d) { return d === "rising" ? "#1E6B3C" : d === "falling" ? "#A63228" : "#5B4DB8"; }

function InsightsPanel({ signals, savedRoles, learnedOrgs, setLearnedOrgs, orgPerf, broaderPerf, briefs, setBriefs, learnedSearches, setLearnedSearches }) {
  const latestSaved = briefs?.[0] || null;
  const [brief, setBrief] = useState(latestSaved ? { ...latestSaved.content, generatedAt: latestSaved.created_at, id: latestSaved.id } : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync brief when briefs array loads from DB (initial mount)
  useEffect(() => {
    if (briefs?.[0] && !brief) {
      const b = briefs[0];
      setBrief({ ...b.content, generatedAt: b.created_at, id: b.id });
    }
  }, [briefs]);

  const savedList = Object.values(savedRoles);

  const [expandedBriefId, setExpandedBriefId] = useState(null);

  const generateBrief = async () => {
    setLoading(true);
    setError(null);

    // Build a compact data snapshot to send to Claude
    const cityCount = {};
    const catCount = {};
    const thumbUps = [];
    const thumbDowns = [];
    const notes = [];

    signals.forEach(s => {
      if (s.city) cityCount[s.city] = (cityCount[s.city] || 0) + 1;
      if (s.category) catCount[s.category] = (catCount[s.category] || 0) + 1;
      if (s.thumb === "up" && s.org) thumbUps.push(s.org);
      if (s.thumb === "down" && s.org) thumbDowns.push(s.org);
      if (s.notes) notes.push(s.notes);
    });

    // Build compact text summaries — group by org to keep prompt lean
    const orgGroups = {};
    savedList.forEach(r => {
      const org = r.orgName || r.org || "Unknown";
      if (!orgGroups[org]) orgGroups[org] = [];
      orgGroups[org].push(r.title);
    });
    const savedLines = Object.entries(orgGroups).map(([org, titles]) =>
      `- ${org}: ${titles.join(", ")}`
    ).join("\n");

    const orgPerfLines = Object.entries(orgPerf || {}).map(([id, p]) => {
      const name = TARGET_ORGS.find(o => o.id === id)?.name || id;
      return `- ${name}: score ${p.score}, ${p.rolesStarred||0} starred, ${p.rolesShown||0} shown, ${p.zeroScans||0} empty scans`;
    }).sort((a,b) => {
      const sa = parseInt(a.match(/score (-?\d+)/)?.[1]||0);
      const sb = parseInt(b.match(/score (-?\d+)/)?.[1]||0);
      return sb-sa;
    }).join("\n");

    const broaderPerfLines = Object.entries(broaderPerf || {}).map(([id, p]) => {
      const name = BROADER_SEARCHES.find(s => s.id === id)?.label || id;
      return `- ${name}: score ${p.score}, ${p.rolesStarred||0} starred, ${p.rolesShown||0} shown`;
    }).join("\n");

    const cityLines = Object.entries(cityCount).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v}`).join(", ");
    const catLines = Object.entries(catCount).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}: ${v}`).join(", ");

    const prompt = `You are the intelligence layer of a job discovery system for Bella Daniel-Hunsicker. Bella: MSc Gender/Sexuality Studies LSE (Sep 2026), BA Diaspora & Transnational Studies UofT. Works FROM WITHIN communities. Causes: LGBTQ+ rights, immigrant rights, reproductive rights, digital rights. Cities: Toronto (primary), Chicago (strong second), New York (deferred), London. No government roles.

SAVED ROLES (${savedList.length} total):
${savedLines}

SIGNALS (${signals.length} total):
- Cities: ${cityLines || "none yet"}
- Categories: ${catLines || "none yet"}
- Thumb up orgs: ${thumbUps.length ? [...new Set(thumbUps)].join(", ") : "none"}
- Thumb down orgs: ${thumbDowns.length ? [...new Set(thumbDowns)].join(", ") : "none"}
- User notes: ${notes.length ? notes.slice(-3).join(" | ") : "none"}

ORG SCAN PERFORMANCE:
${orgPerfLines || "No scans yet"}

BROADER SEARCH PERFORMANCE:
${broaderPerfLines || "No searches yet"}

LEARNED ORGS: ${learnedOrgs.map(o => o.name + " (" + o.city + ")").join(", ") || "none yet"}

Based on all of this, generate a concise strategic brief in exactly this JSON structure:
{
  "profile": {
    "headline": "One sharp sentence describing the current state of Bella's search — what it's converging on",
    "cities": ["ordered list of cities by signal strength"],
    "causes": ["ordered list of cause areas by signal strength"],
    "roleTypes": ["role types/functions that are landing — e.g. Programme Coordinator, Communications, Policy"],
    "orgTypes": ["types of orgs generating signal — e.g. legal advocacy nonprofits, university human rights centers"],
    "summary": "2-3 sentences synthesizing the search profile as it stands today. Be specific — name orgs, cities, causes."
  },
  "changing": {
    "headline": "One sentence on the most significant shift happening in the search",
    "trends": [
      { "label": "Short trend name", "direction": "rising or falling or new", "detail": "One specific sentence on what this trend means and what's driving it" }
    ],
    "summary": "2-3 sentences on how the profile has been changing. If there's not enough history to detect a shift, say so plainly."
  },
  "nextActions": {
    "headline": "One sentence on what the system will focus on next",
    "scanPriorities": ["List of org names or search categories the system will weight highest in next scans"],
    "searchAdjustments": ["Specific adjustments to make to broader search queries based on what's working"],
    "gaps": ["Cause areas, cities, or org types that are underrepresented given Bella's profile and should be explored"],
    "summary": "2-3 sentences on what the system will do differently next time, and what you as the operator should consider doing manually."
  }
}

Also add these arrays to nextActions:
- "newOrgs": up to 5 specific org names NOT already in Bella's scan list but clearly belonging given her profile and signals. Name the actual org, not a category.
- "learnedSearches": up to 4 NEW broader search rows to create based on gaps and thumb signals. Each must have: { "id": "unique-slug", "label": "City — Category Description", "city": "city name", "category": "category", "query": "specific search query string for job boards", "hint": "one-line hint for the operator" }. Create these when thumb down signals or empty scans reveal gaps, or when thumb up signals show a category worth doubling down on that has no dedicated search yet.
- "searchUpdates": up to 4 UPDATES to existing broader searches (by id from this list: toronto-nonprofit, chicago-nonprofit, lgbtq-toronto-chicago, repro-rights, edu-chicago, digital-rights, uk-charity, nyc-nonprofit, chicago-lgbtq, chicago-repro, chicago-university, chicago-immigrant, toronto-lgbtq, toronto-immigrant). Each must have: { "id": "existing-search-id", "query": "updated search query", "hint": "updated hint" }. Update when thumb down notes reveal the current query is too broad or off-target, or when thumb up patterns suggest a tighter angle.

Thumb down signals and their notes are the strongest signal for searchUpdates — if someone thumbed down roles with a note like "too corporate" or "not mission-driven", tighten the query to exclude those patterns.

Return only valid JSON. No markdown, no preamble.`;

    try {
      const data = await callClaudePure(prompt);
      if (data?.profile && data?.changing && data?.nextActions) {
        // Save to DB
        const briefId = await saveBrief(data, signals.length, savedList.length);

        // Write any new orgs Claude identified to learned_orgs
        const newOrgs = data.nextActions?.newOrgs || [];
        for (const orgName of newOrgs) {
          if (!orgName) continue;
          const orgKey = "org-" + orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const alreadyLearned = learnedOrgs.some(lo => lo.name.toLowerCase() === orgName.toLowerCase());
          const alreadyNamed = TARGET_ORGS.some(o => o.name.toLowerCase() === orgName.toLowerCase() || o.fullName?.toLowerCase() === orgName.toLowerCase());
          if (!alreadyLearned && !alreadyNamed) {
            const { error } = await supabase.from("learned_orgs").upsert({
              id: orgKey, name: orgName, city: "Unknown", category: "Advocacy",
              source_role_id: "brief-" + briefId, created_at: new Date().toISOString()
            });
            if (error) console.error("brief learned_org write:", error);
          }
        }
        // Reload learned orgs if new ones were added
        if (newOrgs.length) loadLearnedOrgs().then(orgs => setLearnedOrgs(orgs));

        // Write new learned searches from brief
        const newSearches = data.nextActions?.learnedSearches || [];
        for (const search of newSearches) {
          if (!search?.id || !search?.query) continue;
          const alreadyHardcoded = ["toronto-nonprofit","chicago-nonprofit","lgbtq-toronto-chicago","repro-rights","edu-chicago","digital-rights","uk-charity","nyc-nonprofit"].includes(search.id);
          const alreadyLearned = (learnedSearches || []).some(ls => ls.id === search.id);
          if (!alreadyHardcoded && !alreadyLearned) {
            await saveLearnedSearch({ ...search, source: "brief", created_at: new Date().toISOString() });
          }
        }

        // Apply search query/hint updates to learned_searches table (for dynamic searches)
        const searchUpdates = data.nextActions?.searchUpdates || [];
        for (const update of searchUpdates) {
          if (!update?.id) continue;
          // Only update if it exists in learned_searches (don't touch hardcoded ones in app)
          const isLearned = (learnedSearches || []).some(ls => ls.id === update.id);
          if (isLearned) {
            await updateLearnedSearch(update.id, {
              ...(update.query && { query: update.query }),
              ...(update.hint && { hint: update.hint })
            });
          }
        }

        // Reload learned searches
        if (newSearches.length || searchUpdates.length) {
          loadLearnedSearches().then(searches => setLearnedSearches(searches));
        }

        const enriched = { ...data, generatedAt: new Date().toISOString(), id: briefId };
        setBriefs(prev => [{ id: briefId, content: data, created_at: enriched.generatedAt }, ...prev].slice(0, 10));
        setBrief(enriched);
      } else {
        console.error("Brief parse failed, got:", data);
        setError("Couldn't parse the brief. Try again.");
      }
    } catch(e) {
      console.error("Brief exception:", e);
      setError("Something went wrong generating the brief.");
    }
    setLoading(false);
  };

  if (!savedList.length && !signals.length) return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🧭</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#888" }}>No data yet</div>
      <div style={{ fontSize: 12, color: "#AAA", marginTop: 6 }}>Save some roles or run scans first, then come back here for your first brief.</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Generate / refresh button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1B2A4A" }}>Search Intelligence Brief</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
            {brief ? `Generated ${new Date(brief.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${new Date(brief.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Claude synthesizes all signals into a strategic read on the search."}
          </div>
        </div>
        <button onClick={generateBrief} disabled={loading} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8,
          border: "none", background: loading ? "#E0E0E0" : "#1B2A4A", color: loading ? "#AAA" : "#FFF",
          fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
          flexShrink: 0
        }}>
          {loading ? <><Spinner size={12} color="#AAA" /><span>Generating…</span></> : brief ? "↻ Refresh Brief" : "Generate Brief"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#FDF0F0", border: "1.5px solid #E8B4B0", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#A63228" }}>{error}</div>
      )}

      {/* Brief sections */}
      {brief && (
        <>
          {/* Profile */}
          <InsightSection title="Current Profile" headline={brief.profile.headline} accent="#1B2A4A" accentBg="#F0F3F8">
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Cities</div>
              {brief.profile.cities.map(c => <InsightTag key={c} label={c} color="#1D6A72" bg="#E8F4F5" />)}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Cause Areas</div>
              {brief.profile.causes.map(c => <InsightTag key={c} label={c} color="#5B4DB8" bg="#F0EEFF" />)}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Role Types Landing</div>
              {brief.profile.roleTypes.map(r => <InsightTag key={r} label={r} color="#B8732A" bg="#FDF3E3" />)}
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Org Types</div>
              {brief.profile.orgTypes.map(o => <InsightTag key={o} label={o} color="#1B2A4A" bg="#F0F3F8" />)}
            </div>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, borderTop: "1px solid #F0F0F0", paddingTop: 12 }}>{brief.profile.summary}</div>
          </InsightSection>

          {/* What's changing */}
          <InsightSection title="What's Changing" headline={brief.changing.headline} accent="#1E6B3C" accentBg="#EAF4EE">
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {brief.changing.trends.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: directionColor(t.direction), flexShrink: 0, marginTop: 1 }}>{directionIcon(t.direction)}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#333" }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginTop: 2 }}>{t.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, borderTop: "1px solid #F0F0F0", paddingTop: 12 }}>{brief.changing.summary}</div>
          </InsightSection>

          {/* What the system will do next */}
          <InsightSection title="What Happens Next" headline={brief.nextActions.headline} accent="#5B4DB8" accentBg="#F0EEFF">
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Scan Priorities</div>
              {brief.nextActions.scanPriorities.map(p => <InsightTag key={p} label={p} color="#5B4DB8" bg="#F0EEFF" />)}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Search Adjustments</div>
              {brief.nextActions.searchAdjustments.map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #4DADA3" }}>{a}</div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Gaps to Explore</div>
              {brief.nextActions.gaps.map((g, i) => (
                <div key={i} style={{ fontSize: 12, color: "#555", lineHeight: 1.5, marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #F5C842" }}>{g}</div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, borderTop: "1px solid #F0F0F0", paddingTop: 12 }}>{brief.nextActions.summary}</div>
          </InsightSection>

          {/* New searches from brief */}
          {brief?.nextActions?.learnedSearches?.length > 0 && (
            <div style={{ background: "#E8F4F5", border: "1.5px solid #1D6A72", borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#1D6A72", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>New searches added to Broader Search</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, marginBottom: 8 }}>
                The brief identified these search gaps — they've been added to your Broader Search list automatically:
              </div>
              {brief.nextActions.learnedSearches.map(s => (
                <div key={s.id} style={{ padding: "6px 0", borderBottom: "1px solid #C8E6EC" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1B2A4A" }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{s.city} · {s.category}</div>
                  {s.hint && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{s.hint}</div>}
                </div>
              ))}
            </div>
          )}

          {/* New orgs from brief */}
          {brief?.nextActions?.newOrgs?.length > 0 && (
            <div style={{ background: "#F0EEFF", border: "1.5px solid #5B4DB8", borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#5B4DB8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>New orgs added to scan list</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                The brief identified these orgs as gaps — they've been added to your Org Scan list automatically:
              </div>
              <div style={{ marginTop: 8 }}>
                {brief.nextActions.newOrgs.map(o => <InsightTag key={o} label={o} color="#5B4DB8" bg="#E8E2FF" />)}
              </div>
            </div>
          )}

          {/* Last updated */}
          <div style={{ textAlign: "center", fontSize: 11, color: "#BBB", paddingBottom: 4 }}>
            Based on {signals.length} signals · {savedList.length} saved roles · {learnedOrgs.length} learned orgs
          </div>
        </>
      )}

      {/* Brief history */}
      {briefs.length > 1 && (
        <div style={{ background: "#FFF", border: "1.5px solid #E4E4E4", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1B2A4A" }}>Brief History</div>
            <div style={{ fontSize: 11, color: "#AAA" }}>{briefs.length} saved</div>
          </div>
          {briefs.slice(1).map(b => {
            const isExpanded = expandedBriefId === b.id;
            const d = new Date(b.created_at);
            const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={b.id} style={{ borderBottom: "1px solid #F4F4F4" }}>
                <button onClick={() => setExpandedBriefId(isExpanded ? null : b.id)} style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
                }}>
                  <div style={{ fontSize: 12, color: "#555", fontWeight: 600, textAlign: "left", flex: 1 }}>{b.content?.profile?.headline || "Brief"}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: "#AAA" }}>{label}</span>
                    <span style={{ fontSize: 10, color: "#AAA" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div style={{ padding: "0 18px 14px" }}>
                    <div style={{ fontSize: 12, color: "#444", lineHeight: 1.7, marginBottom: 8 }}>{b.content?.profile?.summary}</div>
                    <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>{b.content?.changing?.headline}</div>
                    {b.content?.nextActions?.scanPriorities?.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Scan priorities at the time</div>
                        {b.content.nextActions.scanPriorities.map(p => <InsightTag key={p} label={p} color="#5B4DB8" bg="#F0EEFF" />)}
                      </div>
                    )}
                    <button onClick={() => { setBrief({ ...b.content, generatedAt: b.created_at, id: b.id }); setExpandedBriefId(null); }}
                      style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: "#1D6A72", background: "#E8F4F5", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                      Restore this brief
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state before first generate */}
      {!brief && !loading && (
        <div style={{ background: "#F7F8FA", border: "1.5px dashed #DDD", borderRadius: 12, padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🧭</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 6 }}>Ready to generate your brief</div>
          <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
            Claude will synthesize {signals.length} signal{signals.length !== 1 ? "s" : ""} and {savedList.length} saved role{savedList.length !== 1 ? "s" : ""} into a strategic read on where Bella's search stands, what's shifting, and what to focus on next.
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
  const [briefs, setBriefs] = useState([]);
  const [learnedSearches, setLearnedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    registerApiErrorHandler(setApiError);
    async function init() {
      const [org, broader, saved, sigs, lorgs, bfs, lsearches] = await Promise.all([
        loadScanResults("org"),
        loadScanResults("broader"),
        loadSavedRoles(),
        loadFeedbackSignals(),
        loadLearnedOrgs(),
        loadBriefs(),
        loadLearnedSearches()
      ]);
      setOrgResults(org);
      setBroaderResults(broader);
      setSavedRoles(saved);
      setSignals(sigs);
      setLearnedOrgs(lorgs);
      setBriefs(bfs);
      setLearnedSearches(lsearches);
      setLoading(false);
    }
    init();
  }, []);

  const latestBrief = briefs[0]?.content || null;
  const adaptiveContext = buildAdaptiveContext(signals, latestBrief);

  const savedRolesList = Object.values(savedRoles);
  const orgPerf = computeSourcePerformance(orgResults, savedRolesList, "org");
  const broaderPerf = computeSourcePerformance(broaderResults, savedRolesList, "broader");
  const perfContext = buildPerformanceContext(orgPerf, broaderPerf, TARGET_ORGS, BROADER_SEARCHES);
  const fullAdaptiveContext = adaptiveContext + perfContext;
  const stats = useGlobalStats(orgResults, broaderResults, savedRoles, learnedOrgs, orgPerf, broaderPerf);

  const tabs = [
    { key: "orgscan",  label: "Org Scan" },
    { key: "broader",  label: "Broader Search" },
    { key: "saved",    label: `Saved ★ ${stats.saved > 0 ? stats.saved : ""}` },
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
      <div style={{ background: "#1B2A4A", padding: "12px 16px 0" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Row 1: logo + title + live dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAIv0lEQVR4nO2dK3IcSRRFsxWOGJNZgbiBwABtQFxcQEzhfQhpHw4zAXNxb0BggIC5VmDiQRowU+5SdX2yMt//3cNsS+X8nL71Mju7uhQAAnHQbkAEzi+u36iu9fryhDnpAINXCaW0rUD2bTBAC1gQeAsIfgoG5H88CLwFBE8udASJl8gqd7pOR5Z4iUxyp+hoRomXiC536M5B5GWiih2yUxC5nmhih+kMJO4ngtxn2g2gADLTEGEcXb8iI0yAVbymtctGQ2Q5vIntqrGeRb58uC3P94/azWjGi9gftBtQiyWZLx9uZ//es7BbnF9cv3mQ2rzQFkReEjgbw1xYFttsw0rRlblF4qWEHl8rSopbldpsQmvI7DWJNepzqyWIOaEtlBge0bgLWCxBTAntSWYrpcPcXWX4O0mxrUhtRmjrMrfKoVnGSIptRWr1BlgSeSofhQhzQlMJRrlwpURTbFWhLcnMBafQa//HFtxia0mtJnQGmUuREXrr/1uDsy0aUquctssiswbP94/VknKntMY8iwudSWbNBeEesTmRnm/RW0ImmUtZF1pDNs13LKXKD7GEziazRTRTW2r+RYSGzLaILDW70Fll9nouhBtuH1iFzipzDZmF5/SCTWjIDNbg8iPEp74BGGARmvLVl/nWHB2OlCYXmkNmb1J7a68m1FKTCs2ZzBElidinFii9MVlDSx/oAXEgE5rqVQaZc0LlD4nQkPkIyoh2KDzqFhoyA0p6fVKvoS8fblPLjESnpUtornd7ssgM5unxqlloCpmRTmCJVr/US44pntMZL1B9moRGOgMJWjxTSeilRaDndO4h4otbq0+7haZI56m4WUWOyvgMTq/Ye31Tq6EHiaPIHDFlW9Aeh11CU2/TRZEZrCOZ0tVC4xMooIaah763UOufuW27rGjfqqMAoQmAjO/hSukaqoRGuQH2wrE+qvEQCQ1E4U7pTaGRzqAVjZRGQhsiSy3O2c9VoZHO22SRsBXplEZCg1BAaCHwruh7uO5si0Kj3KBjz7mViCXM3GG03hf4kp9I6A5q5MPJwiMSR4QhNCOZ5Z0iNRazQqPc6GdtAiE6DXOeIqEZqBEWUvMAoYnZI6rmIZ6onAiNcqMOKumQ1H1MfUVCE9IqJ6SmA0IT0SslpKYBQhMAGe3wTmjUz3VwfcXw+FpYGNYz9hYJ3QFHMiPt+4DQjXCKB6nbOYz/gJIDeOX15elQykjoVpkzP6wc2OL15enwQbsRUfnx5dfqv3/6/FGoJbmA0MRsiTz9OYhNS5fQ2Fo6Uivy0u9BbBrIdzky1s+tMlNfA2DbrhtKESF1PxC6Aw4BIXUfZ6Xk2H++urkjvR6neNTXpu67Vc4vrt9C7nLMTeD3b1/Jri+Roj++/CJbKH7/9pV9TKzgXuit9Ik4aS0M4zAer4iSuxJ6762TY3Ika1zKlB5YSusB75KbFbqn7vM0ARrMpfUaniQ3IzTVwoVzoDV2IDhSemArrdeY/p4VwVWE5lh1WxlQb+xN6yWspDi70BJbRpC5n560XkJD8kMpdEdH//z7D4Im1SMtstabHtLnPKT3rSnnsVlo7c16jVTOInQpfue3K6GneH5l15BFaOl5/PnXP+/+3HPAjbSGnhOMc3CGa6OGpkFjvUN9BJl9USgh+dXNHaTuJMrOk8q2HYfkEmn96fNH8bKDu9zwsP+/BzNvrEwHpGfD38rgWifiu7FmhJ7Sk+KcaS2Z0lzpbOFMDBdmhZ5jr+RI61Oin050JfQcW5JzpLVESlOns5W3prlxL/QcS5J7kZpD5ojyznFWyvExSpHhqqc9XDOLzK8vTwd8SLYTSgHxbI5+IDQBFCJmlJnjQUUha2gNBiH31tUZRV6j90FFEJqYWrEhMg8QmgkIqwOEBmpwPAfx96Iww9YdiMvgL3Y5QCggNAgFhAaheCc06mjgkbG3SGgQCggNQgGhQShOhEYdDTwx9RUJDUIBoUEoZoWmLjvwBZ2AgzlPWQ8nQWQgDUvJcflweyIz5AYSLArdU3Zk+3pkqsdpaT/C1hNLfmJRSATHVzqA/YgKjbIDcLMqNMqOOnq/eAfPud7HmpfiJUf0lN4rNUoNWjaFRkoDS2z5qLIoRErv+zlQT5XQHCmdXWrIvJ8aD7FtR8SeZ1dnebStBiJCZ01pIE+10L0HlrIuEKdpHL3U4AqpWv92JTT1Kbwskg8SZ5GZWuo93onW0M/3j78lziJzFqwcRmtKXKqvUo5ISwp7XhAuiUsVWHurAuxyAHI0775NQuODtKAU/rKixTMkNCBFe23ULDRSOjcW07mUxkXhGCwQT9mzMPS4IJyTmTKZe8ISJQfYBbfMvXQLjdIjDxIy9/pEktCQOj4eZC6FsOSA1Edq62Iv9bMXmUtBDQ0qmMprqWaeQio0UjounGdwKL0hT2hIHRfrMpfCVHJAalADhyeooZnYWvB5WRB6g01opDRYg8sP1oSG1GAOTi/YSw4tqfEBXJtw+yBSQ2tKDbHtIOGBqGhSJ/PWJJZ+UwDP4PgPqVAT3eWwUFMjteWRnHfxbTvuztXKCrFlkA4xtcTkLj9aZOUoRzKXHBp3ZNUSQKKm1habQ+hpnyweFtIqL9VrWsmPcNXIzZ3SrTJbWuhuoblWYv2ewhqGzkuIPUy8h9rZQxunWFj0qws98PrydJBK6yWxtZLOo7xTLMhciiGhS5GVupT3AkeQSgsrMpdiTOhSZEuQMdbq0C0stNeSyAPmGjQm0jM/rm7uFheEtXcHCxIPWJS5FIMJPUa6BLGGJYHHWJW5FONCl6JXgkhiVdwplkUeMN/AMZGlto4HmUtxJvQAxJbDi8gDrho7BWLz4U3kAZeNngKx6fAq8kCIT317nwQrRBhH9x2YA4ldTwSJx4TqzBSIvUw0kQdCdmoKxD4SVeSB0J2bI6Pc0SUek6ajc0SWO5PEY1J2eo4IcmeVeEz6AVjCg+AQ+BQMSCUWBIfA22CACKCUHdL28S+YEEv6iNWJuAAAAABJRU5ErkJggg==" alt="logo" style={{ width: 28, height: 28, flexShrink: 0 }}/>
            <h1 style={{ fontSize: 15, fontWeight: 800, color: "#FFF", letterSpacing: "-0.01em", flex: 1, minWidth: 0 }}>Job Posting Discovery Agent</h1>
            <div
              title={apiError === "credits" ? "API credits exhausted — top up at console.anthropic.com/settings/billing" : apiError === "other" ? "API error — check console for details" : "Live search active"}
              style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, cursor: apiError ? "help" : "default" }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: apiError ? "#A63228" : "#4DADA3",
                animation: apiError ? "none" : "spin 3s linear infinite"
              }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: apiError ? "#E57373" : "#4DADA3" }}>
                {apiError === "credits" ? "No credits" : apiError === "other" ? "API error" : "Live"}
              </span>
            </div>
          </div>

          {/* Row 2: stats strip */}
          <div style={{ display: "flex", gap: 0, marginBottom: 10, background: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden" }}>
            {[
              { label: "Saved", value: stats.saved, color: "#F5C842" },
              { label: "High yield", value: stats.highYield, color: "#4DADA3" },
              { label: "New this week", value: stats.newThisWeek, color: "#FFF" },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#4A6FA5", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Row 3: tagline */}
          <p style={{ fontSize: 10, color: "#4A6FA5", marginBottom: 10, lineHeight: 1.4 }}>Bella Daniel-Hunsicker · LGBTQ+ · Immigrant Rights · Reproductive Rights · Digital Rights</p>

          {/* Tab bar — horizontally scrollable */}
          <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(255,255,255,0.1)", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            <style>{`.tabbar::-webkit-scrollbar{display:none}`}</style>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: "9px 13px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12,
                background: "transparent", color: tab === t.key ? "#FFF" : "#5A7FAA",
                borderBottom: tab === t.key ? "2px solid #4DADA3" : "2px solid transparent",
                marginBottom: -2, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "14px 12px 32px" }}>
        {tab === "orgscan" && (
          <OrgScanPanel
            results={orgResults} setResults={setOrgResults}
            savedRoles={savedRoles} setSavedRoles={setSavedRoles}
            adaptiveContext={fullAdaptiveContext}
            learnedOrgs={learnedOrgs} setLearnedOrgs={setLearnedOrgs}
            orgPerf={orgPerf} signals={signals}
          />
        )}
        {tab === "broader" && (
          <BroaderSearchPanel
            results={broaderResults} setResults={setBroaderResults}
            savedRoles={savedRoles} setSavedRoles={setSavedRoles}
            adaptiveContext={fullAdaptiveContext}
            broaderPerf={broaderPerf} setLearnedOrgs={setLearnedOrgs} signals={signals}
            learnedSearches={learnedSearches}
          />
        )}
        {tab === "saved" && (
          <SavedPanel savedRoles={savedRoles} setSavedRoles={setSavedRoles} signals={signals} />
        )}
        {tab === "add" && (
          <AddPostingPanel
            savedRoles={savedRoles} setSavedRoles={setSavedRoles}
            setSignals={setSignals} setLearnedOrgs={setLearnedOrgs} signals={signals}
          />
        )}
        {tab === "insights" && (
          <InsightsPanel
            signals={signals} savedRoles={savedRoles}
            learnedOrgs={learnedOrgs} setLearnedOrgs={setLearnedOrgs}
            orgPerf={orgPerf} broaderPerf={broaderPerf}
            briefs={briefs} setBriefs={setBriefs}
            learnedSearches={learnedSearches} setLearnedSearches={setLearnedSearches}
          />
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid #E4E4E4", padding: "14px 20px", textAlign: "center", background: "#FFF" }}>
        <div style={{ fontSize: 11, color: "#BBB" }}>
          Career Discovery System · v40 &nbsp;·&nbsp; © {new Date().getFullYear()} &nbsp;·&nbsp; Built for Bella Daniel-Hunsicker
        </div>
      </div>

    </div>
  );
}
