export enum Step {
  SESSION_INFO = 1,
  IDENTITY_UPLOAD = 2,
  CLOTHING_UPLOAD = 3,
  POSE_UPLOAD = 4,
  STYLE_SELECTION = 5,
  GENERATE = 6,
}

export interface StepConfig {
  id: Step;
  title: string;
}

export interface Option {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  colorHex?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
}

export interface SessionData {
  clientName: string;
  sessionName: string;
  photoshootNiche: string;
  identityPhotos: ImageFile[];
  clothingPhotos: ImageFile[];
  posePhotos: ImageFile[];
  selectedClothing: Option | null;
  selectedBackground: Option;
  selectedStyle: Option;
  selectedLighting: Option;
  selectedAspectRatio: Option;
  selectedStudioColor: Option | null;
}
