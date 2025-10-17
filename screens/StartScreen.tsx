import React, { useContext } from 'react';
import { GameDispatchContext } from '../context/GameContext';
import { Screen } from '../types';
import Button from '../components/Button';

const StartScreen: React.FC = () => {
  const dispatch = useContext(GameDispatchContext);

  const handleStart = () => {
    dispatch({ type: 'SET_SCREEN', payload: Screen.Story });
  };

  return (
    // ▼▼▼ 背景画像の入れ替え ▼▼▼
    // ↓ここの "url('...')" を、使いたい背景画像のパスに差し替えてください。
    <div className="w-full h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/japan-pattern/1920/1080')"}}>
    {/* ▲▲▲ 背景画像の入れ替え ▲▲▲ */}
        <div className="bg-white bg-opacity-80 p-10 rounded-3xl shadow-2xl text-center">
            <h1 className="font-mochiy text-6xl md:text-9xl text-red-600 drop-shadow-lg animate-float" style={{textShadow: '4px 4px 0 #fff, 8px 8px 0 #ddd'}}>
                おみこしダッシュ！
            </h1>
            <div className="mt-12">
                <Button onClick={handleStart}>
                    お祭りスタート
                </Button>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-300">
                    <h3 className="font-bold text-xl text-orange-800">あそびかた①</h3>
                    <p className="mt-1 text-lg text-orange-700">スマホを乗せた模型を上下に振って、おみこしを進めよう！</p>
                </div>
                <div className="bg-teal-100 p-4 rounded-lg border-2 border-teal-300">
                    <h3 className="font-bold text-xl text-teal-800">あそびかた②</h3>
                    <p className="mt-1 text-lg text-teal-700">大きな声で応援すると、おみこしがスピードアップするぞ！</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default StartScreen;