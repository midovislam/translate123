import { SVGProps } from "react";

type SvgComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

// Big Ben — UK (en)
const BigBen: SvgComponent = (props) => (
  <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Base */}
    <rect x="60" y="340" width="80" height="40" />
    <rect x="70" y="300" width="60" height="40" />
    {/* Tower body */}
    <rect x="75" y="120" width="50" height="180" />
    {/* Windows */}
    <rect x="85" y="140" width="30" height="20" rx="3" />
    <rect x="85" y="175" width="30" height="20" rx="3" />
    <rect x="85" y="210" width="30" height="20" rx="3" />
    <rect x="85" y="245" width="30" height="20" rx="3" />
    {/* Clock face */}
    <rect x="72" y="80" width="56" height="40" />
    <circle cx="100" cy="100" r="15" />
    <line x1="100" y1="100" x2="100" y2="89" />
    <line x1="100" y1="100" x2="108" y2="100" />
    {/* Spire */}
    <polygon points="80,80 120,80 110,50 90,50" />
    <polygon points="90,50 110,50 105,25 95,25" />
    <line x1="100" y1="25" x2="100" y2="5" />
  </svg>
);

// St. Basil's Cathedral — Russia (ru)
const StBasils: SvgComponent = (props) => (
  <svg viewBox="0 0 240 400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Base */}
    <rect x="40" y="340" width="160" height="40" />
    {/* Main building */}
    <rect x="60" y="200" width="120" height="140" />
    {/* Windows */}
    <rect x="80" y="280" width="25" height="40" rx="12" />
    <rect x="135" y="280" width="25" height="40" rx="12" />
    <rect x="90" y="220" width="20" height="25" rx="10" />
    <rect x="130" y="220" width="20" height="25" rx="10" />
    {/* Center dome */}
    <rect x="100" y="120" width="40" height="80" />
    <path d="M100,120 Q100,70 120,55 Q140,70 140,120" />
    <line x1="120" y1="55" x2="120" y2="35" />
    <circle cx="120" cy="32" r="4" />
    {/* Left dome */}
    <rect x="55" y="160" width="30" height="40" />
    <path d="M55,160 Q55,120 70,110 Q85,120 85,160" />
    <line x1="70" y1="110" x2="70" y2="95" />
    <circle cx="70" cy="92" r="3" />
    {/* Right dome */}
    <rect x="155" y="160" width="30" height="40" />
    <path d="M155,160 Q155,120 170,110 Q185,120 185,160" />
    <line x1="170" y1="110" x2="170" y2="95" />
    <circle cx="170" cy="92" r="3" />
  </svg>
);

// Christ the Redeemer — Brazil (pt)
const ChristRedeemer: SvgComponent = (props) => (
  <svg viewBox="0 0 240 400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Mountain */}
    <path d="M0,400 Q60,300 120,250 Q180,300 240,400" />
    {/* Pedestal */}
    <rect x="100" y="220" width="40" height="30" />
    <rect x="95" y="245" width="50" height="8" />
    {/* Body */}
    <rect x="108" y="120" width="24" height="100" rx="4" />
    {/* Arms */}
    <line x1="120" y1="135" x2="30" y2="150" strokeWidth={2} />
    <line x1="120" y1="135" x2="210" y2="150" strokeWidth={2} />
    {/* Hands */}
    <line x1="30" y1="150" x2="25" y2="158" />
    <line x1="210" y1="150" x2="215" y2="158" />
    {/* Head */}
    <circle cx="120" cy="110" r="12" />
    {/* Robe lines */}
    <line x1="114" y1="160" x2="108" y2="220" />
    <line x1="126" y1="160" x2="132" y2="220" />
  </svg>
);

// Sagrada Familia — Spain (es)
const SagradaFamilia: SvgComponent = (props) => (
  <svg viewBox="0 0 240 400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Base */}
    <rect x="40" y="340" width="160" height="40" />
    {/* Main facade */}
    <rect x="60" y="180" width="120" height="160" />
    {/* Door */}
    <path d="M100,340 L100,290 Q120,270 140,290 L140,340" />
    {/* Windows */}
    <circle cx="100" cy="230" r="12" />
    <circle cx="140" cy="230" r="12" />
    <circle cx="120" cy="200" r="8" />
    {/* Left spire */}
    <rect x="55" y="100" width="20" height="80" />
    <polygon points="55,100 75,100 65,30" />
    <circle cx="65" cy="27" r="4" />
    {/* Center spire */}
    <rect x="105" y="80" width="30" height="100" />
    <polygon points="105,80 135,80 120,15" />
    <circle cx="120" cy="12" r="5" />
    {/* Right spire */}
    <rect x="165" y="100" width="20" height="80" />
    <polygon points="165,100 185,100 175,30" />
    <circle cx="175" cy="27" r="4" />
  </svg>
);

// Eiffel Tower — France (fr)
const EiffelTower: SvgComponent = (props) => (
  <svg viewBox="0 0 200 400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Base legs */}
    <line x1="100" y1="60" x2="30" y2="380" />
    <line x1="100" y1="60" x2="170" y2="380" />
    {/* Base feet */}
    <path d="M20,380 L30,380 Q30,360 35,350" />
    <path d="M180,380 L170,380 Q170,360 165,350" />
    {/* First platform */}
    <line x1="55" y1="300" x2="145" y2="300" />
    <line x1="52" y1="305" x2="148" y2="305" />
    {/* Arch at base */}
    <path d="M60,320 Q100,290 140,320" />
    {/* Second platform */}
    <line x1="72" y1="220" x2="128" y2="220" />
    <line x1="70" y1="225" x2="130" y2="225" />
    {/* Cross braces */}
    <line x1="62" y1="260" x2="138" y2="260" />
    <line x1="80" y1="180" x2="120" y2="180" />
    {/* Top section */}
    <rect x="92" y="80" width="16" height="40" />
    {/* Antenna */}
    <line x1="100" y1="80" x2="100" y2="20" />
    {/* Top platform */}
    <line x1="88" y1="120" x2="112" y2="120" />
  </svg>
);

// Brandenburg Gate — Germany (de)
const BrandenburgGate: SvgComponent = (props) => (
  <svg viewBox="0 0 280 400" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Base */}
    <rect x="20" y="360" width="240" height="20" />
    {/* Columns */}
    {[40, 80, 120, 160, 200, 240].map((x) => (
      <g key={x}>
        <rect x={x - 8} y="200" width="16" height="160" />
        <rect x={x - 10} y="195" width="20" height="8" />
      </g>
    ))}
    {/* Entablature */}
    <rect x="20" y="175" width="240" height="20" />
    <rect x="15" y="170" width="250" height="8" />
    {/* Pediment / top structure */}
    <rect x="30" y="140" width="220" height="30" />
    {/* Quadriga (chariot on top) — simplified */}
    <rect x="110" y="115" width="60" height="25" />
    <circle cx="125" cy="110" r="8" />
    <circle cx="155" cy="110" r="8" />
    <line x1="140" y1="105" x2="140" y2="90" />
    <line x1="135" y1="92" x2="145" y2="92" />
  </svg>
);

const LANDMARKS: Record<string, SvgComponent> = {
  en: BigBen,
  ru: StBasils,
  pt: ChristRedeemer,
  es: SagradaFamilia,
  fr: EiffelTower,
  de: BrandenburgGate,
};

export function LandmarkSvg({ code, className }: { code: string; className?: string }) {
  const Svg = LANDMARKS[code];
  if (!Svg) return null;
  return <Svg className={className} />;
}
