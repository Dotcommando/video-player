import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { VideoService } from 'services';
import { VideoClass } from 'classes';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  @ViewChild('dataTable') dataTable: ElementRef;

  videos: VideoClass[];
  mouseOvered: boolean[] = [];

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.videoService.getVideos().subscribe((videos: VideoClass[]) => this.videos = videos)
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
