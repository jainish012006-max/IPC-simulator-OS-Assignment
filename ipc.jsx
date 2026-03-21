import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  bg: "#0b1120",
  panel: "#0f1a2e",
  border: "#1e3358",
  accent: "#d4a017",
  accent2: "#1a6fc4",
  accent3: "#2eaadc",
  warn: "#e8892b",
  danger: "#e05252",
  text: "#e8edf5",
  muted: "#6b82a8",
  card: "#111d33",
};

const style = {
  app: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    background: COLORS.bg,
    minHeight: "100vh",
    color: COLORS.text,
    padding: "0",
  },
  header: {
    background: `linear-gradient(135deg, #0b1120 0%, #0f1a2e 100%)`,
    borderBottom: `1px solid ${COLORS.border}`,
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  subtitle: { fontSize: "12px", color: COLORS.muted, letterSpacing: "1px" },
  tabs: {
    display: "flex",
    gap: "0",
    padding: "0 32px",
    borderBottom: `1px solid ${COLORS.border}`,
    background: COLORS.panel,
  },
  tab: (active) => ({
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? "700" : "400",
    color: active ? COLORS.accent : COLORS.muted,
    borderBottom: active ? `2px solid ${COLORS.accent}` : "2px solid transparent",
    transition: "all 0.2s",
    letterSpacing: "0.5px",
    background: "transparent",
    border: "none",
    fontFamily: "inherit",
  }),
  main: { padding: "28px 32px", maxWidth: "1200px", margin: "0 auto" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "10px",
    padding: "20px",
  },
  cardTitle: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: COLORS.muted,
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  btn: (color = COLORS.accent) => ({
    background: "transparent",
    border: `1px solid ${color}`,
    color: color,
    padding: "8px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "inherit",
    fontWeight: "600",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
  }),
  btnFill: (color = COLORS.accent) => ({
    background: color,
    border: `1px solid ${color}`,
    color: "#0b1120",
    padding: "8px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "inherit",
    fontWeight: "700",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
  }),
  input: {
    background: "#0b1120",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  log: {
    background: "#080e1a",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "8px",
    padding: "14px",
    height: "160px",
    overflowY: "auto",
    fontSize: "11px",
    lineHeight: "1.8",
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
  }),
  badge: (color) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
    background: color + "22",
    color: color,
    border: `1px solid ${color}44`,
    letterSpacing: "0.5px",
  }),
  segment: (filled, color) => ({
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "700",
    background: filled ? color + "33" : "#0b1120",
    border: `1px solid ${filled ? color : COLORS.border}`,
    color: filled ? color : COLORS.muted,
    transition: "all 0.3s",
    letterSpacing: "0px",
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
              background: criticalSection.length > 0 ? COLORS.accent3 + "11" : "#0b1120",
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
              background: waitQueue.length > 0 ? COLORS.warn + "11" : "#0b1120",
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:hover { opacity: 0.85; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0b1120; }
        ::-webkit-scrollbar-thumb { background: #1e3358; border-radius: 4px; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOut { from { opacity: 1; } to { opacity: 0; transform: translateX(20px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
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