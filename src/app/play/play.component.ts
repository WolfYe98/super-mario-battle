import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { Misile } from './models/misile';
import { PreferenceService } from '../shared/services/preference/preference.service';
import { Subscription } from 'rxjs';
import PREFERENCES, { PreferenceType } from '../shared/models/preferences';
import { UFO } from './models/ufo';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  host: { class: 'full-screen-component flex-center-row' }
})
export class PlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('misile') misileRef!: ElementRef;
  @ViewChild('board') boardRef!: ElementRef;
  @ViewChildren('ufoRef') ufosRef!: QueryList<ElementRef>;
  playButton: boolean = true;
  playAgainButton: boolean = false;
  misileObj: Misile = new Misile(this.misileRef);
  time: number = 0;
  punctuation: number = 0;
  ufoNumber: number = 0;
  ufos: UFO[] = [];
  private keydownHandler = (e: KeyboardEvent) => {
    this.moveMisile(e);
  }
  private misilInterval: any = null;
  private preferenceSubscription: Subscription;
  private timerInterval: any = null;

  constructor(private preferenceService: PreferenceService, private renderer: Renderer2) {
    this.preferenceSubscription = this.preferenceService.preferenceSubject$
      .subscribe((obj) => {
        this.preferenceChanged(obj);
      });
    this.initializeTime();
    this.initializeUfoNumber();
    this.initializeUfos();
  }
  private initializeUfos(): void {
    for (let i = 0; i < this.ufoNumber; i++) {
      this.ufos.push(new UFO(this.renderer));
    }
  }
  private initializeUfoNumber(): void {
    this.ufoNumber = (this.preferenceService.getIntegerItem(PREFERENCES.bombNumber) ?? 0);
  }
  private initializeTime(): void {
    this.time = this.getTimeFromPreferences();
  }
  private getTimeFromPreferences(): number {
    return (this.preferenceService.getIntegerItem(PREFERENCES.timeNumber) ?? 0) * 1000;
  }

  ngOnDestroy(): void {
    this.preferenceSubscription.unsubscribe();
  }
  private preferenceChanged(obj: PreferenceType): void {
    if (obj.key == PREFERENCES.bombNumber) {
      this.ufoNumber = obj.value ?? 0;
    } else {
      this.time = (obj.value ?? 0) * 1000;
    }
  }

  ngAfterViewInit(): void {
    this.misileObj = new Misile(this.misileRef);
    this.setUfoRefToUfo();
    this.initializeUfosInRandomPosition();
  }
  private setUfoRefToUfo(): void {
    let ufoIndex: number = 0;
    for (let ufoRef of this.ufosRef) {
      this.ufos[ufoIndex].setUfo(ufoRef);
      ufoIndex++;
    }
  }
  private initializeUfosInRandomPosition(): void {
    for (let ufo of this.ufos) {
      ufo.initializeRandomPosition();
    }
  }

  play(): void {
    this.setPlayTimer();
    for (let ufo of this.ufos) {
      ufo.moveUFO();
    }
    this.addKeyboardEvent();
    this.playButton = false;
    this.playAgainButton = false;
  }
  private setPlayTimer(): void {
    this.timerInterval = setInterval(() => {
      this.time -= 1000;
      if (this.time <= 0) {
        clearInterval(this.timerInterval);
        this.endGame();
      }
    }, 1000);
  }
  private endGame(): void {
    this.stopMisile();
    for (let ufo of this.ufos) {
      ufo.stopUFO();
    }
    document.removeEventListener('keydown', this.keydownHandler);
    this.playAgainButton = true;
    this.calculateFinalPunctuation();
  }
  private calculateFinalPunctuation(): void {
    this.punctuation = Math.floor(this.punctuation / Math.ceil(this.getTimeFromPreferences() / 6000));
    if (this.ufoNumber > 1) {
      this.punctuation -= (this.ufoNumber - 1) * 50;
    }
  }
  private addKeyboardEvent(): void {
    document.addEventListener('keydown', this.keydownHandler);
  }

  moveMisile(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowRight':
        e.preventDefault();
        if (this.misilInterval == null) {
          this.misileObj.setImgPreffix('right');
          this.misileObj.moveMisileRight();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (this.misilInterval == null) {
          this.misileObj.setImgPreffix('left');
          this.misileObj.moveMisileLeft();
        }
        break;
      case 'Space':
        e.preventDefault();
        if (this.misilInterval == null)
          this.shootMisile();
        break;
    }
  }
  private shootMisile(): void {
    if (this.misilInterval != null) {
      this.stopMisile();
    }
    this.misileObj.changeToMissileLaunchImage();
    this.misilInterval = setInterval(() => {
      let misilIsAtTop = this.misileObj.isMisileAtTheTopOfBoard();
      if (this.checkMisileHit()) {
        this.stopMisile();
      }
      if (misilIsAtTop) {
        this.stopMisile();
        this.punctuation = (this.punctuation - 25 < 0) ? 0 : this.punctuation - 25;
        this.misileObj.changeToMisileImage();
      } else {
        this.misileObj.moveMisileUp();
      }
    }, 5);
  }
  private checkMisileHit(): boolean {
    for (let ufo of this.ufos) {
      if (this.checkMisileHitUFO(ufo)) {
        this.ufoHasBeenHit(ufo);
        return true;
      }
    }
    return false;
  }
  private checkMisileHitUFO(ufo: UFO): boolean {
    let horizontalMiddleMisile = this.misileObj.getHorizontalMiddle();
    let horizontalUfoValues = ufo.getHorizontalValues();
    let horizontalHit = horizontalMiddleMisile >= horizontalUfoValues.left
      && horizontalMiddleMisile <= horizontalUfoValues.right;
    let verticalMisileValues = this.misileObj.getVerticalValues();
    let verticalUfoValues = ufo.getVerticalValues();
    let verticalHit =
      verticalMisileValues.top >= verticalUfoValues.top
      && verticalMisileValues.top <= verticalUfoValues.bottom
      && verticalMisileValues.bottom >= verticalUfoValues.top;
    return horizontalHit && verticalHit;
  }
  private ufoHasBeenHit(ufo: UFO): void {
    ufo.setHitImage();
    this.punctuation += 100;
  }
  private stopMisile(): void {
    clearInterval(this.misilInterval);
    this.misilInterval = null;
    this.misileObj.resetToBottom();
  }

  @HostListener('window:resize', ['$event'])
  windowResize(): void {
    this.misileObj.resizeMisile();
    for (let ufo of this.ufos) {
      ufo.resizeUFO();
    }
  }
  replayGame(): void {
    this.initializeUfosInRandomPosition();
    this.initializeTime();
    this.punctuation = 0;
    this.play();
  }
}


