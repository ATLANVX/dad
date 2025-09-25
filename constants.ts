import { Step, StepConfig, Option } from './types';

export const STEPS: StepConfig[] = [
  { id: Step.SESSION_INFO, title: 'Informações' },
  { id: Step.IDENTITY_UPLOAD, title: 'Identidade' },
  { id: Step.CLOTHING_UPLOAD, title: 'Roupa' },
  { id: Step.POSE_UPLOAD, title: 'Pose' },
  { id: Step.STYLE_SELECTION, title: 'Estilo' },
  { id: Step.GENERATE, title: 'Gerar' },
];

export const BACKGROUNDS: Option[] = [
  { id: 'studio', name: 'Estúdio', description: 'Fundo limpo e profissional.' },
  { id: 'urban', name: 'Urbano', description: 'Ruas da cidade e arquitetura moderna.' },
  { id: 'beach', name: 'Praia', description: 'Costa arenosa e vistas para o oceano.' },
  { id: 'nature', name: 'Natureza', description: 'Florestas, campos e paisagens naturais.' },
  { id: 'minimalist', name: 'Minimalista', description: 'Fundo simples, abstrato ou de cor única.' },
];

export const STUDIO_COLORS: Option[] = [
    { id: 'white', name: 'Branco', colorHex: '#FFFFFF' },
    { id: 'light-gray', name: 'Cinza Claro', colorHex: '#E0E0E0' },
    { id: 'dark-gray', name: 'Cinza Escuro', colorHex: '#424242' },
    { id: 'black', name: 'Preto', colorHex: '#000000' },
    { id: 'sky-blue', name: 'Azul Céu', colorHex: '#87CEEB' },
    { id: 'olive-green', name: 'Verde Oliva', colorHex: '#808000' },
    { id: 'beige', name: 'Bege', colorHex: '#F5F5DC' },
];

export const STYLES: Option[] = [
  { id: 'realistic', name: 'Fotorrealista', description: 'Nítido, claro e fiel à realidade.' },
  { id: 'bw', name: 'Preto & Branco', description: 'Estilo monocromático clássico.' },
  { id: 'editorial', name: 'Editorial', description: 'Visual de alta moda, estilo revista.' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Espontâneo, autêntico e no momento.' },
  { id: 'vintage', name: 'Vintage', description: 'Granulação de filme e gradação de cor retrô.' },
];

export const LIGHTING: Option[] = [
  { id: 'soft', name: 'Luz Suave', description: 'Luz uniforme e favorável com sombras suaves.' },
  { id: 'dramatic', name: 'Dramática', description: 'Alto contraste com sombras profundas.' },
  { id: 'sunset', name: 'Golden Hour', description: 'Luz quente e dourada do pôr do sol.' },
  { id: 'studio-flash', name: 'Flash de Estúdio', description: 'Visual de flash direto e brilhante.' },
  { id: 'backlit', name: 'Contraluz', description: 'Fonte de luz atrás do objeto.' },
];

export const ASPECT_RATIOS: Option[] = [
    { id: '1:1', name: 'Quadrado', description: 'Perfeito para perfis.' },
    { id: '3:4', name: 'Retrato', description: 'Ideal para retratos (Vertical).' },
    { id: '4:3', name: 'Paisagem', description: 'Tamanho de foto padrão (Horizontal).' },
    { id: '16:9', name: 'Widescreen', description: 'Visual cinematográfico (Horizontal).' },
    { id: '9:16', name: 'Story', description: 'Para stories de redes sociais (Vertical).' },
];

export const CLOTHES_LIBRARY: Option[] = [
    { id: 'white-tshirt', name: 'Camiseta Branca', imageUrl: 'https://picsum.photos/id/1025/200/200' },
    { id: 'denim-jacket', name: 'Jaqueta Jeans', imageUrl: 'https://picsum.photos/id/103/200/200' },
    { id: 'black-dress', name: 'Vestido Preto', imageUrl: 'https://picsum.photos/id/1047/200/200' },
    { id: 'leather-jacket', name: 'Jaqueta de Couro', imageUrl: 'https://picsum.photos/id/1060/200/200' },
    { id: 'summer-dress', name: 'Vestido de Verão', imageUrl: 'https://picsum.photos/id/122/200/200' },
];