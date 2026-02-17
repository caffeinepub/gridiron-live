import { AlertCircle } from 'lucide-react';

interface ViewerSubtitlesOverlayProps {
  caption: string | null;
  isEnabled: boolean;
  captionsUnavailable: boolean;
}

export default function ViewerSubtitlesOverlay({
  caption,
  isEnabled,
  captionsUnavailable,
}: ViewerSubtitlesOverlayProps) {
  if (!isEnabled) {
    return null;
  }

  if (captionsUnavailable) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-[90%] px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-500/50 z-20">
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Broadcaster captions are unavailable</span>
        </div>
      </div>
    );
  }

  if (!caption || caption.trim() === '') {
    return null;
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-[90%] px-4 py-2 bg-black/80 backdrop-blur-sm rounded-lg z-20">
      <p className="text-white text-center text-sm md:text-base leading-relaxed">
        {caption}
      </p>
    </div>
  );
}
