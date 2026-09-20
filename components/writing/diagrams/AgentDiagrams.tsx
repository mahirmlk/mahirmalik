/* Faithful static SVG diagrams for the agent-systems essay.
   Editorial style: thin dark strokes, white fill, restrained sans type.
   No gradients, shadows, colours or motion. Colours come from
   .dg-* CSS classes so dark mode stays coherent. */

type Line = { text: string; title?: boolean; muted?: boolean };

function Node({
  cx,
  y,
  w,
  h,
  lines,
}: {
  cx: number;
  y: number;
  w: number;
  h: number;
  lines: Line[];
}) {
  const x = cx - w / 2;
  const step = 17;
  const startY = y + h / 2 - ((lines.length - 1) * step) / 2 + 4.5;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} className="dg-box" />
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={startY + i * step}
          textAnchor="middle"
          className={line.title ? "dg-title" : line.muted ? "dg-note" : "dg-text"}
        >
          {line.text}
        </text>
      ))}
    </g>
  );
}

function VArrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g className="dg-line">
      <line x1={x} y1={y1} x2={x} y2={y2 - 1} />
      <polygon points={`${x - 4},${y2 - 7} ${x + 4},${y2 - 7} ${x},${y2}`} className="dg-head" />
    </g>
  );
}

function HArrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g className="dg-line">
      <line x1={x1} y1={y} x2={x2 - 1} y2={y} />
      <polygon points={`${x2 - 7},${y - 4} ${x2 - 7},${y + 4} ${x2},${y}`} className="dg-head" />
    </g>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="dg-text">
      {children}
    </text>
  );
}

function Frame({
  width,
  height,
  minWidth,
  children,
}: {
  width: number;
  height: number;
  minWidth?: number;
  children: React.ReactNode;
}) {
  const svg = (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="dg-svg"
      style={minWidth ? { minWidth } : undefined}
      role="img"
    >
      {children}
    </svg>
  );
  if (minWidth) {
    return <div className="w-diagram-scroll">{svg}</div>;
  }
  return svg;
}

/* Figure 1 — the old workflow: the human drives every step. */
function OldWorkflow() {
  const nodes = ["Human", "Prompt", "LLM", "Answer", "Human decides what to do next"];
  const w = 250;
  const cx = 170;
  const h = 32;
  const gap = 24;
  const top = 8;
  return (
    <Frame width={340} height={top * 2 + nodes.length * h + (nodes.length - 1) * gap}>
      {nodes.map((n, i) => {
        const y = top + i * (h + gap);
        return (
          <g key={n}>
            <Node cx={cx} y={y} w={w} h={h} lines={[{ text: n }]} />
            {i < nodes.length - 1 && <VArrow x={cx} y1={y + h} y2={y + h + gap} />}
          </g>
        );
      })}
    </Frame>
  );
}

/* Figure 2 — a modern coding-agent flow. */
function AgentFlow() {
  const nodes = [
    "Goal",
    "Agent",
    "Inspect files",
    "Edit code",
    "Run tests",
    "Read errors",
    "Fix code",
    "Run tests again",
    "Review",
    "Repeat",
    "Done",
  ];
  const w = 220;
  const cx = 150;
  const h = 30;
  const gap = 20;
  const top = 8;
  return (
    <Frame width={300} height={top * 2 + nodes.length * h + (nodes.length - 1) * gap}>
      {nodes.map((n, i) => {
        const y = top + i * (h + gap);
        return (
          <g key={`${n}-${i}`}>
            <Node cx={cx} y={y} w={w} h={h} lines={[{ text: n }]} />
            {i < nodes.length - 1 && <VArrow x={cx} y1={y + h} y2={y + h + gap} />}
          </g>
        );
      })}
    </Frame>
  );
}

/* Figure 3 — one agent, three engineering concerns. */
function Workshop() {
  const cols = [
    {
      title: "CONTEXT ENGINEERING",
      items: ["What does it know?", "What should it see?", "What should be", "retrieved?"],
    },
    {
      title: "HARNESS ENGINEERING",
      items: ["What can it do?", "What tools exist?", "What is forbidden?", "How is it checked?"],
    },
    {
      title: "LOOP ENGINEERING",
      items: ["What happens next?", "Keep going?", "Retry?", "Stop?"],
    },
  ];
  const centers = [110, 330, 550];
  const headY = 128;
  return (
    <Frame width={660} height={290} minWidth={560}>
      <Node
        cx={330}
        y={8}
        w={210}
        h={58}
        lines={[{ text: "AI AGENT", title: true }, { text: "(the model)", muted: true }]}
      />
      {centers.map((cx) => (
        <line key={cx} x1={330} y1={66} x2={cx} y2={headY} className="dg-line" />
      ))}
      {centers.map((cx) => (
        <polygon
          key={`h-${cx}`}
          points={`${cx - 4},${headY - 7} ${cx + 4},${headY - 7} ${cx},${headY}`}
          className="dg-head"
        />
      ))}
      {cols.map((col, i) => (
        <g key={col.title}>
          <Node cx={centers[i]} y={headY} w={196} h={40} lines={[{ text: col.title, title: true }]} />
          {col.items.map((item, j) => (
            <text key={item} x={centers[i]} y={headY + 62 + j * 19} textAnchor="middle" className="dg-note">
              {item}
            </text>
          ))}
        </g>
      ))}
    </Frame>
  );
}

/* Figure 4 — the harness around the model. */
function Harness() {
  const items = [
    "Context assembly",
    "Tool access",
    "Permissions",
    "Sandbox",
    "State & memory",
    "Validation",
    "Logging",
    "Error handling",
    "Recovery",
    "Evaluation",
    "Human escalation",
    "Workflow / orchestration",
  ];
  const boxX = 45;
  const boxW = 290;
  const top = 8;
  const boxH = 14 + 22 + 8 + items.length * 21 + 14;
  return (
    <Frame width={380} height={top + boxH + 24 + 36 + 8}>
      <rect x={boxX} y={top} width={boxW} height={boxH} rx={2} className="dg-box" />
      <text x={boxX + boxW / 2} y={top + 28} textAnchor="middle" className="dg-title">
        HARNESS
      </text>
      {items.map((item, i) => (
        <text key={item} x={boxX + 20} y={top + 58 + i * 21} className="dg-text">
          {item}
        </text>
      ))}
      <VArrow x={boxX + boxW / 2} y1={top + boxH} y2={top + boxH + 24} />
      <Node cx={boxX + boxW / 2} y={top + boxH + 24} w={160} h={36} lines={[{ text: "MODEL", title: true }]} />
    </Frame>
  );
}

/* Figure 5 — the loop. */
function Loop() {
  const boxX = 150;
  const boxW = 170;
  const boxY = 8;
  const rows = ["Prompt agent", "Observe result", "Evaluate", "Continue?"];
  const boxH = 48 + (rows.length - 1) * 36 + 26;
  const bottom = boxY + boxH;
  return (
    <Frame width={400} height={bottom + 64}>
      <text x={52} y={boxY + 46} textAnchor="middle" className="dg-title">
        Goal
      </text>
      <HArrow x1={78} x2={boxX} y={boxY + 42} />
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={2} className="dg-box" />
      <text x={boxX + boxW / 2} y={boxY + 20} textAnchor="middle" className="dg-title">
        LOOP
      </text>
      {rows.map((row, i) => {
        const y = boxY + 48 + i * 36;
        return (
          <g key={row}>
            <text x={boxX + boxW / 2} y={y} textAnchor="middle" className="dg-text">
              {row}
            </text>
            {i < rows.length - 1 && <VArrow x={boxX + boxW / 2} y1={y + 8} y2={y + 24} />}
          </g>
        );
      })}
      {/* yes: back into the loop */}
      <g className="dg-line">
        <line x1={boxX + boxW} y1={bottom - 12} x2={366} y2={bottom - 12} />
        <line x1={366} y1={bottom - 12} x2={366} y2={bottom + 34} />
        <line x1={366} y1={bottom + 34} x2={282} y2={bottom + 34} />
        <line x1={282} y1={bottom + 34} x2={282} y2={bottom - 1} />
        <polygon points={`278,${bottom - 7} 286,${bottom - 7} 282,${bottom}`} className="dg-head" />
      </g>
      <text x={348} y={bottom - 18} textAnchor="middle" className="dg-note">
        yes
      </text>
      {/* no: done */}
      <VArrow x={202} y1={bottom} y2={bottom + 26} />
      <text x={214} y={bottom + 20} className="dg-note">
        no
      </text>
      <Node cx={202} y={bottom + 26} w={140} h={32} lines={[{ text: "DONE", title: true }]} />
    </Frame>
  );
}

/* Figure 6 — a complete, minimal agent system. */
function FullStack() {
  const cx = 200;
  const w = 210;
  let y = 8;
  const gap = 22;
  const parts: React.ReactNode[] = [];

  const pushLabel = (text: string) => {
    parts.push(<Label key={`l-${y}-${text}`} x={cx} y={y + 14} children={text} />);
    y += 20;
  };
  const pushArrow = () => {
    const y1 = y;
    parts.push(
      <g key={`a-${y1}`} className="dg-line">
        <line x1={cx} y1={y1} x2={cx} y2={y1 + gap - 1} />
        <polygon points={`${cx - 4},${y1 + gap - 7} ${cx + 4},${y1 + gap - 7} ${cx},${y1 + gap}`} className="dg-head" />
      </g>,
    );
    y += gap;
  };
  const pushNode = (lines: Line[], h: number) => {
    parts.push(<Node key={`n-${y}-${lines[0].text}`} cx={cx} y={y} w={w} h={h} lines={lines} />);
    y += h;
  };

  pushLabel("TASK");
  pushArrow();
  pushNode([{ text: "TASK STATE", title: true }], 34);
  pushArrow();
  const loopY = y;
  pushNode([{ text: "LOOP", title: true }, { text: "Choose action", muted: true }], 56);
  pushArrow();
  pushNode(
    [
      { text: "CONTEXT", title: true },
      { text: "task" },
      { text: "relevant code" },
      { text: "progress" },
      { text: "feedback" },
    ],
    118,
  );
  pushArrow();
  pushNode([{ text: "MODEL", title: true }], 34);
  pushArrow();
  pushNode([{ text: "POLICY", title: true }, { text: "allowed?", muted: true }], 56);
  pushArrow();
  pushNode(
    [{ text: "TOOLS", title: true }, { text: "files" }, { text: "shell" }, { text: "tests" }, { text: "git" }],
    118,
  );
  pushArrow();
  pushLabel("ENVIRONMENT");
  pushArrow();
  pushNode(
    [
      { text: "EVALUATOR", title: true },
      { text: "tests" },
      { text: "lint" },
      { text: "typecheck" },
      { text: "review" },
    ],
    118,
  );

  // PASS / FAIL branch
  const branchY = y + 26;
  parts.push(
    <g key="branch">
      <line x1={cx} y1={y} x2={cx} y2={branchY} className="dg-line" />
      <line x1={110} y1={branchY} x2={290} y2={branchY} className="dg-line" />
      <line x1={110} y1={branchY} x2={110} y2={branchY + 24} className="dg-line" />
      <line x1={290} y1={branchY} x2={290} y2={branchY + 24} className="dg-line" />
      <text x={110} y={branchY - 8} textAnchor="middle" className="dg-note">
        PASS
      </text>
      <text x={290} y={branchY - 8} textAnchor="middle" className="dg-note">
        FAIL
      </text>
    </g>,
  );
  const doneY = branchY + 24;
  const updateY = branchY + 24;
  parts.push(
    <g key="ends">
      <Node cx={110} y={doneY} w={130} h={34} lines={[{ text: "DONE", title: true }]} />
      <Node cx={290} y={updateY} w={150} h={34} lines={[{ text: "update state" }]} />
    </g>,
  );
  // FAIL feedback back up to LOOP
  const fbX = 392;
  const loopMidY = loopY + 28;
  parts.push(
    <g key="feedback" className="dg-line">
      <line x1={365} y1={updateY + 17} x2={fbX} y2={updateY + 17} />
      <line x1={fbX} y1={updateY + 17} x2={fbX} y2={loopMidY} />
      <line x1={fbX} y1={loopMidY} x2={cx + w / 2 + 1} y2={loopMidY} />
      <polygon
        points={`${cx + w / 2 - 6},${loopMidY - 4} ${cx + w / 2 - 6},${loopMidY + 4} ${cx + w / 2},${loopMidY}`}
        className="dg-head"
      />
    </g>,
  );

  const height = doneY + 34 + 8;
  return (
    <Frame width={420} height={height}>
      {parts}
    </Frame>
  );
}

/* Figure 7 — a production-ready agent runtime. */
function Production() {
  const cx = 300;
  let y = 8;
  const gap = 22;
  const parts: React.ReactNode[] = [];
  const pushNode = (lines: Line[], w: number, h: number, ncx: number = cx) => {
    parts.push(<Node key={`n-${y}-${lines[0].text}`} cx={ncx} y={y} w={w} h={h} lines={lines} />);
    y += h;
  };
  const pushArrow = (ax: number = cx) => {
    const y1 = y;
    parts.push(
      <g key={`a-${y1}-${ax}`} className="dg-line">
        <line x1={ax} y1={y1} x2={ax} y2={y1 + gap - 1} />
        <polygon points={`${ax - 4},${y1 + gap - 7} ${ax + 4},${y1 + gap - 7} ${ax},${y1 + gap}`} className="dg-head" />
      </g>,
    );
    y += gap;
  };

  pushNode([{ text: "Scheduler", title: true }], 150, 34);
  pushArrow();
  pushNode([{ text: "Task Queue" }], 132, 34);
  pushArrow();
  pushNode([{ text: "Orchestrator", title: true }], 180, 34);
  // fan out to three agents (stub drops below the box so the bar never
  // overdraws the box border)
  const fanY = y + 12;
  parts.push(
    <g key="fan" className="dg-line">
      <line x1={cx} y1={y} x2={cx} y2={fanY} />
      <line x1={150} y1={fanY} x2={450} y2={fanY} />
    </g>,
  );
  const agents = ["Research Agent", "Builder Agent", "Reviewer Agent"];
  const ax = [150, 300, 450];
  agents.forEach((a, i) => {
    parts.push(
      <g key={`fan-${a}`} className="dg-line">
        <line x1={ax[i]} y1={fanY} x2={ax[i]} y2={fanY + 24} />
      </g>,
    );
  });
  y = fanY + 24;
  const agentY = y;
  agents.forEach((a, i) => {
    parts.push(<Node key={`agent-${a}`} cx={ax[i]} y={agentY} w={148} h={56} lines={[{ text: a.split(" ")[0], title: true }, { text: "Agent", title: true }]} />);
  });
  y = agentY + 56;
  // join into shared state
  const joinY = y + 22;
  ax.forEach((x) => {
    parts.push(
      <g key={`j-${x}`} className="dg-line">
        <line x1={x} y1={y} x2={x} y2={joinY} />
      </g>,
    );
  });
  parts.push(<line key="join" x1={150} y1={joinY} x2={450} y2={joinY} className="dg-line" />);
  y = joinY;
  pushArrow();
  pushNode([{ text: "Shared State", title: true }], 152, 34);
  // split to evaluators / memory (stub drops below the box so the bar
  // never overdraws the box border)
  const splitY = y + 12;
  parts.push(
    <g key="split" className="dg-line">
      <line x1={cx} y1={y} x2={cx} y2={splitY} />
      <line x1={215} y1={splitY} x2={385} y2={splitY} />
      <line x1={215} y1={splitY} x2={215} y2={splitY + 24} />
      <line x1={385} y1={splitY} x2={385} y2={splitY + 24} />
    </g>,
  );
  y = splitY + 24;
  const emY = y;
  parts.push(<Node key="eval" cx={215} y={emY} w={140} h={34} lines={[{ text: "Evaluators" }]} />);
  parts.push(<Node key="mem" cx={385} y={emY} w={140} h={34} lines={[{ text: "Memory" }]} />);
  y = emY + 34;
  const join2Y = y + 22;
  [215, 385].forEach((x) => {
    parts.push(
      <g key={`j2-${x}`} className="dg-line">
        <line x1={x} y1={y} x2={x} y2={join2Y} />
      </g>,
    );
  });
  parts.push(<line key="join2" x1={215} y1={join2Y} x2={385} y2={join2Y} className="dg-line" />);
  y = join2Y;
  pushArrow();
  pushNode([{ text: "Progress" }], 132, 34);
  pushArrow();
  pushNode([{ text: "Loop", title: true }], 112, 34);

  return (
    <Frame width={600} height={y + 8} minWidth={520}>
      {parts}
    </Frame>
  );
}

/* Figure 8 — the ladder from prompting to agent engineering. */
function Tldr() {
  const stages = [
    { name: "Prompt Engineering", q: "What should I say?" },
    { name: "Context Engineering", q: "What should the model see?" },
    { name: "Harness Engineering", q: "What should the model be able to do?" },
    { name: "Loop Engineering", q: "How should the system keep working?" },
    { name: "Agent Engineering", q: "How do all of these work together?" },
  ];
  const cx = 190;
  const top = 12;
  const step = 104;
  return (
    <Frame width={380} height={top + stages.length * step}>
      {stages.map((s, i) => {
        const y = top + i * step;
        return (
          <g key={s.name}>
            <text x={cx} y={y} textAnchor="middle" className="dg-title">
              {s.name}
            </text>
            <VArrow x={cx} y1={y + 8} y2={y + 32} />
            <text x={cx} y={y + 52} textAnchor="middle" className="dg-note">
              {s.q}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/* Figure C1 — the Confluence loop: pick, run, inspect, reproduce. */
function ConfluenceFlow() {
  return (
    <Frame width={620} height={196} minWidth={520}>
      <Node
        cx={110}
        y={30}
        w={180}
        h={136}
        lines={[
          { text: "You pick", title: true },
          { text: "algorithm", muted: true },
          { text: "dataset", muted: true },
          { text: "hyperparameters", muted: true },
        ]}
      />
      <HArrow x1={200} x2={238} y={98} />
      <Node
        cx={323}
        y={30}
        w={170}
        h={136}
        lines={[
          { text: "sklearn runs it", title: true },
          { text: "FastAPI", muted: true },
          { text: "scikit-learn", muted: true },
          { text: "nothing mocked", muted: true },
        ]}
      />
      <HArrow x1={408} x2={446} y={98} />
      <Node
        cx={531}
        y={30}
        w={170}
        h={136}
        lines={[
          { text: "You get", title: true },
          { text: "boundary heatmap", muted: true },
          { text: "loss curves", muted: true },
          { text: "explanations", muted: true },
          { text: "Python code", muted: true },
        ]}
      />
    </Frame>
  );
}

/* Figure C2 — one slider, three models: gamma on the same data. */
function ConfluenceGamma() {
  const panels = [
    { gx: "0.01", verdict: "underfit" },
    { gx: "1", verdict: "about right" },
    { gx: "10", verdict: "memorized" },
  ];
  const dotsA = [
    [28, 30],
    [44, 62],
    [30, 96],
    [58, 44],
  ];
  const dotsB = [
    [104, 36],
    [120, 70],
    [102, 102],
    [88, 56],
  ];
  return (
    <Frame width={510} height={208} minWidth={440}>
      {panels.map((p, i) => {
        const ox = 15 + i * 165;
        return (
          <g key={p.gx}>
            <rect x={ox} y={8} width={150} height={130} rx={2} className="dg-box" />
            {dotsA.map(([dx, dy], j) => (
              <circle key={`a${j}`} cx={ox + dx} cy={8 + dy} r={3.2} className="dg-dot-a" />
            ))}
            {dotsB.map(([dx, dy], j) => (
              <circle key={`b${j}`} cx={ox + dx} cy={8 + dy} r={3.2} className="dg-dot-b" />
            ))}
            {i === 0 && (
              <line x1={ox + 72} y1={12} x2={ox + 72} y2={134} className="dg-line" />
            )}
            {i === 1 && (
              <path
                d={`M ${ox + 78} 12 C ${ox + 50} 50, ${ox + 104} 90, ${ox + 70} 134`}
                className="dg-curve"
              />
            )}
            {i === 2 && (
              <g className="dg-line">
                <ellipse cx={ox + 44} cy={52} rx={16} ry={20} />
                <ellipse cx={ox + 104} cy={72} rx={18} ry={22} />
                <ellipse cx={ox + 66} cy={108} rx={14} ry={14} />
              </g>
            )}
            <text x={ox + 75} y={160} textAnchor="middle" className="dg-text">
              gamma = {p.gx}
            </text>
            <text x={ox + 75} y={178} textAnchor="middle" className="dg-note">
              {p.verdict}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/* Figure C3 — boring on purpose: the Confluence stack. */
function ConfluenceStack() {
  return (
    <Frame width={560} height={252} minWidth={500}>
      <rect x={8} y={8} width={544} height={236} rx={4} className="dg-dashed" />
      <text x={24} y={32} className="dg-note">
        Docker
      </text>
      <Node
        cx={106}
        y={60}
        w={152}
        h={104}
        lines={[
          { text: "Next.js 15", title: true },
          { text: "TypeScript UI", muted: true },
          { text: "heatmaps", muted: true },
          { text: "playback", muted: true },
        ]}
      />
      <HArrow x1={182} x2={214} y={112} />
      <Node
        cx={290}
        y={60}
        w={152}
        h={104}
        lines={[{ text: "FastAPI", title: true }, { text: "runs the compute", muted: true }]}
      />
      <HArrow x1={366} x2={398} y={112} />
      <Node
        cx={474}
        y={60}
        w={152}
        h={104}
        lines={[
          { text: "scikit-learn", title: true },
          { text: "real compute", muted: true },
          { text: "nothing mocked", muted: true },
        ]}
      />
      <VArrow x={290} y1={164} y2={188} />
      <Node cx={290} y={188} w={152} h={30} lines={[{ text: "Redis cache", muted: true }]} />
    </Frame>
  );
}
/* Figure C4 — the organizing idea: algorithms grouped by boundary shape. */
function ConfluenceTaxonomy() {
  const panels = ["Linear", "Tree-Based", "Kernel", "Instance-Based"];
  return (
    <Frame width={545} height={168} minWidth={480}>
      {panels.map((name, i) => {
        const ox = 10 + i * 135;
        return (
          <g key={name}>
            <rect x={ox} y={8} width={120} height={120} rx={2} className="dg-box" />
            {i === 0 && (
              <g>
                <circle cx={ox + 32} cy={48} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 44} cy={86} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 88} cy={44} r={3.2} className="dg-dot-b" />
                <circle cx={ox + 78} cy={92} r={3.2} className="dg-dot-b" />
                <line x1={ox + 60} y1={12} x2={ox + 60} y2={124} className="dg-line" />
              </g>
            )}
            {i === 1 && (
              <g>
                <circle cx={ox + 32} cy={48} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 44} cy={108} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 90} cy={48} r={3.2} className="dg-dot-b" />
                <circle cx={ox + 105} cy={103} r={3.2} className="dg-dot-b" />
                <path
                  d={`M ${ox + 18} 12 H ${ox + 58} V 68 H ${ox + 98} V 124`}
                  className="dg-curve"
                />
              </g>
            )}
            {i === 2 && (
              <g>
                <circle cx={ox + 52} cy={56} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 68} cy={80} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 24} cy={92} r={3.2} className="dg-dot-b" />
                <circle cx={ox + 96} cy={40} r={3.2} className="dg-dot-b" />
                <ellipse cx={ox + 60} cy={68} rx={28} ry={40} className="dg-line" fill="none" />
              </g>
            )}
            {i === 3 && (
              <g>
                <circle cx={ox + 34} cy={42} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 50} cy={90} r={3.2} className="dg-dot-a" />
                <circle cx={ox + 88} cy={50} r={3.2} className="dg-dot-b" />
                <circle cx={ox + 76} cy={96} r={3.2} className="dg-dot-b" />
                <path
                  d={`M ${ox + 52} 12 L ${ox + 70} 46 L ${ox + 54} 78 L ${ox + 72} 124`}
                  className="dg-curve"
                />
              </g>
            )}
            <text x={ox + 60} y={150} textAnchor="middle" className="dg-text">
              {name}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/* Figure C5 — playback is replay: frames over a websocket. */
function ConfluenceFrames() {
  return (
    <Frame width={600} height={172} minWidth={520}>
      <Node
        cx={110}
        y={30}
        w={170}
        h={112}
        lines={[
          { text: "trainer", title: true },
          { text: "fits the model", muted: true },
          { text: "steps the epochs", muted: true },
        ]}
      />
      <HArrow x1={195} x2={245} y={86} />
      <text x={220} y={74} textAnchor="middle" className="dg-note">
        frames
      </text>
      <Node
        cx={420}
        y={30}
        w={350}
        h={112}
        lines={[
          { text: "browser", title: true },
          { text: "boundary + loss per frame", muted: true },
          { text: "play, pause, scrub = replay", muted: true },
        ]}
      />
    </Frame>
  );
}

/* Figure J1 — every loop step becomes a slow generative call. */
function JevProblem() {
  const nodes = [
    "action = llm(context)",
    "run_tool(action)",
    "context += result",
    "repeat: judge, route, check",
  ];
  const w = 260;
  const cx = 210;
  const h = 34;
  const gap = 22;
  const top = 34;
  return (
    <Frame width={420} height={top + nodes.length * h + (nodes.length - 1) * gap + 66}>
      <text x={cx} y={16} textAnchor="middle" className="dg-note">
        while not done:
      </text>
      {nodes.map((n, i) => {
        const y = top + i * (h + gap);
        return (
          <g key={`${n}-${i}`}>
            <Node cx={cx} y={y} w={w} h={h} lines={[{ text: n }]} />
            {i < nodes.length - 1 && <VArrow x={cx} y1={y + h} y2={y + h + gap} />}
          </g>
        );
      })}
      <text x={cx} y={top + nodes.length * h + (nodes.length - 1) * gap + 28} textAnchor="middle" className="dg-note">
        each fork waits for tokens to stream out
      </text>
      <text x={cx} y={top + nodes.length * h + (nodes.length - 1) * gap + 46} textAnchor="middle" className="dg-note">
        parse, validate, retry when shape is wrong
      </text>
    </Frame>
  );
}

/* Figure J2 — state plus questions in, typed answers out. */
function JevWhat() {
  return (
    <Frame width={620} height={210} minWidth={520}>
      <Node
        cx={110}
        y={40}
        w={180}
        h={130}
        lines={[
          { text: "state", title: true },
          { text: "text or JSON", muted: true },
          { text: "ticket, logs,", muted: true },
          { text: "page elements", muted: true },
        ]}
      />
      <Node
        cx={310}
        y={40}
        w={180}
        h={130}
        lines={[
          { text: "questions", title: true },
          { text: "Choice / Score /", muted: true },
          { text: "Noul, fixed", muted: true },
          { text: "shapes", muted: true },
        ]}
      />
      <HArrow x1={200} x2={218} y={105} />
      <HArrow x1={400} x2={418} y={105} />
      <Node
        cx={509}
        y={40}
        w={164}
        h={130}
        lines={[
          { text: "Jev", title: true },
          { text: "parallel pass", muted: true },
          { text: "70-500 ms", muted: true },
        ]}
      />
      <VArrow x={509} y1={170} y2={188} />
      <text x={509} y={204} textAnchor="middle" className="dg-note">
        typed answers + probabilities
      </text>
    </Frame>
  );
}

/* Figure J3 — the three primitives. */
function JevPrimitives() {
  const cols = [
    { title: "CHOICE", lines: ["picks 1 of up to 255", "returns winner +", "full distribution"] },
    { title: "SCORE", lines: ["rates on 2-10 levels", "result 0 to N-1", "can land between"] },
    { title: "NOUL", lines: ["yes or no as P(yes)", "0 to 1, no separate", "confidence field"] },
  ];
  const centers = [105, 310, 515];
  return (
    <Frame width={620} height={190} minWidth={520}>
      {cols.map((col, i) => (
        <g key={col.title}>
          <Node cx={centers[i]} y={20} w={180} h={44} lines={[{ text: col.title, title: true }]} />
          {col.lines.map((line, j) => (
            <text key={line} x={centers[i]} y={88 + j * 19} textAnchor="middle" className="dg-note">
              {line}
            </text>
          ))}
        </g>
      ))}
      <text x={310} y={172} textAnchor="middle" className="dg-note">
        one request can ask all three in parallel
      </text>
    </Frame>
  );
}

/* Figure J4 — latency and price, vendor comparison. */
function JevLlmVsJev() {
  const barX = 170;
  const maxW = 380;
  const rows = [
    { label: "Jev latency", value: "70-500 ms", w: 60 },
    { label: "LLM latency", value: "3-329 s", w: maxW },
    { label: "Jev input", value: "$0.042 / 1M", w: 40 },
    { label: "LLM input", value: "$0.20-$10 / 1M", w: maxW },
  ];
  const top = 12;
  const step = 52;
  return (
    <Frame width={600} height={top + rows.length * step + 40} minWidth={500}>
      {rows.map((row, i) => {
        const y = top + i * step;
        return (
          <g key={row.label}>
            <text x={barX - 10} y={y + 22} textAnchor="end" className="dg-text">
              {row.label}
            </text>
            <rect x={barX} y={y + 6} width={row.w} height={20} rx={2} className="dg-box" />
            <text x={barX + row.w + 8} y={y + 22} className="dg-note">
              {row.value}
            </text>
          </g>
        );
      })}
      <text x={310} y={top + rows.length * step + 22} textAnchor="middle" className="dg-note">
        vendor ceiling: 40-200x faster, up to 400x cheaper
      </text>
    </Frame>
  );
}

/* Figure J5 — close race means low confidence. Faithful values. */
function JevConfidence() {
  const barX = 150;
  const maxW = 300;
  const rows = [
    { label: "billing 0.52", w: Math.round(maxW * 0.52) },
    { label: "technical 0.46", w: Math.round(maxW * 0.46) },
    { label: "sales 0.02", w: Math.round(maxW * 0.02) },
  ];
  const top = 12;
  const step = 44;
  return (
    <Frame width={560} height={top + rows.length * step + 64} minWidth={460}>
      {rows.map((row, i) => {
        const y = top + i * step;
        return (
          <g key={row.label}>
            <text x={barX - 10} y={y + 20} textAnchor="end" className="dg-text">
              {row.label}
            </text>
            <rect x={barX} y={y + 5} width={Math.max(row.w, 6)} height={18} rx={2} className="dg-box" />
          </g>
        );
      })}
      <text x={300} y={top + rows.length * step + 24} textAnchor="middle" className="dg-title">
        confidence 0.18: do not auto-route
      </text>
      <text x={300} y={top + rows.length * step + 44} textAnchor="middle" className="dg-note">
        winner tells what won, spread tells how close it was
      </text>
    </Frame>
  );
}

/* Figure J6 — LLM, Jev, and code each own one job. */
function JevAgent() {
  return (
    <Frame width={620} height={200} minWidth={520}>
      <Node
        cx={110}
        y={30}
        w={180}
        h={120}
        lines={[
          { text: "LLM", title: true },
          { text: "plans, writes,", muted: true },
          { text: "explains", muted: true },
        ]}
      />
      <Node
        cx={315}
        y={30}
        w={190}
        h={120}
        lines={[
          { text: "Jev", title: true },
          { text: "routes, scores,", muted: true },
          { text: "gates, checks", muted: true },
        ]}
      />
      <Node
        cx={525}
        y={30}
        w={170}
        h={120}
        lines={[
          { text: "code", title: true },
          { text: "runs branches,", muted: true },
          { text: "limits, logs", muted: true },
        ]}
      />
      <HArrow x1={200} x2={218} y={90} />
      <HArrow x1={410} x2={438} y={90} />
      <text x={310} y={178} textAnchor="middle" className="dg-note">
        route with Choice, gate risk, check results, escalate when unsure
      </text>
    </Frame>
  );
}

export const DIAGRAMS: Record<string, { caption: string; Component: () => React.JSX.Element }> = {
  "old-workflow": { caption: "Figure 1. The old workflow — the human is the control system.", Component: OldWorkflow },
  "agent-flow": { caption: "Figure 2. A modern coding-agent flow — the system drives itself.", Component: AgentFlow },
  workshop: { caption: "Figure 3. One agent, three engineering concerns.", Component: Workshop },
  harness: { caption: "Figure 4. The harness — everything the model operates inside.", Component: Harness },
  loop: { caption: "Figure 5. The loop — the machine handles the repetition.", Component: Loop },
  "full-stack": { caption: "Figure 6. A complete, minimal agent system.", Component: FullStack },
  production: { caption: "Figure 7. Scaling up — from one loop to an agent runtime.", Component: Production },
  tldr: { caption: "Figure 8. The ladder — from prompting to agent engineering.", Component: Tldr },
  "confluence-flow": { caption: "Figure 1. The Confluence loop: pick, run, inspect, reproduce.", Component: ConfluenceFlow },
  "confluence-gamma": { caption: "Figure 2. One slider, three models: gamma at 0.01, 1, and 10 on the same data.", Component: ConfluenceGamma },
  "confluence-stack": { caption: "Figure 3. Boring on purpose: Next.js, FastAPI, scikit-learn, Redis, Docker.", Component: ConfluenceStack },
  "confluence-taxonomy": { caption: "Figure 4. The organizing idea: algorithms grouped by boundary shape.", Component: ConfluenceTaxonomy },
  "confluence-frames": { caption: "Figure 5. Playback is replay: the backend streams frames, the browser scrubs them.", Component: ConfluenceFrames },
  "jev-problem": { caption: "Figure 1. Each loop step becomes a generative call that streams tokens and needs parsing.", Component: JevProblem },
  "jev-what": { caption: "Figure 2. State plus questions in, typed answers with probabilities out.", Component: JevWhat },
  "jev-primitives": { caption: "Figure 3. Choice, Score, and Noul cover pick, rate, and yes-or-no.", Component: JevPrimitives },
  "jev-llm-vs-jev": { caption: "Figure 4. Vendor comparison: 70-500 ms vs 3-329 s, $0.042 vs $0.20-$10 per million input tokens.", Component: JevLlmVsJev },
  "jev-confidence": { caption: "Figure 5. Billing 0.52 vs technical 0.46 with confidence 0.18 means send to review.", Component: JevConfidence },
  "jev-agent": { caption: "Figure 6. LLM creates work, Jev decides next, code runs it.", Component: JevAgent },
};
