import { GoogleGenAI, Modality } from "@google/genai";
import { SessionData } from "../types";

// Helper to convert a File object to a GoogleGenAI.Part object.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
};

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generatePhotoshoot = async (
    sessionData: SessionData,
    onProgress: (progress: number) => void
): Promise<string[]> => {
  try {
    const {
      identityPhotos,
      clothingPhotos,
      posePhotos,
      photoshootNiche,
      selectedClothing,
      selectedBackground,
      selectedStyle,
      selectedLighting,
      selectedAspectRatio,
      selectedStudioColor,
    } = sessionData;

    // Use the specified model for image editing/generation.
    const model = 'gemini-2.5-flash-image-preview';

    const imageParts = [];

    // Convert all uploaded images to the format required by the API.
    for (const img of identityPhotos) {
      imageParts.push(await fileToGenerativePart(img.file));
    }
    for (const img of clothingPhotos) {
      imageParts.push(await fileToGenerativePart(img.file));
    }
    for (const img of posePhotos) {
      imageParts.push(await fileToGenerativePart(img.file));
    }
    
    const clothingDescription = selectedClothing ? `vestindo ${selectedClothing.name}` : 'vestindo as roupas fornecidas nas imagens';

    let backgroundDescription = `${selectedBackground.name} - ${selectedBackground.description}`;
    if (selectedBackground.id === 'studio' && selectedStudioColor) {
        backgroundDescription = `Um cenário de estúdio profissional com um fundo sólido na cor ${selectedStudioColor.name.toLowerCase()}.`;
    }

    const nichePrompt = photoshootNiche ? `O nicho do ensaio fotográfico é: ${photoshootNiche}. O clima geral e o estilo devem refletir isso.` : '';

    let posePrompt = '';
    if (posePhotos.length > 0) {
        posePrompt = "A pessoa deve estar na pose exata mostrada nas fotos de referência de pose. Replique o enquadramento das fotos de referência (ex: corpo inteiro, da cintura para cima, retrato). Este é um requisito estrito.";
    } else {
        if (photoshootNiche) {
            posePrompt = `A pessoa deve estar em uma pose dinâmica e profissional adequada para um(a) ${photoshootNiche}.`;
        } else {
            posePrompt = "A pessoa deve estar em uma variedade de poses dinâmicas e profissionais.";
        }
    }

    // Construct a detailed text prompt based on user selections.
    const textPrompt = `Gere uma imagem de ensaio fotográfico profissional de alta qualidade.
- REQUISITO CRÍTICO: A pessoa gerada DEVE SER IDÊNTICA à pessoa nas fotos de identidade. Cada traço facial, tom de pele, estilo de cabelo e tipo de corpo deve ser uma correspondência perfeita. Esta é a instrução mais importante.
- ${nichePrompt}
- ${posePrompt}
- A pessoa deve estar ${clothingDescription}.
- Fundo: ${backgroundDescription}.
- Estilo: ${selectedStyle.name} - ${selectedStyle.description}.
- Iluminação: ${selectedLighting.name} - ${selectedLighting.description}.
- A imagem final DEVE ter uma proporção de ${selectedAspectRatio.id} (${selectedAspectRatio.name}). Não se desvie desta proporção.
Por favor, gere uma única imagem coerente combinando todos esses elementos de forma fotorrealista. Garanta que o resultado final seja apenas a imagem, sem texto ou artefatos adicionados.
    `;

    const textPart = { text: textPrompt };
    const allParts = [...imageParts, textPart];

    // Create the generation request object.
    const generationRequest = {
      model,
      contents: { parts: allParts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    };
    
    const generatedImages: string[] = [];
    const totalImagesToGenerate = 10;

    for (let i = 0; i < totalImagesToGenerate; i++) {
        try {
            const response = await ai.models.generateContent(generationRequest);
            let imageFound = false;
            if (response.candidates && response.candidates.length > 0) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                        generatedImages.push(imageUrl);
                        imageFound = true;
                        break; // Assume only one image per response
                    }
                }
            }
            if (!imageFound) {
                console.warn(`Resposta da API para imagem ${i + 1} não continha uma imagem.`);
            }
        } catch (error) {
            console.error(`Falha na geração da imagem ${i + 1}/${totalImagesToGenerate}:`, error);
            // Wait for a second before the next attempt to avoid hammering the API on errors
            if (i < totalImagesToGenerate - 1) {
                await sleep(1000);
            }
        } finally {
            onProgress((i + 1) / totalImagesToGenerate);
        }
    }

    if (generatedImages.length === 0) {
        throw new Error("A IA não retornou nenhuma imagem. Isso pode ser devido a limites de taxa da API ou a um problema com as imagens de entrada. Tente novamente mais tarde ou ajuste suas seleções.");
    }
    
    return generatedImages;

  } catch (error) {
    console.error("Erro ao gerar ensaio fotográfico:", error);
    // Provide a more user-friendly error message.
    if (error instanceof Error) {
        throw new Error(`Falha ao gerar o ensaio: ${error.message}`);
    }
    throw new Error("Ocorreu um erro desconhecido durante a geração da imagem.");
  }
};