import { gather, pipe, payloadArg, same, Formula, map } from '@barajs/formula'
import { readFile } from '@barajs/fs'
import { load } from 'js-yaml'

/**
 * Read a file path as YAML object
 */
export const readAsYaml = (pathFormula: Formula = payloadArg()) =>
  pipe(
    readFile(pathFormula, { encoding: 'utf8' }),
    doc => load(doc), // ?,
  )

/**
 * Read multiple file paths as YAML array.
 * @param filterFormula Get YAML name
 */
export const readAsYamlList = (filterFormula: Formula = payloadArg()) =>
  pipe(
    filterFormula,
    map(
      gather({
        doc: readAsYaml(same()),
        path: same(),
      }),
    ),
  )

// readAsYaml()(__dirname + '/sample.yaml').then(content => {
//   content // ?
// })

// readAsYamlList()([__dirname + '/sample.yaml']).then(result => {
//   result
// })
