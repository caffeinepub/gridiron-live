interface QuarterTimerOverlayProps {
  phase: string;
  formattedTime: string;
}

export default function QuarterTimerOverlay({ phase, formattedTime }: QuarterTimerOverlayProps) {
  return (
    <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-white/20">
      <div className="flex flex-col items-start gap-1">
        <div className="text-white font-bold text-sm tracking-wider">{phase}</div>
        <div className="text-white font-mono text-2xl font-bold leading-none">{formattedTime}</div>
      </div>
    </div>
  );
}
