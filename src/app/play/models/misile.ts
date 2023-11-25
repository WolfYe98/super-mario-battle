import { ElementRef, Renderer2 } from "@angular/core";
import { GameBoard } from "./gameBoard";

export class Misile {
    static PIXEL_LEFT_RIGHT = 5;
    static PIXEL_UP = 5;
    private imgPrefix: string = "right";
    private imgSuffix: string = "1";
    private misileRef: ElementRef;
    private imgSrcHead: string = "../../assets/imgs/";
    private imgSrcTail: string = ".png";
    private bottomPxs: number = 0;
    imgSrc: string = this.imgSrcHead + this.imgPrefix + this.imgSuffix + this.imgSrcTail;

    constructor(misileRef: ElementRef, private renderer: Renderer2) {
        this.misileRef = misileRef;
    }
    moveMisileRight(): void {
        let misileLeftPxs: number = this.getMisileLeftPixels();
        let misileWidth: number = this.getMisileWidth();
        let gameBoardWidth = GameBoard.getGameBoardWidth();
        if ((misileLeftPxs + misileWidth + 8) < gameBoardWidth) {
            this.changeImgInMovement();
            this.renderer.setStyle(this.misileRef.nativeElement, 'left', (misileLeftPxs + Misile.PIXEL_LEFT_RIGHT) + 'px');
        }
    }
    moveMisileLeft(): void {
        let misileLeftPxs = this.getMisileLeftPixels();
        if (misileLeftPxs > 2) {
            this.changeImgInMovement();
            this.renderer.setStyle(this.misileRef.nativeElement, 'left', (misileLeftPxs - Misile.PIXEL_LEFT_RIGHT) + 'px');
        }
    }
    private changeImgInMovement(): void {
        this.changeImgSuffix();
        this.imgSrc = this.imgSrcHead + this.imgPrefix + this.imgSuffix + this.imgSrcTail;
    }
    changeImgSuffix(): void {
        let suffixNumber: number = parseInt(this.imgSuffix);
        suffixNumber = (suffixNumber + 1) % 3;
        if (suffixNumber == 0) {
            suffixNumber = 1;
        }
        this.imgSuffix = suffixNumber.toString();
    }
    private getMisileLeftPixels(): number {
        return this.misileRef.nativeElement.offsetLeft;
    }
    private getMisileWidth(): number {
        return this.misileRef.nativeElement.width;
    }
    setImgPreffix(prefix: 'left' | 'right'): void {
        this.imgPrefix = prefix;
    }
    resetToBottom(): void {
        this.bottomPxs = 0;
        this.renderer.setStyle(this.misileRef.nativeElement, 'bottom', '0px');
        this.changeToMisileImage();
    }
    changeToMissileLaunchImage(): void {
        this.imgSrc = this.imgSrcHead + this.imgPrefix + 'Up' + this.imgSrcTail;
    }
    changeToMisileImage(): void {
        this.imgSrc = this.imgSrcHead + this.imgPrefix + '1' + this.imgSrcTail;
    }
    isMisileAtTheTopOfBoard(): boolean {
        return this.misileRef.nativeElement.offsetTop <= 0;
    }
    moveMisileUp(): void {
        this.bottomPxs += Misile.PIXEL_UP;
        this.renderer.setStyle(this.misileRef.nativeElement, 'bottom', this.bottomPxs + 'px');
    }
    resizeMisile(): void {
        let gameBoardWidth: number = GameBoard.getGameBoardWidth();
        let misileWidth: number = this.getMisileWidth();
        if ((this.getMisileLeftPixels() + misileWidth + 8) >= gameBoardWidth - 1) {
            this.renderer.setStyle(this.misileRef.nativeElement, 'left', (gameBoardWidth - misileWidth) + 'px');
        }
    }
    getHorizontalMiddle() {
        return (this.getMisileLeftPixels() + (this.getMisileWidth() + this.getMisileLeftPixels())) / 2;
    }
    getVerticalValues() {
        return {
            top: this.misileRef.nativeElement.offsetTop,
            bottom: this.misileRef.nativeElement.offsetTop + this.misileRef.nativeElement.height
        }
    }
}