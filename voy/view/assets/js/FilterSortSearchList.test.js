import FilterSortSearchList from "./FilterSortSearchList";


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
    const fss = new FilterSortSearchList( [] ) ;

    expect(fss.getResults()).toBeArray();
    expect(fss.getResults()).toBeEmpty();
  });

  test('Returns the list after initialization', () => {
    const fss = new FilterSortSearchList( data );

    expect(fss.getResults()).toIncludeSameMembers(data);
  });


  describe('searching', () => {

    test('Search works on simple values', () => {
      const fss = new FilterSortSearchList( data, { searchKeys: [ 'key' ] } );

      fss.setSearchTerm( 'value 1' )

      expect(fss.getResults()).toBeArray();
    });


    test('Search works on array values', () => {
      const fss = new FilterSortSearchList( data, { searchKeys: [ 'array' ] } );

      fss.setSearchTerm( 'value 1' )

      expect(fss.getResults()).toBeArray();
    });

  });

});
