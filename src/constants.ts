import { Tool } from './types';

export const TOOLS: Tool[] = [
  // CLARITY & SCALE (Formerly Enhance Studio)
  { id: 'sharpen', name: 'Sharpen', category: 'enhance-studio', icon: 'Maximize', description: 'Enhance image clarity' },
  { id: 'upscale', name: 'Upscale Image (4K/8K)', category: 'enhance-studio', icon: 'Maximize', description: 'High resolution enhancement' },
  { id: 'upscale-multiplier', name: 'Upscale Multiplier (2X, 4X & 8X)', category: 'enhance-studio', icon: 'Plus', description: 'Multiple scale levels' },
  { id: 'extend-image', name: 'Extend Image', category: 'enhance-studio', icon: 'Maximize', description: 'AI generative expand' },
  { id: 'clean-noise', name: 'Clean noise', category: 'enhance-studio', icon: 'Sparkles', description: 'Denoise and smooth' },
  { id: 'blur-reduction', name: 'Blur Reduction', category: 'enhance-studio', icon: 'Maximize', description: 'De-blur algorithm' },

  // COLOR STUDIO (New Section)
  { id: 'color-correction', name: 'Color Correction', category: 'color-studio', icon: 'Palette', description: 'Natural color balance' },
  { id: 'adjustments', name: 'Brightness & Contrast', category: 'color-studio', icon: 'Settings', description: 'Exposure and tone' },
  { id: 'grayscale', name: 'Grayscale Mode', category: 'color-studio', icon: 'Palette', description: 'Black and white' },
  { id: 'invert', name: 'Invert Colors', category: 'color-studio', icon: 'Box', description: 'Negative effect' },

  // PORTRAIT LAB (Formerly Profile Gen)
  { id: 'restore-photo', name: 'Restore Old Photo', category: 'portrait-lab', icon: 'RefreshCw', description: 'Recover old/damaged photos' },
  { id: 'face-enhancer', name: 'Face Enhancer', category: 'portrait-lab', icon: 'UserCheck', description: 'Polished headshots' },
  { id: 'headshot-gen', name: 'Professional Headshot', category: 'portrait-lab', icon: 'UserCircle', description: 'Professional team avatars' },
  { id: 'change-bg', name: 'Change Profile BG', category: 'portrait-lab', icon: 'ImagePlus', description: 'Update profile backdrop' },
  { id: 'headshot-crop', name: 'Smart Profile Crop', category: 'portrait-lab', icon: 'UserCheck', description: 'Auto-frame avatar' },

  // MAGIC REMOVER
  { id: 'bg-remove', name: 'Remove Background', category: 'magic-remover', icon: 'Eraser', description: 'AI removal (Powered by img.ly)' },
  { id: 'object-remove', name: 'Remove Object', category: 'magic-remover', icon: 'Scissors', description: 'Remove distracting items' },
  { id: 'text-remove', name: 'Remove Text', category: 'magic-remover', icon: 'Scissors', description: 'Cleanup text overlays' },

  // CREATIVE STUDIO (AI Asset Gen)
  { id: 'ai-gen', name: 'AI Image Creator', category: 'ai-asset-gen', icon: 'Sparkles', description: 'Generate custom stock photography' },
  { id: 'bg-gen', name: 'Generate Background', category: 'ai-asset-gen', icon: 'ImagePlus', description: 'Create custom backgrounds' },
  { id: 'vector-gen', name: 'Vector / SVG Gen', category: 'ai-asset-gen', icon: 'PenTool', description: 'Infinite-scaling graphic assets' },
  { id: 'doodle-gen', name: 'Doodle Art', category: 'ai-asset-gen', icon: 'Smile', description: 'Playful sketched illustrations' },
  { id: 'smart-crop', name: 'Presentation Crop', category: 'ai-asset-gen', icon: 'Crop', description: '16:9 and 4:3 PowerPoint presets' },

  // UTILITIES
  { id: 'color-palette', name: 'Brand Palette', category: 'utility', icon: 'Palette', description: 'Extract hex codes from your logo' },
  { id: 'compress', name: 'Compress for PPT', category: 'utility', icon: 'Shrink', description: 'Reduce file size while keeping quality' },
  { id: 'convert', name: 'Convert to PNG/JPG', category: 'utility', icon: 'RefreshCw', description: 'Make images compatible with PPT' },
  { id: 'qr-gen', name: 'QR Code Gen', category: 'utility', icon: 'QrCode', description: 'Contact & link codes' }
];

export const ASPECT_RATIOS = [
  { name: '16:9 (PPT Standard)', value: 16/9 },
  { name: '4:3 (Traditional)', value: 4/3 },
  { name: '1:1 (Square)', value: 1 },
  { name: 'Custom', value: 0 }
];
