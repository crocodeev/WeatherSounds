import Button, { TbuttonConent } from './button';
import { EBackGrounds, EIcons, ESounds, TTransition } from './types';
import styles from './styles.module.css'
import Sound, { ESoundState } from './sound'


const buttonsNames: string[] = ['rain', 'summer', 'winter']

const buttons: TbuttonConent[] = buttonsNames.map((item) => {
    return {
        name: item,
        background: EBackGrounds[item as keyof typeof EBackGrounds],
        icon: EIcons[item as keyof typeof EIcons],
        sound: ESounds[item as keyof typeof ESounds]
    }
})


class ButtonBarState {
    static body: string = 'body'
    static buttonBar: HTMLElement = document.getElementById('#buttons_bar')
    
    static changeBackGround (backgroundImage: EBackGrounds) {
        const body = document.getElementsByTagName('body')[0]
        body.style.backgroundImage = `url(${backgroundImage})`
    }

    static appendButton(button: HTMLDivElement){
        this.buttonBar.append(button)
    }

    currentState: string
    buttonsContent: TbuttonConent[]
    transitions: { [key: string]: TTransition}

    ButtonCreator: new (buttonConent: TbuttonConent) => Button 
    SoundCreator: new (soundUrl: string) => Sound


    constructor(
        currentState: number,
        buttonsContent: TbuttonConent[],
        SoundCreator: new (soundUrl: string) => Sound,
        ButtonCreator: new (buttonConent: TbuttonConent) => Button 

    ) {
        this.currentState = buttonsContent[currentState].name
        this.ButtonCreator = ButtonCreator 
        this.SoundCreator = SoundCreator
        this.transitions = {}

        buttonsContent.forEach((item) => {

            const button = new this.ButtonCreator(item)
            const sound = new this.SoundCreator(item.sound.toString())
            
            ButtonBarState.appendButton(button.element)

            button.element.addEventListener('click', () => {
                this.dispath(item.name)
            })

            this.transitions[item.name] = {
                togglePausePlay: () => {
                    console.log("toggle pause play from state");
                    
                    if(sound.state === ESoundState.play){
                        sound.pause()
                        button.togglePlayPause(true)
                    }else if(sound.state === ESoundState.pause){
                        sound.play()
                        button.togglePlayPause(false)
                    }else{
                        sound.play()
                    }

                },
                stop: () => {
                    if(sound.state === ESoundState.pause){
                        sound.stop()
                        button.togglePlayPause(false)
                    }else if(sound.state === ESoundState.play){
                        sound.stop()
                    }
                }
            }

        })
    }

    public dispath(state: string){
        const transition = this.transitions[state]

        if(transition){

            if(this.currentState === state){
                transition.togglePausePlay()
            }else{
                console.log("To new");
                
                ButtonBarState.changeBackGround(EBackGrounds[state as keyof typeof EBackGrounds])
                this.transitions[this.currentState].stop()
                transition.togglePausePlay()
                this.currentState = state
            }
        }
    }


}

function initStyles(): void {
    const title = document.getElementById('#title')
    title.className = styles.title
    const buttonBar = document.getElementById('#buttons_bar')
    buttonBar.className = styles.bar_btn
    ButtonBarState.changeBackGround(EBackGrounds.summer)
}

function createVolumeControl() {
    const parent = document.getElementById('#volume')
    parent.className = styles.bar_btn
    const slider = document.createElement('input')
    slider.className = styles.slider
    slider.type = 'range'
    slider.min = "0"
    slider.max = "100"

    slider.addEventListener('input', (event: Event) => {
        const value = (event.target as HTMLInputElement).value
        Sound.setVolume = Number(value)
    })

    parent.append(slider)

}


initStyles()
const buttonBarStates = new ButtonBarState(1, buttons, Sound, Button)
createVolumeControl()
