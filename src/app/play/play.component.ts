import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AcceptCancelModalComponent } from '../modalComponents/accept-cancel-modal/accept-cancel-modal.component';
import PREFERENCES, { PreferenceType } from '../shared/models/preferences';
import { CustomToastService } from '../shared/services/customtoast/custom-toast.service';
import { PreferenceService } from '../shared/services/preference/preference.service';
import { RecordService } from '../shared/services/record/record.service';
import { SessionStorageService } from '../shared/services/sessionstorage/session-storage.service';
import { Misile } from './models/misile';
import { UFO } from './models/ufo';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  host: { class: 'full-screen-component flex-center-row' }
})
export class PlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('misile') misileRef!: ElementRef;
  @ViewChildren('ufoRef') ufosRef!: QueryList<ElementRef>;
  playButton: boolean = true;
  playAgainButton: boolean = false;
  misileObj: Misile;
  time: number = 0;
  punctuation: number = 0;
  ufoNumber: number = 0;
  ufos: UFO[] = [];
  private originalTime: number = 0;
  private rendererListener: any = null;
  private misilInterval: any = null;
  private preferenceSubscription: Subscription;
  private timerInterval: any = null;
  private recordSubscription: Subscription = new Subscription();

  constructor(private preferenceService: PreferenceService, private renderer: Renderer2, private modal: NgbModal,
    private sessionStorageService: SessionStorageService, private recordService: RecordService, private toast: CustomToastService) {
    this.preferenceSubscription = this.preferenceService.preferenceSubject$
      .subscribe((obj) => {
        this.preferenceChanged(obj);
      });
    this.misileObj = new Misile(this.misileRef, this.renderer);
    this.initializeTime();
    this.initializeUfoNumber();
    this.initializeUfos();
  }
  ngOnDestroy(): void {
    this.preferenceSubscription.unsubscribe();
    this.recordSubscription.unsubscribe();
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
    this.originalTime = this.time;
  }
  private getTimeFromPreferences(): number {
    return (this.preferenceService.getIntegerItem(PREFERENCES.timeNumber) ?? 0) * 1000;
  }

  private preferenceChanged(obj: PreferenceType): void {
    if (obj.key == PREFERENCES.bombNumber) {
      this.ufoNumber = obj.value ?? 0;
    } else {
      this.time = (obj.value ?? 0) * 1000;
      this.originalTime = (obj.value ?? 0) * 1000;
    }
    if (this.ufoNumber == 0 && this.originalTime == 0) {
      this.playButton = false;
      this.playAgainButton = false;
    }
  }

  ngAfterViewInit(): void {
    this.misileObj = new Misile(this.misileRef, this.renderer);
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
  private addKeyboardEvent(): void {
    this.rendererListener = this.renderer.listen(document, 'keydown', e => this.moveMisile(e));
  }

  private endGame(): void {
    this.stopMisile();
    for (let ufo of this.ufos) {
      ufo.stopUFO();
    }
    this.rendererListener();
    this.playAgainButton = true;
    this.calculateFinalPunctuation();
    this.openSaveResultModalIfHasUser();
  }
  private openSaveResultModalIfHasUser(): void {
    let hasToken: boolean = this.sessionStorageService.sessionHasAuthToken();
    if (hasToken && this.noZeroValues()) {
      this.openModal();
    }
  }
  private noZeroValues(): boolean {
    return this.punctuation != 0 && this.originalTime > 0 && this.ufoNumber > 0;
  }
  private openModal(): void {
    const modalRef = this.modal.open(AcceptCancelModalComponent);
    modalRef.componentInstance.title = "Save Result";
    modalRef.componentInstance.message = "Do you want to save the result of this game?";
    modalRef.result.then(
      (shouldSaveResult) => this.saveResult(shouldSaveResult)
    );
  }
  private saveResult(shouldSaveResult: boolean): void {
    if (shouldSaveResult) {
      this.recordSubscription = this.recordService.saveRecord({
        punctuation: this.punctuation,
        ufos: this.ufoNumber,
        disposedTime: this.originalTime / 1000,
      }).subscribe({
        next: () => this.toast.showSuccessToast({ title: 'Result', message: 'Result successfully saved.' }),
        error: (err) => this.treatError(err)
      });
    }
  }
  private treatError(err: HttpErrorResponse) {
    console.error('Play:', err);
    switch (err.status) {
      case 400:
        this.toast.showErrorToast({ title: 'Internal error', message: 'Some parameter is missing, please contact to support.' });
        break;
      case 500:
        this.toast.showErrorToast({ title: 'Server error', message: 'Some error happens in the server.' });
        break;
    }
  }
  private calculateFinalPunctuation(): void {
    this.punctuation = Math.floor(this.punctuation / Math.ceil(this.originalTime / 60000));
    if (this.ufoNumber > 1) {
      this.punctuation -= (this.ufoNumber - 1) * 50;
    }
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