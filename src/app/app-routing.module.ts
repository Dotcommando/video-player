import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  VideoListComponent,
  ReadVideoComponent
} from 'components';

const routes: Routes = [
  { path: '', redirectTo: '/video-list', pathMatch: 'full' },
  { path: 'video-list', component: VideoListComponent },
  { path: 'read/:id', component: ReadVideoComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
