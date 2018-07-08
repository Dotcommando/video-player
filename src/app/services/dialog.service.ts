import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private matDialogService: MatDialog) {
  }

  /**
   * Открывает указанный диалог и передает ему входные данные.
   * @param dialogComponent
   * @param data
   * @returns {Observable<any>}
   */
  openDialog(dialogComponent, data: any | null = null): Observable<any> {
    return this.matDialogService.open(dialogComponent, {data: data}).beforeClose();
  }
}
