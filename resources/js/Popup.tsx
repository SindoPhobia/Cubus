import {PropsWithChildren, useState} from 'react';
import {Button} from './Inputs/Button';
import {Icon, SVG} from './Icons/SVG';
import {create} from 'zustand';
import {TextInput} from './Inputs/TextInput';
import {Portrait} from './Icons/Portrait';
import {RadioButton} from './Inputs/RadioButton';
import {useAppState} from './Store/app_state';
import Network from './network';
import {User} from './types/models/tables/User';
import {GameSession} from './types/models/tables/Session';
import {AudioManager} from './AudioManager';
import {useGameSettings} from './Store/game_settings';
import {Checkbox} from './Inputs/Checkbox';
import {useBoardState} from './Store/board_state';
import {GameResponse} from './types/game';

type PopupDetails = PropsWithChildren<{
    title?: string;
    showExit?: boolean;
    denyExit?: boolean;
}>;

type PopupType =
    | 'mock-login'
    | 'credits'
    | 'user-settings'
    | 'lobby-settings'
    | 'settings'
    | 'prompt-audio';

type PopupState = {
    popup?: PopupType;
    popupDetails?: PopupDetails;
    popupCallback?: () => void;

    showPopup: (
        title: PopupType,
        details: PopupDetails,
        popupCallback?: () => void,
    ) => void;
    hidePopup: () => void;
};

export const usePopup = create<PopupState>(set => ({
    popup: undefined,
    popupDetails: {showExit: true},
    popupCallback: undefined,

    showPopup: (popup, details, popupCallback) =>
        set({popup, popupDetails: details, popupCallback}),
    hidePopup: () => set({popup: undefined, popupCallback: undefined}),
}));

export function PopupContainer({className}: {className?: string}) {
    const {popup, popupDetails, hidePopup} = usePopup();

    function onCancelCallbackStrict(event: React.MouseEvent) {
        if (event.target !== event.currentTarget || popupDetails?.denyExit)
            return;
        hidePopup();
    }

    if (popup == null) return;
    return (
        <div
            className={`fixed z-50 inset-0 bg-black/75 pt-[128px] ${className}`}
            onClick={onCancelCallbackStrict}>
            <div
                className="
                relative left-1/2 -translate-x-1/2

                w-fit min-w-[200px]
                rounded-[40px]
                text-bold text-custom-gray-400

                py-2

                border-t
                border-b-2
                bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800
                ">
                <header className="pl-[24px] pr-[16px] py-[8px] h-[62px] min-w-[300px] flex items-center">
                    <div>
                        {popupDetails?.title?.length !== 0 && (
                            <p className="font-bold text-custom-pink-50 px-4">
                                {popupDetails?.title}
                            </p>
                        )}
                    </div>
                    <div className="ml-auto">
                        {popupDetails?.showExit == true && (
                            <Button
                                icon={Icon.xmark}
                                color="red"
                                onClick={() => {
                                    if (popupDetails?.denyExit) return;
                                    hidePopup();
                                }}
                            />
                        )}
                    </div>
                </header>

                {popup === 'mock-login' && <PopupMockLogin />}
                {popup === 'credits' && <PopupCredits />}
                {popup === 'user-settings' && <PopupUserSettings />}
                {popup === 'lobby-settings' && <PopupLobbySettings />}
                {popup === 'settings' && <PopupSettings />}
                {popup === 'prompt-audio' && <PopupAudioPrompt />}
            </div>
        </div>
    );
}

function PopupMockLogin() {
    const [mockID, setMockID] = useState<string>();

    function onUpdate(event: React.KeyboardEvent<HTMLInputElement>) {
        const data = event?.currentTarget?.value ?? '';
        setMockID(oldData => data);
    }

    function onConfirm() {
        console.log('Attempting to login with mock id:', mockID);
        window.open(route('login.mock', mockID), '_self');
    }

    return (
        <>
            <div className="max-w-[600px] pl-10 pr-6 pt-2 pb-4">
                <div className="flex items-center gap-2 rounded-full border border-custom-purple-400 bg-custom-purple-600 px-2 py-1">
                    <SVG icon={Icon.infoCircle} fill="fill-custom-pink-50" />
                    <p className="text-custom-pink-50">
                        This is meant for testing purposes only.
                    </p>
                </div>

                <div className="pt-12 pb-6 flex flex-col gap-1">
                    <label className="text-custom-pink-50">Mock ID</label>
                    <TextInput
                        maxWidth="100%"
                        placeholder="Mock ID"
                        onUpdate={onUpdate}
                    />
                </div>

                <p className="pb-2">You can use whatever id you want.</p>
                <p>
                    If a user with that mock id doesn't exist it will create a
                    new user, otherwise it will connect you to an existing one.
                </p>
            </div>

            <footer className="py-4 px-6 flex justify-end gap-[12px]">
                <Button icon={Icon.check} text="Confirm" onClick={onConfirm} />
            </footer>
        </>
    );
}

function PopupCredits() {
    return (
        <div className="w-[540px] pl-10 pr-6 pt-2 pb-4">
            <p className="text-custom-pink-50">
                CUBUS was made as a project for the course ADISE.
            </p>
            <p>The team thanks you for trying the game out.</p>

            <p className="pt-4 pb-2 text-custom-pink-50">Lead Developers</p>
            <p className="pb-1">Tryfonas Mazarakis</p>
            <p className="pb-1">Pandeli Bezolli</p>

            <p className="pt-4 pb-2 text-custom-pink-50">2D Artists</p>
            <p className="pb-1">Tryfonas Mazarakis</p>
            <p className="pb-1">Pandeli Bezolli</p>

            <p className="pt-4 pb-2 text-custom-pink-50">3D Artists</p>
            <p className="pb-1">Tryfonas Mazarakis</p>

            <p className="pt-4 pb-2 text-custom-pink-50">
                Music and Sound Effects
            </p>
            <p className="pb-1">Pandeli Bezolli</p>
        </div>
    );
}

function PopupUserSettings() {
    // WARN: THE ICONS ARE MANUALLY INSERTED & VISIBLE IN THIS LIST
    // This is required to not unintentionally leak public icons, although it would be really nice to have a way to grab all these icons beforehand.
    const icons = [
        '/portraits/black-elegance.jpg',
        '/portraits/black-mlady.jpg',
        '/portraits/white-cowboy.jpg',
        '/portraits/white-wizard.jpg',
        '/portraits/yellow-elegance.jpg',
        '/portraits/yellow-mlady.jpg',
    ];

    const {hidePopup, popupCallback } = usePopup();
    const {user, setUser} = useAppState();
    console.info(
        'Opening user settings with data:',
        {user},
        'icon index: ',
        icons.indexOf(user!.icon!) + 1,
    );
    const [username, setUsername] = useState<string>(user?.name ?? '');
    const [icon, setIcon] = useState<number>(
        user?.icon ? icons.indexOf(user.icon) + 1 : 0,
    );
    const [errors, setErrors] = useState<{name?: string; icon?: string}>({});
    const AudioInterface = AudioManager.getInstance();

    function verifyUsername(username: string) {
        const pattern = new RegExp(/^[a-zA-Z-0-9_\-.!#$%^&*]*$/);

        if (username.length < 1) {
            setErrors(old => ({
                ...old,
                name: 'Your name must be at least 1 character long.',
            }));
            return false;
        }

        if (username.length > 80) {
            setErrors(old => ({
                ...old,
                name: 'Your name must be max 80 characters long.',
            }));
            return false;
        }

        if (!pattern.test(username)) {
            setErrors(old => ({
                ...old,
                name: "Don't use spaces between characters.\n Use alphanumerics and basic symbols.",
            }));
            return false;
        }

        setErrors(old => ({...old, name: undefined}));
        return true;
    }

    function verifyIcon(icon: number) {
        if (icon === 0) {
            setErrors(old => ({...old, icon: 'You need to select an icon'}));
            return false;
        }

        setErrors(old => ({...old, icon: undefined}));
        return true;
    }

    function onUsernameUpdateCallback(
        event: React.KeyboardEvent<HTMLInputElement>,
    ) {
        const data = event?.currentTarget.value ?? '';
        verifyUsername(data);

        setUsername(() => data);
    }

    async function onConfirmCallback() {
        console.info('Attempting to update user setting with: ', {
            username,
            icon,
        });
        if (!verifyUsername(username) || !verifyIcon(icon)) return;

        const result = await Network.post<User>({
            url: route('profile.store'),
            body: {name: username, icon},
        });
        let newUser = user ?? result!;
        if (user) {
            newUser.name = username;
            newUser.icon = icons[icon - 1];
        }

        if (result) setUser(newUser);
        if(popupCallback) popupCallback();
        hidePopup();
    }

    function onPortraitSelectCallback(index: number) {
        AudioInterface.play('click', false);
        setIcon(index + 1);
    }

    return (
        <>
            <div className="max-w-[600px] pl-10 pr-6 pt-2 pb-4">
                <div className="pb-6 flex flex-col gap-1">
                    <label className="pb-1 text-custom-pink-50">
                        Your Username
                    </label>
                    <TextInput
                        maxWidth="100%"
                        placeholder="best_cubus_player"
                        onUpdate={onUsernameUpdateCallback}
                        defaultValue={username}
                        error={errors.name}
                    />
                </div>

                <div className="pb-6 flex flex-col gap-1">
                    <label className="pb-1 text-custom-pink-50">
                        Your Icon
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {icons.map((curIcon, index) => (
                            <button
                                key={curIcon}
                                className={`rounded-[25px] ${index + 1 !== icon ? 'shadow-portrait' : 'shadow-portrait-hover'} hover:shadow-portrait-hover`}
                                onMouseEnter={() =>
                                    AudioInterface.play('hover', false)
                                }
                                onClick={() => onPortraitSelectCallback(index)}>
                                <Portrait url={curIcon} />
                            </button>
                        ))}
                    </div>

                    {errors.icon && (
                        <div className="flex items-center gap-4 rounded-full border border-red-400 bg-red-950 px-4 py-1">
                            <SVG icon={Icon.infoCircle} fill="fill-red-400" />
                            <p className="text-red-400 whitespace-pre-line">
                                {errors.icon}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <footer className="py-4 pl-10 pr-6 flex justify-end gap-[12px]">
                <Button
                    icon={Icon.check}
                    text="Confirm"
                    onClick={onConfirmCallback}
                />
            </footer>
        </>
    );
}

function PopupLobbySettings() {
    const [lobbyName, setLobbyName] = useState<string>('');
    const [playerCount, setPlayerCount] = useState<number>(2);
    const {setCurrentSession} = useAppState();
    const [errors, setErrors] = useState<{general?: string; name?: string}>({});
    const {hidePopup} = usePopup();
    const updateState = useBoardState(s => s.updateState);

    function verifyName(name: string) {
        const pattern = new RegExp(/^[ a-zA-Z-0-9_\-.!#$%^&*]*$/);

        if (name.length < 1) {
            setErrors(old => ({
                ...old,
                name: 'Your name must be at least 1 character long.',
            }));
            return false;
        }

        if (name.length > 80) {
            setErrors(old => ({
                ...old,
                name: 'Your name must be max 80 characters long.',
            }));
            return false;
        }

        if (!pattern.test(name)) {
            setErrors(old => ({
                ...old,
                name: 'Use alphanumerics, basic symbols and spaces only.',
            }));
            return false;
        }

        setErrors(old => ({...old, name: undefined}));
        return true;
    }

    function onLobbyNameChangeCallback(
        event: React.KeyboardEvent<HTMLInputElement>,
    ) {
        const data = event?.currentTarget?.value ?? '';
        verifyName(data);
        setLobbyName(data);
    }

    function onPlayerCountChange(players: number) {
        console.info('Attempting to change player count to: ', players);
        setPlayerCount(players);
    }

    async function onConfirmCallback() {
        console.info('Attempting to create lobby with:', {
            lobbyName,
            playerCount,
        });
        if (!verifyName(lobbyName)) return;
        const result = await Network.post<GameResponse & {message?: string}>({
            url: route('lobby.store'),
            body: {name: lobbyName, player_count: playerCount},
        });

        if (!result) {
            hidePopup();
            return;
        }

        if (result?.message != null) {
            setErrors(old => ({...old, general: result.message}));
            return;
        } else {
            setErrors(old => ({...old, general: undefined}));
        }
        setCurrentSession(result.session);
        updateState(result.session, result.player);
        hidePopup();
    }

    return (
        <>
            <div className="w-[550px] pl-10 pr-6 pt-2 pb-4">
                {errors.general && (
                    <div className="flex items-center gap-4 rounded-full border border-red-400 bg-red-950 px-4 py-1 mb-4">
                        <SVG icon={Icon.infoCircle} fill="fill-red-400" />
                        <p className="text-red-400 whitespace-pre-line">
                            {errors.general}
                        </p>
                    </div>
                )}

                <div className="pb-6 flex flex-col gap-1">
                    <label className="pb-1 text-custom-pink-50">
                        Lobby's Name
                    </label>
                    <TextInput
                        maxWidth="100%"
                        placeholder="Friends only"
                        onUpdate={onLobbyNameChangeCallback}
                        error={errors.name}
                    />
                </div>

                <div className="pb-6 flex flex-col gap-2">
                    <label className="pb-2 text-custom-pink-50">
                        Player Count
                    </label>
                    <div className="flex gap-4">
                        <Checkbox
                            name="player-count"
                            value="2"
                            checked={playerCount === 2}
                            label="2 Players"
                            onClick={() => onPlayerCountChange(2)}
                        />
                        <Checkbox
                            name="player-count"
                            value="4"
                            label="4 Players"
                            checked={playerCount === 4}
                            onClick={() => onPlayerCountChange(4)}
                        />
                    </div>
                </div>
            </div>

            <footer className="py-4 pl-10 pr-6 flex justify-end gap-[12px]">
                <Button
                    icon={Icon.check}
                    text="Confirm"
                    onClick={onConfirmCallback}
                />
            </footer>
        </>
    );
}

function PopupSettings() {
    const hidePopup = usePopup(s => s.hidePopup);
    const {setGridHelper, gridHelper, enableLights, setEnableLights,enablePerf,setEnablePerf} =
        useGameSettings();
    const audioInterface = AudioManager.getInstance();

    function onLogoutCallback() {
        window.open(route('logout'), '_self');
    }

    // This doesn't represent the final volume. It's a helper to display the visual of the volume
    const [volume, setVolume] = useState<number>(0.5);

    function toggleVolumeCallback() {
        const newVolume = (volume + 0.5) % 1.5;
        setVolume(newVolume);

        audioInterface.setVolume(newVolume);
    }

    return (
        <div className="w-[540px] pl-10 pr-6 pt-2 pb-4 flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-4">
                <Checkbox
                    name="Lights"
                    value="lights"
                    label="Lights on"
                    checked={enableLights}
                    onClick={() => {
                        setEnableLights(!enableLights);
                    }}
                />
                <Checkbox
                    name="Grid Helper"
                    value="grid"
                    label="Enable Grid Helper"
                    checked={gridHelper}
                    onClick={() => {
                        setGridHelper(!gridHelper);
                    }}
                />
                <Checkbox
                    name="Performance Metrics"
                    value="metrics"
                    label="Enable Performance Metrics"
                    checked={enablePerf}
                    onClick={() => {
                        setEnablePerf(!enablePerf);
                    }}
                />

                <Button text="Volume" icon={ volume === 0 ? Icon.volumeMuted : volume <= 0.5 ? Icon.volumeLow : Icon.volumeHigh } onClick={toggleVolumeCallback} />
            </div>
            <div className="flex justify-between">
                <Button text="Logout" color="red" onClick={onLogoutCallback} />
                <Button
                    text="Apply & Close"
                    color="default"
                    onClick={hidePopup}
                />
            </div>
        </div>
    );
}

function PopupAudioPrompt() {
    const hidePopup = usePopup(s => s.hidePopup);
    const setHasInterracted = useAppState(s => s.setHasInterracted);
    const AudioInterface = AudioManager.getInstance();

    function onExitPopup() {
        setHasInterracted(true);
        hidePopup();
    }

    return (
        <div className="w-[540px] pl-10 pr-6 pt-2 pb-4 font-bold">
            <p className="pb-8">
                This game contains audio. Would you like to enable music?
            </p>

            <div className="flex items-center justify-end gap-4">
                <Button
                    text="No"
                    color="red"
                    onClick={() => {
                        AudioInterface.setVolume(0);
                        onExitPopup();
                    }}
                />
                <Button text="Yes" onClick={onExitPopup} />
            </div>
        </div>
    );
}
