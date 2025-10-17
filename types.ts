
export enum Screen {
  Start,
  Story,
  Connect,
  Generate,
  Race,
  Goal,
  Photo,
}

export interface GameState {
  screen: Screen;
  omikoshiImage: string | null;
  playerImage: string | null;
  raceTime: number | null;
}

export type GameAction =
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'SET_OMIKOSHI'; payload: { image: string } }
  | { type: 'SET_PLAYER_IMAGE'; payload: string }
  | { type: 'SET_RACE_TIME'; payload: number }
  | { type: 'RESET_GAME' };
