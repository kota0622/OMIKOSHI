import React, { useState, useContext, useEffect, useCallback } from 'react';
import { GameDispatchContext } from '../context/GameContext';
import { Screen } from '../types';
import { STORY_DIALOGUE } from '../constants';

// ▼▼▼ キャラクター画像の入れ替え ▼▼▼
// ↓ここのsrcを、やまかさくんの画像パスに差し替えてください。
const YamakasaKun = () => <img src="/public/image/boy.png" alt="Yamakasa-kun" className="h-96 w-auto object-contain drop-shadow-lg" />;
// ↓ここのsrcを、はなちゃんの画像パスに差し替えてください。
const Hana = () => <img src="/public/image/cat.png" alt="Hana" className="h-96 w-auto object-contain drop-shadow-lg" />;
// ▲▲▲ キャラクター画像の入れ替え ▲▲▲


const StoryScreen: React.FC = () => {
    const dispatch = useContext(GameDispatchContext);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    const handleNext = useCallback(() => {
        if (dialogueIndex < STORY_DIALOGUE.length - 1) {
            setDialogueIndex(prevIndex => prevIndex + 1);
        } else {
            dispatch({ type: 'SET_SCREEN', payload: Screen.Connect });
        }
    }, [dialogueIndex, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleNext]);

    const currentDialogue = STORY_DIALOGUE[dialogueIndex];

    return (
        // ▼▼▼ 背景画像の入れ替え ▼▼▼
        // ↓ここの "url('...')" を、使いたい背景画像のパスに差し替えてください。
        <div className="w-full h-screen flex flex-col items-center justify-end p-8 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/hakata-night/1920/1080')"}}>
        {/* ▲▲▲ 背景画像の入れ替え ▲▲▲ */}
             <div className="flex justify-between w-full max-w-6xl items-end px-4 flex-grow">
                <div className={`transition-all duration-500 ${currentDialogue.speaker === 'はな' ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}>
                    <Hana />
                </div>
                <div className={`transition-all duration-500 ${currentDialogue.speaker === 'やまかさくん' ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}>
                    <YamakasaKun />
                </div>
            </div>
            <div className="w-full max-w-5xl bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl border-4 border-gray-800 cursor-pointer" onClick={handleNext}>
                <p className="font-bold text-2xl mb-2 text-gray-900">{currentDialogue.speaker}</p>
                <p className="text-2xl h-28 overflow-y-auto">{currentDialogue.text}</p>
                <p className="text-right mt-2 text-gray-500 animate-pulse">クリック or Enterキーですすむ ▼</p>
            </div>
        </div>
    );
};

export default StoryScreen;