/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eraser, ImagePlus, Maximize, UserCheck, Scissors, Crop, 
  Sparkles, PenTool, UserCircle, Box, Smile, Palette, 
  Shrink, RefreshCw, QrCode, Copy, Download, Upload, 
  ChevronRight, ChevronLeft, Menu, X, Plus, Trash2, 
  Undo2, Redo2, Settings, History, Check, AlertCircle, Info, Move, ZoomIn, ZoomOut, RotateCcw,
  MousePointer2, PanelRightOpen
} from 'lucide-react';
import { TOOLS, ASPECT_RATIOS } from './constants';
import { AppState, WorkspaceImage, Tool } from './types';
import * as gemini from './services/geminiService';
import * as imgUtils from './utils/imageProcessing';

// Notification component for feedback
const Toast = ({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 border text-xs font-semibold ${
        type === 'success' ? 'bg-brand text-white border-brand-dark' : 'bg-brand-secondary text-white border-brand-secondary'
      }`}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <span>{message}</span>
    </motion.div>
  );
};

// ... Sidebar and TopBar remain similar but with more Polish ...
// (I will include them in the full replacement below to ensure consistency)

const PhotoshopToolbar = ({ activeToolId, hasActiveImage, onSelectTool }: { activeToolId: string, hasActiveImage: boolean, onSelectTool: (id: string) => void }) => {
  const categories = [
    { id: 'enhance-studio', name: 'Clarity & Scale', icon: <Maximize size={16} />, shortcut: 'W', requiresImage: true },
    { id: 'color-studio', name: 'Color Studio', icon: <Palette size={16} />, shortcut: 'C', requiresImage: true },
    { id: 'magic-remover', name: 'Magic Remover', icon: <Eraser size={16} />, shortcut: 'E', requiresImage: true },
    { id: 'ai-asset-gen', name: 'Creative Studio', icon: <Sparkles size={16} />, shortcut: 'G', requiresImage: false },
    { id: 'portrait-lab', name: 'Portrait Lab', icon: <UserCircle size={16} />, shortcut: 'P', requiresImage: true },
    { id: 'utility', name: 'Utilities', icon: <Box size={16} />, shortcut: 'U', requiresImage: false }
  ];

  const activeTool = TOOLS.find(t => t.id === activeToolId);
  const activeCategory = activeTool ? activeTool.category : '';

  return (
    <aside className="pro-toolbar relative">
      {/* Photoshop Style Icons */}
      <div className={`pro-toolbar-btn group ${!hasActiveImage ? 'opacity-20 cursor-not-allowed' : ''}`}>
        <MousePointer2 size={16} />
      </div>
      <div className={`pro-toolbar-btn group ${!hasActiveImage ? 'opacity-20 cursor-not-allowed' : ''}`}>
        <Crop size={16} />
      </div>
      <div className="toolbar-sep" />

      {categories.map((cat, idx) => {
        const catTools = TOOLS.filter(t => t.category === cat.id);
        const isCatActive = activeCategory === cat.id;
        const isDisabled = cat.requiresImage && !hasActiveImage;

        return (
          <div 
            key={cat.id} 
            className={`pro-toolbar-btn group ${isCatActive ? 'active' : ''} ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
            onClick={(e) => {
              if (isDisabled) e.stopPropagation();
            }}
          >
             {cat.icon}
             {/* Small triangle in bottom right for Photoshop style sub-tools */}
             {!isDisabled && (
               <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[4px] border-l-[4px] border-t-transparent border-l-transparent border-r-[4px] border-r-gray-500 group-hover:border-r-white border-b-[4px] border-b-transparent" 
                    style={{ borderRightColor: isCatActive ? 'white' : '#666' }}
               />
             )}
             
             {/* Flyout Menu */}
             {!isDisabled && (
               <div className="flyout max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide py-1">
                  <div className="px-3 py-1.5 border-b border-[#1a1a1a] mb-1">
                     <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{cat.name}</span>
                  </div>
                  {catTools.map(tool => {
                    const ToolIcon = { 
                      Eraser, ImagePlus, Maximize, UserCheck, Scissors, Crop, 
                      Sparkles, PenTool, UserCircle, Box, Smile, Palette, 
                      Shrink, RefreshCw, QrCode, Move, Settings, Plus
                    }[tool.icon] || Box;

                    return (
                      <button 
                        key={tool.id} 
                        onClick={() => onSelectTool(tool.id)}
                        className={`flyout-item group/item ${activeToolId === tool.id ? 'active' : ''}`}
                      >
                        <ToolIcon size={14} className={activeToolId === tool.id ? 'text-white' : 'text-gray-500 group-hover/item:text-white'} />
                        <span className="flex-1 text-left">{tool.name}</span>
                        <span className="text-[8px] text-gray-500 font-mono opacity-40">{idx + 1}</span>
                      </button>
                    );
                  })}
               </div>
             )}
          </div>
        );
      })}

      <div className="mt-auto">
        <div className="toolbar-sep" />
        <div className={`pro-toolbar-btn group ${!hasActiveImage ? 'opacity-20 cursor-not-allowed' : ''}`}>
          <History size={16} />
        </div>
        <div className="pro-toolbar-btn group">
          <PanelRightOpen size={16} />
        </div>
      </div>
    </aside>
  );
};

const NewDocumentDialog = ({ onCreate, onCancel }: { onCreate: (width: number, height: number, bgColor: string) => void, onCancel: () => void }) => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [bgColor, setBgColor] = useState('#ffffff');
  const presets = [
    { name: 'Full HD (16:9)', w: 1920, h: 1080 },
    { name: 'Traditional (4:3)', w: 1440, h: 1080 },
    { name: 'Square (1:1)', w: 1080, h: 1080 },
    { name: 'DINA4', w: 2480, h: 3508 },
    { name: 'Instagram Story', w: 1080, h: 1920 },
  ];

  const colors = ['#ffffff', '#000000', '#f1f5f9', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#2b2b2b] border border-[#3d3d3d] w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-5 py-3 border-b border-[#3d3d3d] flex items-center justify-between bg-[#333333]">
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">New Document</span>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preset Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => (
                <button 
                  key={p.name}
                  onClick={() => { setWidth(p.w); setHeight(p.h); }}
                  className="px-3 py-2 bg-[#1a1a1a] border border-[#3d3d3d] rounded text-[10px] text-gray-300 hover:border-brand-secondary transition-all text-left"
                >
                  <div className="font-bold truncate">{p.name}</div>
                  <div className="text-[9px] text-gray-500">{p.w} x {p.h} px</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Width (px)</label>
              <input 
                type="number" 
                value={width} 
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1a1a1a] border border-[#3d3d3d] rounded px-3 py-2 text-xs text-white outline-none focus:border-brand-secondary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Height (px)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1a1a1a] border border-[#3d3d3d] rounded px-3 py-2 text-xs text-white outline-none focus:border-brand-secondary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <button 
                  key={c}
                  onClick={() => setBgColor(c)}
                  className={`w-6 h-6 rounded-sm border ${bgColor === c ? 'ring-2 ring-brand-secondary border-white' : 'border-[#3d3d3d]'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input 
                type="color" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-6 h-6 bg-transparent border-none cursor-pointer outline-none p-0"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#1a1a1a] border-t border-[#3d3d3d] flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={() => onCreate(width, height, bgColor)}
            className="px-8 py-2 bg-brand-secondary text-white rounded text-[11px] font-bold hover:bg-brand transition-colors shadow-lg shadow-brand-secondary/10"
          >
            CREATE
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PasteDialog = ({ onChoice, onCancel }: { onChoice: (choice: 'active' | 'new') => void, onCancel: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a1a1a] border border-[#3d3d3d] w-full max-w-[240px] rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="px-3 py-2 border-b border-[#3d3d3d] flex items-center justify-between bg-[#242424]">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Paste Data</span>
          <button onClick={onCancel} className="text-gray-500 hover:text-white p-1">
            <X size={12} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-[11px] text-gray-300 mb-4 text-center">Choose target canvas:</p>
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => onChoice('active')}
              className="slick-btn bg-[#2a2a2a] border border-[#3d3d3d] text-white hover:bg-[#333] w-full text-[10px] py-2 cursor-default"
            >
              Merge into Active
            </button>
            <button 
              onClick={() => onChoice('new')}
              className="slick-btn slick-btn-primary w-full text-[10px] py-2"
            >
              Open as New
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [canvasCounter, setCanvasCounter] = useState(1);
  const [state, setState] = useState<AppState>({
    activeToolId: 'bg-remove',
    openImages: [],
    activeImageId: null,
    isProcessing: false
  });

  const activeImage = state.openImages.find(img => img.id === state.activeImageId) || null;

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [quality, setQuality] = useState(0.85);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0].value);
  const [palette, setPalette] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [pendingPaste, setPendingPaste] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const activeTool = TOOLS.find(t => t.id === state.activeToolId);

  const handleAction = async (actionFn: () => Promise<string | null>) => {
    if (state.isProcessing || !activeImage) return;
    setState(s => ({ ...s, isProcessing: true }));
    try {
      const result = await actionFn();
      if (result) {
        const img = new Image();
        img.onload = () => {
          const containerWidth = canvasRef.current?.offsetWidth || 800;
          const containerHeight = canvasRef.current?.offsetHeight || 600;
          const fitZoom = Math.min(containerWidth / img.width, containerHeight / img.height);
          setZoom(fitZoom);

          const updatedImg: WorkspaceImage = {
            ...activeImage,
            url: result,
            width: img.width,
            height: img.height,
            history: [...(activeImage.history || []), activeImage.url].filter(Boolean)
          };

          setState(prev => ({
            ...prev,
            openImages: prev.openImages.map(img => img.id === prev.activeImageId ? updatedImg : img),
            isProcessing: false
          }));
          setToast({ message: 'Magic complete: Asset transformed', type: 'success' });
        };
        img.src = result;
      } else {
        setState(prev => ({ ...prev, isProcessing: false }));
        setToast({ message: 'AI failed to isolate the subject. Try an image with a clearer background.', type: 'error' });
      }
    } catch (err) {
      console.error('AI Error:', err);
      setState(prev => ({ ...prev, isProcessing: false }));
      setToast({ message: 'Processing limit reached or safety filter triggered.', type: 'error' });
    }
  };

  useEffect(() => {
    if (state.activeToolId === 'color-palette' && activeImage) {
      imgUtils.extractPalette(activeImage.url).then(setPalette);
    }
  }, [state.activeToolId, activeImage]);

  const handleUpload = useCallback(() => {
    if (state.openImages.length >= 5) {
      setToast({ message: 'Maximum 5 canvases can be open at a time.', type: 'error' });
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const img = new Image();
          img.onload = () => {
            const containerWidth = canvasRef.current?.offsetWidth || 800;
            const containerHeight = canvasRef.current?.offsetHeight || 600;
            const fitZoom = Math.min(containerWidth / img.width, containerHeight / img.height);
            setZoom(fitZoom);

            const newId = Math.random().toString(36).substr(2, 9);
            const label = `Canvas-${canvasCounter}`;
            setCanvasCounter(prev => prev + 1);

            const workspaceImg: WorkspaceImage = {
              id: newId,
              label,
              url: re.target?.result as string,
              width: img.width,
              height: img.height,
              mimeType: file.type,
              history: []
            };
            setState(prev => ({
              ...prev,
              openImages: [...prev.openImages, workspaceImg],
              activeImageId: newId
            }));
            
            if (state.activeToolId === 'color-palette') {
              imgUtils.extractPalette(workspaceImg.url).then(setPalette);
            }
          };
          img.src = re.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [state.activeToolId, state.openImages.length]);

  const handleCreateBlank = useCallback((width: number = 1920, height: number = 1080, bgColor: string = '#ffffff') => {
    if (state.openImages.length >= 5) {
      setToast({ message: 'Maximum 5 canvases allowed. Close some before creating new.', type: 'error' });
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const dataUrl = canvas.toDataURL('image/png');
    
    const containerWidth = canvasRef.current?.offsetWidth || 800;
    const containerHeight = canvasRef.current?.offsetHeight || 600;
    const fitZoom = Math.min(containerWidth / canvas.width, containerHeight / canvas.height);
    setZoom(fitZoom);

    const newId = 'blank-' + Date.now();
    const label = `Canvas-${canvasCounter}`;
    setCanvasCounter(prev => prev + 1);

    const workspaceImg: WorkspaceImage = {
      id: newId,
      label,
      url: dataUrl,
      width: canvas.width,
      height: canvas.height,
      mimeType: 'image/png',
      history: []
    };

    setState(prev => ({
      ...prev,
      openImages: [...prev.openImages, workspaceImg],
      activeImageId: newId
    }));
    setToast({ message: 'New canvas created', type: 'success' });
    setShowNewDialog(false);
  }, [state.openImages.length]);

   const handleCopyClipboard = async () => {
    if (!activeImage) return;
    try {
      const response = await fetch(activeImage.url);
      const blob = await response.blob();
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      setToast({ message: 'Asset copied to clipboard', type: 'success' });
    } catch (err) {
      setToast({ message: 'System clipboard blocked', type: 'error' });
    }
  };

  const handleDownload = () => {
    if (!activeImage) return;
    const link = document.createElement('a');
    link.href = activeImage.url;
    link.download = `ai-design-toolkit-${state.activeToolId}-${Date.now()}.png`;
    link.click();
    setToast({ message: 'Exported successfully', type: 'success' });
  };

  const undo = () => {
    if (!activeImage || activeImage.history.length === 0) return;
    const newHistory = [...(activeImage.history || [])];
    const lastUrl = newHistory.pop()!;
    
    const img = new Image();
    img.onload = () => {
      const updatedImg: WorkspaceImage = {
        ...activeImage,
        url: lastUrl,
        width: img.width,
        height: img.height,
        history: newHistory
      };
      setState(prev => ({
        ...prev,
        openImages: prev.openImages.map(i => i.id === prev.activeImageId ? updatedImg : i)
      }));
    };
    img.src = lastUrl;
  };

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleNew = () => {
    setShowNewDialog(true);
    setActiveMenu(null);
  };

  const handleOpen = () => {
    handleUpload();
    setActiveMenu(null);
  };

  const handleSave = () => {
    handleDownload();
    setActiveMenu(null);
  };

  const closeCanvas = useCallback((id: string | null) => {
    if (!id) return;
    setState(prev => {
      const filtered = prev.openImages.filter(img => img.id !== id);
      const isClosingActive = prev.activeImageId === id;
      const nextId = isClosingActive 
        ? (filtered.length > 0 ? filtered[filtered.length - 1].id : null)
        : prev.activeImageId;
      
      return {
        ...prev,
        openImages: filtered,
        activeImageId: nextId
      };
    });
  }, []);

  const handleClose = () => {
    if (state.activeImageId) {
      closeCanvas(state.activeImageId);
    }
    setActiveMenu(null);
  };

  const handleExit = () => {
    if (window.confirm('Do you really want to exit the application and close all canvases?')) {
      setState(prev => ({
        ...prev,
        openImages: [],
        activeImageId: null
      }));
      setToast({ message: 'Application session reset', type: 'success' });
    }
    setActiveMenu(null);
  };

  const handleCopyAsset = () => {
    handleCopyClipboard();
    setActiveMenu(null);
  };

  const handlePasteAsset = async () => {
    try {
      if (!navigator.clipboard?.read) {
        throw new Error('Clipboard API not available');
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageTypes = item.types.filter(type => type.startsWith('image/'));
        if (imageTypes.length > 0) {
          const blob = await item.getType(imageTypes[0]);
          const reader = new FileReader();
          reader.onload = (re) => {
            const dataUrl = re.target?.result as string;
            if (state.openImages.length > 0) {
              setPendingPaste(dataUrl);
            } else {
              performPaste(dataUrl, 'new');
            }
          };
          reader.readAsDataURL(blob);
          setActiveMenu(null);
          return;
        }
      }
      setToast({ message: 'No image found in clipboard', type: 'error' });
    } catch (err) {
      console.error('Paste error:', err);
      setToast({ message: 'Paste blocked. Use Ctrl+V keyboard shortcut.', type: 'error' });
    }
    setActiveMenu(null);
  };

  const performPaste = useCallback((dataUrl: string, target: 'active' | 'new') => {
    const img = new Image();
    img.onload = () => {
      const containerWidth = canvasRef.current?.offsetWidth || 800;
      const containerHeight = canvasRef.current?.offsetHeight || 600;
      const fitZoom = Math.min(containerWidth / img.width, containerHeight / img.height);
      setZoom(fitZoom);

      if (target === 'active' && activeImage) {
        const updatedImg: WorkspaceImage = {
          ...activeImage,
          url: dataUrl,
          width: img.width,
          height: img.height,
          history: [...(activeImage.history || []), activeImage.url].filter(Boolean)
        };
        setState(prev => ({
          ...prev,
          openImages: prev.openImages.map(i => i.id === prev.activeImageId ? updatedImg : i)
        }));
        setToast({ message: 'Pasted into active canvas', type: 'success' });
      } else {
        if (state.openImages.length >= 5) {
          setToast({ message: 'Maximum 5 canvases reached. Close some before opening new.', type: 'error' });
          setPendingPaste(null);
          return;
        }
        const newId = Math.random().toString(36).substr(2, 9);
        const label = `Canvas-${canvasCounter}`;
        setCanvasCounter(prev => prev + 1);

        const workspaceImg: WorkspaceImage = {
          id: newId,
          label,
          url: dataUrl,
          width: img.width,
          height: img.height,
          mimeType: 'image/png',
          history: []
        };
        setState(prev => ({
          ...prev,
          openImages: [...prev.openImages, workspaceImg],
          activeImageId: newId
        }));
        setToast({ message: 'Pasted as new canvas', type: 'success' });
      }
      setPendingPaste(null);
    };
    img.src = dataUrl;
  }, [activeImage, state.openImages.length, state.activeImageId]);

  // Global Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const targetElement = e.target as HTMLElement;
      if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (!blob) continue;

          const reader = new FileReader();
          reader.onload = (re) => {
            const dataUrl = re.target?.result as string;
            // Ask if at least one image exists
            if (state.openImages.length > 0) {
              setPendingPaste(dataUrl);
            } else {
              performPaste(dataUrl, 'new');
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [state.openImages.length, performPaste]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-secondary/30 overflow-hidden flex-col">
      {/* Photoshop Style Top Bar */}
      <header className="h-10 bg-brand-dark flex items-center justify-between px-4 z-40 shrink-0 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-secondary rounded text-white flex items-center justify-center font-black text-[10px]">A</div>
            <span className="text-[11px] font-bold text-white/90">AI Design Toolkit</span>
          </div>
          <nav className="flex items-center gap-0 h-full">
            <div className="relative h-full flex items-center">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'File' ? null : 'File')}
                className={`text-[11px] px-3 h-full transition-colors cursor-default flex items-center ${activeMenu === 'File' ? 'bg-[#2b2b2b] text-white' : 'text-white/60 hover:text-white hover:bg-[#2b2b2b]/50'}`}
              >
                File
              </button>
              {activeMenu === 'File' && (
                <div className="pro-menu-dropdown top-full">
                  <button onClick={handleNew} className="pro-menu-item group">
                    <span>New...</span>
                    <span className="pro-menu-shortcut">Ctrl+N</span>
                  </button>
                  <button onClick={handleOpen} className="pro-menu-item group">
                    <span>Open...</span>
                    <span className="pro-menu-shortcut">Ctrl+O</span>
                  </button>
                  <div className="pro-menu-sep" />
                  <button onClick={handleClose} disabled={!activeImage} className="pro-menu-item group disabled:opacity-30 disabled:hover:bg-transparent">
                    <span>Close</span>
                    <span className="pro-menu-shortcut">Ctrl+W</span>
                  </button>
                  <div className="pro-menu-sep" />
                  <button onClick={handleSave} disabled={!activeImage} className="pro-menu-item group disabled:opacity-30 disabled:hover:bg-transparent">
                    <span>Save</span>
                    <span className="pro-menu-shortcut">Ctrl+S</span>
                  </button>
                  <div className="pro-menu-sep" />
                  <button onClick={handleExit} className="pro-menu-item group">
                    <span>Exit</span>
                    <span className="pro-menu-shortcut">Ctrl+Q</span>
                  </button>
                </div>
              )}
            </div>
            <div className="relative h-full flex items-center">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'Edit' ? null : 'Edit')}
                className={`text-[11px] px-3 h-full transition-colors cursor-default flex items-center ${activeMenu === 'Edit' ? 'bg-[#2b2b2b] text-white' : 'text-white/60 hover:text-white hover:bg-[#2b2b2b]/50'}`}
              >
                Edit
              </button>
              {activeMenu === 'Edit' && (
                <div className="pro-menu-dropdown top-full">
                  <button onClick={undo} disabled={!activeImage || activeImage.history.length === 0} className="pro-menu-item group disabled:opacity-30">
                    <span>Undo</span>
                    <span className="pro-menu-shortcut">Ctrl+Z</span>
                  </button>
                  <div className="pro-menu-sep" />
                  <button onClick={handleCopyAsset} disabled={!state.activeImageId} className="pro-menu-item group disabled:opacity-30">
                    <span>Copy</span>
                    <span className="pro-menu-shortcut">Ctrl+C</span>
                  </button>
                  <button onClick={handlePasteAsset} className="pro-menu-item group">
                    <span>Paste</span>
                    <span className="pro-menu-shortcut">Ctrl+V</span>
                  </button>
                  <div className="pro-menu-sep" />
                  <div className="px-4 py-1.5 mb-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Color & Light</span>
                  </div>
                  {TOOLS.filter(t => t.category === 'color-studio').map(tool => (
                    <button 
                      key={tool.id} 
                      onClick={() => { setState(prev => ({ ...prev, activeToolId: tool.id })); setActiveMenu(null); }}
                      className={`pro-menu-item group ${state.activeToolId === tool.id ? 'active' : ''}`}
                    >
                      <span>{tool.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {['Image', 'Layer', 'Select', 'Filter', 'View', 'Window', 'Help'].map(item => (
              <button key={item} className="text-[11px] text-white/60 hover:text-white hover:bg-[#2b2b2b]/50 h-full px-3 transition-colors cursor-default">{item}</button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-white/40">
           <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono tracking-tighter">V3.1 FLASH LITE</span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div>
           </div>
           <UserCircle size={16} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <PhotoshopToolbar 
          activeToolId={state.activeToolId} 
          hasActiveImage={!!activeImage}
          onSelectTool={(id) => setState(prev => ({ ...prev, activeToolId: id }))} 
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-11 bg-white border-b border-border flex items-center justify-between px-6 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleUpload}
                className="text-[11px] font-extrabold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
              >
                Import
              </button>
              <div className="h-4 w-px bg-slate-200" />
              <button 
                onClick={handlePasteAsset}
                className="text-[11px] font-extrabold text-brand-secondary hover:text-brand transition-colors uppercase tracking-[0.2em]"
              >
                Paste Asset
              </button>
            </div>

            <div className="flex items-center gap-3">
              {activeImage && (
                <button 
                  onClick={handleDownload}
                  className="slick-btn-primary px-4 py-1.5 flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Export Asset
                </button>
              )}
            </div>
          </header>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Main Canvas Area */}
            <div className="flex-1 relative bg-slate-200 flex flex-col items-center justify-center overflow-hidden border-r border-border">
              {/* Tabs Bar */}
              {state.openImages.length > 0 && (
                <div className="absolute top-0 left-0 right-0 h-9 bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center z-20 overflow-x-auto scrollbar-hide">
                  {state.openImages.map((img) => (
                    <div 
                      key={img.id}
                      className={`h-9 flex items-center border-r border-[#1a1a1a] cursor-default text-[11px] min-w-[120px] max-w-[200px] transition-colors relative group ${state.activeImageId === img.id ? 'bg-[#333333] text-white' : 'bg-[#252525] text-gray-500 hover:bg-[#2e2e2e]'}`}
                    >
                      <button 
                        type="button"
                        className="flex-1 truncate px-4 h-full flex items-center text-left"
                        onClick={() => {
                          setState(prev => ({ ...prev, activeImageId: img.id })); 
                          const containerWidth = canvasRef.current?.offsetWidth || 800;
                          const containerHeight = canvasRef.current?.offsetHeight || 600;
                          const fitZoom = Math.min(containerWidth / img.width, containerHeight / img.height);
                          setZoom(fitZoom);
                        }}
                      >
                        {img.label}
                      </button>
                      
                      {state.activeImageId === img.id && (
                        <button
                          type="button"
                          title="Close Canvas"
                          className="mr-1.5 w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/30 hover:text-white transition-all flex-shrink-0 z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            closeCanvas(img.id);
                          }}
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ))}
                  {state.openImages.length < 5 && (
                    <button 
                      onClick={handleNew}
                      className="h-full px-3 text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex items-center"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              )}

              <div className="absolute top-11 left-1/2 -translate-x-1/2 glass px-3 py-0.5 rounded-full text-[9px] font-bold text-slate-500 z-10 border border-slate-300/50 shadow-sm">
                WORKSPACE: {activeImage ? `${activeImage.width}x${activeImage.height}` : 'NO ASSET'}
              </div>
            
            <div 
              className="flex-1 w-full slick-card flex items-center justify-center relative bg-[#d1d5db]" 
              ref={canvasRef}
              style={{
                backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
              }}
            >
              <AnimatePresence mode="wait">
                {activeImage ? (
                  <motion.div 
                    key={activeImage.url}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="relative group w-full h-full flex items-center justify-center overflow-auto scrollbar-hide"
                  >
                    <div className="flex items-center justify-center min-w-full min-h-full p-2">
                      <img 
                        src={activeImage.url} 
                        alt="Active workspace" 
                        style={{ 
                          width: activeImage.width * zoom, 
                          height: activeImage.height * zoom,
                          maxWidth: 'none',
                          filter: state.activeToolId === 'adjustments' ? `brightness(${brightness}) contrast(${contrast})` : 'none'
                        }}
                        className="shadow-lg rounded-lg transition-all duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {state.isProcessing && (
                      <div className="absolute inset-0 glass flex items-center justify-center rounded-lg z-20">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
                          <div className="text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Analyzing Subject</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center p-6 w-full h-full max-w-5xl mx-auto"
                  >
                    <div className="mb-10 text-center">
                      <div className="w-14 h-14 bg-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-secondary/20">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Evalueserve Design Studio</h1>
                      <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Precision AI toolkit for brand asset creation and refinement.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
                      {/* Dashboard Card 1: New */}
                      <button 
                        onClick={handleNew}
                        className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-secondary hover:-translate-y-1 transition-all text-left flex flex-col h-[180px]"
                      >
                         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                           <Plus size={20} />
                         </div>
                         <h3 className="text-base font-black text-slate-900 mb-1">New Canvas</h3>
                         <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Create custom formatted assets from scratch.</p>
                         <div className="mt-auto flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Get Started <ChevronRight size={10} />
                         </div>
                      </button>

                      {/* Dashboard Card 2: Open */}
                      <button 
                        onClick={handleOpen}
                        className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-secondary hover:-translate-y-1 transition-all text-left flex flex-col h-[180px]"
                      >
                         <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                           <Upload size={20} />
                         </div>
                         <h3 className="text-base font-black text-slate-900 mb-1">Open Asset</h3>
                         <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Import photos or textures for AI enhancement.</p>
                         <div className="mt-auto flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Browse Files <ChevronRight size={10} />
                         </div>
                      </button>

                      {/* Dashboard Card 3: Paste */}
                      <button 
                        onClick={handlePasteAsset}
                        className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-secondary hover:-translate-y-1 transition-all text-left flex flex-col h-[180px]"
                      >
                         <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center mb-4 text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                           <Copy size={20} />
                         </div>
                         <h3 className="text-base font-black text-slate-900 mb-1">Paste Asset</h3>
                         <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Edit screenshots directly from your clipboard.</p>
                         <div className="mt-auto flex items-center gap-1.5 text-[9px] font-black text-brand-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Quick Edit <ChevronRight size={10} />
                         </div>
                      </button>
                    </div>

                    <div className="mt-12 flex items-center gap-6 opacity-30">
                      <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] font-black uppercase tracking-widest">GEMINI 1.5 PRO READY</span>
                      </div>
                      <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                        <Check className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">BRAND COMPLIANT</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Canvas Controls Overlay */}
              {activeImage && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur shadow-2xl border border-slate-300 p-1 rounded-xl z-30 transition-all hover:scale-105">
                  <button 
                    onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  
                  <div className="flex items-center px-2 min-w-[45px] justify-center cursor-default">
                    <span className="text-[10px] font-black text-brand tabular-nums">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>

                  <button 
                    onClick={() => setZoom(prev => Math.min(5, prev + 0.1))}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>

                  <div className="w-px bg-slate-200 self-stretch my-1 mx-1" />

                  <button 
                    onClick={() => {
                      const containerWidth = canvasRef.current?.offsetWidth || 800;
                      const containerHeight = canvasRef.current?.offsetHeight || 600;
                      const img = activeImage;
                      if (img) {
                        const fitZoom = Math.min(containerWidth / img.width, containerHeight / img.height);
                        setZoom(fitZoom);
                      }
                    }}
                    className="px-3 py-1.5 text-[10px] font-extrabold text-slate-500 hover:bg-brand/5 hover:text-brand rounded-lg transition-all"
                  >
                    MAX
                  </button>

                  <button 
                    onClick={() => setZoom(1)}
                    className="px-3 py-1.5 text-[10px] font-extrabold text-slate-500 hover:bg-brand/5 hover:text-brand rounded-lg transition-all"
                  >
                    1:1
                  </button>
                </div>
              )}
            </div>

            {/* Format Shortcuts */}
            <div className="mt-6 flex justify-center gap-3">
              {ASPECT_RATIOS.map(ratio => (
                <button 
                  key={ratio.name}
                  onClick={() => setSelectedRatio(ratio.value)}
                  className={`px-4 py-2 bg-white border rounded-xl text-[10px] font-bold transition-all shadow-sm ${
                    selectedRatio === ratio.value ? 'border-brand-secondary text-brand shadow-md' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {ratio.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Control Panel (Properties) */}
          <aside className="w-[260px] bg-white p-4 flex flex-col space-y-4 overflow-y-auto shrink-0 scrollbar-hide select-none border-l border-border">
            <div className="border-b border-border pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Properties</span>
                <div className={`p-1 px-2 text-[8px] font-black rounded uppercase ${activeImage ? 'bg-brand-secondary/10 text-brand-secondary' : 'bg-slate-100 text-slate-400'}`}>
                  {activeImage ? 'AI Active' : 'Waiting'}
                </div>
              </div>
              <h2 className="text-sm font-black text-slate-800 leading-tight tracking-tight">
                {activeImage ? activeTool?.name : 'Ready to Edit'}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                {activeImage ? activeTool?.description : 'Open an image to unlock AI tools.'}
              </p>
            </div>
            
            <div className="flex-1 space-y-6">
              {!activeImage && !['ai-asset-gen', 'utility'].includes(activeTool?.category || '') ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-2 space-y-4 py-8">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                     <Info className="w-5 h-5 text-slate-300" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-900 uppercase">Awaiting Asset</p>
                     <p className="text-[9px] text-slate-400 leading-relaxed px-4">Upload or paste an image to enable precision editing.</p>
                   </div>
                   <div className="pt-4 space-y-2 w-full max-w-[200px]">
                      <button onClick={handleNew} className="w-full transition-all flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-secondary text-[10px] font-bold text-slate-600">
                        <Plus size={12} className="text-brand" />
                        NEW CANVAS
                      </button>
                      <button onClick={handleOpen} className="w-full transition-all flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-secondary text-[10px] font-bold text-slate-600">
                        <Upload size={12} className="text-brand" />
                        OPEN FILE
                      </button>
                   </div>
                </div>
              ) : (
                <>
                  {/* CLARITY & SCALE */}
              {activeTool?.category === 'enhance-studio' && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-brand-secondary" />
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Evalueserve Clarity Engine</p>
                  </div>
                  
                  {activeTool.id === 'upscale-multiplier' && (
                     <div className="grid grid-cols-3 gap-2">
                        {['2X', '4X', '8X'].map(m => (
                          <button key={m} className="py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 hover:border-brand-secondary hover:text-brand transition-all">
                            {m}
                          </button>
                        ))}
                     </div>
                  )}

                  <button 
                    disabled={!activeImage || state.isProcessing}
                    className="slick-btn slick-btn-primary w-full"
                    onClick={() => handleAction(() => gemini.enhanceImage(activeImage!.url, activeImage!.mimeType, `Please apply ${activeTool.name} to this image. ${activeTool.description}. Return the fully processed, high-quality result.`))}
                  >
                    Enhance Selection
                  </button>
                </div>
              )}

              {/* COLOR STUDIO */}
              {activeTool?.category === 'color-studio' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {activeTool.id === 'adjustments' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">Brightness</label>
                            <span className="text-[10px] font-bold text-brand">{Math.round(brightness * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.01" 
                            value={brightness} 
                            onChange={(e) => setBrightness(parseFloat(e.target.value))}
                            className="w-full" 
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">Contrast</label>
                            <span className="text-[10px] font-bold text-brand">{Math.round(contrast * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.01" 
                            value={contrast} 
                            onChange={(e) => setContrast(parseFloat(e.target.value))}
                            className="w-full" 
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            disabled={!activeImage || state.isProcessing}
                            className="slick-btn slick-btn-primary flex-1"
                            onClick={() => handleAction(async () => {
                              const result = await imgUtils.applyFilter(activeImage!.url, `brightness(${brightness}) contrast(${contrast})`);
                              setBrightness(1);
                              setContrast(1);
                              return result;
                            })}
                          >
                            Apply Adjustments
                          </button>
                          <button 
                            onClick={() => {
                              setBrightness(1);
                              setContrast(1);
                            }}
                            className="slick-btn bg-slate-100 text-slate-500 hover:bg-slate-200"
                            title="Reset Sliders"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {['invert', 'grayscale', 'vintage'].includes(activeTool.id) && (
                      <button 
                        disabled={!activeImage || state.isProcessing}
                        className="slick-btn slick-btn-brand w-full"
                        onClick={() => {
                          const filterMap: Record<string, string> = {
                            'invert': 'invert(1)',
                            'grayscale': 'grayscale(1)',
                            'vintage': 'sepia(0.5) contrast(1.2) brightness(1.1)'
                          };
                          handleAction(() => imgUtils.applyFilter(activeImage!.url, filterMap[activeTool.id] || 'none'));
                        }}
                      >
                        Apply Filter
                      </button>
                    )}

                    {['balance-light', 'color-correction', 'vibrant-colors'].includes(activeTool.id) && (
                      <button 
                        disabled={!activeImage || state.isProcessing}
                        className="slick-btn slick-btn-primary w-full"
                        onClick={() => handleAction(() => gemini.enhanceImage(activeImage!.url, activeImage!.mimeType, `Adjust colors: ${activeTool.name}. ${activeTool.description}`))}
                      >
                        AI Color Grading
                      </button>
                    )}

                    {activeImage && activeImage.history.length > 0 && (
                      <button 
                        onClick={() => {
                          const originalUrl = activeImage.history[0];
                          const img = new Image();
                          img.onload = () => {
                            const updatedImg: WorkspaceImage = {
                              ...activeImage,
                              url: originalUrl,
                              width: img.width,
                              height: img.height,
                              history: []
                            };
                            setState(prev => ({
                              ...prev,
                              openImages: prev.openImages.map(i => i.id === prev.activeImageId ? updatedImg : i)
                            }));
                            setToast({ message: 'Reverted to original', type: 'success' });
                          };
                          img.src = originalUrl;
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-slate-400 hover:text-brand-secondary transition-colors uppercase tracking-widest border-t border-slate-100 mt-4 pt-4"
                      >
                        <RotateCcw size={12} />
                        Reset All Changes
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* MAGIC REMOVER */}
              {activeTool?.category === 'magic-remover' && (
                <div className="space-y-6">
                  {activeTool.id === 'object-remove' || activeTool.id === 'text-remove' ? (
                    <div className="space-y-4">
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Describe what to remove (e.g. "the watermark")`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs min-h-[120px] focus:ring-2 focus:ring-brand-secondary/20 outline-none"
                      />
                      <button 
                        disabled={!activeImage || !prompt || state.isProcessing}
                        className="slick-btn slick-btn-primary w-full"
                        onClick={() => handleAction(() => gemini.enhanceImage(activeImage!.url, activeImage!.mimeType, `Remove the following from the image: ${prompt}. ${activeTool.description}`))}
                      >
                        Execute Removal
                      </button>
                    </div>
                  ) : (
                    <button 
                      disabled={!activeImage || state.isProcessing}
                      className="slick-btn slick-btn-primary w-full"
                      onClick={() => handleAction(() => gemini.removeBackground(activeImage!.url))}
                    >
                      Cleansheet Subject
                    </button>
                  )}
                </div>
              )}

              {/* AI ASSET GEN */}
              {activeTool?.category === 'ai-asset-gen' && (
                <div className="space-y-6">
                   <div className="space-y-4">
                      {!state.activeImage && (
                        <div className="p-4 bg-slate-900 rounded-2xl border border-brand-dark">
                          <p className="text-[11px] font-bold text-brand-secondary flex items-center gap-2">
                            <Sparkles size={14} />
                            AI RECOMMENDATION
                          </p>
                          <p className="text-[10px] text-white/50 mt-1 font-medium">Generate a new brand asset by starting with a blank canvas.</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">Intent</label>
                        <textarea 
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the asset..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs min-h-[140px] focus:ring-2 focus:ring-brand-secondary/20 outline-none text-slate-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">Format</label>
                        <div className="grid grid-cols-3 gap-2">
                           {[{label: '16:9', val: 16/9}, {label: '4:3', val: 4/3}, {label: '1:1', val: 1}].map(r => (
                             <button 
                               key={r.label} 
                               onClick={() => setSelectedRatio(r.val)}
                               className={`py-2 px-1 border rounded-xl text-[10px] font-bold transition-all ${Math.abs(selectedRatio - r.val) < 0.01 ? 'bg-brand/5 border-brand/20 text-brand' : 'bg-white border-slate-200 text-slate-400'}`}
                             >
                               {r.label}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">Style</label>
                        <select 
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-brand/10 outline-none text-slate-700"
                        >
                          <option>Photorealistic</option>
                          <option>Corporate Blue 3D</option>
                          <option>Minimalist Vector</option>
                          <option>Professional Photography</option>
                        </select>
                      </div>

                      {activeTool.id === 'smart-crop' ? (
                        <button 
                          disabled={!activeImage || state.isProcessing}
                          className="slick-btn slick-btn-brand w-full text-[10px] uppercase tracking-widest font-bold"
                          onClick={() => handleAction(() => imgUtils.smartCrop(activeImage!.url, selectedRatio))}
                        >
                          E-Smart Crop
                        </button>
                      ) : (
                        <button 
                          disabled={!prompt || state.isProcessing}
                          className="slick-btn slick-btn-primary w-full"
                          onClick={() => {
                            const ratioStr = Math.abs(selectedRatio - 16/9) < 0.01 ? "16:9" : Math.abs(selectedRatio - 4/3) < 0.01 ? "4:3" : "1:1";
                            handleAction(() => gemini.generateAsset(prompt, style, ratioStr));
                          }}
                        >
                          Generate Insight
                        </button>
                      )}
                   </div>
                </div>
              )}

              {/* PORTRAIT LAB */}
              {activeTool?.category === 'portrait-lab' && (
                <div className="space-y-6">
                   <div className="p-4 bg-brand/5 rounded-2xl border border-brand/10 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <UserCheck className="w-4 h-4 text-brand" />
                        <p className="text-[11px] font-bold text-brand uppercase tracking-tight">Portrait Insight</p>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Professional grade portrait enhancements and headshot generation.</p>
                   </div>

                   <button 
                      disabled={!activeImage || state.isProcessing}
                      className="slick-btn slick-btn-primary w-full"
                      onClick={() => handleAction(() => gemini.enhanceImage(activeImage!.url, activeImage!.mimeType, `Professional portrait processing: ${activeTool.name}. ${activeTool.description}`))}
                    >
                      Studio Optimize
                    </button>
                </div>
              )}

              {/* UTILITIES */}
              {activeTool?.category === 'utility' && (
                <div className="space-y-6">
                   {activeTool.id === 'color-palette' && (
                     <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {palette.map((color, i) => (
                            <div 
                              key={i} 
                              className="aspect-square rounded-xl shadow-sm border border-slate-100 cursor-copy group relative overflow-hidden"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                navigator.clipboard.writeText(color);
                                setToast({ message: `Copied ${color}`, type: 'success' });
                              }}
                            >
                              <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Copy className="w-4 h-4 text-brand" />
                              </div>
                            </div>
                          ))}
                        </div>
                        {palette.length === 0 && (
                          <div className="p-10 slick-card bg-slate-50/50 border-dashed text-center">
                             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Brand Spectrum</p>
                          </div>
                        )}
                     </div>
                   )}

                   {activeTool.id === 'compress' && (
                     <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Quality</label>
                          <span className="text-xs font-mono font-bold text-brand-secondary">{Math.round(quality * 100)}%</span>
                        </div>
                        <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
                        <button 
                          disabled={!activeImage || state.isProcessing}
                          className="slick-btn slick-btn-brand w-full"
                          onClick={() => imgUtils.compressImage(activeImage!.url, quality)}
                        >
                          Efficiency Engine
                        </button>
                     </div>
                   )}

                    {activeTool.id === 'convert' && (
                      <div className="grid grid-cols-2 gap-3">
                        {['PNG', 'JPG'].map(fmt => (
                          <button 
                            key={fmt}
                            disabled={!activeImage}
                            className="slick-btn border border-slate-200 text-slate-600 hover:border-brand-secondary hover:text-brand px-0 text-[11px]"
                            onClick={() => handleAction(() => imgUtils.convertToFormat(activeImage!.url, fmt === 'PNG' ? 'image/png' : 'image/jpeg'))}
                          >
                            EXTRACT {fmt}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTool.id === 'qr-gen' && (
                      <div className="space-y-4">
                        <input 
                          type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                          placeholder="Corporate URL..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-secondary/20 outline-none"
                        />
                        <button 
                          disabled={!prompt || state.isProcessing}
                          className="slick-btn slick-btn-primary w-full"
                          onClick={() => {
                            const url = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(prompt)}`;
                            handleAction(async () => {
                              const res = await fetch(url);
                              const blob = await res.blob();
                              return new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.readAsDataURL(blob);
                              });
                            });
                          }}
                        >
                          Generate Link
                        </button>
                      </div>
                    )}
                </div>
              )}
                </>
              )}
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100">
               <button 
                 onClick={handleCopyClipboard}
                 disabled={!activeImage}
                 className="slick-btn bg-brand/5 text-brand border border-brand/10 hover:bg-brand/10 w-full text-[11px] uppercase tracking-wider"
               >
                 <Copy className="w-4 h-4" />
                 Ready for Impact
               </button>
            </div>
          </aside>
        </div>
      </main>
    </div>

    <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {showNewDialog && (
        <NewDocumentDialog 
          onCreate={handleCreateBlank}
          onCancel={() => setShowNewDialog(false)}
        />
      )}

      {pendingPaste && (
        <PasteDialog 
          onChoice={(choice) => performPaste(pendingPaste, choice)}
          onCancel={() => setPendingPaste(null)}
        />
      )}
    </div>
  );
}
