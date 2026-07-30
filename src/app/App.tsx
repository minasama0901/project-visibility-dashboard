import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  ChevronDown,
  FileText,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const project = {
  name: "PTX-201 API Manufacturing Campaign",
  client: "Potential Therapeutics, Inc.",
  code: "PRJ-2026-PT-0317",
  product: "PTX-201 Active Pharmaceutical Ingredient",
  cdmoPM: "Mina Kang",
  clientPM: "John Doe",
  health: "On Track",
  lastUpdated: "Jul 8, 2026 · 14:32 UTC",
};

const milestones = [
  { label: "Tech Transfer", date: "Feb 2026", status: "done" },
  { label: "Material Readiness", date: "Mar 2026", status: "done" },
  { label: "Intermediate Mfg.", date: "Apr–May 2026", status: "done" },
  { label: "Final API Mfg.", date: "Jun–Jul 2026", status: "active" },
  { label: "QC / QA Release", date: "Aug 2026", status: "upcoming" },
  { label: "Shipment", date: "Sep 2026", status: "upcoming" },
  { label: "Project Close", date: "Oct 2026", status: "upcoming" },
];

const STAGES = ["RM Ready", "Reaction", "Workup", "Cryst.", "Drying", "Milling", "Packaging", "QA Release", "Shipped"];

const batches = [
  { id: "PTX201-B001", name: "Batch 001", stage: "Shipped", stageIdx: 8, planned: "Jun 30, 2026", status: "completed", note: "QA released. Dispatched to Potential Therapeutics on Jul 1 via Safety Logistics. Tracking reference: SL-LG-2026-0701." },
  { id: "PTX201-B002", name: "Batch 002", stage: "Drying", stageIdx: 4, planned: "Jul 18, 2026", status: "active", note: "Currently in drying step. On schedule. Temperature excursion deviation report in preparation." },
  { id: "PTX201-B003", name: "Batch 003", stage: "Crystallization", stageIdx: 3, planned: "Jul 28, 2026", status: "active", note: "Crystallization underway. No deviations observed. Starting material lot SM-2047 CoA pending." },
  { id: "PTX201-B004", name: "Batch 004", stage: "Workup", stageIdx: 2, planned: "Aug 8, 2026", status: "active", note: "Workup in progress. Yield within specification range." },
  { id: "PTX201-INT1", name: "Intermediate 1", stage: "Shipped", stageIdx: 8, planned: "May 15, 2026", status: "completed", note: "Intermediate 2 production completed. Used as starting material for Batch 001–002." },
];

type ActionStatus = "open" | "in-progress" | "completed" | "at-risk";
type Priority = "high" | "medium" | "low";

const actions: Array<{
  id: number;
  title: string;
  owner: string;
  dept: string;
  pic: string;
  due: string;
  status: ActionStatus;
  note: string;
}> = [
  { id: 1, title: "Provide updated CoA for starting material lot SM-2047", owner: "Potential Therapeutics", dept: "Supply Chain", pic: "J. Doe", due: "Jul 10, 2026", status: "open", note: "Required for B003 mfg. start" },
  { id: 2, title: "Submit deviation report for Batch 002 temperature excursion", owner: "Yuhan CDMO", dept: "QA", pic: "M. Kang", due: "Jul 12, 2026", status: "in-progress", note: "Draft under internal review" },
  { id: 3, title: "Approve revised process parameter specifications v2.1", owner: "Potential Therapeutics", dept: "Process Dev.", pic: "Dr. A. Patel", due: "Jul 15, 2026", status: "in-progress", note: "Sent for review Jul 5" },
  { id: 4, title: "Schedule QC audit for Batch 001 release package", owner: "Yuhan CDMO", dept: "Quality Control", pic: "M. Chen", due: "Jul 8, 2026", status: "completed", note: "Audit complete. All items resolved." },
  { id: 5, title: "Confirm shipment destination and incoterms for Batch 001", owner: "Potential Therapeutics", dept: "Logistics", pic: "S. Lee", due: "Jul 14, 2026", status: "at-risk", note: "No response since Jun 28. Escalated." },
  { id: 6, title: "Update raw material forecast for Q3 2026 batches", owner: "Yuhan CDMO", dept: "Planning", pic: "M. Kang", due: "Jul 20, 2026", status: "open", note: "Awaiting client yield expectations" },
  { id: 7, title: "Provide reference standard material for impurity testing", owner: "Potential Therapeutics", dept: "Analytical", pic: "Dr. A. Patel", due: "Jul 22, 2026", status: "open", note: "Required for QC method validation" },
];

const FOLLOW_UP_STATES = ["Submitted", "Under Review", "Data Shared", "Confirm Pending", "Closed"];

const followUps = [
  { title: "CoA for SM-2047 — Lot Certification", current: 0 },
  { title: "Deviation Report B002 — QA Review", current: 2 },
  { title: "Shipment Confirmation B001 — Logistics", current: 0 },
  { title: "Process Parameter Spec v2.1 Approval", current: 2 },
];

const clientRequests: Array<{ id: string; title: string; details: string; date: string; priority: Priority; due: string }> = [
  { id: "cr1", title: "Updated impurity profile report", details: "Please provide updated impurity profile for Batch 002 including the new Imp-D limits discussed in the Jul 3 call.", date: "Jul 4, 2026", priority: "high", due: "Jul 12, 2026" },
  { id: "cr2", title: "Particle size distribution data — Batch 001", details: "Milled material PSD report needed for internal drug product formulation team. Final report preferred.", date: "Jul 6, 2026", priority: "medium", due: "Jul 16, 2026" },
];

const cdmoRequests: Array<{ id: string; title: string; details: string; date: string; priority: Priority; due: string }> = [
  { id: "dr1", title: "Approved shipping protocol for PTX-201 API", details: "Please share approved shipping protocol and cold chain requirements for PTX-201 API dispatch. Needed to finalize Batch 001 logistics with Safety Logistics.", date: "Jul 5, 2026", priority: "high", due: "Jul 11, 2026" },
  { id: "dr2", title: "Confirm Q3 batch scale requirements", details: "Awaiting confirmation of planned scales for Batches 005–007 to schedule equipment and procure raw materials.", date: "Jul 7, 2026", priority: "medium", due: "Jul 18, 2026" },
];

const recentUpdates = [
  { date: "Jul 8", text: "Batch 002 drying initiated. Estimated completion in 3 days." },
  { date: "Jul 6", text: "Batch 001 QA release package approved by QA." },
  { date: "Jul 4", text: "Intermediate 1 shipment confirmed and dispatched via Safety Logistics." },
  { date: "Jul 2", text: "Batch 003 crystallization started on schedule." },
];

const upcomingMilestones = [
  { date: "Jul 10", label: "SM-2047 CoA Due", urgent: true },
  { date: "Jul 18", label: "Batch 002 Completion", urgent: false },
  { date: "Jul 28", label: "Batch 003 Completion", urgent: false },
  { date: "Aug 8", label: "Batch 004 Completion", urgent: false },
];

const escalations = [
  { level: "high", text: "Shipment confirmation overdue — Safety Logistics (6 days)" },
  { level: "medium", text: "Deviation report B002 pending QA internal sign-off" },
];

const documents = [
  { name: "Batch 002 Deviation Report v1.0", status: "Yuhan Review" },
  { name: "Process Parameter Spec v2.1", status: "Potential Review" },
  { name: "Batch 001 Release Package", status: "Approved" },
];

// ─── Status & Priority Helpers ────────────────────────────────────────────────

const STATUS_CFG: Record<ActionStatus, { bg: string; text: string; dot: string; label: string }> = {
  open:          { bg: "bg-slate-100",  text: "text-slate-600",  dot: "bg-slate-400",  label: "Open" },
  "in-progress": { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   label: "In Progress" },
  completed:     { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "Completed" },
  "at-risk":     { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  label: "At Risk" },
};

const PRIORITY_CFG: Record<Priority, { bg: string; text: string }> = {
  high:   { bg: "bg-red-50",   text: "text-red-700" },
  medium: { bg: "bg-amber-50", text: "text-amber-700" },
  low:    { bg: "bg-slate-100", text: "text-slate-600" },
};

function StatusPill({ status }: { status: ActionStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const p = PRIORITY_CFG[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide shrink-0 ${p.bg} ${p.text}`}>
      {priority}
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, boolean>>({
    "cr1-cdmo": true,  "cr1-client": true,
    "cr2-cdmo": true,  "cr2-client": false,
    "dr1-cdmo": true,  "dr1-client": false,
    "dr2-cdmo": false, "dr2-client": false,
  });

  const toggle = (key: string) => setReviews(p => ({ ...p, [key]: !p[key] }));

  return (
    <div
      className="bg-background min-h-screen text-foreground"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Sticky Header ──────────────────────────────────────── */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-xl">
        <div className="max-w-[1440px] mx-auto px-6 py-3.5">
          {/* Top row */}
          <div className="flex items-start justify-between gap-8">
            {/* Left: project identity */}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="font-mono text-[11px] px-2 py-0.5 rounded border text-white/70 border-white/15 bg-white/5"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {project.code}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-white/50 truncate">{project.product}</span>
              </div>
              <h1 className="text-base font-semibold leading-tight">{project.name}</h1>
              <p className="text-sm text-white/55 mt-0.5">{project.client}</p>
            </div>

            {/* Center: PM names */}
            <div className="flex items-center gap-7 shrink-0 mt-0.5">
              <div className="text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">CDMO PM</div>
                <div className="text-sm font-medium">{project.cdmoPM}</div>
                <div className="text-[11px] text-accent">Yuhan CDMO</div>
              </div>
              <div className="w-px h-9 bg-white/12" />
              <div className="text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Client PM</div>
                <div className="text-sm font-medium">{project.clientPM}</div>
                <div className="text-[11px] text-accent">Potential Therapeutics</div>
              </div>
            </div>

            {/* Right: health + timestamp */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 text-green-300 text-xs font-semibold border border-green-500/25">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {project.health}
              </span>
              <span className="text-[11px] text-white/40">Updated {project.lastUpdated}</span>
            </div>
          </div>

          {/* Quick chips row */}
          <div className="flex gap-2.5 mt-3 pt-3 border-t border-white/10">
            {[
              { label: "Current Phase",     value: "Final API Manufacturing",  color: "bg-white/6 border-white/10" },
              { label: "Next Milestone",    value: "Batch 003 — Jul 28",       color: "bg-white/6 border-white/10" },
              { label: "Open Actions",      value: "7 items",                  color: "bg-accent/15 border-accent/25" },
              { label: "Pending Requests",  value: "3 requests",               color: "bg-amber-500/10 border-amber-500/20" },
            ].map(chip => (
              <div
                key={chip.label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-default hover:bg-white/10 transition-colors ${chip.color}`}
              >
                <span className="text-white/45">{chip.label}:</span>
                <span className="text-white font-semibold">{chip.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Page body ────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 py-5 flex gap-5 items-start">

        {/* ── Main content column ──────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col gap-5">

          {/* 1. Project Lifecycle Timeline */}
          <section className="bg-card rounded-xl border border-border shadow-sm px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                Project Lifecycle Timeline
              </h2>
              <span
                className="text-[11px] text-muted-foreground"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >Feb 2026 – Oct 2026</span>
            </div>

            <div className="relative px-6">
              {/* Base track */}
              <div className="absolute left-6 right-6 top-5 h-px bg-slate-200" />
              {/* Progress track: 3 of 6 gaps filled (done→active = 3/6) */}
              <div
                className="absolute left-6 top-5 h-px bg-primary"
                style={{ width: "calc((3 / 6) * 100%)" }}
              />

              <div className="relative flex justify-between">
                {milestones.map((m, i) => (
                  <div key={i} className="flex flex-col items-center" style={{ width: `${100 / milestones.length}%` }}>
                    {/* Node */}
                    <div
                      className={[
                        "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                        m.status === "done"
                          ? "bg-primary border-primary"
                          : m.status === "active"
                          ? "bg-white border-accent ring-4 ring-accent/20"
                          : "bg-white border-slate-200",
                      ].join(" ")}
                    >
                      {m.status === "done" && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {m.status === "active" && (
                        <div className="w-3 h-3 rounded-full bg-accent" />
                      )}
                      {m.status === "upcoming" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="mt-3 text-center px-1">
                      <div
                        className={`text-xs font-semibold leading-tight ${
                          m.status === "active"   ? "text-accent" :
                          m.status === "done"     ? "text-primary" :
                          "text-slate-400"
                        }`}
                      >
                        {m.label}
                      </div>
                      <div
                        className="text-[10px] text-muted-foreground mt-0.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {m.date}
                      </div>
                      {m.status === "active" && (
                        <div className="mt-1.5 text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                          ▼ NOW
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Batch & Campaign Tracker */}
          <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                Batch & Campaign Tracker
              </h2>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                  Completed stage
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-accent inline-block" />
                  Current stage
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
                  Pending
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {batches.map(batch => (
                <div key={batch.id}>
                  <div
                    className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                    onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                  >
                    {/* ID */}
                    <div className="w-32 shrink-0">
                      <div
                        className="text-[11px] font-semibold text-primary"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {batch.id}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{batch.name}</div>
                    </div>

                    {/* Stage pipeline */}
                    <div className="flex-1 flex gap-0.5">
                      {STAGES.map((stage, i) => (
                        <div key={i} className="flex-1 group relative">
                          <div
                            className={[
                              "h-5 rounded-sm transition-all",
                              i < batch.stageIdx
                                ? "bg-primary"
                                : i === batch.stageIdx
                                ? "bg-accent"
                                : "bg-slate-100 border border-slate-200",
                            ].join(" ")}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-primary text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-20 shadow-lg pointer-events-none">
                            {stage}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Current stage badge */}
                    <div className="w-28 shrink-0 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded ${
                          batch.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {batch.stage}
                      </span>
                    </div>

                    {/* Planned date */}
                    <div
                      className="w-28 shrink-0 text-[11px] text-muted-foreground"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {batch.planned}
                    </div>

                    {/* Status */}
                    <div className="w-24 shrink-0">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                          batch.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {batch.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-300 transition-transform shrink-0 ${
                        expandedBatch === batch.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Expanded note */}
                  {expandedBatch === batch.id && (
                    <div className="px-5 pb-3.5 flex gap-4">
                      <div className="w-32 shrink-0" />
                      <div className="flex-1 bg-slate-50 rounded-lg px-4 py-2.5 text-xs text-slate-600 border-l-2 border-accent"><span className="font-semibold text-accent">Note: </span>{batch.note}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Stage legend */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex gap-4 overflow-x-auto">
              {STAGES.map((stage, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 shrink-0 text-[10px] text-muted-foreground"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="text-slate-300">{i + 1}.</span>
                  {stage}
                </div>
              ))}
            </div>
          </section>

          {/* 3. Action Items */}
          <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                Action Items
              </h2>
              <div className="flex gap-2">
                {(["open", "in-progress", "at-risk", "completed"] as ActionStatus[]).map(s => (
                  <StatusPill key={s} status={s} />
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-left border-b border-slate-100">
                    <th className="px-4 py-2.5 text-muted-foreground font-semibold w-8">#</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold">Action Item</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold w-20">Owner</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold w-28">Department</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold w-24">PIC</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold w-28">Due Date</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold w-28">Status</th>
                    <th className="px-3 py-2.5 text-muted-foreground font-semibold">Progress Note</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map(a => (
                    <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                      <td
                        className="px-4 py-3 text-slate-300"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {a.id}
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-medium text-foreground leading-snug">{a.title}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            a.owner === "Yuhan CDMO"
                              ? "bg-primary/8 text-primary"
                              : "bg-accent/10 text-accent"
                          }`}
                          style={{
                            backgroundColor:
                              a.owner === "Yuhan CDMO"
                                ? "rgba(28,53,87,0.08)"
                                : "rgba(13,158,138,0.10)",
                          }}
                        >
                          {a.owner === "Yuhan CDMO" ? "Yuhan" : "Potential"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{a.dept}</td>
                      <td className="px-3 py-3 font-medium text-foreground">{a.pic}</td>
                      <td
                        className="px-3 py-3 text-muted-foreground"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {a.due}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={a.status} />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground italic">{a.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 + 5. Follow-up Timeline & Mutual Requests */}
          <div className="grid grid-cols-2 gap-5">

            {/* 4. Follow-up Progress */}
            <section className="bg-card rounded-xl border border-border shadow-sm p-5">
              <h2 className="text-xs font-bold text-primary uppercase tracking-widest mb-5">
                Follow-up Progress
              </h2>

              <div className="flex flex-col gap-6">
                {followUps.map((item, fi) => (
                  <div key={fi}>
                    <div className="text-[11px] font-semibold text-foreground mb-3 leading-snug">
                      {item.title}
                    </div>
                    <div className="relative flex items-start">
                      {/* Base track */}
                      <div className="absolute left-0 right-0 top-[7px] h-px bg-slate-100" />
                      {/* Filled track */}
                      <div
                        className="absolute left-0 top-[7px] h-px bg-accent transition-all"
                        style={{ width: `${(item.current / (FOLLOW_UP_STATES.length - 1)) * 100}%` }}
                      />
                      {FOLLOW_UP_STATES.map((state, si) => (
                        <div key={si} className="flex-1 flex flex-col items-center relative z-10">
                          <div
                            className={[
                              "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all",
                              si < item.current
                                ? "bg-accent border-accent"
                                : si === item.current
                                ? "bg-white border-accent ring-2 ring-accent/20"
                                : "bg-white border-slate-200",
                            ].join(" ")}
                          >
                            {si < item.current && (
                              <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {si === item.current && (
                              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            )}
                          </div>
                          <div
                            className={`mt-2 text-[9px] text-center leading-tight px-0.5 ${
                              si === item.current
                                ? "text-accent font-bold"
                                : si < item.current
                                ? "text-slate-400"
                                : "text-slate-300"
                            }`}
                          >
                            {state}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Mutual Request Board */}
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                  Mutual Request Board
                </h2>
              </div>

              <div className="grid grid-cols-2 divide-x divide-border h-[calc(100%-53px)]">
                {/* Client → CDMO */}
                <div className="p-4 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                      Potential → Yuhan
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {clientRequests.map(req => (
                      <div
                        key={req.id}
                        className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-accent/25 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold text-foreground leading-tight">
                            {req.title}
                          </span>
                          <PriorityBadge priority={req.priority} />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug mb-2.5">
                          {req.details}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] text-muted-foreground"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Due: {req.due}
                          </span>
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="w-3 h-3 accent-[#0d9e8a] rounded"
                                checked={reviews[`${req.id}-cdmo`] ?? false}
                                onChange={() => toggle(`${req.id}-cdmo`)}
                              />
                              <span
                                className={`text-[10px] font-medium ${
                                  reviews[`${req.id}-cdmo`] ? "text-accent" : "text-slate-300"
                                }`}
                              >
                                Yuhan ✓
                              </span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="w-3 h-3 accent-[#1c3557] rounded"
                                checked={reviews[`${req.id}-client`] ?? false}
                                onChange={() => toggle(`${req.id}-client`)}
                              />
                              <span
                                className={`text-[10px] font-medium ${
                                  reviews[`${req.id}-client`] ? "text-primary" : "text-slate-300"
                                }`}
                              >
                                Potential ✓
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yuhan → Potential */}
                <div className="p-4 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      Yuhan → Potential
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {cdmoRequests.map(req => (
                      <div
                        key={req.id}
                        className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold text-foreground leading-tight">
                            {req.title}
                          </span>
                          <PriorityBadge priority={req.priority} />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug mb-2.5">
                          {req.details}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] text-muted-foreground"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Due: {req.due}
                          </span>
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="w-3 h-3 accent-[#0d9e8a] rounded"
                                checked={reviews[`${req.id}-cdmo`] ?? false}
                                onChange={() => toggle(`${req.id}-cdmo`)}
                              />
                              <span
                                className={`text-[10px] font-medium ${
                                  reviews[`${req.id}-cdmo`] ? "text-accent" : "text-slate-300"
                                }`}
                              >
                                Yuhan ✓
                              </span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                className="w-3 h-3 accent-[#1c3557] rounded"
                                checked={reviews[`${req.id}-client`] ?? false}
                                onChange={() => toggle(`${req.id}-client`)}
                              />
                              <span
                                className={`text-[10px] font-medium ${
                                  reviews[`${req.id}-client`] ? "text-primary" : "text-slate-300"
                                }`}
                              >
                                Potential ✓
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* ── Right Summary Rail ───────────────────────────────── */}
        <aside className="w-[272px] shrink-0 flex flex-col gap-4 sticky top-[131px]">

          {/* Upcoming milestones */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              Upcoming Milestones
            </h3>
            <div className="flex flex-col gap-1.5">
              {upcomingMilestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                    m.urgent
                      ? "bg-red-50 border border-red-100"
                      : "hover:bg-slate-50 transition-colors"
                  }`}
                >
                  <span className={`text-xs ${m.urgent ? "text-red-700 font-medium" : "text-foreground"}`}>
                    {m.label}
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${m.urgent ? "text-red-600" : "text-muted-foreground"}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {m.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation risks */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Escalation Risks
            </h3>
            <div className="flex flex-col gap-2">
              {escalations.map((e, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg ${
                    e.level === "high"
                      ? "bg-red-50 border border-red-100"
                      : "bg-amber-50 border border-amber-100"
                  }`}
                >
                  <span
                    className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                      e.level === "high" ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                  <span
                    className={`text-[11px] leading-snug ${
                      e.level === "high" ? "text-red-700" : "text-amber-700"
                    }`}
                  >
                    {e.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              Documents Awaiting Review
            </h3>
            <div className="flex flex-col divide-y divide-slate-50">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-start justify-between gap-2 py-2 first:pt-0 last:pb-0">
                  <span className="text-[11px] text-foreground leading-snug">{doc.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${
                      doc.status === "Approved"
                        ? "bg-green-50 text-green-700"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent updates */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 shrink-0" />
              Recent Updates
            </h3>
            <div className="flex flex-col gap-3">
              {recentUpdates.map((u, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="text-[10px] text-muted-foreground w-10 shrink-0 pt-0.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {u.date}
                  </span>
                  <div className="flex items-start gap-1.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                    <span className="text-[11px] text-muted-foreground leading-snug">{u.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
