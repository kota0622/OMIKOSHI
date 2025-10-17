
import React, { useContext } from 'react';
import { GameDispatchContext } from '../context/GameContext';
import { Screen } from '../types';
import Button from '../components/Button';

const ConnectScreen: React.FC = () => {
  const dispatch = useContext(GameDispatchContext);

  const handleProceed = () => {
    dispatch({ type: 'SET_SCREEN', payload: Screen.Generate });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-blue-100 p-8">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-2xl">
        <h2 className="font-mochiy text-4xl text-blue-800 mb-4">スマホを接続しよう！</h2>
        <p className="text-lg mb-6">
          手元のスマートフォンで下のQRコードを読み込んで、コントローラーページを開いてね！
        </p>
        <div className="flex justify-center my-8">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=OmikoshiDash" alt="QR Code" className="p-4 bg-white border-4 border-gray-300 rounded-xl" />
        </div>
        <p className="text-gray-600 mb-8">
          （このデモでは、下のボタンを押して次に進んでください）
        </p>
        <Button onClick={handleProceed} variant="secondary">
          接続完了！次へ！
        </Button>
      </div>
    </div>
  );
};

export default ConnectScreen;
