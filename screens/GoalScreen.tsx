
import React, { useEffect, useContext } from 'react';
import { GameDispatchContext, GameStateContext } from '../context/GameContext';
import { Screen } from '../types';

const GoalScreen: React.FC = () => {
    const dispatch = useContext(GameDispatchContext);
    const { raceTime, omikoshiImage, playerImage } = useContext(GameStateContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: 'SET_SCREEN', payload: Screen.Photo });
        }, 8000); // Show for 8 seconds

        return () => clearTimeout(timer);
    }, [dispatch]);

    const getRank = (time: number | null) => {
        if (!time) return "ー";
        if (time <= 30000) return "あっぱれ！";
        if (time <= 35000) return "見事！";
        return "おつかれさま！";
    };

    return (
        // ▼▼▼ 背景画像の入れ替え ▼▼▼
        // ↓ここの "url('...')" を、使いたい背景画像のパスに差し替えてください。
        <div className="w-full h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden" style={{backgroundImage: "url('https://picsum.photos/seed/goal-shrine/1920/1080')"}}>
        {/* ▲▲▲ 背景画像の入れ替え ▲▲▲ */}
             <div className="absolute inset-0 bg-black/30"></div>
             
             {[...Array(50)].map((_, i) => (
                <div key={i} className="absolute w-2 h-4 bg-yellow-300 rounded-sm animate-fall" style={{ 
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 3}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                 }}></div>
             ))}

            <div className="relative text-center z-10 bg-white/80 p-8 rounded-3xl shadow-2xl">
                <h1 className="font-mochiy text-9xl text-red-600 drop-shadow-lg mb-4">ゴール！</h1>
                <p className="font-mochiy text-6xl text-yellow-600 mb-8" style={{textShadow: '2px 2px 0 #fff'}}>{getRank(raceTime)}</p>

                <div className="my-8 relative w-64 h-64 mx-auto animate-float">
                    {omikoshiImage && <img src={`data:image/png;base64,${omikoshiImage}`} alt="おみこし" className="w-full h-full object-contain" />}
                </div>
                
                <div className="bg-gray-800 text-white font-mono text-5xl p-4 rounded-lg inline-block shadow-lg">
                    TIME: {(raceTime ? (raceTime / 1000).toFixed(2) : '0.00')}
                </div>
            </div>
            
            <style>{`
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            .animate-fall {
                top: -10%;
                animation: fall linear forwards;
            }
            `}</style>

        </div>
    );
};

export default GoalScreen;