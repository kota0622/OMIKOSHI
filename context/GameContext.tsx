
import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { Screen, GameState, GameAction } from '../types';

const initialState: GameState = {
  screen: Screen.Start,
  omikoshiImage: null,
  playerImage: null,
  raceTime: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };
    case 'SET_OMIKOSHI':
      return { ...state, omikoshiImage: action.payload.image };
    case 'SET_PLAYER_IMAGE':
        return { ...state, playerImage: action.payload };
    case 'SET_RACE_TIME':
        return { ...state, raceTime: action.payload };
    case 'RESET_GAME':
        return initialState;
    default:
      return state;
  }
}

export const GameStateContext = createContext<GameState>(initialState);
export const GameDispatchContext = createContext<Dispatch<GameAction>>(() => null);

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};
