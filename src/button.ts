import  styles  from './styles.module.css';
import { EBackGrounds, EIcons, ESounds } from "./types";

export type TbuttonConent = {
    name: string,
    background: EBackGrounds,
    icon: EIcons,
    sound: ESounds
}

class Button {

    public element: HTMLDivElement
    private iconPause: EIcons
    private iconDefault: EIcons
    private img: HTMLImageElement
    private isPaused: boolean

    static iconPause = EIcons.pause

    constructor(buttonContent: TbuttonConent, ){

        this.iconPause = Button.iconPause
        this.iconDefault = buttonContent.icon
        this.element = document.createElement('div')
        this.element.className = styles.sound_btn
        this.element.style.backgroundImage = `url(${buttonContent.background})`
        this.img = document.createElement('img')
        this.img.className = styles.icon_btn
        this.img.src = this.iconDefault.toString()
        this.element.append(this.img)

    }

    private changeIcon(){
        this.img.src = this.isPaused ?  this.iconPause.toString() : this.iconDefault.toString()
    }

    // true for pause
    togglePlayPause(isPaused: boolean){
        if(this.isPaused !== isPaused){
            this.isPaused = isPaused
            this.changeIcon()
        }
    }

}

export default Button