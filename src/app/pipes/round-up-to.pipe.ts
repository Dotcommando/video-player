import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundUpTo'
})
export class RoundUpToPipe implements PipeTransform {

  // Принимаем секунды, а не миллисекунды.
  transform(val: number, accuracy: number = 25): number {

    if (val === undefined || val === null) {
      return 0;
    }
    return Math.round(val * accuracy) / accuracy;

  }

}
