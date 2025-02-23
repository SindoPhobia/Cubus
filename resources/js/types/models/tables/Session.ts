import {PlayerColor, SessionState, ValorizedVector2} from '@/types/game';
import {Id} from '../index';
import {User} from './User';

export type GameSession = {
    /*
     * Backend Info
     */
    id: Id | null;
    name: string;
    current_round: number; //* [Default value]: 0
    board_state?: Array<ValorizedVector2>;
    session_state?: SessionState;
    current_player_count?: number;
    player_count?: '2' | '4';

    player_host?: User;
    player_blue?: User;
    player_blue_has_finished?: boolean;
    player_blue_points?: number;
    player_red_has_finished?: boolean;
    player_red_points?: number;
    player_red?: User;
    player_green_has_finished?: boolean;
    player_green_points?: number;
    player_green?: User;
    player_yellow_has_finished?: boolean;
    player_yellow_points?: number;
    player_yellow?: User;
    current_playing?: PlayerColor;
};
