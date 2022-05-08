import Fuse from 'fuse.js';
import { isString, isEmpty, isUndefined, isArray, isObject, isSet, isNumber } from 'lodash';


const SORT_DIRECTION_ASCENDING  = Symbol('ASC');
const SORT_DIRECTION_DESCENDING = Symbol('DESC');

const SORT_DIRECTION_MAP = {
  'a': SORT_DIRECTION_ASCENDING,
  'asc': SORT_DIRECTION_ASCENDING,
  'ascending': SORT_DIRECTION_ASCENDING,
  'd': SORT_DIRECTION_DESCENDING,
  'des': SORT_DIRECTION_DESCENDING,
  'dec': SORT_DIRECTION_DESCENDING,
  'desc': SORT_DIRECTION_DESCENDING,
  'descending': SORT_DIRECTION_DESCENDING,
};

export default class FindFilterSortList {

  static wrapValueWithArray( value ) {
    return isArray(value) ? value : [ value ];
  }

  static getSet( value ) {
    return new Set( FindFilterSortList.wrapValueWithArray(value) );
  }

  static filterObjectList( objects, filters ) {
    console.assert( isArray(objects) );
    console.assert( isObject(filters) );

    if( isEmpty(filters) ) {
      return objects;
    }

    const filterEntries = Object.entries( filters );

    return objects.filter(
      object => FindFilterSortList.isObjectMatchingFilters( object, filterEntries )
    );
  }

  static isObjectMatchingFilters( object, filterEntries ) {
    console.assert( isObject(object) );
    console.assert( isArray(filterEntries) );

    return filterEntries.every( ([ fitlerKey, filterValue ]) => {
      console.assert( isString(fitlerKey) );
      console.assert( !isEmpty(fitlerKey) );
      console.assert( isSet(filterValue) );

      if( !object.hasOwnProperty( fitlerKey ) ) {
        return false;
      }

      const valueArray = FindFilterSortList.wrapValueWithArray( object[fitlerKey] );

      return valueArray.some( value => filterValue.has( value ) );
    } );
  }

  static sortObjectList( objects, key, direction = SORT_DIRECTION_ASCENDING ) {
    console.assert( [ SORT_DIRECTION_ASCENDING, SORT_DIRECTION_DESCENDING ].includes(direction) );

    const directionModifier = direction === SORT_DIRECTION_ASCENDING ? 1 : -1;

    return objects.sort( (a, b) => {
      console.assert( a.hasOwnProperty( key ) );
      console.assert( b.hasOwnProperty( key ) );

      const valueA = a[key];
      const valueB = b[key];

      let result = 0;

      if( isString(valueA) ) {
        result = valueA.localeCompare(valueB)
      } else {
        result = valueA - valueB;
      }

      return result * directionModifier;
    } );
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
    console.assert( isString(searchTerm) );

    this._searchTerm = searchTerm;
  }

  removeSearchTerm() {
    this._searchTerm = undefined;
  }

  updateSearchTerm( searchTerm ) {
    if( isEmpty(searchTerm) ) {
      this.removeSearchTerm();
    } else {
      this.setSearchTerm( searchTerm );
    }
  }

  setFilter( key, value ) {
    console.assert( isString(key) );
    console.assert( !isEmpty(key) );
    console.assert( isString(value) );
    console.assert( !isEmpty(value) );

    this._filters[key] = FindFilterSortList.getSet( value );
  }

  removeFilter( key ) {
    console.assert( isString(key) );
    console.assert( !isEmpty(key) );

    delete this._filters[key];
  }

  updateFilter( key, value ) {
    if( isEmpty(value) ) {
      this.removeFilter( key );
    } else {
      this.setFilter( key, value );
    }
  }

  setSortingOrder( key, direction = 'ASC' ) {
    console.assert( isString(key) || isUndefined(key) );
    console.assert( isString(direction) );
    console.assert( SORT_DIRECTION_MAP.hasOwnProperty(direction.toLowerCase()) );

    if( isEmpty(key) ) {
      this._sortKey = undefined;
    } else {
      this._sortKey = key;
    }

    this._sortDirection = SORT_DIRECTION_MAP[direction.toLowerCase()];
  }

  getResults() {
    let items = this._getSearchResults();

    if( !isEmpty(this._filters) ) {
      items = FindFilterSortList.filterObjectList(items, this._filters);
    }

    if( !isUndefined( this._sortKey ) ) {
      items = FindFilterSortList.sortObjectList(items, this._sortKey, this._sortDirection);
    }

    return items
  }

  _getSearchResults() {
    if( isEmpty(this._searchTerm) ) {
      return this._items.slice();
    }

    return this._fuse.search( this._searchTerm )
      .map( result => result.item );
  }
}
