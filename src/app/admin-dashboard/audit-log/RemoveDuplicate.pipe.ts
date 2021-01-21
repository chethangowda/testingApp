import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'unique',
  pure: false,
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // Remove the duplicate elements
    return _.uniqBy(value, args);
  }
}
