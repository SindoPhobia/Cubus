import {create} from 'zustand';

export type GameSettings = {
    gridHelper: boolean;
    enableLights: boolean;
    enablePerf: boolean;
};

type Actions = {
    setGridHelper: (gridHelper: boolean) => void;
    setEnableLights: (enableLights: boolean) => void;
    setEnablePerf: (enablePerf: boolean) => void;
};

export const useGameSettings = create<GameSettings & Actions>((set, get) => ({
    gridHelper: false,
    enableLights: true,
    enablePerf: false,
    setGridHelper: gridHelper => set({gridHelper}),
    setEnableLights: enableLights => set({enableLights}),
    setEnablePerf: enablePerf => set({enablePerf}),
}));
