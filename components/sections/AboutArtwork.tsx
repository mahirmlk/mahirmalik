export function NeuralMap() {
  return (
    <svg viewBox="0 0 300 220" fill="none" aria-hidden="true">
      <g stroke="#aaa69f" strokeWidth="1.25" opacity=".9">
        <path d="M35 42 124 34M35 42 124 82M35 42 124 130M35 42 124 178M35 86 124 34M35 86 124 82M35 86 124 130M35 86 124 178M35 134 124 34M35 134 124 82M35 134 124 130M35 134 124 178M35 178 124 34M35 178 124 82M35 178 124 130M35 178 124 178" />
        <path d="M124 34 246 58M124 34 246 110M124 34 246 164M124 82 246 58M124 82 246 110M124 82 246 164M124 130 246 58M124 130 246 110M124 130 246 164M124 178 246 58M124 178 246 110M124 178 246 164" />
      </g>
      <g fill="#f7f6f3" stroke="#51504b" strokeWidth="1.8">
        <circle cx="35" cy="42" r="5" /><circle cx="35" cy="86" r="5" />
        <circle cx="35" cy="134" r="5" /><circle cx="35" cy="178" r="5" />
        <circle cx="124" cy="34" r="5" /><circle cx="124" cy="82" r="5" />
        <circle cx="124" cy="130" r="5" /><circle cx="124" cy="178" r="5" />
        <circle cx="246" cy="58" r="5" /><circle cx="246" cy="110" r="5" />
        <circle cx="246" cy="164" r="5" />
      </g>
      <circle cx="35" cy="134" r="5" fill="#49a99a" stroke="#49a99a" />
      <circle cx="124" cy="82" r="5.5" fill="#4968df" stroke="#4968df" />
      <circle cx="124" cy="178" r="5" fill="#e58b63" stroke="#e58b63" />
      <circle cx="246" cy="110" r="5.5" fill="#49a99a" stroke="#49a99a" />
      <circle cx="246" cy="164" r="5" fill="#e58b63" stroke="#e58b63" />
    </svg>
  );
}

export function EmbeddingOrbit() {
  return (
    <svg viewBox="0 0 300 240" fill="none" aria-hidden="true">
      <g stroke="#77746e" strokeWidth="1.4">
        <ellipse cx="150" cy="120" rx="104" ry="38" transform="rotate(-28 150 120)" />
        <ellipse cx="150" cy="120" rx="104" ry="38" transform="rotate(32 150 120)" />
        <ellipse cx="150" cy="120" rx="104" ry="38" transform="rotate(90 150 120)" />
      </g>
      <circle cx="150" cy="120" r="15" fill="#f7f6f3" stroke="#34332f" strokeWidth="1.7" />
      <circle cx="150" cy="120" r="4" fill="#4968df" />
      <circle cx="60" cy="145" r="5" fill="#f7f6f3" stroke="#34332f" strokeWidth="1.5" />
      <circle cx="231" cy="73" r="5" fill="#4968df" />
      <circle cx="150" cy="20" r="4" fill="#f7f6f3" stroke="#34332f" strokeWidth="1.5" />
    </svg>
  );
}

export function DescentMap() {
  return (
    <svg viewBox="0 0 320 220" fill="none" aria-hidden="true">
      <g stroke="#aaa69f" strokeWidth="1.1">
        <path d="M18 62c48-48 104-54 150-36 43 17 72 17 134-10M18 100c44-35 91-40 134-24 49 18 88 18 150-7M18 139c38-23 77-27 116-15 54 17 101 15 168-5M18 177c33-10 64-13 98-6 59 12 112 8 186-3" />
      </g>
      <path d="M40 43 82 88l35-16 36 50 34-14 42 44 36-20" stroke="#4968df" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="#f7f6f3" stroke="#34332f" strokeWidth="1.5">
        <circle cx="40" cy="43" r="4" /><circle cx="82" cy="88" r="4" />
        <circle cx="117" cy="72" r="4" /><circle cx="153" cy="122" r="4" />
        <circle cx="187" cy="108" r="4" /><circle cx="229" cy="152" r="4" />
      </g>
      <circle cx="265" cy="132" r="5" fill="#4968df" />
    </svg>
  );
}

export function MatrixField() {
  const activeCells = new Set([2, 8, 11, 19, 23, 27, 32]);

  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
      <path d="M26 28h188M26 64h188M26 100h188M26 136h188M26 172h188M44 14v172M82 14v172M120 14v172M158 14v172M196 14v172" stroke="#aaa69f" strokeWidth="1" />
      {Array.from({ length: 35 }, (_, index) => {
        const column = index % 7;
        const row = Math.floor(index / 7);
        const active = activeCells.has(index);

        return (
          <circle
            key={index}
            cx={44 + column * 25.3}
            cy={28 + row * 36}
            r={active ? 4.2 : 2.2}
            fill={active ? "#4968df" : "#77746e"}
            opacity={active ? 0.95 : 0.55}
          />
        );
      })}
    </svg>
  );
}

export function SignalCurve() {
  return (
    <svg viewBox="0 0 300 210" fill="none" aria-hidden="true">
      <path d="M30 24v154h240M30 139c26-2 28-80 58-78 28 2 30 91 61 88 28-3 25-57 54-56 24 1 34 31 67 27" stroke="#77746e" strokeWidth="1.4" />
      <path d="M30 154c26 0 34-34 59-35 31-1 34 29 62 27 30-2 36-64 67-66 20-2 30 18 52 18" stroke="#4968df" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M30 179h240M30 24v154" stroke="#aaa69f" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="151" cy="146" r="4.5" fill="#4968df" />
      <circle cx="218" cy="80" r="4.5" fill="#f7f6f3" stroke="#34332f" strokeWidth="1.5" />
      <circle cx="270" cy="98" r="4.5" fill="#4968df" />
    </svg>
  );
}

export function AgentLoop() {
  return (
    <svg viewBox="0 0 300 230" fill="none" aria-hidden="true">
      <path d="M78 62c17-18 38-27 64-27 40 0 73 22 88 57" stroke="#4968df" strokeWidth="2" strokeLinecap="round" />
      <path d="m218 83 13 9 8-14" stroke="#4968df" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M232 121c-8 38-39 66-80 68-28 1-53-11-69-32" stroke="#49a99a" strokeWidth="2" strokeLinecap="round" />
      <path d="m94 162-12-6-4 14" stroke="#49a99a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 146c-18-17-27-41-23-66" stroke="#e58b63" strokeWidth="2" strokeLinecap="round" />
      <path d="m39 88 7-12 9 10" stroke="#e58b63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="103" y="79" width="94" height="72" rx="14" fill="#fffdfa" stroke="#d4d0c9" strokeWidth="1.4" />
      <circle cx="150" cy="104" r="10" fill="#4968df" fillOpacity=".15" />
      <circle cx="150" cy="104" r="4" fill="#4968df" />
      <path d="M129 126h42" stroke="#aaa69f" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="75" cy="51" r="13" fill="#f7f6f3" stroke="#4968df" strokeWidth="1.5" />
      <circle cx="75" cy="51" r="4" fill="#4968df" />
      <circle cx="242" cy="111" r="13" fill="#f7f6f3" stroke="#e58b63" strokeWidth="1.5" />
      <circle cx="242" cy="111" r="4" fill="#e58b63" />
      <circle cx="150" cy="201" r="13" fill="#f7f6f3" stroke="#49a99a" strokeWidth="1.5" />
      <circle cx="150" cy="201" r="4" fill="#49a99a" />
    </svg>
  );
}
