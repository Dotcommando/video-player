import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  Renderer,
  ViewChild,
  EventEmitter,
  HostListener
} from '@angular/core';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { VideoClass, TriggerPoint, PlayerStatus } from 'classes';
import { OutAction, OutActionComplete } from 'classes';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() video: VideoClass;
  @Input() width = 400;
  @Input() height = 225;
  @Input() triggers: TriggerPoint[] = [];
  @Input() showControlsAlways = false; // Не скрывать контролы никогда.
  _outAction: OutAction;
  @Input('outAction')
  set outAction(val: OutAction) {
    if (val !== undefined) {
      this._outAction = val;
      this.outActionController(val);
    }
  }
  _sendStatus: number;
  @Input('sendStatus')
  set sendStatus(val: number) {
    if (val !== undefined && val !== 0) {
      this._sendStatus = val;
      this.onSendStatus();
    }
  }
  get sendStatus() {
    return this._sendStatus;
  }
  @Output() timelineChange = new EventEmitter<number>();
  @Output() outActionChange = new EventEmitter<OutActionComplete>();
  @Output() requestStatus = new EventEmitter<PlayerStatus>();
  @ViewChild('placeholder') placeholder: ElementRef;
  @ViewChild('outer') outer: ElementRef;
  @ViewChild('player') player: ElementRef;
  @ViewChild('timeline') timeline: ElementRef;
  @ViewChild('timelineMarks') timelineMarks: ElementRef;

  key: string = this.makeID();

  isHTMLVideoElement = false;
  p: HTMLVideoElement; // ссылка на элемент #player.
  duration = 0; // Длительность в s.
  mute = false; // Отключен звук.
  volumeValue: number; // Звук, от 0.00 до 1.00.
  isFullscreen: boolean = screenfull.isFullscreen; // Контроль, открыт ли
                                                   // плеер на всю ивановскую.
  currentTime = 0; // Текущая позиция в s.
  timeAccuracy = 100; // Точность округления времени,
                      // т.к. video-элемент может отдать значение
                      // типа 45.234572, а у Material Slider
                      // step задан 0.01.
  showControls = false; // Показывать контролы плеера.
  showControlsTimer: number; // Глобальный таймер
                             // на отключение показа контролов.
  deviceIsTouchable = ('ontouchstart' in window); // Проверка на touchable устройство.
  timeControl = 0; // Глобальный таймер контроля воспроизведения.
  scaleHeight = 6; // Высота шкалы с метками.
  scale: CanvasRenderingContext2D; // Холст с метками на шкале воспроизведения.

  _playPause = false;
  set playPause(val: boolean) {
    if (val) {
      this.p.play();
      this.timeControl = setInterval(() => {
        if (this.p.currentTime < this.p.duration) {
          this.currentTime = this.p.currentTime;
          this.onChangeTimeline();
        } else {
          this.currentTime = 0;
          clearInterval(this.timeControl);
          setTimeout(() => { // снимаем чекбокс, чтобы отжать кнопку play/pause
            this.playPause = false;
          });
        }
      }, 10);
    } else {
      this.p.pause();
      clearInterval(this.timeControl);
    }
    this._playPause = val;
  }
  get playPause(): boolean {
    return this. _playPause;
  }

  constructor(private renderer: Renderer) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.isFullscreen) {
      return;
    }
    this.showControls = true;
    clearTimeout(this.showControlsTimer);
  }

  @HostListener('mouseout') onMouseOut() {
    if (this.isFullscreen) {
      return;
    }
    clearTimeout(this.showControlsTimer);
    this.showControls = true;
    this.showControlsTimer = setTimeout(() => {
      this.showControls = false;
    }, 5000);
  }

  @HostListener('click', ['$event']) onClick(event) {
    clearTimeout(this.showControlsTimer);
    this.showControls = true;
    this.showControlsTimer = setTimeout(() => {
      this.showControls = false;
    }, 5000);
  }

  defineType(src: string): string {
    const ext = src.substr(-4, 4);
    if (ext === '.mp4' || ext === 'mpeg') {
      return 'video/mp4';
    }
    if (ext === '.ogg' || ext === '.ogv' || ext === '.ogm') {
      return 'video/ogg';
    }
    if (ext === 'webm') {
      return 'video/webm';
    }
    return '';
  }

  prepareVideo() {
    this.p.volume = 0.25;
    this.scale = this.timelineMarks.nativeElement.getContext('2d');
    // На загрузку метаданных, иначе длительность будет 0.
    this.p.onloadedmetadata = () => {
      this.duration = this.p.duration;
      this.onSendStatus();
      if (this.triggers.length > 0) {
        this.renderCanvasScale();
      }
    };
  }

  /**
   * В метку контрола звука передаёт округлённое до целого значение.
   *
   * @param {number | null} value
   * @returns {any}
   */
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    return Math.round(value * 100);
  }

  /**
   * Передаёт изменения звука в video объект.
   *
   * @param {} val
   */
  onVolumeChange(val: MatSliderChange) {
    this.p.volume = val.value;
  }

  /**
   * Открывает видосик на всю ивановскую.
   */
  onFullScreenModeChange() {
    if (this.deviceIsTouchable && !this.showControls) { return; }
    if (screenfull.enabled) {
      screenfull.toggle(this.outer.nativeElement);
      setTimeout(() => {
        this.renderCanvasScale()
      }, 800);
    }
  }

  /**
   * Делает уникальную строку для каждого запуска компонента.
   * Теперь уже не нужен. Просто так оставил.
   *
   * @returns {string}
   */
  makeID() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Округляет с заданной точностью, например, чтобы округлить до 0.5,
   * надо задать accuracy: 2.
   * Если accuracy === 25, то точность округления === 0.04
   *
   * @param {number} val
   * @param {number} accuracy
   * @returns {number}
   */
  roundUpTo(val: number, accuracy: number = 25): number {
    return Math.round(val * accuracy) / accuracy;
  }

  onTimeSeekChange(event: MatSliderChange) {
    if (this.deviceIsTouchable && !this.showControls) { return; }
    this.p.currentTime = this.roundUpTo(event.value);
    this.currentTime = this.p.currentTime;
    this.timelineChange.emit(this.p.currentTime);
  }

  onChangeTimeline() {
    this.timelineChange.emit(this.p.currentTime);
  }

  outActionController(val: OutAction): boolean {
    if (val === undefined || val === null) {
      return false;
    }
    const result: OutActionComplete = {
      action: '',
      statusWas: '',
      statusNow: '',
      time: -1,
      result: false
    };
    result.action = val.action;
    const timeBefore = this.currentTime;
    if (val.action === 'play') {
      if (this.playPause === false) {
        result.statusWas = 'pause';
        this.playPause = true;
        result.statusNow = 'play';
      }
      if (this.playPause === true) {
        result.statusWas = 'play';
        result.statusNow = 'play';
      }
    }
    if (val.action === 'pause') {
      if (this.playPause === false) {
        result.statusWas = 'pause';
        result.statusNow = 'pause';
      }
      if (this.playPause === true) {
        result.statusWas = 'play';
        this.playPause = false;
        result.statusNow = 'pause';
      }
    }
    if (val.action === 'seek') {
      if (val.params !== undefined && val.params !== null) {
        if (typeof(val.params.goto) === 'number') {
          result.statusWas = (this.playPause === true) ? 'play' : 'pause';
          this.p.currentTime = val.params.goto;
          result.statusNow = (this.playPause === true) ? 'play' : 'pause';
        }
        if (typeof(val.params.add) === 'number') {
          result.statusWas = (this.playPause === true) ? 'play' : 'pause';
          this.p.currentTime += val.params.add;
          result.statusNow = (this.playPause === true) ? 'play' : 'pause';
        }
      }
    }
    this.p.currentTime = this.roundUpTo(this.p.currentTime, 100);
    this.currentTime = this.p.currentTime;
    result.time = this.currentTime;
    this.renderCanvasScale();
    if (val.action === 'play' || val.action === 'pause') {
      result.result = val.action === result.statusNow;
    }
    if (val.action === 'pause') {
      result.result = timeBefore !== result.time;
    }
    this.outActionChange.emit(result);
    return true;
  }

  onSendStatus() {
    if (!this.isHTMLVideoElement) {
      this.requestStatus.emit(undefined);
      return;
    }
    const status: PlayerStatus = {
      status: (this.playPause) ? 'play' : 'pause',
      time: this.p.currentTime,
      volume: this.p.volume,
      fullscreen: this.isFullscreen,
      mute: this.mute,
      duration: this.duration,
      definedWidth: this.width,
      definedHeight: this.height,
      nativeWidth: this.p.videoWidth,
      nativeHeight: this.p.videoHeight
    };
    this.requestStatus.emit(status);
  }

  renderCanvasScale() {
    this.scale.fillStyle = 'rgb(255, 204, 0)';
    this.scale.clearRect(0, 0, this.p.offsetWidth - 10, this.scaleHeight);
    const part = this.p.offsetWidth / this.p.duration;
    const triggersNumber = this.triggers.length;
    for (let i = 0; i < triggersNumber; i++) {
      const time = this.triggers[i].time;
      this.scale.fillRect(this.roundUpTo(time, 100) * part - 2, 0, 4, this.scaleHeight);
    }
  }

  ngOnInit() {
    const player = this.player.nativeElement;
    this.isHTMLVideoElement = player instanceof HTMLVideoElement;
    if (this.isHTMLVideoElement) {
      this.p = player;
      this.p.controls = false;
      this.prepareVideo();

      screenfull.on('change', () => {
        this.isFullscreen = screenfull.isFullscreen;
      });
    }
  }

}
