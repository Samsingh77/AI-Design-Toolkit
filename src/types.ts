
export type ToolCategory = 'enhance-studio' | 'color-studio' | 'magic-remover' | 'ai-asset-gen' | 'portrait-lab' | 'utility';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  icon: string;
  description: string;
}

export interface WorkspaceImage {
  id: string;
  label: string;
  url: string;
  width: number;
  height: number;
  mimeType: string;
  history: string[]; // Store URLs for undo/redo for this specific image
}

export interface AppState {
  activeToolId: string;
  openImages: WorkspaceImage[];
  activeImageId: string | null;
  isProcessing: boolean;
}
