import FindFilterSortList from "./FindFilterSortList";
import { shuffle } from 'lodash';


const data = [
  {
    id: 0,
    key: 'foo',
    sort: 'C',
    filter: '1337',
    array: [ 'foo 1', 'foo 2', 'foo 3' ],
  },
  {
    id: 1,
    key: 'bar',
    sort: 'B',
    filter: '1337',
    array: [ 'bar 2', 'bar 2', 'bar 2' ],
  },
  {
    id: 2,
    key: 'gap',
    sort: 'A',
    filter: '42',
    array: [ 'gap 3', 'gap 3', 'gap 3' ],
  }
];


describe('FilterSortSearchList', () => {

  test('Works with an empty array', () => {
    const ffs = new FindFilterSortList( [] );
    const results = ffs.getResults();

    expect(results).toBeArray();
    expect(results).toBeEmpty();
  });

  test('Returns the list after initialization', () => {
    const ffs = new FindFilterSortList( data );
    const results = ffs.getResults();

    // Make sure the order matches
    expect(results[0].id).toBe(0);
    expect(results[1].id).toBe(1);
    expect(results[2].id).toBe(2);

    // Make sure the contents are the same
    expect(results).toIncludeSameMembers(data);
  });


  describe('searching', () => {

    test('Search works on simple values', () => {
      const ffs = new FindFilterSortList( data, { searchKeys: [ 'key' ] } );
      ffs.setSearchTerm( 'foo' )
      const results = ffs.getResults();

      // We dont want to test the searching library, we just want to make sure
      // to get some result back.
      expect(results).toIncludeAnyMembers(data);
    });

    test('Search works on array values', () => {
      const ffs = new FindFilterSortList( data, { searchKeys: [ 'array' ] } );
      ffs.setSearchTerm( 'foo 1' )
      const results = ffs.getResults();

      // We dont want to test the searching library, we just want to make sure
      // to get some result back.
      expect(results).toIncludeAnyMembers(data);
    });

  });


  describe('filtering', () => {

    test('Filtering for a simple value works', () => {
      const ffs = new FindFilterSortList( data );
      ffs.setFilter( 'filter', '1337' );
      const results = ffs.getResults();

      // Make sure the order matches
      expect(results[0].id).toBe(0);
      expect(results[1].id).toBe(1);

      expect(results.length).toBe(2);
    });

    test('Filtering for an array value works', () => {
      const ffs = new FindFilterSortList( data );
      ffs.setFilter( 'filter', '1337' );
      const results = ffs.getResults();

      // Make sure the order matches
      expect(results[0].id).toBe(0);
      expect(results[1].id).toBe(1);

      expect(results.length).toBe(2);
    });

    test('Resetting a filter works', () => {
      const ffs = new FindFilterSortList( data );
      ffs.setFilter( 'filter', '1337' );
      ffs.setFilter( 'filter', '' );
      const results = ffs.getResults();

      // Make sure the order matches
      expect(results[0].id).toBe(0);
      expect(results[1].id).toBe(1);
      expect(results[2].id).toBe(2);
    });

  });


  describe('sorting', () => {

    test('Setting no sort returns the list as it is', () => {
      const ffs = new FindFilterSortList( data );
      const results = ffs.getResults();

      // Make sure the order matches
      expect(results[0].id).toBe(0);
      expect(results[1].id).toBe(1);
      expect(results[2].id).toBe(2);
    });

    test('Sorting by a simple key works', () => {
      const ffs = new FindFilterSortList( shuffle(data) );
      ffs.setSortingOrder( 'sort' );
      const results = ffs.getResults();

      // Make sure the order matches
      expect(results[0].sort).toBe('A');
      expect(results[1].sort).toBe('B');
      expect(results[2].sort).toBe('C');
    });

    test('Resetting the sort returns the list as it was', () => {
      const ffs = new FindFilterSortList( data );
      ffs.setSortingOrder( 'sort' );
      ffs.setSortingOrder( '' );
      const results = ffs.getResults();

      // Make sure the order matches
      expect(results[0].id).toBe(0);
      expect(results[1].id).toBe(1);
      expect(results[2].id).toBe(2);
    });

    describe('directions', () => {

      test.each([
        [ 'a',          'ascending',  [ 'A', 'B', 'C' ] ],
        [ 'asc',        'ascending',  [ 'A', 'B', 'C' ] ],
        [ 'ascending',  'ascending',  [ 'A', 'B', 'C' ] ],
        [ 'A',          'ascending',  [ 'A', 'B', 'C' ] ],
        [ 'ASC',        'ascending',  [ 'A', 'B', 'C' ] ],
        [ 'ASCENDING',  'ascending',  [ 'A', 'B', 'C' ] ],
        [ 'd',          'descending', [ 'C', 'B', 'A' ] ],
        [ 'des',        'descending', [ 'C', 'B', 'A' ] ],
        [ 'dec',        'descending', [ 'C', 'B', 'A' ] ],
        [ 'desc',       'descending', [ 'C', 'B', 'A' ] ],
        [ 'descending', 'descending', [ 'C', 'B', 'A' ] ],
        [ 'D',          'descending', [ 'C', 'B', 'A' ] ],
        [ 'DES',        'descending', [ 'C', 'B', 'A' ] ],
        [ 'DEC',        'descending', [ 'C', 'B', 'A' ] ],
        [ 'DESC',       'descending', [ 'C', 'B', 'A' ] ],
        [ 'DESCENDING', 'descending', [ 'C', 'B', 'A' ] ],
      ])('"%s" is interpreted as %s', ( direction, _, order) => {
        const ffs = new FindFilterSortList( shuffle(data) );
        ffs.setSortingOrder( 'sort', direction );
        const results = ffs.getResults();

        expect(results[0].sort).toBe(order[0]);
        expect(results[1].sort).toBe(order[1]);
        expect(results[2].sort).toBe(order[2]);
      });

    });

  });


  describe('isObjectMatchingFilters', () => {

    test('Is matching for simple keys', () => {
      const object = { key: 'value' };
      const filter = Object.entries({ key: new Set([ 'value' ]) });

      expect(FindFilterSortList.isObjectMatchingFilters(object, filter)).toBe(true);
    });

    test('Is matching for array keys', () => {
      const object = { key: [ 'value 1', 'value 2' ] };
      const filter1 = Object.entries({ key: new Set([ 'value 1' ]) });
      const filter2 = Object.entries({ key: new Set([ 'value 2' ]) });
      const filter3 = Object.entries({ key: new Set([ 'value 1', 'value 2' ]) });

      expect(FindFilterSortList.isObjectMatchingFilters(object, filter1)).toBe(true);
      expect(FindFilterSortList.isObjectMatchingFilters(object, filter2)).toBe(true);
      expect(FindFilterSortList.isObjectMatchingFilters(object, filter3)).toBe(true);
    });

    test('Is not matching when it shouldn\'t', () => {
      const object = { answer: '1337' };
      const filter = Object.entries({ answer: new Set([ '42' ]) });

      expect(FindFilterSortList.isObjectMatchingFilters(object, filter)).toBe(false);
    });

  });

});
