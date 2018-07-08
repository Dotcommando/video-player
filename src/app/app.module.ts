import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatSliderModule } from '@angular/material/slider';
import { OverlayModule } from '@angular/cdk/overlay';
import { AngularDraggableModule } from 'angular2-draggable';
import {
  MatInputModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatRadioModule,
  MatButtonModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatChipsModule
} from '@angular/material';

import { AppComponent } from './app.component';
import {
  VideoListComponent,
  ReadVideoComponent,
  PlayerComponent
} from 'components';

import {
  ConfirmDialogComponent
} from 'components/dialogs';

import {
  MsToTimePipe,
  RoundUpToPipe
} from 'pipes';


@NgModule({
  declarations: [
    AppComponent,
    VideoListComponent,
    ReadVideoComponent,
    PlayerComponent,
    ConfirmDialogComponent,
    MsToTimePipe,
    RoundUpToPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatSliderModule,
    OverlayModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatChipsModule,
    AngularDraggableModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  providers: [
    MsToTimePipe,
    RoundUpToPipe
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
