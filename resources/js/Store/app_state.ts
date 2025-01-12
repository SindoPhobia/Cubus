import { AudioManager, Sounds } from "@/AudioManager";
import { GameSession } from "@/types/models/tables/Session";
import { User } from "@/types/models/tables/User";
import { create } from "zustand";

type StateProps =  {
    user?: User;
    currentSession?: GameSession;
    hasInterracted: boolean;

    setUser: (user: User) => void;
    setCurrentSession: (session: GameSession) => void;
    setHasInterracted: (hasInterracted: boolean) => void;
}

export const useAppState = create<StateProps>((set, get) => ({
    user: undefined,
    currentSession: undefined,
    hasInterracted: false,

    setUser: (user) => set({ user }),
    setCurrentSession: (session) => set({ currentSession: session }),
    setHasInterracted: (hasInterracted) => {
        if(!get().hasInterracted) {
            const song: Sounds = get().currentSession?.session_state === 'playing' ? 'soundtrack-gameplay' : 'soundtrack-lobby';
            AudioManager.getInstance().play(song, true);
        }

        return set({ hasInterracted });
    },
}))
