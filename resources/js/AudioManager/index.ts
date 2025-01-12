const SOUNDS = {
    'play': '/audio/play.wav',
    'block-pickup': '/audio/block-pickup.flac',
    'airship-engines': '/audio/airship-engines.wav',
    'airship-ping': '/audio/airship-ping.flac',
    'win': '/audio/win.wav',
    'hover': '/audio/button-hover.wav',
    'chimes-starry': '/audio/chimes-starry.flac',
    'chimes-success': '/audio/chimes-success.mp3',
    'click': '/audio/click.wav',
} as const;

const SOUNDTRACKS = {
    'soundtrack-lobby': '/audio/AvapXia-Skybound.mp3',
    'soundtrack-gameplay': '/audio/Xennial-The_Next_Level.mp3',
} as const;

export type Sounds = keyof typeof SOUNDS | keyof typeof SOUNDTRACKS;

type SoundInterfaces = { [Property in Sounds]?: HTMLAudioElement };

export class AudioManager {
    private static instance: AudioManager;
    private audioInterfaces: SoundInterfaces;
    private volume: number;

    private constructor() {
        console.info(`[AudioManager] Preparing to load a total of (${Object.keys(SOUNDS).length}) sounds: `, SOUNDS);
        this.audioInterfaces = {};
        this.volume = 0.5;

        for(const [name, file] of [...Object.entries(SOUNDS), ...Object.entries(SOUNDTRACKS)]) {
            let audioElement = new Audio(file);
            audioElement.load();
            this.audioInterfaces[name as Sounds] = audioElement;
        }
    }

    public static getInstance() {
        if(!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
            console.info('[AudioManager] Instance created:', AudioManager.instance);
        }

        return AudioManager.instance;
    }

    public setVolume(newVolume: number) {
        console.info('[AudioManager] Setting volume for all sounds to: ', newVolume);
        this.volume = newVolume;

        for(const curInterface of Object.values(this.audioInterfaces)) {
            curInterface.volume = newVolume;
        }
    }

    public stop(name: Sounds) {
        if(!this.audioInterfaces[name]) return;
        console.info('[AudioManager] Stopping ', name);

        this.audioInterfaces[name].pause();
        this.audioInterfaces[name].fastSeek(0);
    }

    public play(name: Sounds, loop: boolean, endCallback?: () => void) {
        if(!this.audioInterfaces[name]) return;
        console.info('[AudioManager] Playing sound:', name, { loop, endCallback: endCallback != null}, 'from interface:', this.audioInterfaces[name]);

        if(name.startsWith('soundtrack')) {
            for(const soundtrack of Object.keys(SOUNDTRACKS)) {
                this.audioInterfaces[soundtrack as Sounds]?.pause();
            }
        }

        this.audioInterfaces[name].volume = this.volume;
        this.audioInterfaces[name].loop = loop;
        this.audioInterfaces[name].play();

        this.audioInterfaces[name].onended = () => {
            this.audioInterfaces[name]!.onended = null;
            if(endCallback != null) endCallback();
        };
    }
}
