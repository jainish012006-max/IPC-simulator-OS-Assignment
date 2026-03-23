import { useState, useEffect, useContext, createContext } from "react";

// ── THEME DEFINITIONS ──────────────────────────────────────────────────────────
const DARK = {
  isDark: true,
  bg: "#050508",
  bgGradient: "linear-gradient(135deg, #050508 0%, #0a0a14 25%, #080814 50%, #050510 100%)",
  ambientBg: `
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,245,255,0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(180,77,255,0.1) 0%, transparent 45%),
    radial-gradient(ellipse 50% 30% at 0% 80%, rgba(0,255,136,0.08) 0%, transparent 40%),
    linear-gradient(180deg, transparent 0%, rgba(5,5,8,0.3) 100%)`,
  gridLine: "rgba(0,245,255,0.03)",
  panel: "rgba(12,12,22,0.85)",
  header: "rgba(8,8,18,0.7)",
  headerShadow: "0 4px 30px rgba(0,245,255,0.05)",
  border: "rgba(0,245,255,0.15)",
  accent: "#00f5ff", accent2: "#b44dff", accent3: "#00ff88",
  warn: "#ffb020", danger: "#ff3366", priorityLow: "rgba(161,161,170,0.9)",
  text: "#e4e4e7", muted: "rgba(161,161,170,0.9)",
  card: "rgba(18,18,28,0.6)", cardBorder: "rgba(255,255,255,0.06)",
  cardShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset",
  onAccent: "#050508", inputBg: "rgba(5,5,10,0.8)", logBg: "rgba(5,5,12,0.6)",
  emptySlotBg: "rgba(5,5,12,0.8)", logoShadow: "0 0 20px rgba(0,245,255,0.5), 0 0 40px rgba(0,245,255,0.2)",
  tabActive: "0 0 20px rgba(0,245,255,0.2)",
  btnGlow: (c) => `0 0 15px ${c}22`, btnFillGlow: (c) => `0 0 20px ${c}44, 0 4px 15px rgba(0,0,0,0.3)`,
  badgeGlow: (c) => `0 0 12px ${c}22`, logGlow: true,
  scrollTrack: "rgba(5,5,10,0.8)", scrollThumb: "linear-gradient(180deg,rgba(0,245,255,0.4) 0%,rgba(180,77,255,0.3) 100%)",
  scrollThumbHover: "rgba(0,245,255,0.6)", hoverGlow: "0 0 25px rgba(0,245,255,0.35), 0 4px 20px rgba(0,0,0,0.4)",
  navBadgeHover: "0 0 25px rgba(0,245,255,0.6), 0 0 50px rgba(0,245,255,0.3)",
  inputFocusBorder: "rgba(0,245,255,0.5)", inputFocusShadow: "0 0 20px rgba(0,245,255,0.15)", bodyBg: "#050508",
};

const LIGHT = {
  isDark: false,
  bg: "#f8fafc",
  bgGradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 70%, #f1f5f9 100%)",
  ambientBg: `
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14,165,233,0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139,92,246,0.06) 0%, transparent 45%),
    radial-gradient(ellipse 50% 30% at 0% 80%, rgba(16,185,129,0.06) 0%, transparent 40%)`,
  gridLine: "rgba(148,163,184,0.12)",
  panel: "rgba(241,245,249,0.95)", header: "rgba(255,255,255,0.9)",
  headerShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "rgba(148,163,184,0.4)",
  accent: "#0ea5e9", accent2: "#8b5cf6", accent3: "#10b981",
  warn: "#f59e0b", danger: "#ef4444", priorityLow: "#6366f1",
  text: "#1e293b", muted: "#64748b",
  card: "rgba(255,255,255,0.9)", cardBorder: "rgba(203,213,225,0.8)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
  onAccent: "#ffffff", inputBg: "#ffffff", logBg: "#f1f5f9",
  emptySlotBg: "#f1f5f9", logoShadow: "none",
  tabActive: "0 2px 8px rgba(14,165,233,0.25)",
  btnGlow: () => "0 1px 2px rgba(0,0,0,0.05)", btnFillGlow: (c) => `0 4px 14px ${c}44`,
  badgeGlow: () => "0 1px 2px rgba(0,0,0,0.06)", logGlow: false,
  scrollTrack: "#e2e8f0", scrollThumb: "#94a3b8", scrollThumbHover: "#64748b",
  hoverGlow: "0 4px 12px rgba(0,0,0,0.12)", navBadgeHover: "0 4px 12px rgba(14,165,233,0.25)",
  inputFocusBorder: "rgba(14,165,233,0.6)", inputFocusShadow: "0 0 0 3px rgba(14,165,233,0.15)", bodyBg: "#f8fafc",
};

const ThemeCtx = createContext(DARK);
const useTheme = () => useContext(ThemeCtx);

// ── BREAKPOINT HOOK ────────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w < 900, w };
}

const PROC_PALETTE_DARK  = ["#00f5ff","#b44dff","#00ff88","#ffb020","#ff6eb4","#a78bfa","#34d399","#fb923c"];
const PROC_PALETTE_LIGHT = ["#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ec4899","#7c3aed","#059669","#ea580c"];

function buildProcesses(n, isDark = true) {
  const pal = isDark ? PROC_PALETTE_DARK : PROC_PALETTE_LIGHT;
  return Array.from({ length: n }, (_, i) => ({ id: `P${i + 1}`, color: pal[i % pal.length] }));
}

// ── STYLE FACTORY ──────────────────────────────────────────────────────────────
function makeStyles(T, bp) {
  const pad = bp.isMobile ? "12px 16px" : bp.isTablet ? "16px 24px" : "20px 36px";
  const mainPad = bp.isMobile ? "16px" : bp.isTablet ? "20px 24px" : "32px 36px";

  return {
    app: { fontFamily:"'DM Sans',-apple-system,sans-serif", background:T.bgGradient, minHeight:"100vh", color:T.text, padding:"0", position:"relative", overflowX:"hidden" },
    header: { background:T.header, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`, boxShadow:T.headerShadow, padding:pad, display:"flex", alignItems:"center", gap:"12px", flexWrap: bp.isMobile ? "wrap" : "nowrap" },
    logo: { fontFamily:"'Syne',sans-serif", fontSize: bp.isMobile ? "18px" : "24px", fontWeight:"800", color:T.accent, letterSpacing: bp.isMobile ? "2px" : "3px", textTransform:"uppercase", textShadow:T.logoShadow },
    subtitle: { fontSize: bp.isMobile ? "10px" : "13px", color:T.muted, letterSpacing:"1px", fontFamily:"'DM Sans',sans-serif", display: bp.isMobile ? "none" : "block" },
    tabs: { display:"flex", gap:"0", padding: bp.isMobile ? "0 8px" : bp.isTablet ? "0 16px" : "0 36px", borderBottom:`1px solid ${T.border}`, background:T.panel, backdropFilter:"blur(12px)", overflowX:"auto", WebkitOverflowScrolling:"touch" },
    tab: (active) => ({ padding: bp.isMobile ? "12px 12px" : "16px 28px", cursor:"pointer", fontSize: bp.isMobile ? "11px" : "13px", fontWeight:active?"700":"500", color:active?T.accent:T.muted, borderBottom:active?`2px solid ${T.accent}`:"2px solid transparent", boxShadow:active?T.tabActive:"none", transition:"all 0.25s ease", letterSpacing: bp.isMobile ? "0px" : "1px", background:"transparent", border:"none", fontFamily:"'Syne',sans-serif", whiteSpace:"nowrap", flexShrink:0 }),
    main: { padding:mainPad, maxWidth:"1200px", margin:"0 auto", position:"relative", zIndex:1 },
    grid2: { display:"grid", gridTemplateColumns: bp.isTablet ? "1fr" : "1fr 1fr", gap:"16px" },
    card: { background:T.card, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:`1px solid ${T.cardBorder}`, borderRadius:"16px", padding: bp.isMobile ? "16px" : "24px", boxShadow:T.cardShadow },
    cardTitle: { fontSize:"11px", textTransform:"uppercase", letterSpacing:"2px", color:T.muted, marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px", fontFamily:"'Syne',sans-serif", fontWeight:"600", flexWrap:"wrap" },
    btn: (color) => ({ background:"transparent", border:`1px solid ${color}`, color:color, padding: bp.isMobile ? "8px 12px" : "10px 20px", borderRadius:"10px", cursor:"pointer", fontSize: bp.isMobile ? "11px" : "12px", fontFamily:"'Syne',sans-serif", fontWeight:"600", letterSpacing:"0.5px", transition:"all 0.25s ease", boxShadow:T.btnGlow(color) }),
    btnFill: (color) => ({ background:`linear-gradient(135deg,${color} 0%,${color}dd 100%)`, border:`1px solid ${color}`, color:T.onAccent, padding: bp.isMobile ? "8px 12px" : "10px 20px", borderRadius:"10px", cursor:"pointer", fontSize: bp.isMobile ? "11px" : "12px", fontFamily:"'Syne',sans-serif", fontWeight:"700", letterSpacing:"0.5px", transition:"all 0.25s ease", boxShadow:T.btnFillGlow(color) }),
    input: { background:T.inputBg, border:`1px solid ${T.border}`, color:T.text, padding:"10px 14px", borderRadius:"10px", fontSize:"13px", fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%", boxSizing:"border-box", transition:"all 0.2s ease" },
    log: { background:T.logBg, border:`1px solid ${T.cardBorder}`, borderRadius:"12px", padding:"16px", height:"160px", overflowY:"auto", fontSize:"11px", lineHeight:"1.8", boxShadow:T.isDark?"inset 0 2px 8px rgba(0,0,0,0.3)":"inset 0 1px 3px rgba(0,0,0,0.06)" },
    logEntry: (type) => ({ color: type==="success"?T.accent3:type==="warn"?T.warn:type==="error"?T.danger:type==="info"?T.accent:T.muted, display:"block", textShadow:T.logGlow&&["success","warn","error","info"].includes(type)?"0 0 8px currentColor":"none" }),
    badge: (color) => ({ display:"inline-block", padding:"4px 10px", borderRadius:"8px", fontSize:"10px", fontWeight:"700", background:`${color}${T.isDark?"18":"22"}`, color:color, border:`1px solid ${color}${T.isDark?"40":"55"}`, letterSpacing:"1px", fontFamily:"'Syne',sans-serif", boxShadow:T.badgeGlow(color) }),
  };
}

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────────
function ProcessConfigCard({ procInput, onInput, onBlur, processes, MIN_PROC, MAX_PROC }) {
  const T = useTheme();
  const bp = useBreakpoint();
  const s = makeStyles(T, bp);
  return (
    <div style={{ ...s.card, marginBottom:"16px" }}>
      <div style={s.cardTitle}><span style={{ color:T.accent2 }}>⚙</span> Process Configuration</div>
      <div style={{ display:"flex", alignItems: bp.isMobile ? "flex-start" : "center", gap:"24px", flexWrap:"wrap", flexDirection: bp.isMobile ? "column" : "row" }}>
        <div>
          <div style={{ fontSize:"10px", color:T.muted, marginBottom:"8px", letterSpacing:"1px" }}>
            NUMBER OF PROCESSES <span style={{ color:T.border }}>({MIN_PROC}–{MAX_PROC})</span>
          </div>
          <input type="number" min={MIN_PROC} max={MAX_PROC} value={procInput} onChange={onInput} onBlur={onBlur}
            style={{ ...s.input, width:"72px", textAlign:"center", fontSize:"16px", fontWeight:"700", padding:"8px 10px" }} />
        </div>
        <div style={{ flex:1, minWidth:"160px" }}>
          <div style={{ fontSize:"10px", color:T.muted, marginBottom:"8px", letterSpacing:"1px" }}>ACTIVE PROCESSES</div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {processes.map((p) => (
              <div key={p.id} style={{ padding:"5px 12px", borderRadius:"8px", fontSize:"11px", fontWeight:"700", background:`${p.color}18`, color:p.color, border:`1px solid ${p.color}44`, fontFamily:"'Syne',sans-serif", letterSpacing:"1px" }}>{p.id}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityLog({ logs }) {
  const T = useTheme();
  const bp = useBreakpoint();
  const s = makeStyles(T, bp);
  return (
    <div style={{ marginTop:"16px" }}>
      <div style={s.cardTitle}><span style={{ color:T.accent3 }}>●</span> Activity Log</div>
      <div style={s.log} ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
        {logs.length === 0 && <span style={{ color:T.muted }}>No activity yet...</span>}
        {logs.map((l, i) => (
          <span key={i} style={s.logEntry(l.type)}>[{new Date(l.ts).toLocaleTimeString()}] {l.msg}</span>
        ))}
      </div>
    </div>
  );
}

// ── SHARED MEMORY TAB ──────────────────────────────────────────────────────────
function SharedMemoryTab() {
  const T = useTheme();
  const bp = useBreakpoint();
  const s = makeStyles(T, bp);
  const SLOTS = 8, MIN_PROC = 2, MAX_PROC = 8;

  const [processCount, setProcessCount] = useState(2);
  const [procInput, setProcInput] = useState("2");
  const [processes, setProcesses] = useState(() => buildProcesses(2, true));
  const [writerPid, setWriterPid] = useState("P1");
  const [readerPid, setReaderPid] = useState("P2");
  const [memory, setMemory] = useState(Array(SLOTS).fill(null));
  const [writeSlot, setWriteSlot] = useState(0);
  const [writeValue, setWriteValue] = useState("Hello");
  const [readSlot, setReadSlot] = useState(0);
  const [logs, setLogs] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [animSlot, setAnimSlot] = useState(null);

  useEffect(() => {
    const np = buildProcesses(processCount, T.isDark);
    setProcesses(np);
    const ids = np.map((p) => p.id);
    if (!ids.includes(writerPid)) setWriterPid(ids[0]);
    if (!ids.includes(readerPid)) setReaderPid(ids[Math.min(1, ids.length - 1)]);
  }, [processCount, T.isDark]);

  const handleProcInput = (e) => { setProcInput(e.target.value); const n = parseInt(e.target.value,10); if (!isNaN(n)) setProcessCount(Math.max(MIN_PROC, Math.min(MAX_PROC, n))); };
  const handleProcBlur = () => setProcInput(String(processCount));
  const addLog = (msg, type="info") => setLogs((l) => [...l.slice(-40), { msg, type, ts:Date.now() }]);
  const writerProc = processes.find((p) => p.id === writerPid) || processes[0];
  const readerProc = processes.find((p) => p.id === readerPid) || processes[0];

  const write = () => {
    const slot = Number(writeSlot);
    if (slot < 0 || slot >= SLOTS) return addLog("Invalid slot index","error");
    setAnimSlot(slot);
    setTimeout(() => {
      setMemory((m) => { const n=[...m]; n[slot]={ value:writeValue, writer:writerPid }; return n; });
      setHighlight(slot);
      addLog(`${writerPid} → wrote "${writeValue}" to slot[${slot}]`,"success");
      setTimeout(() => { setAnimSlot(null); setHighlight(null); }, 1200);
    }, 300);
  };

  const read = () => {
    const slot = Number(readSlot);
    if (slot < 0 || slot >= SLOTS) return addLog("Invalid slot index","error");
    const cell = memory[slot];
    setHighlight(slot);
    addLog(cell ? `${readerPid} ← read "${cell.value}" from slot[${slot}] (written by ${cell.writer})` : `${readerPid} ← slot[${slot}] is EMPTY`, cell ? "success" : "warn");
    setTimeout(() => setHighlight(null), 1200);
  };

  const clearSlot = (i) => { setMemory((m) => { const n=[...m]; n[i]=null; return n; }); addLog(`Cleared slot[${i}]`,"warn"); };
  const clearAll  = () => { setMemory(Array(SLOTS).fill(null)); addLog("All memory slots cleared","warn"); };

  const slotSize = bp.isMobile ? "56px" : "66px";

  return (
    <div>
      <p style={{ color:T.muted, fontSize:"12px", marginBottom:"16px", lineHeight:"1.6" }}>
        Shared Memory allows multiple processes to access the same memory region directly. Configure processes, select who writes and who reads, then interact with the slots.
      </p>
      <ProcessConfigCard procInput={procInput} onInput={handleProcInput} onBlur={handleProcBlur} processes={processes} MIN_PROC={MIN_PROC} MAX_PROC={MAX_PROC} />

      <div style={s.grid2}>
        {/* Memory Grid */}
        <div style={s.card}>
          <div style={{ ...s.cardTitle, justifyContent:"space-between" }}>
            <span style={{ display:"flex", alignItems:"center", gap:"8px" }}><span style={{ color:T.accent }}>⬛</span> Shared Memory Segments</span>
            <button style={{ ...s.btn(T.danger), padding:"4px 10px", fontSize:"10px" }} onClick={clearAll}>✕ Clear All</button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"12px" }}>
            {memory.map((cell, i) => {
              const wc = cell ? (processes.find((p) => p.id === cell.writer)?.color || T.accent) : T.accent;
              const hl = highlight === i, an = animSlot === i;
              return (
                <div key={i} style={{ width:slotSize, height:slotSize, borderRadius:"12px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"2px", cursor:cell?"pointer":"default", background:cell?(hl?`${T.warn}25`:`${wc}18`):T.emptySlotBg, border:`1px solid ${cell?(hl?T.warn:wc):T.border}`, color:cell?(hl?T.warn:wc):T.muted, transition:"all 0.3s ease", transform:an?"scale(1.15)":"scale(1)", boxShadow:cell?`0 2px 6px ${wc}33`:"none" }}
                  title={cell?`Written by ${cell.writer} — Click to clear`:"Empty"} onClick={() => cell && clearSlot(i)}>
                  <span style={{ fontSize:"8px", color:"inherit", opacity:0.7 }}>slot[{i}]</span>
                  <span style={{ fontSize:"10px", fontWeight:"800", overflow:"hidden", maxWidth:"50px", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cell?cell.value:"—"}</span>
                  {cell && <span style={{ fontSize:"7px", opacity:0.7, fontFamily:"'Syne',sans-serif" }}>by {cell.writer}</span>}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize:"10px", color:T.muted }}>Cell color = writing process · Click to clear</div>
        </div>

        {/* Write + Read */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div style={s.card}>
            <div style={s.cardTitle}><span style={s.badge(writerProc?.color||T.accent)}>WRITE</span> Process writes to shared memory</div>
            <div style={{ marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", color:T.muted, marginBottom:"6px" }}>SELECT WRITER PROCESS</div>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {processes.map((p) => <button key={p.id} style={writerPid===p.id?s.btnFill(p.color):s.btn(p.color)} onClick={() => setWriterPid(p.id)}>{p.id}</button>)}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", marginBottom:"10px", flexWrap: bp.isMobile ? "wrap" : "nowrap" }}>
              <div style={{ flex: bp.isMobile ? "0 0 70px" : "0 0 70px" }}>
                <div style={{ fontSize:"10px", color:T.muted, marginBottom:"4px" }}>Slot (0-7)</div>
                <input type="number" min="0" max="7" value={writeSlot} onChange={(e) => setWriteSlot(e.target.value)} style={{ ...s.input, width:"70px" }} />
              </div>
              <div style={{ flex:1, minWidth: bp.isMobile ? "100%" : "auto" }}>
                <div style={{ fontSize:"10px", color:T.muted, marginBottom:"4px" }}>Value</div>
                <input type="text" value={writeValue} onChange={(e) => setWriteValue(e.target.value)} style={s.input} placeholder="Enter data..." onKeyDown={(e) => e.key==="Enter" && write()} />
              </div>
            </div>
            <button style={{ ...s.btnFill(writerProc?.color||T.accent), width:"100%" }} onClick={write}>▶ {writerPid} writes to Shared Memory</button>
          </div>

          <div style={s.card}>
            <div style={s.cardTitle}><span style={s.badge(readerProc?.color||T.accent2)}>READ</span> Process reads from shared memory</div>
            <div style={{ marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", color:T.muted, marginBottom:"6px" }}>SELECT READER PROCESS</div>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {processes.map((p) => <button key={p.id} style={readerPid===p.id?s.btnFill(p.color):s.btn(p.color)} onClick={() => setReaderPid(p.id)}>{p.id}</button>)}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", alignItems: bp.isMobile ? "flex-start" : "flex-end", flexWrap: bp.isMobile ? "wrap" : "nowrap" }}>
              <div>
                <div style={{ fontSize:"10px", color:T.muted, marginBottom:"4px" }}>Slot (0-7)</div>
                <input type="number" min="0" max="7" value={readSlot} onChange={(e) => setReadSlot(e.target.value)} style={{ ...s.input, width:"70px" }} />
              </div>
              <button style={{ ...s.btnFill(readerProc?.color||T.accent2), flex:1, minWidth: bp.isMobile ? "100%" : "auto" }} onClick={read}>▶ {readerPid} reads from Shared Memory</button>
            </div>
          </div>
        </div>
      </div>
      <ActivityLog logs={logs} />
    </div>
  );
}

// ── MESSAGE QUEUE TAB ──────────────────────────────────────────────────────────
function MessageQueueTab() {
  const T = useTheme();
  const bp = useBreakpoint();
  const s = makeStyles(T, bp);
  const MAX_Q = 6, MIN_PROC = 2, MAX_PROC = 8;

  const [processCount, setProcessCount] = useState(3);
  const [procInput, setProcInput] = useState("3");
  const [processes, setProcesses] = useState(() => buildProcesses(3, true));
  const [sender, setSender] = useState("P1");
  const [queue, setQueue] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [priority, setPriority] = useState("normal");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const np = buildProcesses(processCount, T.isDark);
    setProcesses(np);
    const ids = np.map((p) => p.id);
    if (!ids.includes(sender)) setSender(ids[0]);
  }, [processCount, T.isDark]);

  const handleProcInput = (e) => { setProcInput(e.target.value); const n=parseInt(e.target.value,10); if(!isNaN(n)) setProcessCount(Math.max(MIN_PROC,Math.min(MAX_PROC,n))); };
  const handleProcBlur = () => setProcInput(String(processCount));
  const addLog = (msg, type="info") => setLogs((l) => [...l.slice(-40), { msg, type, ts:Date.now() }]);
  const priColor = (p) => p==="high"?T.danger:p==="normal"?T.accent:T.priorityLow;
  const senderProc = processes.find((p) => p.id===sender);

  const enqueue = () => {
    if (!msgInput.trim()) return addLog("Message cannot be empty","error");
    if (queue.length >= MAX_Q) return addLog("Queue is FULL!","error");
    const msg = { id:Date.now(), text:msgInput.trim(), priority, sender };
    setTimeout(() => { setQueue((q) => priority==="high"?[msg,...q]:[...q,msg]); addLog(`${sender} → enqueued [${priority.toUpperCase()}] "${msgInput.trim()}"`,"success"); setMsgInput(""); }, 300);
  };

  const dequeue = () => {
    if (queue.length===0) return addLog("Queue is EMPTY!","warn");
    setTimeout(() => { setQueue((q) => { const [msg,...rest]=q; addLog(`Dequeued [${msg.priority.toUpperCase()}] "${msg.text}" (sent by ${msg.sender})`,"success"); return rest; }); }, 300);
  };

  return (
    <div>
      <p style={{ color:T.muted, fontSize:"12px", marginBottom:"16px", lineHeight:"1.6" }}>
        Message Queues provide an asynchronous IPC channel. Producers enqueue; consumers dequeue. High-priority messages jump to the front.
      </p>
      <ProcessConfigCard procInput={procInput} onInput={handleProcInput} onBlur={handleProcBlur} processes={processes} MIN_PROC={MIN_PROC} MAX_PROC={MAX_PROC} />

      <div style={s.grid2}>
        {/* Queue State */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <span style={{ color:T.accent }}>◈</span> Queue State
            <span style={{ marginLeft:"auto", ...s.badge(queue.length>=MAX_Q?T.danger:T.accent3) }}>{queue.length}/{MAX_Q}</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px", minHeight:"180px" }}>
            {queue.length===0 && <div style={{ color:T.muted, fontSize:"12px", padding:"20px 0", textAlign:"center" }}>Queue is empty</div>}
            {queue.map((msg, i) => (
              <div key={msg.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", background:priColor(msg.priority)+"11", border:`1px solid ${priColor(msg.priority)}44`, borderRadius:"6px", transition:"all 0.3s", flexWrap: bp.isMobile ? "wrap" : "nowrap" }}>
                <span style={s.badge(priColor(msg.priority))}>{msg.priority}</span>
                <span style={{ flex:1, fontSize:"12px", minWidth:"60px" }}>{msg.text}</span>
                <span style={{ fontSize:"10px", color:T.muted, whiteSpace:"nowrap" }}>from {msg.sender}</span>
                {i===0 && <span style={{ fontSize:"10px", color:T.warn, whiteSpace:"nowrap" }}>← HEAD</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop:"12px" }}>
            <div style={{ fontSize:"10px", color:T.muted, marginBottom:"4px" }}>Queue Capacity</div>
            <div style={{ display:"flex", gap:"4px" }}>
              {Array(MAX_Q).fill(0).map((_,i) => (
                <div key={i} style={{ flex:1, height:"6px", borderRadius:"3px", background:i<queue.length?(queue.length>=MAX_Q?T.danger:T.accent):T.border, transition:"background 0.3s" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Send + Receive */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div style={s.card}>
            <div style={s.cardTitle}><span style={s.badge(senderProc?.color||T.accent)}>SEND</span> Enqueue Message</div>
            <div style={{ marginBottom:"8px" }}>
              <div style={{ fontSize:"10px", color:T.muted, marginBottom:"6px" }}>SELECT SENDER PROCESS</div>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {processes.map((p) => <button key={p.id} style={sender===p.id?s.btnFill(p.color):s.btn(p.color)} onClick={() => setSender(p.id)}>{p.id}</button>)}
              </div>
            </div>
            <div style={{ marginBottom:"8px" }}>
              <div style={{ fontSize:"10px", color:T.muted, marginBottom:"4px" }}>Message</div>
              <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} style={s.input} placeholder="Type message..." onKeyDown={(e) => e.key==="Enter" && enqueue()} />
            </div>
            <div style={{ marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", color:T.muted, marginBottom:"4px" }}>Priority</div>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {["high","normal","low"].map((p) => <button key={p} style={priority===p?s.btnFill(priColor(p)):s.btn(priColor(p))} onClick={() => setPriority(p)}>{p}</button>)}
              </div>
            </div>
            <button style={{ ...s.btnFill(senderProc?.color||T.accent), width:"100%" }} onClick={enqueue}>▶ {sender} Enqueues</button>
          </div>

          <div style={s.card}>
            <div style={s.cardTitle}><span style={s.badge(T.accent2)}>RECEIVE</span> Dequeue Message</div>
            <p style={{ fontSize:"11px", color:T.muted, marginBottom:"12px", lineHeight:"1.6" }}>
              Pulls the next message from the head of the queue (FIFO / highest priority first). Any waiting consumer receives it.
            </p>
            <button style={{ ...s.btnFill(T.accent2), width:"100%" }} onClick={dequeue}>▶ Dequeue from Queue</button>
          </div>
        </div>
      </div>
      <ActivityLog logs={logs} />
    </div>
  );
}

// ── SEMAPHORE TAB ──────────────────────────────────────────────────────────────
function SemaphoreTab() {
  const T = useTheme();
  const bp = useBreakpoint();
  const s = makeStyles(T, bp);
  const SEM_COLORS = [T.accent, T.accent2, T.accent3, T.warn];

  const buildSemProcs = (n) => Array.from({ length:n }, (_, i) => ({ id:`P${i+1}`, state:"ready", color:SEM_COLORS[i%SEM_COLORS.length] }));

  const [semType, setSemType] = useState("mutex");
  const [semValue, setSemValue] = useState(1);
  const [maxCount, setMaxCount] = useState(3);
  const [processCount, setProcessCount] = useState(4);
  const [processes, setProcesses] = useState(() => buildSemProcs(4));
  const [waitQueue, setWaitQueue] = useState([]);
  const [criticalSection, setCriticalSection] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type="info") => setLogs((l) => [...l.slice(-40), { msg, type, ts:Date.now() }]);

  const reset = () => {
    const val = semType==="mutex"?1:maxCount;
    setSemValue(val); setWaitQueue([]); setCriticalSection([]);
    setProcesses((ps) => ps.map((p) => ({ ...p, state:"ready" })));
    addLog(`Semaphore reset. Initial value = ${val}`,"info");
  };

  useEffect(() => { reset(); }, [semType, maxCount]);
  useEffect(() => {
    const n = Math.max(2,Math.min(8,processCount));
    setProcesses(buildSemProcs(n)); setWaitQueue([]); setCriticalSection([]);
    setSemValue(semType==="mutex"?1:maxCount);
  }, [processCount]);

  const wait = (pid) => {
    const proc = processes.find((p) => p.id===pid);
    if (!proc||proc.state!=="ready") return addLog(`${pid} is not in ready state`,"warn");
    if (semValue>0) { setSemValue((v)=>v-1); setCriticalSection((cs)=>[...cs,pid]); setProcesses((ps)=>ps.map((p)=>p.id===pid?{...p,state:"critical"}:p)); addLog(`${pid} → wait() → entered Critical Section (sem=${semValue-1})`,"success"); }
    else { setWaitQueue((wq)=>[...wq,pid]); setProcesses((ps)=>ps.map((p)=>p.id===pid?{...p,state:"waiting"}:p)); addLog(`${pid} → wait() → BLOCKED (sem=0)`,"warn"); }
  };

  const signal = (pid) => {
    const proc = processes.find((p) => p.id===pid);
    if (!proc||proc.state!=="critical") return addLog(`${pid} is not in critical section`,"warn");
    setCriticalSection((cs)=>cs.filter((id)=>id!==pid));
    setProcesses((ps)=>ps.map((p)=>p.id===pid?{...p,state:"ready"}:p));
    if (waitQueue.length>0) {
      const [next,...rest]=waitQueue; setWaitQueue(rest);
      setCriticalSection((cs)=>[...cs,next]);
      setProcesses((ps)=>ps.map((p)=>p.id===next?{...p,state:"critical"}:p));
      addLog(`${pid} → signal() → ${next} unblocked & enters CS`,"success");
    } else { setSemValue((v)=>v+1); addLog(`${pid} → signal() → released CS (sem=${semValue+1})`,"success"); }
  };

  const stateColor = (st) => st==="critical"?T.accent3:st==="waiting"?T.warn:st==="ready"?T.accent:T.muted;
  const stateLabel = (st) => st==="critical"?"IN CS":st==="waiting"?"WAITING":"READY";

  return (
    <div>
      <p style={{ color:T.muted, fontSize:"12px", marginBottom:"16px", lineHeight:"1.6" }}>
        Semaphores control access to shared resources. <b style={{ color:T.text }}>Mutex</b> allows only 1 process at a time.
        <b style={{ color:T.text }}> Counting Semaphore</b> allows up to N concurrent processes.
      </p>

      {/* Type selector row — wraps on mobile */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"16px", alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:"12px", color:T.muted }}>Type:</span>
        {["mutex","counting"].map((t) => (
          <button key={t} style={semType===t?s.btnFill(T.accent):s.btn(T.accent)} onClick={() => setSemType(t)}>
            {t==="mutex"?"🔒 Mutex":"🔢 Counting"}
          </button>
        ))}
        {semType==="counting" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
              <span style={{ fontSize:"11px", color:T.muted }}>Max:</span>
              {[2,3,4].map((n) => <button key={n} style={maxCount===n?s.btnFill(T.accent2):s.btn(T.accent2)} onClick={() => setMaxCount(n)}>{n}</button>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"11px", color:T.muted }}>Procs:</span>
              <input type="number" min={2} max={8} value={processCount}
                onChange={(e) => setProcessCount(Math.max(2,Math.min(8,parseInt(e.target.value,10)||2)))}
                style={{ ...s.input, width:"56px", padding:"6px 10px" }} />
            </div>
          </>
        )}
        <button style={{ ...s.btn(T.muted), marginLeft:"auto" }} onClick={reset}>↺ Reset</button>
      </div>

      <div style={s.grid2}>
        {/* Dashboard */}
        <div style={s.card}>
          <div style={s.cardTitle}><span style={{ color:T.accent }}>◉</span> Semaphore Dashboard</div>
          <div style={{ display:"flex", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
            {Array(semType==="mutex"?1:maxCount).fill(0).map((_,i) => (
              <div key={i} style={{ width:"48px", height:"48px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:"700", background:i<semValue?T.accent3+"22":T.danger+"22", border:`2px solid ${i<semValue?T.accent3:T.danger}`, color:i<semValue?T.accent3:T.danger, transition:"all 0.3s" }}>
                {i<semValue?"✓":"✗"}
              </div>
            ))}
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", marginLeft:"8px" }}>
              <div style={{ fontSize:"22px", fontWeight:"800", color:semValue>0?T.accent3:T.danger }}>{semValue}</div>
              <div style={{ fontSize:"10px", color:T.muted }}>sem value</div>
            </div>
          </div>

          <div style={{ marginBottom:"12px" }}>
            <div style={{ fontSize:"10px", color:T.muted, marginBottom:"6px" }}>CRITICAL SECTION</div>
            <div style={{ minHeight:"48px", padding:"8px", borderRadius:"6px", background:criticalSection.length>0?T.accent3+"11":T.bg, border:`1px dashed ${criticalSection.length>0?T.accent3:T.border}`, display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
              {criticalSection.length===0 ? <span style={{ color:T.muted, fontSize:"11px" }}>Empty</span>
                : criticalSection.map((pid) => { const p=processes.find((x)=>x.id===pid); return <span key={pid} style={s.badge(p?.color||T.accent3)}>{pid} ▶ IN CS</span>; })}
            </div>
          </div>

          <div>
            <div style={{ fontSize:"10px", color:T.muted, marginBottom:"6px" }}>WAIT QUEUE</div>
            <div style={{ minHeight:"40px", padding:"8px", borderRadius:"6px", background:waitQueue.length>0?T.warn+"11":T.bg, border:`1px dashed ${waitQueue.length>0?T.warn:T.border}`, display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
              {waitQueue.length===0 ? <span style={{ color:T.muted, fontSize:"11px" }}>Empty</span>
                : waitQueue.map((pid,i) => { const p=processes.find((x)=>x.id===pid); return <span key={pid} style={s.badge(p?.color||T.warn)}>{i+1}. {pid}</span>; })}
            </div>
          </div>
        </div>

        {/* Process Control */}
        <div style={s.card}>
          <div style={s.cardTitle}><span style={{ color:T.accent2 }}>◈</span> Process Control</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {processes.map((p) => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px", borderRadius:"8px", background:stateColor(p.state)+"11", border:`1px solid ${stateColor(p.state)}33`, flexWrap: bp.isMobile ? "wrap" : "nowrap" }}>
                <span style={{ fontWeight:"700", color:p.color, width:"28px", flexShrink:0 }}>{p.id}</span>
                <span style={s.badge(stateColor(p.state))}>{stateLabel(p.state)}</span>
                <div style={{ display:"flex", gap:"6px", marginLeft:"auto" }}>
                  <button style={p.state==="ready"?s.btnFill(T.accent):s.btn(T.muted)} onClick={() => wait(p.id)} disabled={p.state!=="ready"}>wait()</button>
                  <button style={p.state==="critical"?s.btnFill(T.accent2):s.btn(T.muted)} onClick={() => signal(p.id)} disabled={p.state!=="critical"}>signal()</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"12px", fontSize:"10px", color:T.muted, lineHeight:"1.6" }}>
            <span style={{ color:T.accent }}>wait()</span> — acquire (P op) &nbsp;|&nbsp; <span style={{ color:T.accent2 }}>signal()</span> — release (V op)
          </div>
        </div>
      </div>
      <ActivityLog logs={logs} />
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
const TABS = [
  { id:"shm", label:"Shared Memory",    icon:"🗂", badgeLabel:"Shared Memory" },
  { id:"mq",  label:"Message Queue",    icon:"📨", badgeLabel:"Message Queue" },
  { id:"sem", label:"Semaphore / Mutex",icon:"🔒", badgeLabel:"Semaphore" },
];

export default function App() {
  const [tab, setTab] = useState("shm");
  const [isDark, setIsDark] = useState(true);
  const bp = useBreakpoint();
  const T = isDark ? DARK : LIGHT;
  const s = makeStyles(T, bp);

  return (
    <ThemeCtx.Provider value={T}>
      <div style={s.app}>
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:T.ambientBg }} />
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:`linear-gradient(${T.gridLine} 1px,transparent 1px),linear-gradient(90deg,${T.gridLine} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:T.isDark?0.6:0.5 }} />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
          * { box-sizing:border-box; margin:0; padding:0; }
          button:hover { transform:translateY(-2px); filter:brightness(1.05); }
          button:hover:not(:disabled) { box-shadow:${T.hoverGlow} !important; }
          button:active { transform:translateY(0); }
          input:focus { border-color:${T.inputFocusBorder} !important; box-shadow:${T.inputFocusShadow} !important; outline:none; }
          ::-webkit-scrollbar { width:6px; height:6px; }
          ::-webkit-scrollbar-track { background:${T.scrollTrack}; border-radius:3px; }
          ::-webkit-scrollbar-thumb { background:${T.scrollThumb}; border-radius:3px; }
          ::-webkit-scrollbar-thumb:hover { background:${T.scrollThumbHover}; }
          body { background:${T.bodyBg}; margin:0; transition:background 0.3s; }
          .nav-badge:hover { box-shadow:${T.navBadgeHover} !important; transform:scale(1.05); }
          /* hide tab label text on mobile, keep icon */
          @media (max-width: 480px) { .tab-label { display: none; } }
        `}</style>

        {/* ── HEADER ── */}
        <div style={s.header}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={s.logo}>⬡ IPC Simulator</div>
            <div style={s.subtitle}>Inter-Process Communication — OS Visualizer</div>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center", flexShrink:0, flexWrap: bp.isMobile ? "wrap" : "nowrap", justifyContent: bp.isMobile ? "flex-end" : "flex-start" }}>
            {/* Theme toggle */}
            <button onClick={() => setIsDark((d) => !d)}
              style={{ ...s.btn(isDark?T.accent:T.accent2), padding:"7px 12px", display:"flex", alignItems:"center", gap:"6px", borderRadius:"10px" }}
              title={isDark?"Switch to Light":"Switch to Dark"}>
              <span style={{ fontSize:"14px" }}>{isDark?"☀️":"🌙"}</span>
              {!bp.isMobile && <span style={{ fontSize:"10px", letterSpacing:"1px", fontWeight:"700" }}>{isDark?"LIGHT":"DARK"}</span>}
            </button>

            {!bp.isMobile && <div style={{ width:"1px", height:"24px", background:T.border }} />}

            {/* Nav badges — hidden on mobile (tabs bar handles navigation) */}
            {!bp.isMobile && TABS.map((t) => (
              <button key={t.id} className="nav-badge"
                style={{ ...s.badge(tab===t.id?T.accent:T.muted), cursor:"pointer", border:"none", fontFamily:"inherit", transition:"all 0.25s ease",
                  boxShadow:tab===t.id?(T.isDark?`0 0 20px rgba(0,245,255,0.5),0 0 40px rgba(0,245,255,0.2)`:`0 2px 8px rgba(14,165,233,0.3)`):(T.isDark?`0 0 12px ${T.accent}22`:`0 1px 3px rgba(0,0,0,0.08)`) }}
                onClick={() => setTab(t.id)}>
                {t.badgeLabel}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button key={t.id} style={s.tab(tab===t.id)} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>
              <span className="tab-label"> {t.label}</span>
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={s.main}>
          {tab==="shm" && <SharedMemoryTab />}
          {tab==="mq"  && <MessageQueueTab />}
          {tab==="sem" && <SemaphoreTab />}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}