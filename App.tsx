import React, { useState } from 'react';
import { Step, SessionData, Option, ImageFile } from './types';
import { STEPS, BACKGROUNDS, STYLES, LIGHTING, ASPECT_RATIOS, CLOTHES_LIBRARY, STUDIO_COLORS } from './constants';
import { StepIndicator } from './components/StepIndicator';
import { FileUpload } from './components/FileUpload';
import { OptionSelector } from './components/OptionSelector';
import { Loader } from './components/Loader';
import { ImageGrid } from './components/ImageGrid';
import { SparklesIcon, ArrowPathIcon } from './components/icons/Icons';
import { generatePhotoshoot } from './services/geminiService';

interface ImagePreviewModalProps {
  src: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fade-in p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative bg-gray-800 p-4 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex-grow flex justify-center items-center overflow-hidden">
            <img src={src} alt="Pré-visualização do ensaio gerado" className="max-w-full max-h-full object-contain rounded-md" />
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <a
            href={src}
            download={`ensaio-resultado-${Date.now()}.png`}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Baixar Imagem
          </a>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            aria-label="Fechar pré-visualização"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SESSION_INFO);
  const [sessionData, setSessionData] = useState<SessionData>({
    clientName: '',
    sessionName: '',
    photoshootNiche: '',
    identityPhotos: [],
    clothingPhotos: [],
    posePhotos: [],
    selectedClothing: null,
    selectedBackground: BACKGROUNDS[0],
    selectedStyle: STYLES[0],
    selectedLighting: LIGHTING[0],
    selectedAspectRatio: ASPECT_RATIOS[0],
    selectedStudioColor: STUDIO_COLORS[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (field: keyof SessionData, value: any) => {
    setSessionData(prev => {
        const newState = { ...prev, [field]: value };
        // If the background is changed to something other than studio, clear the color
        if (field === 'selectedBackground' && value.id !== 'studio') {
            newState.selectedStudioColor = null;
        }
        // If the background is changed to studio and no color is selected, select the first one by default.
        if (field === 'selectedBackground' && value.id === 'studio' && !newState.selectedStudioColor) {
            newState.selectedStudioColor = STUDIO_COLORS[0];
        }
        return newState;
    });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setProgress(0);
    try {
        const onProgress = (p: number) => setProgress(p);
        const images = await generatePhotoshoot(sessionData, onProgress);
        setGeneratedImages(images);
    } catch (err: any) {
        setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
        setIsLoading(false);
        setProgress(null);
    }
  };
  
  const canProceed = (): boolean => {
    switch (currentStep) {
        case Step.SESSION_INFO:
            return sessionData.clientName.trim() !== '' && sessionData.sessionName.trim() !== '';
        case Step.IDENTITY_UPLOAD:
            return sessionData.identityPhotos.length > 0;
        case Step.CLOTHING_UPLOAD:
            return sessionData.clothingPhotos.length > 0 || sessionData.selectedClothing !== null;
        case Step.POSE_UPLOAD:
            return true; // Pose upload is now optional
        case Step.STYLE_SELECTION:
            return true; // Always can proceed from here
        default:
            return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.SESSION_INFO:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-300">Nome do Cliente</label>
              <input
                type="text"
                id="clientName"
                value={sessionData.clientName}
                onChange={e => handleDataChange('clientName', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ex: Maria da Silva"
              />
            </div>
            <div>
              <label htmlFor="sessionName" className="block text-sm font-medium text-gray-300">Nome da Sessão de Fotos</label>
              <input
                type="text"
                id="sessionName"
                value={sessionData.sessionName}
                onChange={e => handleDataChange('sessionName', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ex: Coleção de Verão 2024"
              />
            </div>
            <div>
              <label htmlFor="photoshootNiche" className="block text-sm font-medium text-gray-300">Nicho do Ensaio (Opcional)</label>
              <input
                type="text"
                id="photoshootNiche"
                value={sessionData.photoshootNiche}
                onChange={e => handleDataChange('photoshootNiche', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ex: Advogada, Musicista, Coach Fitness"
              />
            </div>
          </div>
        );
      case Step.IDENTITY_UPLOAD:
        return <FileUpload 
            title="Enviar Fotos de Identidade" 
            description="Envie fotos nítidas e bem iluminadas do rosto da pessoa de vários ângulos. (Mín 1, Máx 10)" 
            onFilesChange={(files: ImageFile[]) => handleDataChange('identityPhotos', files)} 
            maxFiles={10}
        />;
      case Step.CLOTHING_UPLOAD:
        return (
            <div>
                 <h2 className="text-xl font-bold text-white mb-2">Escolha a Roupa</h2>
                 <p className="text-gray-400 mb-4">Selecione uma roupa da nossa biblioteca ou envie suas próprias fotos de roupas.</p>
                 <h3 className="text-lg font-semibold text-white mb-2">Da Biblioteca</h3>
                 <OptionSelector 
                    options={CLOTHES_LIBRARY}
                    selectedOption={sessionData.selectedClothing}
                    onSelect={(option: Option) => handleDataChange('selectedClothing', sessionData.selectedClothing?.id === option.id ? null : option)}
                    isImage={true}
                 />
                 <div className="my-6 text-center text-gray-400">OU</div>
                <FileUpload 
                    title="Enviar Fotos de Roupas" 
                    description="Envie fotos das peças de roupa a serem usadas." 
                    onFilesChange={(files: ImageFile[]) => handleDataChange('clothingPhotos', files)}
                    maxFiles={3}
                />
            </div>
        );
      case Step.POSE_UPLOAD:
        return <FileUpload 
            title="Enviar Fotos de Referência de Pose" 
            description="Envie fotos mostrando a pose desejada. (Máx 15) Ou deixe em branco para poses geradas pela IA com base no seu nicho." 
            onFilesChange={(files: ImageFile[]) => handleDataChange('posePhotos', files)}
            maxFiles={15}
        />;
      case Step.STYLE_SELECTION:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Fundo</h3>
              <OptionSelector options={BACKGROUNDS} selectedOption={sessionData.selectedBackground} onSelect={(option: Option) => handleDataChange('selectedBackground', option)} />
            </div>
            
            {sessionData.selectedBackground.id === 'studio' && (
                <div className="pl-4 border-l-4 border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">Cor do Fundo de Estúdio</h3>
                    <OptionSelector 
                        options={STUDIO_COLORS} 
                        selectedOption={sessionData.selectedStudioColor} 
                        onSelect={(option: Option) => handleDataChange('selectedStudioColor', option)}
                        isColor={true}
                     />
                </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Estilo</h3>
              <OptionSelector options={STYLES} selectedOption={sessionData.selectedStyle} onSelect={(option: Option) => handleDataChange('selectedStyle', option)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Iluminação</h3>
              <OptionSelector options={LIGHTING} selectedOption={sessionData.selectedLighting} onSelect={(option: Option) => handleDataChange('selectedLighting', option)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Proporção da Imagem</h3>
              <OptionSelector options={ASPECT_RATIOS} selectedOption={sessionData.selectedAspectRatio} onSelect={(option: Option) => handleDataChange('selectedAspectRatio', option)} />
            </div>
          </div>
        );
      case Step.GENERATE:
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Pronto para Gerar?</h2>
                <p className="text-gray-400 mt-2 mb-6">Revise suas seleções e clique no botão abaixo para iniciar o ensaio fotográfico com IA. Isso irá gerar 10 imagens únicas.</p>
                {isLoading ? (
                    <Loader progress={progress} />
                ) : (
                    <>
                        <button 
                            onClick={handleGenerate} 
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-transform transform hover:scale-105"
                        >
                            <SparklesIcon />
                            {generatedImages.length > 0 ? 'Gerar Novamente' : 'Gerar Ensaio'}
                        </button>
                        {generatedImages.length > 0 && 
                          <button 
                            onClick={() => {
                              setCurrentStep(Step.SESSION_INFO);
                              setGeneratedImages([]);
                              // Optionally reset sessionData here if desired
                            }} 
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-transform transform hover:scale-105 ml-4"
                          >
                              <ArrowPathIcon />
                              Começar Novo
                          </button>
                        }
                    </>
                )}
                {error && <p className="text-red-400 mt-4">{error}</p>}
                {generatedImages.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Suas Fotos Geradas:</h3>
                        <ImageGrid 
                            images={generatedImages} 
                            isResult={true}
                            onImageClick={(src) => setPreviewImage(src)} 
                        />
                    </div>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-cyan-400 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6"/> Gerador de Ensaio Fotográfico com IA
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-8">
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          {renderStepContent()}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
          {currentStep < Step.GENERATE ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Avançar
            </button>
          ) : (
             <div /> // Placeholder to keep "Back" button on the left
          )}
        </div>
      </main>
      {previewImage && <ImagePreviewModal src={previewImage} onClose={() => setPreviewImage(null)} />}
    </div>
  );
}

export default App;