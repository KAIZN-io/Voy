import FindFilterSortList from "./FindFilterSortList";


const data = [
  {
    'key': 'value 1',
    'array': [ 'value 11', 'value 12', 'value 13' ],
  },
  {
    'key': 'value 2',
    'array': [ 'value 21', 'value 22', 'value 23' ],
  },
  {
    'key': 'value 3',
    'array': [ 'value 31', 'value 32', 'value 33' ],
  }
];

beforeEach(() => {

});

describe('FilterSortSearchList', () => {

  test('Works with an empty array', () => {
    const ffs = new FindFilterSortList( [] ) ;

    expect(ffs.getResults()).toBeArray();
    expect(ffs.getResults()).toBeEmpty();
  });

  test('Returns the list after initialization', () => {
    const ffs = new FindFilterSortList( data );

    expect(ffs.getResults()).toIncludeSameMembers(data);
  });


  describe('searching', () => {

    test('Search works on simple values', () => {
      const ffs = new FindFilterSortList( data, { searchKeys: [ 'key' ] } );

      ffs.setSearchTerm( 'value 1' )

      expect(ffs.getResults()).toBeArray();
    });


    test('Search works on array values', () => {
      const ffs = new FindFilterSortList( data, { searchKeys: [ 'array' ] } );

      ffs.setSearchTerm( 'value 1' )

      expect(ffs.getResults()).toBeArray();
    });

  });

});
