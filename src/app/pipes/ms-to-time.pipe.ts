import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msToTime'
})
export class MsToTimePipe implements PipeTransform {

  // Принимаем секунды, а не миллисекунды.
  transform(s: number, showMs: boolean = false): string {
    if (s === null || s === undefined || s === 0) {
      return '00 : 00';
    }

    function numToStr(val: number): string {
      if (val >= 10) {
        return val.toString();
      }
      if (val > 0 && val < 10) {
        return '0' + val.toString();
      }
      if (val === 0) {
        return '00';
      }
    }

    const date = new Date(s * 1000);

    const days = Math.floor(s / (60 * 60 * 24));
    const hours = date.getUTCHours();
    const mins = date.getUTCMinutes();
    const secs = date.getUTCSeconds();
    const ms = date.getUTCMilliseconds();

    let result = s < 0 ? '-' : '';

    if (days > 0) {
      result += days + ' : ';
    }
    let hoursStr = '';
    if (days > 0 || hours > 0) {
      hoursStr = numToStr(hours);
      result += hoursStr + ' : ';
    }
    const minsStr = numToStr(mins);
    result += minsStr + ' : ';
    const secsStr = numToStr(secs);
    result += secsStr;
    if (showMs && ms !== 0) {
      result += '.' + ms.toString().substr(0, 3);
    }

    return result;
  }

}
