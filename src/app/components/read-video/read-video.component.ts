import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'services';
import { Answer, TriggerPoint, TriggerQuestion, VideoClass } from 'classes';
import { Observable, Subscription } from 'rxjs';

/* TEST DATA */
const TRIGGERS =  [
  new TriggerPoint({
    video: 'gver6t',
    uid: '124tyu',
    time: 12.00,
    question: new TriggerQuestion({
      uid: 'gb5ds746',
      question: 'Перескажите вкратце произведение Льва Николаевича Толстого «Война и мир».',
      answers: [
        new Answer({value: 'Variant -1'}),
        new Answer({value: 'Variant -2'}),
        new Answer({value: 'Вариант -3'})
      ],
      right: 0,
      type: 'Radio'
    }),
    disallowSeeking: false
  }),
  new TriggerPoint({
    video: 'gver6t',
    uid: '123qwe',
    time: 34.22,
    question: new TriggerQuestion({
      uid: 'igfh746',
      question: 'Перечислите названия звёзд и их расстояние до солнца в параллакс-секундах в радиусе 12 парсек.',
      answers: [
        new Answer({value: 'Variant 1'}),
        new Answer({value: 'Variant 2'}),
        new Answer({value: 'Варик 3'})
      ],
      right: 1,
      type: 'Radio'
    }),
    disallowSeeking: true
  }),
  new TriggerPoint({
    video: 'gver6t',
    uid: 'drtyh45',
    time: 53.65,
    question: new TriggerQuestion({
      uid: 'rghj747',
      question: 'Отсортируйте планеты в порядке удаленности от солнца.',
      answers: [
        new Answer({value: 'Очень-преочень длинный-предлинный вариант номер 0'}),
        new Answer({value: 'Variant 1'}),
        new Answer({value: 'Variant 2'}),
        new Answer({value: 'Variant 3'})
      ],
      right: 2,
      type: 'Checkbox'
    }),
    disallowSeeking: true
  })
];

@Component({
  selector: 'app-read-video',
  templateUrl: './read-video.component.html',
  styleUrls: ['./read-video.component.scss']
})
export class ReadVideoComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  activeVideo: VideoClass;
  videoUid = '';
  triggers: TriggerPoint[] = TRIGGERS;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) { }

  ngOnInit() {
    this.videoUid = this.route.snapshot.paramMap.get('id') !== null ? this.route.snapshot.paramMap.get('id') : '';
    this.subscriptions.push(
      this.videoService.getVideoById(this.videoUid)
        .subscribe((video: VideoClass) => this.activeVideo = video)
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
