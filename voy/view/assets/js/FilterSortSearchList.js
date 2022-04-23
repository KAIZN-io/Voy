import Fuse from 'fuse.js';
import { isString, isEmpty, isUndefined, isArray, isObject, isSet } from 'lodash';


const SORT_DIRECTION_ASCENDING  = Symbol('ASC');
const SORT_DIRECTION_DESCENDING = Symbol('DESC');

export default class FilterSortSearchList {

  static wrapValueWithArray( value ) {
    return isArray(value) ? value : [ value ];
  }

  static getSet( value ) {
    return new Set( FilterSortSearchList.wrapValueWithArray(value) );
  }

  static filterObjectList( objects, filters ) {
    console.assert( isArray(objects) );
    console.assert( isObject(filters) );

    if( isEmpty(filters) ) {
      return objects;
    }

    const filterEntries = Object.entries( filters );

    return objects.filter(
      object => FilterSortSearchList.isObjectMatchingFilters( object, filterEntries )
    );
  }

  static isObjectMatchingFilters( object, filterEntries ) {
    console.assert( isObject(object) );
    console.assert( isArray(filterEntries) );

    return filterEntries.every( ([ fitlerKey, filterValue ]) => {
      console.assert( isString(fitlerKey) && !isEmpty(fitlerKey) );
      console.assert( isSet(filterValue) );

      if( Object.hasOwnProperty(object, fitlerKey) ) {
        return false;
      }

      const valueArray = FilterSortSearchList.wrapValueWithArray( object[fitlerKey] );

      return valueArray.find( value => filterValue.has( value ) );
    } );
  }

  static isValueMatchingFilter( value, filterValue ) {
    console.assert( isArray(value) );
    console.assert( isArray(filterValue) );
  }

  static sortObjectList( objects, key, direction = SORT_DIRECTION_ASCENDING ) {
    return objects;
  }

  constructor( items, { searchKeys = [] } = {} ) {
    console.assert( Array.isArray(items) );
    console.assert( Array.isArray(searchKeys) );

    this._items = items;
    this._fuse = new Fuse(items, { keys: searchKeys });

    this._searchTerm = undefined;
    this._filters = {};
    this._sortKey = undefined;
    this._sortDirection = SORT_DIRECTION_ASCENDING;
  }

  setSearchTerm( searchTerm ) {
    console.assert( isString(searchTerm) || isUndefined(searchTerm) );

    if( isEmpty(searchTerm) ) {
      this._searchTerm = undefined;
    } else {
      this._searchTerm = searchTerm;
    }
  }

  setFilter( key, value ) {
    console.assert( isString(key) && key.length > 0 );

    if( isEmpty(value) ) {
      delete this._filters[key];
    } else {
      this._filters[key] = FilterSortSearchList.getSet( value );
    }
  }

  setSortingOrder( key, direction = SORT_DIRECTION_ASCENDING ) {
    console.assert( isString(key) || isUndefined(key) );
    console.assert( [ SORT_DIRECTION_ASCENDING, SORT_DIRECTION_DESCENDING ].includes(direction) );

    if( isEmpty(key) ) {
      this._sortKey = undefined;
    } else {
      this._sortKey = key;
    }

    this._sortDirection = direction;
  }

  getResults() {
    let items = this._getSearchResults();

    items = FilterSortSearchList.filterObjectList(items, this._filters);

    return FilterSortSearchList.sortObjectList(items, this._sortKey, this._sortDirection);
  }

  _getSearchResults() {
    if( isEmpty(this._searchTerm) ) {
      return this._items;
    }

    return this._fuse.search( this._searchTerm )
      .map( result => result.item );
  }
}
