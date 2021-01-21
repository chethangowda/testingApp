import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchFilter' })
export class SearchFilter implements PipeTransform {
  public transform(items: any[], searchText: any, isFrom?: any): any[] {
    if(!items) return [];
    if(!searchText) return items;

    if(isFrom == 'recentQuery') {
      return items.filter( it => {
        if(it.queryName) {
          return it.queryName.toLowerCase().includes(searchText.toLowerCase());
        }

      });
    } else {
      return items.filter( it => {
        if(it.resourceName) {
          return it.resourceName.toLowerCase().includes(searchText.toLowerCase());
        }
      });
    }
  }

}
