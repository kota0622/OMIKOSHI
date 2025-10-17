
import React, { useState, useContext, useRef, useCallback } from 'react';
import { GameDispatchContext, GameStateContext } from '../context/GameContext';
import { Screen } from '../types';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { sanitizeAndEnhancePrompt, generateOmikoshiImage } from '../services/geminiService';
import { NG_WORDS } from '../constants';

const GenerationScreen: React.FC = () => {
  const dispatch = useContext(GameDispatchContext);
  const { omikoshiImage } = useContext(GameStateContext);

  const [step, setStep] = useState(1); // 1: Omikoshi, 2: Players
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerateOmikoshi = async () => {
    const containsNGWord = NG_WORDS.some(word => theme.toLowerCase().includes(word.toLowerCase()));
    if (containsNGWord) {
        setError(`「${theme}」は使えないみたい…別の言葉で試してみて！`);
        return;
    }
    setError(null);
    setIsLoading(true);
    
    try {
        setLoadingText('テーマを解析中...');
        const sanitizedTheme = await sanitizeAndEnhancePrompt(theme);
        
        setLoadingText('職人が魂を込めて作っています…');
        const imageData = await generateOmikoshiImage(sanitizedTheme);

        if (imageData) {
            dispatch({ type: 'SET_OMIKOSHI', payload: { image: imageData } });
            setStep(2);
        } else {
            throw new Error('おみこしの生成に失敗しました。');
        }
    } catch (err) {
        setError('エラーが発生しました。テーマを変えてもう一度試してください。');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("カメラにアクセスできませんでした。");
      }
    }
  }, []);

  React.useEffect(() => {
    if (step === 2) {
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step, startCamera]);


  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/png');
      dispatch({ type: 'SET_PLAYER_IMAGE', payload: dataUrl });
      dispatch({ type: 'SET_SCREEN', payload: Screen.Race });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4">
      {isLoading && <Loader text={loadingText} />}

      <div className={`w-full max-w-3xl text-center transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <h2 className="font-mochiy text-3xl md:text-5xl text-yellow-800 mb-4">オリジナルおみこしを作ろう！</h2>
          <p className="mb-8 text-lg">どんなおみこしにする？テーマを入力してね！</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                  type="text"
                  value={theme}
                  onChange={(e) => { setTheme(e.target.value); setError(null); }}
                  placeholder="例：宇宙を旅する龍"
                  className="w-full sm:w-auto flex-grow text-xl p-4 border-4 border-yellow-400 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-300"
              />
              <Button onClick={handleGenerateOmikoshi} disabled={!theme}>
                  生成！
              </Button>
          </div>
          {error && <p className="mt-4 text-red-600 font-bold">{error}</p>}
      </div>

      <div className={`w-full max-w-4xl text-center transition-opacity duration-500 ${step === 2 ? 'opacity-100' : 'opacity-0 hidden'}`}>
        <h2 className="font-mochiy text-3xl md:text-5xl text-green-800 mb-4">担ぎ手を登録！</h2>
        <p className="mb-6 text-lg">ふたりで一緒にカメラの前に立って、最高のポーズで撮影しよう！</p>
        <div className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden border-4 border-green-700 shadow-lg">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <Button onClick={handleCapture} className="mt-8 bg-green-600 hover:bg-green-700 border-green-800">
            撮影する！
        </Button>
      </div>

    </div>
  );
};


export default GenerationScreen;
