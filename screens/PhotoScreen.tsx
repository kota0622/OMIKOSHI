import React, { useContext } from 'react';
import { GameDispatchContext, GameStateContext } from '../context/GameContext';
import Button from '../components/Button';

const PhotoScreen: React.FC = () => {
    const dispatch = useContext(GameDispatchContext);
    const { omikoshiImage, playerImage, raceTime } = useContext(GameStateContext);

    const handleRestart = () => {
        dispatch({ type: 'RESET_GAME' });
    };

    const shareText = `おみこしダッシュ！で ${raceTime ? (raceTime / 1000).toFixed(2) : ''}秒でゴールしたよ！ #おみこしダッシュ`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden border-8 border-yellow-300">
                <div className="p-6 bg-red-500 text-white text-center">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-x-6 gap-y-2">
                        <h2 className="font-mochiy text-5xl">祝・完走！</h2>
                        <div className="font-mono text-4xl bg-gray-800 text-white p-2 px-4 rounded-lg inline-block shadow-lg">
                            TIME: {raceTime ? (raceTime / 1000).toFixed(2) : '0.00'}
                        </div>
                    </div>
                    <p className="font-noto font-bold text-2xl mt-4">次は本物山笠を見に行こう！！</p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-around items-center gap-6 p-8 bg-orange-50">
                    {/* Left Side: Omikoshi */}
                    <div className="flex flex-col items-center text-center">
                        <p className="font-mochiy text-4xl text-red-700">おみこし</p>
                        <div className="w-64 h-64 lg:w-80 lg:h-80 my-4 bg-white rounded-full flex items-center justify-center p-2 shadow-inner">
                            {omikoshiImage && <img src={`data:image/png;base64,${omikoshiImage}`} alt="おみこし" className="max-w-full max-h-full object-contain" />}
                        </div>
                    </div>

                    {/* Right Side: Players */}
                    <div className="flex flex-col items-center text-center">
                         <p className="font-mochiy text-4xl text-blue-700">担ぎ手</p>
                         {playerImage && (
                            <div className="w-64 h-64 lg:w-80 lg:h-80 my-4 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img src={playerImage} className="w-full h-full object-cover" alt="担ぎ手" />
                            </div>
                         )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                 <p className="mb-4 text-xl">記念画像をダウンロードしてね！</p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OmikoshiDash-Result" alt="QR Code for Download" className="p-2 bg-white border-2 border-gray-400 rounded-md"/>
                    <div className="flex flex-col gap-4">
                        <Button onClick={handleRestart} className="!text-2xl">
                            スタート画面へ
                        </Button>
                        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" className="!text-2xl w-full">
                                Xでシェア
                            </Button>
                        </a>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default PhotoScreen;