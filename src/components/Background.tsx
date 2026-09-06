import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import waveAnimation from "../../public/wave-animation.json";

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050508] pointer-events-none">
      {/* Top purple ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),rgba(126,34,206,0.08)_40%,transparent_70%)] blur-3xl pointer-events-none" />
      
      {/* Corner secondary ambient glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-48 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle fine tech grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
      />

      {/* Wave animation blended with overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <DotLottieReact
          data={waveAnimation}
          loop={true}
          autoplay={true}
          className="w-full h-full object-cover scale-110"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.2)' }}
        />
      </div>

      {/* Soft vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050508]/60 to-[#050508] pointer-events-none" />
    </div>
  );
}

