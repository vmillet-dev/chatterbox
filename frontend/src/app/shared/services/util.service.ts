import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public static toCapitalize(value: string): string {
    if (!value) return '';
    return value.split('-')
      .filter((w: string)  => w)
      .map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

}
