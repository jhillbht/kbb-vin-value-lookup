import { RefObject } from "react";

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement>;
}

export const CameraView = ({ videoRef }: CameraViewProps) => {
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden">
      <video 
        ref={videoRef} 
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        playsInline
        muted
      />
      
      {/* Scanning Frame Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-4/5 h-24 border-2 border-white/20 rounded-lg">
          {/* Corner Markers */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
          </div>
        </div>
      </div>

      {/* Scanning Line Animation */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-primary/75"
        style={{
          animation: "scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          top: "50%"
        }}
      />
    </div>
  );
};