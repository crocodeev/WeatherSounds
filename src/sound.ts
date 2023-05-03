export enum ESoundState{
    play = 1,
    pause,
    stop
}

class Sound {
    private ctx: AudioContext
    private volume: GainNode
    private soundUrl: string
    private bufferNode: AudioBufferSourceNode
    private _state: ESoundState


    static ctx: AudioContext = new AudioContext()
    static volume: GainNode = this.ctx.createGain()
    
    constructor(soundUrl: string){
        this.ctx = Sound.ctx
        this.soundUrl = soundUrl
        this.volume = Sound.volume
        this._state = ESoundState.stop
    }

    async play(){

        try {

            if(this._state === ESoundState.stop){

                const data = await fetch(this.soundUrl)
                const buffer = await data.arrayBuffer()
                const decoded = await this.ctx.decodeAudioData(buffer)
                
                this.bufferNode = this.ctx.createBufferSource()
                this.bufferNode.buffer = decoded
            
                this.bufferNode.connect(this.volume)
                this.volume.connect(this.ctx.destination)
                this.bufferNode.start()

                this._state = ESoundState.play
            }else if (this._state === ESoundState.pause) {
                this.ctx.resume()
                this._state = ESoundState.play
            }
            
        } catch (error) {
            
            console.log(error);
            
        }
        
    }

    pause(){
        if(this._state === ESoundState.play){
            this.ctx.suspend()
            this._state = ESoundState.pause
        }
    }

    stop(){
        this.bufferNode.stop()
        this._state = ESoundState.stop
        Sound.ctx.state === 'suspended' && Sound.ctx.resume() 
    }

    get state(){
        return this._state
    }
    
    public static set setVolume(value: number){

        const mapedValue = (value - 0) * (1 - 0) / (100 - 1)
        Sound.volume.gain.value = mapedValue
    }

}


export default Sound


