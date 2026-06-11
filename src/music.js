import { globalScene } from "./global-scene.js"
export class AddSound {
    constructor(src) {
        this.audio = new Audio(src);
        this.audio.preload = 'auto';
    }
    play() {
        this.audio.currentTime = 0;
        this.audio.play().catch(e => console.log("Play failed:", e));
    }
}
class MusicPlayer {
    setup() {
        this.bgAudioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.bgmGainNode = null
        this.bgAudioBuffers = new Map()
        this.bgAudioSource = null;
        this.bgLoadPromise = Promise.resolve()

        this.currentLoadController = null
        this.cacheOrder = []
        this.bgmMaxCache = 6
        this.isPlaying = false
        this.musicBg = null
        this.bgmPauseTiming = 0;
    }
    async playBgm(music) {
        const src = music.SRC

        if ((this.musicBg === src || globalScene.musicForced) && this.isPlaying) return
        console.log("tryPlay", src, this.musicBg, globalScene.musicBg)

        this.isPlaying = true
        this.musicBg = src
        this.currentLoadController?.abort()
        this.bgLoadPromise = Promise.resolve()
        await this.bgLoadPromise.catch(() => {})

        this.currentLoadController = new AbortController()
        let audioBuffer = this.bgAudioBuffers.get(src)
        if (!audioBuffer) {
            try {
              this.bgLoadPromise = this.loadBgAudioBuffer(src, this.currentLoadController.signal)
              audioBuffer = await this.bgLoadPromise
            } catch (e) {
              if (e.name === 'AbortError') return
              throw e
            }
        } else {
            this.cacheOrder.splice(this.cacheOrder.indexOf(src), 1)
            this.cacheOrder.push(globalScene?.musicBg)
            console.log(globalScene?.musicBg?.SRC, this.cacheOrder, this.bgAudioBuffers)
        }
        globalScene.musicBg = music
        this.bgAudioSource?.stop()
        this.bgAudioSource = null

        this.bgmGainNode = this.bgAudioContext.createGain()
        this.bgmGainNode.connect(this.bgAudioContext.destination)
        this.bgAudioSource = this.bgAudioContext.createBufferSource()
        this.bgAudioSource.buffer = audioBuffer
        this.bgAudioSource.connect(this.bgmGainNode)
        this.bgAudioSource.loop = true
        this.bgAudioSource.loopStart = music.LOOP ?? 0
        if (music.END) this.bgAudioSource.loopEnd = music.END
        this.bgAudioSource.start(0, music.START ?? 0)
    }

    async loadBgAudioBuffer(src, signal) {
      const response = await fetch(src, { signal })
      const arrayBuffer = await response.arrayBuffer()
      return await this.bgAudioContext.decodeAudioData(arrayBuffer)
    }
}

export const musicPlayer = new MusicPlayer()