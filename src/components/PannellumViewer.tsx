import React, { useEffect, useRef, useState } from 'react';
import { 
  Compass, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkle, 
  X,
  Info,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// @ts-ignore
import panoLivingRoom from '../assets/images/pano_living_room_1779773888535.png';
// @ts-ignore
import panoBedroom from '../assets/images/pano_bedroom_1779773910544.png';

// Declarations for TypeScript
declare global {
  interface Window {
    pannellum: any;
  }
}

interface HotspotType {
  id: string;
  pitch: number;
  yaw: number;
  type: 'info' | 'scene';
  text: string;
  desc?: string;
}

interface SceneType {
  id: 'living' | 'bedroom';
  name: string;
  image: string;
  hotspots: HotspotType[];
}

interface PannellumViewerProps {
  propertyName: string;
  propertyId: string;
}

export default function PannellumViewer({ propertyName, propertyId }: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  
  const [activeScene, setActiveScene] = useState<'living' | 'bedroom'>('living');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [currentYaw, setCurrentYaw] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<HotspotType | null>(null);

  // Overlay state to guide player interaction
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(true);
  const [renderOverlay, setRenderOverlay] = useState<boolean>(true);
  const hasInteractedRef = useRef<boolean>(false);
  const interactionTimerRef1 = useRef<any>(null);
  const interactionTimerRef2 = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (interactionTimerRef1.current) clearTimeout(interactionTimerRef1.current);
      if (interactionTimerRef2.current) clearTimeout(interactionTimerRef2.current);
    };
  }, []);

  const startFadeOutSequence = () => {
    if (hasInteractedRef.current) return;
    hasInteractedRef.current = true;

    // After 2 seconds of user initiating movement/drag, start the opacity animation
    interactionTimerRef1.current = setTimeout(() => {
      setIsOverlayActive(false);
      
      // Completely remove the element from the DOM tree after the 1 second transition ends (exactly 3 seconds total)
      interactionTimerRef2.current = setTimeout(() => {
        setRenderOverlay(false);
      }, 1000);
    }, 2000);
  };

  const scenes: Record<'living' | 'bedroom', SceneType> = {
    living: {
      id: 'living',
      name: 'Modern Living Room',
      image: panoLivingRoom || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      hotspots: [
        { 
          id: 'l-sofa', 
          pitch: -15, 
          yaw: 25, 
          type: 'info', 
          text: 'Plush Premium L-Sofa', 
          desc: 'High-density memory foam custom 5-seater sofa set with water-resistant velvet fabric. Professionally deep-cleaned weekly.' 
        },
        { 
          id: 'l-router', 
          pitch: 5, 
          yaw: -85, 
          type: 'info', 
          text: 'Fibre Connection Hub', 
          desc: 'Pre-fitted Airtel & Jio high-speed optical fiber ports supporting up to 1 Gbps. Perfect for working from home.' 
        },
        { 
          id: 'l-flooring', 
          pitch: -40, 
          yaw: -120, 
          type: 'info', 
          text: 'Double Charged Vitrified Flooring', 
          desc: 'Indoors are laid out with anti-skid, heat insulating Italian-style vitrified tiles for seamless durability and elegance.' 
        },
        { 
          id: 'l-planters', 
          pitch: -10, 
          yaw: 155, 
          type: 'info', 
          text: 'Oxygen Rich Plant Corner', 
          desc: 'Pre-placed snake and spider plants designed to purify air and offer a lush, welcoming atmosphere.' 
        }
      ]
    },
    bedroom: {
      id: 'bedroom',
      name: 'Master Bed Cabin',
      image: panoBedroom || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      hotspots: [
        { 
          id: 'b-bed', 
          pitch: -20, 
          yaw: -30, 
          type: 'info', 
          text: 'Solid Teak Wood King Bed', 
          desc: 'Crafted from premium Indian teakwood with custom box storage drawer systems and dual ortho-wellness mattresses.' 
        },
        { 
          id: 'b-ac', 
          pitch: 18, 
          yaw: 60, 
          type: 'info', 
          text: '5-Star Silent Split AC', 
          desc: 'Inverter dual-rotor AC with hyper-ambient cooling and ultra-silent operation (under 19dB) for highly peaceful sleep cycle.' 
        },
        { 
          id: 'b-wardrobe', 
          pitch: -5, 
          yaw: -150, 
          type: 'info', 
          text: 'Sleek Sliding Wardrobe', 
          desc: 'Contemporary full-height wardrobe panel styled with built-in hidden locker, soft-close dividers and vanity mirror.' 
        }
      ]
    }
  };

  const getCompassDirection = (yaw: number) => {
    // Normalize yaw to 0-360
    let normYaw = (yaw + 180) % 360;
    if (normYaw < 0) normYaw += 360;
    
    if (normYaw >= 337.5 || normYaw < 22.5) return 'N (North)';
    if (normYaw >= 22.5 && normYaw < 67.5) return 'NE (North-East)';
    if (normYaw >= 67.5 && normYaw < 112.5) return 'E (East)';
    if (normYaw >= 112.5 && normYaw < 157.5) return 'SE (South-East)';
    if (normYaw >= 157.5 && normYaw < 202.5) return 'S (South)';
    if (normYaw >= 202.5 && normYaw < 247.5) return 'SW (South-West)';
    if (normYaw >= 247.5 && normYaw < 292.5) return 'W (West)';
    return 'NW (North-West)';
  };

  const initPannellum = () => {
    if (!window.pannellum) {
      setLoadError('Pannellum VR engine is initializing. Please wait a moment...');
      return;
    }

    try {
      // Destroy previous instance
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          // Ignore release errors
        }
        viewerRef.current = null;
      }

      if (!containerRef.current) return;

      const scene = scenes[activeScene];

      // Setup list of hotspots with custom click handler attached
      const pannellumHotspots = scene.hotspots.map((hs) => ({
        pitch: hs.pitch,
        yaw: hs.yaw,
        type: 'info',
        text: hs.text,
        createTooltipFunc: (hotspotDiv: HTMLDivElement) => {
          // Add custom elegant styling to the default hotspot look
          hotspotDiv.classList.add('custom-hotspot-ripple');
          const innerElement = document.createElement('div');
          innerElement.className = 'w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg transition-transform hover:scale-125';
          
          const ripple = document.createElement('div');
          ripple.className = 'absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-40';
          
          hotspotDiv.appendChild(ripple);
          hotspotDiv.appendChild(innerElement);
        },
        clickHandlerFunc: () => {
          setClickedHotspot(hs);
        }
      }));

      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: scene.image,
        autoLoad: true,
        autoRotate: isRotating ? -1.5 : 0,
        pitch: 0,
        yaw: currentYaw || 0,
        hfov: 100,
        minHfov: 60,
        maxHfov: 120,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        compass: false, // We render a premium React-controlled compass
        hotSpots: pannellumHotspots,
      });

      // Track movement / rotational yaw to synchronize companion compass
      viewerRef.current.on('change', () => {
        if (viewerRef.current) {
          const yaw = viewerRef.current.getYaw();
          setCurrentYaw(yaw);
        }
      });

      setIsLoaded(true);
      setLoadError(null);
    } catch (err: any) {
      console.error('Pannellum init exception:', err);
      setLoadError('Failed to initialize 360° virtual sphere canvas. Refreshing elements...');
    }
  };

  // Re-run init when activeRoom, base image loaded, or scripts active
  useEffect(() => {
    let timer = setTimeout(() => {
      initPannellum();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          // Safe release
        }
      }
    };
  }, [activeScene]);

  // Adjust autoRotate dynamically without rebuilding entire canvas
  useEffect(() => {
    if (viewerRef.current) {
      if (isRotating) {
        viewerRef.current.startAutoRotate(-1.5);
      } else {
        viewerRef.current.stopAutoRotate();
      }
    }
  }, [isRotating]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!viewerRef.current) return;
    const currentFov = viewerRef.current.getHfov();
    const newFov = direction === 'in' ? Math.max(60, currentFov - 15) : Math.min(120, currentFov + 15);
    viewerRef.current.setHfov(newFov);
  };

  const handleFullscreen = () => {
    if (viewerRef.current) {
      viewerRef.current.toggleFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header section with scene selection tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
            <Sparkle className="w-3 h-3 fill-amber-500 animate-pulse" /> Interactive Virtual Reality Tour
          </span>
          <h4 className="text-sm font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-1.5">
            Interior 360° Sphere Viewer
          </h4>
          <p className="text-[11px] font-semibold text-slate-500">
            Real time tour inside <span className="text-[#b38330]">{propertyName}</span>. Touch/drag inside to look around.
          </p>
        </div>

        {/* Scene Selection Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => {
              setActiveScene('living');
              setClickedHotspot(null);
            }}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
              activeScene === 'living'
                ? 'bg-[#0E1F35] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Living Room
          </button>
          <button
            onClick={() => {
              setActiveScene('bedroom');
              setClickedHotspot(null);
            }}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
              activeScene === 'bedroom'
                ? 'bg-[#0E1F35] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bedroom
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div 
        id="pannellum-viewer-container"
        onPointerDown={startFadeOutSequence}
        onTouchStart={startFadeOutSequence}
        className="relative h-[280px] sm:h-[350px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-950"
      >
        
        {/* Pannellum Mounting Element */}
        <div 
          ref={containerRef} 
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing bg-slate-950" 
        />

        {/* Subtle Dynamic Drag-to-explore Instructions Overlay */}
        {renderOverlay && (
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-[1000ms] pointer-events-none z-10 ${
              isOverlayActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-slate-900/90 text-white rounded-2xl px-5 py-3.5 flex items-center gap-3 border border-white/10 shadow-2xl">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
              <div className="text-left">
                <p className="text-xs font-black tracking-widest uppercase text-amber-400">Drag to explore</p>
                <p className="text-[10px] text-slate-300 font-medium leading-normal mt-0.5">Click & swipe inside the screen to pan 360°</p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Compass overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-white/10 pointer-events-none shadow-lg">
          <Compass 
            className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-75" 
            style={{ transform: `rotate(${currentYaw}deg)` }}
          />
          <span>Direction: {Math.round((currentYaw + 180) % 360)}° {getCompassDirection(currentYaw)}</span>
        </div>

        {/* Center Loading Status/Error Handler */}
        {(!window.pannellum || loadError) && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center text-white">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <span className="text-xs font-extrabold tracking-wide text-slate-300">
              {loadError || 'Spawning Virtual Equirectangular Canvas...'}
            </span>
          </div>
        )}

        {/* Hotspot details dialog */}
        {clickedHotspot && (
          <div className="absolute bottom-16 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-white/15 text-white z-10 animate-scaleUp shadow-2xl">
            <div className="flex justify-between items-start mb-1.5">
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Hotspot Insight
              </span>
              <button 
                onClick={() => setClickedHotspot(null)}
                className="text-white/60 hover:text-white p-0.5 rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h5 className="font-black text-xs text-amber-450">{clickedHotspot.text}</h5>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-1">{clickedHotspot.desc}</p>
          </div>
        )}

        {/* Action controls inside canvas bottom area */}
        <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center pointer-events-none z-10">
          
          {/* Rotational controls */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`pointer-events-auto px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border shadow-md transition-all cursor-pointer ${
              isRotating
                ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600'
                : 'bg-black/75 hover:bg-black border-white/10 text-slate-300'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Pause Rotation' : 'Auto Rotate'}</span>
          </button>

          {/* Zoom & Viewport utility drawer */}
          <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-lg border border-white/10 pointer-events-auto shadow-md">
            <button
              onClick={() => handleZoom('in')}
              title="Zoom In"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              title="Zoom Out"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFullscreen}
              title="Fullscreen"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors border-l border-white/10"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
