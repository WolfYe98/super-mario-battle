import { ElementRef, Renderer2 } from "@angular/core";
import { GameBoard } from "./gameBoard";

export class UFO {
    ufoImgSrc: string = '../../assets/imgs/ufo.png';
    private ufoMovePxs: number = 5;
    private ufoRef: ElementRef;
    private ufoInterval: any = null;
    constructor(private renderer: Renderer2) {
        this.ufoRef = new ElementRef(this.renderer.createElement('img'));
    }
    setUfo(ufoRef: ElementRef): void {
        this.ufoRef = ufoRef;
    }
    initializeRandomPosition(): void {
        let ufoPos = this.getRandomUFOStartPosition();
        this.ufoRef.nativeElement.style.left = ufoPos + 'px';
        this.randomizeStartDirection();
    }
    randomizeStartDirection(): void {
        let randomNumber = Math.random();
        if (randomNumber > 0.5) {
            this.ufoMovePxs *= -1;
            this.changeUFOImgDirection();
        }
    }
    private getRandomUFOStartPosition(): number {
        let ufoWidth: number = this.getUFOWidth() + 2;
        let gameBoardMaxWidth = GameBoard.getGameBoardWidth() - ufoWidth;
        let gameBoardStartPos = 1;
        let diff = gameBoardMaxWidth - gameBoardStartPos;
        let randomNumber = Math.random();
        randomNumber = Math.floor(randomNumber * diff);
        randomNumber += gameBoardStartPos;
        if ((randomNumber + ufoWidth) > gameBoardMaxWidth) {
            randomNumber = GameBoard.getGameBoardWidth() - (ufoWidth + 8);
        }
        return randomNumber;
    }
    private getUFOWidth(): number {
        return this.ufoRef.nativeElement.width;
    }
    private getUFOLeftPxs(): number {
        return this.ufoRef.nativeElement.offsetLeft;
    }

    private changeUFOImgDirection() {
        if (this.ufoMovePxs < 0) {
            this.ufoRef.nativeElement.style.transform = 'scaleX(-1)';
        } else {
            this.ufoRef.nativeElement.style.transform = 'scaleX(1)';
        }
    }
    moveUFO(): void {
        this.ufoInterval = setInterval(() => {
            let hpos_ufo: number = this.getUFOLeftPxs();
            let width_ufo: number = this.getUFOWidth();
            let gameBoardWidth = GameBoard.getGameBoardWidth();
            let gameBoardStartPos = 2;
            if ((hpos_ufo + width_ufo + 8 > gameBoardWidth)
                || (hpos_ufo < gameBoardStartPos)) {
                this.ufoMovePxs *= -1;
                this.changeUFOImgDirection();
            }
            this.ufoRef.nativeElement.style.left = (hpos_ufo + this.ufoMovePxs) + 'px';
        }, 25);
    }
    stopUFO(): void {
        clearInterval(this.ufoInterval);
        this.ufoInterval = null;
    }
    resizeUFO(): void {
        let rightUFO = this.getUFOLeftPxs() + this.getUFOWidth() + 8;
        let rightBoard = GameBoard.getGameBoardWidth();
        if (rightUFO > rightBoard) {
            this.ufoRef.nativeElement.style.left = (rightBoard - (this.getUFOWidth() + 8)) + 'px';
        }
    }
    setHitImage(): void {
        this.ufoImgSrc = "../../assets/imgs/explosion.gif";
        setTimeout(() => {
            this.ufoImgSrc = '../../assets/imgs/ufo.png';
        }, 500);
    }
    getHorizontalValues() {
        return {
            left: this.getUFOLeftPxs(),
            right: this.getUFOLeftPxs() + this.getUFOWidth()
        }
    }
    getVerticalValues() {
        return {
            top: this.ufoRef.nativeElement.parentElement.offsetTop,
            bottom: this.ufoRef.nativeElement.parentElement.offsetTop + this.ufoRef.nativeElement.height
        }
    }
}