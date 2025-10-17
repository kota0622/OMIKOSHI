
import React, { useContext } from 'react';
import { GameProvider, GameStateContext } from './context/GameContext';
import { Screen } from './types';

import StartScreen from './screens/StartScreen';
import StoryScreen from './screens/StoryScreen';
import ConnectScreen from './screens/ConnectScreen';
import GenerationScreen from './screens/GenerationScreen';
import RaceScreen from './screens/RaceScreen';
import GoalScreen from './screens/GoalScreen';
import PhotoScreen from './screens/PhotoScreen';


const ScreenManager: React.FC = () => {
    const { screen } = useContext(GameStateContext);

    switch (screen) {
        case Screen.Start:
            return <StartScreen />;
        case Screen.Story:
            return <StoryScreen />;
        case Screen.Connect:
            return <ConnectScreen />;
        case Screen.Generate:
            return <GenerationScreen />;
        case Screen.Race:
            return <RaceScreen />;
        case Screen.Goal:
            return <GoalScreen />;
        case Screen.Photo:
            return <PhotoScreen />;
        default:
            return <StartScreen />;
    }
};

const App: React.FC = () => {
    return (
        <GameProvider>
            <div className="w-screen h-screen">
                <ScreenManager />
            </div>
        </GameProvider>
    );
};

export default App;
