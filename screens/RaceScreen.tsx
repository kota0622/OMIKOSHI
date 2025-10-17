import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { GameDispatchContext, GameStateContext } from '../context/GameContext';
import { Screen } from '../types';
import Button from '../components/Button';

const RACE_DURATION_MS = 35000; // 35 seconds
const TILT_EVENT_1_PROGRESS = 0.4;
const TILT_EVENT_2_PROGRESS = 0.8;
const VOLUME_THRESHOLD = 160; // out of 255. Increased threshold significantly to require louder cheers.

type TiltDirection = 'left' | 'right' | null;

const RaceScreen: React.FC = () => {
    const dispatch = useContext(GameDispatchContext);
    const { omikoshiImage, playerImage } = useContext(GameStateContext);

    const [startTime] = useState(Date.now());
    const [progress, setProgress] = useState(0);
    const [powerGauge, setPowerGauge] = useState(0);
    const [isBoosted, setIsBoosted] = useState(false);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    
    const [tiltEvent, setTiltEvent] = useState<TiltDirection>(null);
    const [showTiltPrompt, setShowTiltPrompt] = useState(false);
    const [showCheerBoostPrompt, setShowCheerBoostPrompt] = useState(false);

    const requestRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);

    const cheerLoop = useCallback(() => {
        if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
            
            if (average > VOLUME_THRESHOLD) {
                setPowerGauge(prev => Math.min(prev + 0.08, 100)); // Much slower gauge fill rate for 1-2 boosts per game
            }
        }
        requestRef.current = requestAnimationFrame(cheerLoop);
    }, []);

    useEffect(() => {
        // Play BGM
        audioRef.current = document.getElementById('race-bgm') as HTMLAudioElement;
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio play failed.", e));
        }

        // Setup microphone input
        const setupMicrophone = async () => {
            try {
                micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                // FIX: Cast window to any to allow for webkitAudioContext for broader browser compatibility.
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                const source = audioContextRef.current.createMediaStreamSource(micStreamRef.current);
                source.connect(analyserRef.current);
                analyserRef.current.fftSize = 256;
                requestRef.current = requestAnimationFrame(cheerLoop);
            } catch (err) {
                console.error("Microphone access denied:", err);
            }
        };
        setupMicrophone();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            micStreamRef.current?.getTracks().forEach(track => track.stop());
            audioContextRef.current?.close();
        };
    }, [cheerLoop]);

    const animateRace = useCallback(() => {
        const elapsedTime = Date.now() - startTime;
        const currentProgress = Math.min(elapsedTime / RACE_DURATION_MS, 1);
        setProgress(currentProgress);

        if (currentProgress >= 1) {
            dispatch({ type: 'SET_RACE_TIME', payload: elapsedTime });
            dispatch({ type: 'SET_SCREEN', payload: Screen.Goal });
            return;
        }
        // Continue race animation
        const raceAnimationId = requestAnimationFrame(animateRace);
        // Overwrite requestRef if cheerLoop isn't running
        if (!analyserRef.current) {
            requestRef.current = raceAnimationId;
        }
    }, [startTime, dispatch]);

    useEffect(() => {
        const raceAnimationId = requestAnimationFrame(animateRace);
        return () => cancelAnimationFrame(raceAnimationId);
    }, [animateRace]);


    useEffect(() => {
        if (progress > TILT_EVENT_1_PROGRESS && tiltEvent === null) {
            setTiltEvent('right');
            setShowTiltPrompt(true);
        } else if (progress > TILT_EVENT_2_PROGRESS && tiltEvent === 'right') {
            setTiltEvent('left');
            setShowTiltPrompt(true);
        }
    }, [progress, tiltEvent]);

    const handleTilt = (direction: 'left' | 'right') => {
        if (direction === tiltEvent) {
             // Success
        } else {
            // Failure
            setSpeedMultiplier(0.9);
            setTimeout(() => setSpeedMultiplier(1), 2000);
        }
        setShowTiltPrompt(false);
    };

    useEffect(() => {
        if (powerGauge >= 100 && !isBoosted) {
            setIsBoosted(true);
            setShowCheerBoostPrompt(true);
            setTimeout(() => {
                setIsBoosted(false);
                setPowerGauge(0);
            }, 5000);
            setTimeout(() => setShowCheerBoostPrompt(false), 2500);
        }
    }, [powerGauge, isBoosted]);

    const currentSpeed = (isBoosted ? 1.5 : 1) * speedMultiplier;
    const backgroundPosition = -progress * 1500 * currentSpeed;
    const omikoshiPosition = 10 + progress * 70;

    return (
        <div className="w-full h-screen overflow-hidden relative bg-blue-300">
            <div className="absolute inset-0 bg-repeat-x" style={{ 
                backgroundImage: "url('https://picsum.photos/seed/race-scroll/2000/1080')", 
                backgroundSize: 'auto 100%',
                width: '300%',
                transform: `translateX(${backgroundPosition}px)`,
            }}></div>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mochiy text-9xl text-white opacity-0 animate-fade-in-out drop-shadow-lg" style={{ animationDelay: '0s', textShadow: '3px 3px 0 #000' }}>わっしょい！</span>
                <span className="font-mochiy text-8xl text-yellow-300 opacity-0 animate-fade-in-out drop-shadow-lg" style={{ animationDelay: '1s', textShadow: '3px 3px 0 #000' }}>オイサ！</span>
            </div>

            <div className="absolute top-0 left-0 w-full p-4 z-10">
                <div className="bg-white/80 p-2 rounded-full shadow-lg max-w-4xl mx-auto">
                    <div className="bg-green-500 h-8 rounded-full transition-all duration-300 border-2 border-green-700" style={{ width: `${progress * 100}%` }}></div>
                </div>
            </div>
            
            <div className="absolute bottom-1/4 transition-all duration-100 ease-linear transform -translate-x-1/2" style={{ left: `${omikoshiPosition}%` }}>
                <div className="flex flex-col items-center animate-shake">
                    {omikoshiImage && (
                        <img src={`data:image/png;base64,${omikoshiImage}`} alt="おみこし" className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-2xl" />
                    )}
                    {playerImage && (
                        <div className="w-48 h-36 bg-white rounded-t-lg flex overflow-hidden shadow-inner border-4 border-yellow-300 items-center justify-center -mt-8 z-10">
                            <img src={playerImage} className="w-full h-full object-cover" alt="担ぎ手" />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                <div className="w-1/3">
                    <h3 className="font-mochiy text-white text-3xl drop-shadow-md" style={{textShadow: '2px 2px 0 #000'}}>応援パワー</h3>
                    <div className="bg-white/50 w-full h-10 rounded-full mt-2 overflow-hidden border-2 border-gray-600">
                        <div className={`bg-yellow-400 h-full transition-all duration-200 ${powerGauge > 0 ? 'animate-glow' : ''}`} style={{ width: `${powerGauge}%` }}></div>
                    </div>
                </div>
                {/* Manual cheer button kept as a fallback */}
                <Button onClick={() => setPowerGauge(p => Math.min(p + 25, 100))}>応援！</Button>
            </div>

            {showTiltPrompt && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 animate-zoom-in">
                     <h2 className="font-mochiy text-9xl text-yellow-300 mb-8" style={{textShadow: '5px 5px 0 #000'}}>{tiltEvent === 'right' ? '勢い水！' : '度胸一番！'}</h2>
                     <h3 className="font-mochiy text-8xl text-white mb-12" style={{textShadow: '3px 3px 0 #000'}}>おみこしを{tiltEvent === 'left' ? '左' : '右'}に傾けろ！</h3>
                     <div className="flex gap-16">
                        <Button onClick={() => handleTilt('left')} variant='secondary' className="!text-6xl !px-12">⬅️ 左</Button>
                        <Button onClick={() => handleTilt('right')} className="!text-6xl !px-12">右 ➡️</Button>
                    </div>
                </div>
            )}

            {showCheerBoostPrompt && (
                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-40 animate-zoom-in">
                     <h2 className="font-mochiy text-9xl text-yellow-300" style={{textShadow: '5px 5px 0 #c00'}}>応援パワー！！</h2>
                     <h3 className="font-mochiy text-8xl text-white" style={{textShadow: '3px 3px 0 #c00'}}>スピードアップ！</h3>
                 </div>
            )}
        </div>
    );
};

export default RaceScreen;