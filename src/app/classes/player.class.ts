export class OutAction {
  action: 'play' | 'pause' | 'seek' | '';
  params?: any;
}

export interface OutActionComplete {
  action: 'play' | 'pause' | 'seek' | '';
  statusWas: 'play' | 'pause' | 'seek' | '';
  statusNow: 'play' | 'pause' | 'seek' | '';
  time: number; // s
  result: boolean;
}

export interface PlayerStatus {
  status: 'play' | 'pause' | 'seek' | '';
  time: number; // s
  volume: number;
  fullscreen: boolean;
  mute: boolean;
  duration: number;
  definedWidth: number;
  definedHeight: number;
  nativeWidth: number;
  nativeHeight: number;
}
