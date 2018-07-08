import { Injectable } from '@angular/core';
import { VideoClass } from 'classes';
import { VIDEO } from 'constants';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private videos: VideoClass[] = VIDEO;
  private activeVideo: VideoClass;

  constructor() {}

  public setActiveVideo(video: VideoClass): void {
    this.activeVideo = video;
  }

  public getActiveVideo(): Observable<VideoClass> {
    return of(this.activeVideo);
  }

  public getVideos(): Observable<VideoClass[]> {
    return of(this.videos);
  }

  getVideoById(id: string): Observable<VideoClass> {
    return of(this.videos.find(item => item.uid === id));
  }

}
