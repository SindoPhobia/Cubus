import useUserEvents from '@/Connection/useUserEvents';
import {Experience} from '@/Game/Experience';
import {Portrait} from '@/Icons/Portrait';
import {Icon, SVG} from '@/Icons/SVG';
import {Button} from '@/Inputs/Button';
import {List, ListElement} from '@/Inputs/List';
import Network from '@/network';
import {PopupContainer, usePopup} from '@/Popup';
import {useAppState} from '@/Store/app_state';
import {useBoardState} from '@/Store/board_state';
import {PageProps} from '@/types';
import {ConnectionState} from '@/types/connection';
import {GameResponse} from '@/types/game';
import {GameSession} from '@/types/models/tables/Session';
import {User} from '@/types/models/tables/User';
import {PropsWithChildren, useEffect, useState} from 'react';
import Base from './Base';
import {useUserEventsStore} from '@/Store/user_events_store';
import { AudioManager } from '@/AudioManager';

type GameProps = PageProps<{
    user: User;
    userSession?: GameResponse;
    availableSessions?: GameSession[];
}>;

export default function Game(props: GameProps) {
    let {connectionState, latestMove} = useUserEvents();
    const updateGameState = useBoardState(s => s.updateGameState);

    const setLatestMove = useUserEventsStore(s => s.setLatestMove);

    useEffect(() => {
        if (latestMove) {
            updateGameState(latestMove.session);
        }
        setLatestMove(latestMove);
    }, [latestMove]);

    return <GameContent {...props} connectionState={connectionState} />;
}

type GameContentProps = GameProps & {
    connectionState: ConnectionState;
};

function GameContent({
    user,
    availableSessions,
    userSession,
    connectionState,
    flash,
}: GameContentProps) {
    const {currentSession, setUser, setCurrentSession, hasInterracted} =
        useAppState();
    const {showPopup} = usePopup();
    const session = currentSession ?? userSession?.session;
    const setGameState = useBoardState(s => s.setGameState);
    const updatePlayerState = useBoardState(s => s.updatePlayerState);
    const updateGameState = useBoardState(s => s.updateGameState);
    console.info('Initial server data:', {
        user,
        session,
        userSession,
        availableSessions,
    });

    useEffect(() => {
        setUser(user);

        if (session) {
            setCurrentSession(session);
            updateGameState(session);
        }
    }, [session]);

    useEffect(() => {
        if (userSession) {
            console.log('updating session player state');
            updatePlayerState(userSession.player);
        }
    }, [userSession]);

    useEffect(() => {
        if (session) {
            setGameState(session);
        }
    }, []);

    useEffect(() => {
        if (hasInterracted && session !== null && session?.session_state === 'playing') {
            AudioManager.getInstance().play('soundtrack-gameplay', true);
        }
    }, [session, hasInterracted]);

    if (session == null || session.session_state === 'waiting') {
        return (
            <Lobby
                user={user}
                availableSessions={availableSessions}
                connectionState={connectionState}
                serverMessage={flash}
            />
        );
    }

    return (
        <>
            <Experience />
        </>
    );
}

type LobbyProps = {
    user: User;
    connectionState: ConnectionState;
    availableSessions?: GameSession[];
    serverMessage?: string;
};

function Lobby({
    user,
    connectionState,
    availableSessions,
    serverMessage,
}: LobbyProps) {
    const {showPopup} = usePopup();
    const {user: appStateUser, setHasInterracted} = useAppState();
    const currentUser = appStateUser ?? user;

    useEffect(() => {
        if (
            (serverMessage && serverMessage === 'user_new') ||
            (currentUser && (currentUser.icon == null || currentUser.icon.length === 0))
        ) {
            showPopup('user-settings', {
                title: 'Create Your Profile',
                denyExit: true,
            }, () => setHasInterracted(true) );
        }
    }, []);

    return (
        <Base
            className="flex flex-col"
            promptIntializeMusic={(serverMessage !== 'user_new') && !!(currentUser?.icon && currentUser.icon.length > 0)}>
            <PopupContainer />
            <section className="pt-8 px-8 flex gap-8 grow items-start">
                <LobbiesControls games={availableSessions} />
                <div className="flex gap-4 flex-col">
                    <PlayerDetails />
                    <CurrentSessionDetails />
                </div>
            </section>

            <footer className="flex items-center gap-2 p-8">
                <Button
                    icon={Icon.cogs}
                    onClick={() =>
                        showPopup('settings', {
                            title: 'Settings',
                            showExit: true,
                        })
                    }
                />
                <Button
                    icon={Icon.info}
                    onClick={() =>
                        showPopup('credits', {title: 'Credits', showExit: true})
                    }
                />
                <Button
                    text="Give us a Star"
                    icon={Icon.github}
                    isLeft={true}
                    onClick={() =>
                        window.open(
                            'https://github.com/iee-ihu-gr-course1941/ADISE24_Cubus',
                            '_blank',
                        )
                    }
                />

                <p className="ml-auto">
                    Server Status: &nbsp;
                    <span
                        className={`${connectionState === 'connected' ? 'text-green-400' : 'text-custom-brown-500'}`}>
                        {connectionState}
                    </span>
                </p>
            </footer>
        </Base>
    );
}

type LobbiesControlsProps = {
    games?: GameSession[];
};

function LobbiesControls({games: _games}: LobbiesControlsProps) {
    const {showPopup} = usePopup();
    const {currentSession, setCurrentSession} = useAppState();
    const updatePlayerState = useBoardState(s => s.updatePlayerState);
    const updateState = useBoardState(s => s.updateState);
    const [games, setGames] = useState<GameSession[]>(_games ?? []);
    const [loading, setLoading] = useState(false);

    async function joinRandomGameCallback() {
        if (currentSession != null) return;

        let response = await Network.get<GameResponse>({
            url: route('lobby.match'),
        });
        if (!response) return;
        setCurrentSession(response.session);
        console.log(response);
        updateState(response.session, response.player);
        fetchLobbiesCallback();
    }

    async function joinGameCallback(gameId: string) {
        if (currentSession != null) return;

        let response = await Network.get<GameResponse>({
            url: route('lobby.join', gameId),
        });
        if (!response) return;
        setCurrentSession(response.session);
        console.log(response);
        updateState(response.session, response.player);
        fetchLobbiesCallback();
    }

    const fetchLobbiesCallback = async () => {
        if (loading) return;
        setLoading(true);
        let response = await Network.get<{sessions: GameSession[]}>({
            url: route('lobby.index'),
        });
        setLoading(false);
        if (response) {
            setGames(response.sessions);
        }
    };

    return (
        <section className="flex flex-col gap-4 grow h-full">
            <header className="flex gap gap-4">
                <Button
                    text="Create Game"
                    icon={Icon.largeStars}
                    onClick={() =>
                        showPopup('lobby-settings', {
                            title: 'Create Lobby',
                            showExit: true,
                        })
                    }
                />
                <Button
                    text="Join Random"
                    icon={Icon.random}
                    blocked
                    onClick={joinRandomGameCallback}
                />
                <Button
                    text="Refresh"
                    icon={Icon.refresh}
                    blocked={loading}
                    onClick={fetchLobbiesCallback}
                />
            </header>

            <List
                title="Available Games"
                emptyText="No Games Available"
                maxListHeight="70vh"
                className="w-full max-w-[980px] h-full"
                onClick={joinGameCallback}>
                {games && games.length > 0
                    ? games.map(game => (
                          <ListElement
                              key={game?.id}
                              value={game?.id?.toString() ?? ''}>
                              <div className="group px-8 py-4 flex items-center gap-4 w-full hover:bg-custom-purple-400 hover:text-custom-pink-50">
                                  <p className="grow text-start">{game.name}</p>
                                  <div className="flex gap-2 items-center">
                                      <SVG
                                          icon={Icon.crown}
                                          fill="fill-custom-gray-400 group-hover:fill-custom-pink-50"
                                      />
                                      <p>by {game.player_host?.name}</p>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                      <SVG
                                          icon={Icon.users}
                                          fill="fill-custom-gray-400 group-hover:fill-custom-pink-50"
                                      />
                                      <p>
                                          {game.current_player_count} of{' '}
                                          {game.player_count}
                                      </p>
                                  </div>
                              </div>
                          </ListElement>
                      ))
                    : null}
            </List>
        </section>
    );
}

function PlayerDetails() {
    const {user} = useAppState();
    const {showPopup} = usePopup();

    if (user == null) return;

    return (
        <div className="flex gap-4 items-start">
            <section className="flex flex-col gap-[9px] items-end">
                <TextTile>{user.name}</TextTile>
                <TextTile>
                    {user.points} <SVG icon={Icon.points} fill="fill-custom-gray-400" />
                </TextTile>
                <Button
                    icon={Icon.editProfile}
                    onClick={() =>
                        showPopup('user-settings', {
                            title: 'Edit Your Profile',
                            showExit: true,
                        })
                    }
                />
            </section>

            <Portrait url={user.icon} />
        </div>
    );
}

function CurrentSessionDetails() {
    const {currentSession} = useAppState();

    if (!currentSession) return;

    return (
        <div
            className="
            px-8 py-4

            rounded-[30px]
            border-t border-b-2
            bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800
            ">
            <p className="text-custom-pink-50 pb-4">
                Waiting for the game to begin
            </p>
            <div className="flex justify-between">
                <p>{currentSession.name}</p>
                <div className="flex gap-2 items-center">
                    <SVG
                        icon={Icon.users}
                        fill="fill-custom-gray-400 group-hover:fill-custom-pink-50"
                    />
                    <p>
                        {currentSession.current_player_count} of{' '}
                        {currentSession.player_count}
                    </p>
                </div>
            </div>
        </div>
    );
}

function TextTile({
    className,
    children,
}: PropsWithChildren<{className?: string}>) {
    return (
        <div
            className={`
            py-2 px-6
            flex gap-1 items-center w-fit
            border-t border-b-2 rounded-[20px]
            bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800

            ${className}
        `}>
            {children}
        </div>
    );
}
