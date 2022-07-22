import ExcellentExport from 'excellentexport';
// import { isObject } from 'core-js/core/object';


export default function downloadObjectsAsCSV(
  headerObject,
  rowObjects,
  {
    filename = 'export',
    sheetname = 'export'
  } = {}
) {
  // console.assert( isObject( headerObject ) );
  console.assert( Array.isArray( rowObjects ) );

  const keyList = Object.keys( headerObject );
  const header = Object.values( headerObject );
  const rows = rowObjects.map(
    rowObject => getValuesFromObjectOrderedByKeyList( rowObject, keyList )
  );

  const options = {
    openAsDownload: true,
    format: 'xlsx',

    filename,
  };

  const sheets = [
    {
      name: sheetname,
      from: {
        array: [
          header,
          ...rows,
        ]
      }
    },
  ];

  ExcellentExport.convert(options, sheets);

}

function getValuesFromObjectOrderedByKeyList( object, keyList ) {
  return keyList.map( key => object[key] );
}
