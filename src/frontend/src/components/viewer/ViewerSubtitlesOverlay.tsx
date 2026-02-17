interface ViewerSubtitlesOverlayProps {
  transcript: string;
  isSupported: boolean;
  isEnabled: boolean;
}

export default function ViewerSubtitlesOverlay({ transcript, isSupported, isEnabled }: ViewerSubtitlesOverlayProps) {
  if (!isEnabled) return null;

  if (!isSupported) {
    return (
      <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center px-4">
        <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm max-w-2xl">
          Subtitles are not supported in this browser
        </div>
      </div>
    );
  }

  if (!transcript) return null;

  return (
    <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center px-4">
      <div className="bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-base sm:text-lg max-w-3xl shadow-2xl">
        {transcript}
      </div>
    </div>
  );
}
