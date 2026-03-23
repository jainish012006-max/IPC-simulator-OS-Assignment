import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  bg: "#050508",
  bgGradient: "linear-gradient(135deg, #050508 0%, #0a0a14 25%, #080814 50%, #050510 100%)",
  panel: "rgba(12, 12, 22, 0.85)",
  border: "rgba(0, 245, 255, 0.15)",
  borderGlow: "rgba(0, 245, 255, 0.4)",
  accent: "#00f5ff",
  accent2: "#b44dff",
  accent3: "#00ff88",
  warn: "#ffb020",
  danger: "#ff3366",
  text: "#e4e4e7",
  muted: "rgba(161, 161, 170, 0.9)",
  card: "rgba(18, 18, 28, 0.6)",
  cardBorder: "rgba(255, 255, 255, 0.06)",
  onAccent: "#050508",
};

const style = {
  app: {
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    background: COLORS.bgGradient,
    minHeight: "100vh",
    color: COLORS.text,
    padding: "0",
    position: "relative",
    overflowX: "hidden",
  },
  header: {
    background: "rgba(8, 8, 18, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${COLORS.border}`,
    boxShadow: `0 4px 30px rgba(0, 245, 255, 0.05)`,
    padding: "20px 36px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "24px",
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: "3px",
    textTransform: "uppercase",
    textShadow: `0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.2)`,
  },
  subtitle: { fontSize: "13px", color: COLORS.muted, letterSpacing: "1.5px", fontFamily: "'DM Sans', sans-serif" },
  tabs: {
    display: "flex",
    gap: "0",
    padding: "0 36px",
    borderBottom: `1px solid ${COLORS.border}`,
    background: COLORS.panel,
    backdropFilter: "blur(12px)",
  },
  tab: (active) => ({
    padding: "16px 28px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? "700" : "500",
    color: active ? COLORS.accent : COLORS.muted,
    borderBottom: active ? `2px solid ${COLORS.accent}` : "2px solid transparent",
    boxShadow: active ? `0 0 20px rgba(0, 245, 255, 0.2)` : "none",
    transition: "all 0.25s ease",
    letterSpacing: "1px",
    background: "transparent",
    border: "none",
    fontFamily: "'Syne', sans-serif",
  }),
  main: { padding: "32px 36px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  card: {
    background: COLORS.card,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03) inset`,
  },
  cardTitle: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "2.5px",
    color: COLORS.muted,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: "600",
  },
  btn: (color = COLORS.accent) => ({
    background: "transparent",
    border: `1px solid ${color}`,
    color: color,
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: "600",
    letterSpacing: "0.5px",
    transition: "all 0.25s ease",
    boxShadow: `0 0 15px ${color}22`,
  }),
  btnFill: (color = COLORS.accent) => ({
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    border: `1px solid ${color}`,
    color: COLORS.onAccent,
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: "700",
    letterSpacing: "0.5px",
    transition: "all 0.25s ease",
    boxShadow: `0 0 20px ${color}44, 0 4px 15px rgba(0,0,0,0.3)`,
  }),
  input: {
    background: "rgba(5, 5, 10, 0.8)",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  },
  log: {
    background: "rgba(5, 5, 12, 0.6)",
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: "12px",
    padding: "16px",
    height: "160px",
    overflowY: "auto",
    fontSize: "11px",
    lineHeight: "1.8",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
  },
  logEntry: (type) => ({
    color:
      type === "success"
        ? COLORS.accent3
        : type === "warn"
        ? COLORS.warn
        : type === "error"
        ? COLORS.danger
        : type === "info"
        ? COLORS.accent
        : COLORS.muted,
    display: "block",
    textShadow: ["success", "warn", "error", "info"].includes(type) ? `0 0 8px currentColor` : "none",
  }),
  badge: (color) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "700",
    background: `${color}18`,
    color: color,
    border: `1px solid ${color}40`,
    letterSpacing: "1px",
    fontFamily: "'Syne', sans-serif",
    boxShadow: `0 0 12px ${color}22`,
  }),
  segment: (filled, color) => ({
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "700",
    background: filled ? `${color}25` : "rgba(5, 5, 12, 0.8)",
    border: `1px solid ${filled ? color : COLORS.border}`,
    color: filled ? color : COLORS.muted,
    transition: "all 0.3s ease",
    letterSpacing: "0px",
    boxShadow: filled ? `0 0 15px ${color}33` : "none",
  }),
};

// ── SHARED MEMORY TAB ──────────────────────────────────────────────────────────
function SharedMemoryTab() {
  const SLOTS = 8;
  const [memory, setMemory] = useState(Array(SLOTS).fill(null));
  const [procA, setProcA] = useState({ slot: 0, value: "Hello" });
  const [procB, setProcB] = useState({ slot: 0 });
  const [logs, setLogs] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [animSlot, setAnimSlot] = useState(null);

  const addLog = (msg, type = "info") =>
    setLogs((l) => [...l.slice(-40), { msg, type, ts: Date.now() }]);

  const write = () => {
    const slot = Number(procA.slot);
    if (slot < 0 || slot >= SLOTS) return addLog("Invalid slot index", "error");
    setAnimSlot(slot);
    setTimeout(() => {
      setMemory((m) => { const n = [...m]; n[slot] = procA.value; return n; });
      setHighlight(slot);
      addLog(`Process A → wrote "${procA.value}" to slot[${slot}]`, "success");
      setTimeout(() => { setAnimSlot(null); setHighlight(null); }, 1200);
    }, 300);
  };

  const read = () => {
    const slot = Number(procB.slot);
    if (slot < 0 || slot >= SLOTS) return addLog("Invalid slot index", "error");
    const val = memory[slot];
    setHighlight(slot);
    addLog(
      val !== null ? `Process B ← read "${val}" from slot[${slot}]` : `Process B ← slot[${slot}] is EMPTY`,
      val !== null ? "success" : "warn"
    );
    setTimeout(() => setHighlight(null), 1200);
  };

  const clear = (slot) => {
    setMemory((m) => { const n = [...m]; n[slot] = null; return n; });
    addLog(`Cleared slot[${slot}]`, "warn");
  };

  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: "12px", marginBottom: "20px", lineHeight: "1.6" }}>
        Shared Memory allows two processes to access the same memory region directly.
        Process A writes data into a memory slot; Process B reads from the same slot.
      </p>
      <div style={style.grid2}>
        {/* Shared Memory Grid */}
        <div style={style.card}>
          <div style={style.cardTitle}>
            <span style={{ color: COLORS.accent }}>⬛</span> Shared Memory Segments
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            {memory.map((val, i) => (
              <div
                key={i}
                style={{
                  ...style.segment(val !== null, highlight === i ? COLORS.warn : COLORS.accent),
                  width: "60px", height: "60px",
                  flexDirection: "column", gap: "2px",
                  cursor: val !== null ? "pointer" : "default",
                  transform: animSlot === i ? "scale(1.2)" : "scale(1)",
                }}
                title={val !== null ? `Click to clear` : "Empty"}
                onClick={() => val !== null && clear(i)}
              >
                <span style={{ fontSize: "8px", color: COLORS.muted }}>slot[{i}]</span>
                <span style={{ fontSize: "11px", fontWeight: "700", overflow: "hidden", maxWidth: "52px", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {val ?? "—"}
                </span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: COLORS.muted }}>Click a filled slot to clear it</div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={style.card}>
            <div style={style.cardTitle}><span style={style.badge(COLORS.accent)}>PROC A</span> Write</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <div style={{ flex: "0 0 70px" }}>
                <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Slot (0-7)</div>
                <input
                  type="number" min="0" max="7"
                  value={procA.slot}
                  onChange={(e) => setProcA({ ...procA, slot: e.target.value })}
                  style={{ ...style.input, width: "70px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Value</div>
                <input
                  type="text" value={procA.value}
                  onChange={(e) => setProcA({ ...procA, value: e.target.value })}
                  style={style.input}
                  placeholder="Enter data..."
                />
              </div>
            </div>
            <button style={style.btnFill(COLORS.accent)} onClick={write}>▶ Write to Shared Memory</button>
          </div>

          <div style={style.card}>
            <div style={style.cardTitle}><span style={style.badge(COLORS.accent2)}>PROC B</span> Read</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "flex-end" }}>
              <div style={{ flex: "0 0 70px" }}>
                <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Slot (0-7)</div>
                <input
                  type="number" min="0" max="7"
                  value={procB.slot}
                  onChange={(e) => setProcB({ slot: e.target.value })}
                  style={{ ...style.input, width: "70px" }}
                />
              </div>
              <button style={style.btnFill(COLORS.accent2)} onClick={read}>▶ Read from Shared Memory</button>
            </div>
          </div>
        </div>
      </div>

      {/* Log */}
      <div style={{ marginTop: "16px" }}>
        <div style={style.cardTitle}><span style={{ color: COLORS.accent3 }}>●</span> Activity Log</div>
        <div style={style.log} ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
          {logs.length === 0 && <span style={{ color: COLORS.muted }}>No activity yet...</span>}
          {logs.map((l, i) => (
            <span key={i} style={style.logEntry(l.type)}>
              [{new Date(l.ts).toLocaleTimeString()}] {l.msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MESSAGE QUEUE TAB ──────────────────────────────────────────────────────────
function MessageQueueTab() {
  const MAX_Q = 6;
  const [queue, setQueue] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [priority, setPriority] = useState("normal");
  const [logs, setLogs] = useState([]);
  const [animIn, setAnimIn] = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const [processes, setProcesses] = useState([
    { id: "P1", color: COLORS.accent },
    { id: "P2", color: COLORS.accent2 },
    { id: "P3", color: COLORS.accent3 },
  ]);
  const [sender, setSender] = useState("P1");
  const [receiver, setReceiver] = useState("P2");

  const addLog = (msg, type = "info") =>
    setLogs((l) => [...l.slice(-40), { msg, type, ts: Date.now() }]);

  const enqueue = () => {
    if (!msgInput.trim()) return addLog("Message cannot be empty", "error");
    if (queue.length >= MAX_Q) return addLog("Queue is FULL! Cannot enqueue.", "error");
    const msg = { id: Date.now(), text: msgInput.trim(), priority, sender };
    setAnimIn(true);
    setTimeout(() => {
      setQueue((q) => priority === "high" ? [msg, ...q] : [...q, msg]);
      addLog(`${sender} → enqueued [${priority.toUpperCase()}] "${msgInput.trim()}"`, "success");
      setMsgInput("");
      setAnimIn(false);
    }, 300);
  };

  const dequeue = () => {
    if (queue.length === 0) return addLog("Queue is EMPTY! Nothing to dequeue.", "warn");
    setAnimOut(true);
    setTimeout(() => {
      const [msg, ...rest] = queue;
      setQueue(rest);
      addLog(`${receiver} ← dequeued [${msg.priority.toUpperCase()}] "${msg.text}" (from ${msg.sender})`, "success");
      setAnimOut(false);
    }, 300);
  };

  const priColor = (p) => p === "high" ? COLORS.danger : p === "normal" ? COLORS.accent : COLORS.muted;

  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: "12px", marginBottom: "20px", lineHeight: "1.6" }}>
        Message Queues provide an asynchronous communication channel. Producers enqueue messages; consumers dequeue them.
        High-priority messages jump to the front (priority queue behavior).
      </p>
      <div style={style.grid2}>
        {/* Queue Visualization */}
        <div style={style.card}>
          <div style={style.cardTitle}>
            <span style={{ color: COLORS.accent }}>◈</span> Queue State
            <span style={{ marginLeft: "auto", ...style.badge(queue.length >= MAX_Q ? COLORS.danger : COLORS.accent3) }}>
              {queue.length}/{MAX_Q}
            </span>
          </div>
          {/* Queue bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "200px" }}>
            {queue.length === 0 && (
              <div style={{ color: COLORS.muted, fontSize: "12px", padding: "20px 0", textAlign: "center" }}>
                Queue is empty
              </div>
            )}
            {queue.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px",
                  background: priColor(msg.priority) + "11",
                  border: `1px solid ${priColor(msg.priority)}44`,
                  borderRadius: "6px",
                  animation: i === 0 && animOut ? "slideOut 0.3s ease" : animIn && i === 0 ? "slideIn 0.3s ease" : "none",
                  transition: "all 0.3s",
                }}
              >
                <span style={style.badge(priColor(msg.priority))}>{msg.priority}</span>
                <span style={{ flex: 1, fontSize: "12px" }}>{msg.text}</span>
                <span style={{ fontSize: "10px", color: COLORS.muted }}>from {msg.sender}</span>
                {i === 0 && <span style={{ fontSize: "10px", color: COLORS.warn }}>← HEAD</span>}
              </div>
            ))}
          </div>
          {/* Capacity bar */}
          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Queue Capacity</div>
            <div style={{ display: "flex", gap: "4px" }}>
              {Array(MAX_Q).fill(0).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: "6px", borderRadius: "3px",
                  background: i < queue.length ? (queue.length >= MAX_Q ? COLORS.danger : COLORS.accent) : COLORS.border,
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={style.card}>
            <div style={style.cardTitle}><span style={style.badge(COLORS.accent)}>SEND</span> Enqueue Message</div>
            <div style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Sender Process</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {processes.map((p) => (
                  <button key={p.id} style={sender === p.id ? style.btnFill(p.color) : style.btn(p.color)}
                    onClick={() => setSender(p.id)}>{p.id}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Message</div>
              <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)}
                style={style.input} placeholder="Type message..." onKeyDown={(e) => e.key === "Enter" && enqueue()} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Priority</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["high", "normal", "low"].map((p) => (
                  <button key={p} style={priority === p ? style.btnFill(priColor(p)) : style.btn(priColor(p))}
                    onClick={() => setPriority(p)}>{p}</button>
                ))}
              </div>
            </div>
            <button style={style.btnFill(COLORS.accent)} onClick={enqueue}>▶ Enqueue</button>
          </div>

          <div style={style.card}>
            <div style={style.cardTitle}><span style={style.badge(COLORS.accent2)}>RECEIVE</span> Dequeue Message</div>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "4px" }}>Receiver Process</div>
              <div style={{ display: "flex", gap: "6px" }}>
                {processes.map((p) => (
                  <button key={p.id} style={receiver === p.id ? style.btnFill(p.color) : style.btn(p.color)}
                    onClick={() => setReceiver(p.id)}>{p.id}</button>
                ))}
              </div>
            </div>
            <button style={style.btnFill(COLORS.accent2)} onClick={dequeue}>▶ Dequeue (FIFO/Priority)</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <div style={style.cardTitle}><span style={{ color: COLORS.accent3 }}>●</span> Activity Log</div>
        <div style={style.log} ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
          {logs.length === 0 && <span style={{ color: COLORS.muted }}>No activity yet...</span>}
          {logs.map((l, i) => (
            <span key={i} style={style.logEntry(l.type)}>
              [{new Date(l.ts).toLocaleTimeString()}] {l.msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SEMAPHORE / MUTEX TAB ──────────────────────────────────────────────────────
function SemaphoreTab() {
  const [semType, setSemType] = useState("mutex"); // mutex | counting
  const [semValue, setSemValue] = useState(1);
  const [maxCount, setMaxCount] = useState(3);
  const [processes, setProcesses] = useState([
    { id: "P1", state: "ready", color: COLORS.accent },
    { id: "P2", state: "ready", color: COLORS.accent2 },
    { id: "P3", state: "ready", color: COLORS.accent3 },
    { id: "P4", state: "ready", color: COLORS.warn },
  ]);
  const [waitQueue, setWaitQueue] = useState([]);
  const [criticalSection, setCriticalSection] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (msg, type = "info") =>
    setLogs((l) => [...l.slice(-40), { msg, type, ts: Date.now() }]);

  const reset = () => {
    const val = semType === "mutex" ? 1 : maxCount;
    setSemValue(val);
    setWaitQueue([]);
    setCriticalSection([]);
    setProcesses((ps) => ps.map((p) => ({ ...p, state: "ready" })));
    addLog(`Semaphore reset. Initial value = ${val}`, "info");
  };

  useEffect(() => { reset(); }, [semType, maxCount]);

  const wait = (pid) => {
    const proc = processes.find((p) => p.id === pid);
    if (!proc || proc.state !== "ready") return addLog(`${pid} is not in ready state`, "warn");

    if (semValue > 0) {
      setSemValue((v) => v - 1);
      setCriticalSection((cs) => [...cs, pid]);
      setProcesses((ps) => ps.map((p) => p.id === pid ? { ...p, state: "critical" } : p));
      addLog(`${pid} → wait() → entered Critical Section (sem=${semValue - 1})`, "success");
    } else {
      setWaitQueue((wq) => [...wq, pid]);
      setProcesses((ps) => ps.map((p) => p.id === pid ? { ...p, state: "waiting" } : p));
      addLog(`${pid} → wait() → BLOCKED (sem=0, added to wait queue)`, "warn");
    }
  };

  const signal = (pid) => {
    const proc = processes.find((p) => p.id === pid);
    if (!proc || proc.state !== "critical") return addLog(`${pid} is not in critical section`, "warn");

    setCriticalSection((cs) => cs.filter((id) => id !== pid));
    setProcesses((ps) => ps.map((p) => p.id === pid ? { ...p, state: "ready" } : p));

    if (waitQueue.length > 0) {
      const [next, ...rest] = waitQueue;
      setWaitQueue(rest);
      setCriticalSection((cs) => [...cs, next]);
      setProcesses((ps) => ps.map((p) => p.id === next ? { ...p, state: "critical" } : p));
      addLog(`${pid} → signal() → released. ${next} unblocked & enters CS (sem stays 0)`, "success");
    } else {
      setSemValue((v) => v + 1);
      addLog(`${pid} → signal() → released Critical Section (sem=${semValue + 1})`, "success");
    }
  };

  const stateColor = (s) =>
    s === "critical" ? COLORS.accent3 : s === "waiting" ? COLORS.warn : s === "ready" ? COLORS.accent : COLORS.muted;
  const stateLabel = (s) =>
    s === "critical" ? "IN CS" : s === "waiting" ? "WAITING" : "READY";

  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: "12px", marginBottom: "20px", lineHeight: "1.6" }}>
        Semaphores control access to shared resources. <b style={{ color: COLORS.text }}>Mutex</b> allows only 1 process at a time.
        <b style={{ color: COLORS.text }}> Counting Semaphore</b> allows up to N concurrent processes.
        Use <b style={{ color: COLORS.accent }}>wait()</b> to acquire and <b style={{ color: COLORS.accent2 }}>signal()</b> to release.
      </p>

      {/* Type Selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: COLORS.muted }}>Type:</span>
        {["mutex", "counting"].map((t) => (
          <button key={t} style={semType === t ? style.btnFill(COLORS.accent) : style.btn(COLORS.accent)}
            onClick={() => setSemType(t)}>{t === "mutex" ? "🔒 Mutex (Binary)" : "🔢 Counting Semaphore"}</button>
        ))}
        {semType === "counting" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: COLORS.muted }}>Max:</span>
            {[2, 3, 4].map((n) => (
              <button key={n} style={maxCount === n ? style.btnFill(COLORS.accent2) : style.btn(COLORS.accent2)}
                onClick={() => setMaxCount(n)}>{n}</button>
            ))}
          </div>
        )}
        <button style={{ ...style.btn(COLORS.muted), marginLeft: "auto" }} onClick={reset}>↺ Reset</button>
      </div>

      <div style={style.grid2}>
        {/* Semaphore State */}
        <div style={style.card}>
          <div style={style.cardTitle}><span style={{ color: COLORS.accent }}>◉</span> Semaphore Dashboard</div>

          {/* Semaphore value visualizer */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {Array(semType === "mutex" ? 1 : maxCount).fill(0).map((_, i) => (
              <div key={i} style={{
                width: "48px", height: "48px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: "700",
                background: i < semValue ? COLORS.accent3 + "22" : COLORS.danger + "22",
                border: `2px solid ${i < semValue ? COLORS.accent3 : COLORS.danger}`,
                color: i < semValue ? COLORS.accent3 : COLORS.danger,
                transition: "all 0.3s",
              }}>
                {i < semValue ? "✓" : "✗"}
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "8px" }}>
              <div style={{ fontSize: "22px", fontWeight: "800", color: semValue > 0 ? COLORS.accent3 : COLORS.danger }}>
                {semValue}
              </div>
              <div style={{ fontSize: "10px", color: COLORS.muted }}>sem value</div>
            </div>
          </div>

          {/* Critical Section */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "6px" }}>CRITICAL SECTION</div>
            <div style={{
              minHeight: "50px", padding: "8px", borderRadius: "6px",
              background: criticalSection.length > 0 ? COLORS.accent3 + "11" : COLORS.bg,
              border: `1px dashed ${criticalSection.length > 0 ? COLORS.accent3 : COLORS.border}`,
              display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap",
            }}>
              {criticalSection.length === 0
                ? <span style={{ color: COLORS.muted, fontSize: "11px" }}>Empty</span>
                : criticalSection.map((pid) => {
                  const p = processes.find((x) => x.id === pid);
                  return <span key={pid} style={style.badge(p?.color || COLORS.accent3)}>{pid} ▶ IN CS</span>;
                })}
            </div>
          </div>

          {/* Wait Queue */}
          <div>
            <div style={{ fontSize: "10px", color: COLORS.muted, marginBottom: "6px" }}>WAIT QUEUE</div>
            <div style={{
              minHeight: "40px", padding: "8px", borderRadius: "6px",
              background: waitQueue.length > 0 ? COLORS.warn + "11" : COLORS.bg,
              border: `1px dashed ${waitQueue.length > 0 ? COLORS.warn : COLORS.border}`,
              display: "flex", gap: "8px", alignItems: "center",
            }}>
              {waitQueue.length === 0
                ? <span style={{ color: COLORS.muted, fontSize: "11px" }}>Empty</span>
                : waitQueue.map((pid, i) => {
                  const p = processes.find((x) => x.id === pid);
                  return <span key={pid} style={style.badge(p?.color || COLORS.warn)}>{i + 1}. {pid}</span>;
                })}
            </div>
          </div>
        </div>

        {/* Process Controls */}
        <div style={style.card}>
          <div style={style.cardTitle}><span style={{ color: COLORS.accent2 }}>◈</span> Process Control</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {processes.map((p) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "8px",
                background: stateColor(p.state) + "11",
                border: `1px solid ${stateColor(p.state)}33`,
              }}>
                <span style={{ fontWeight: "700", color: p.color, width: "28px" }}>{p.id}</span>
                <span style={style.badge(stateColor(p.state))}>{stateLabel(p.state)}</span>
                <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                  <button
                    style={p.state === "ready" ? style.btnFill(COLORS.accent) : style.btn(COLORS.muted)}
                    onClick={() => wait(p.id)}
                    disabled={p.state !== "ready"}
                  >wait()</button>
                  <button
                    style={p.state === "critical" ? style.btnFill(COLORS.accent2) : style.btn(COLORS.muted)}
                    onClick={() => signal(p.id)}
                    disabled={p.state !== "critical"}
                  >signal()</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", fontSize: "10px", color: COLORS.muted, lineHeight: "1.6" }}>
            <span style={{ color: COLORS.accent }}>wait()</span> — acquire semaphore (P operation) &nbsp;|&nbsp;
            <span style={{ color: COLORS.accent2 }}>signal()</span> — release semaphore (V operation)
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <div style={style.cardTitle}><span style={{ color: COLORS.accent3 }}>●</span> Activity Log</div>
        <div style={style.log} ref={(el) => el && (el.scrollTop = el.scrollHeight)}>
          {logs.length === 0 && <span style={{ color: COLORS.muted }}>No activity yet...</span>}
          {logs.map((l, i) => (
            <span key={i} style={style.logEntry(l.type)}>
              [{new Date(l.ts).toLocaleTimeString()}] {l.msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "shm", label: "Shared Memory", icon: "🗂" },
  { id: "mq", label: "Message Queue", icon: "📨" },
  { id: "sem", label: "Semaphore / Mutex", icon: "🔒" },
];

export default function App() {
  const [tab, setTab] = useState("shm");

  return (
    <div style={style.app}>
      {/* Shiny ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 245, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 100% 100%, rgba(180, 77, 255, 0.1) 0%, transparent 45%),
          radial-gradient(ellipse 50% 30% at 0% 80%, rgba(0, 255, 136, 0.08) 0%, transparent 40%),
          linear-gradient(180deg, transparent 0%, rgba(5, 5, 8, 0.3) 100%)
        `,
      }} />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        opacity: 0.6,
      }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        button:hover:not(:disabled) {
          box-shadow: 0 0 25px rgba(0, 245, 255, 0.35), 0 4px 20px rgba(0,0,0,0.4);
        }
        button:active { transform: translateY(0); }
        input:focus {
          border-color: rgba(0, 245, 255, 0.5);
          box-shadow: 0 0 20px rgba(0, 245, 255, 0.15);
          outline: none;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(5, 5, 10, 0.8); border-radius: 3px; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(0,245,255,0.4) 0%, rgba(180,77,255,0.3) 100%);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 245, 255, 0.6); }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOut { from { opacity: 1; } to { opacity: 0; transform: translateX(20px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        body { background: #050508; margin: 0; }
      `}</style>

      <div style={style.header}>
        <div>
          <div style={style.logo}>⬡ IPC Simulator</div>
          <div style={style.subtitle}>Inter-Process Communication — OS Assignment Visualizer</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          {["Shared Memory", "Message Queue", "Semaphore"].map((m) => (
            <span key={m} style={style.badge(COLORS.accent)}>{m}</span>
          ))}
        </div>
      </div>

      <div style={style.tabs}>
        {TABS.map((t) => (
          <button key={t.id} style={style.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={style.main}>
        {tab === "shm" && <SharedMemoryTab />}
        {tab === "mq" && <MessageQueueTab />}
        {tab === "sem" && <SemaphoreTab />}
      </div>
    </div>
  );
}