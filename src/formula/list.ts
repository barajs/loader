import { attempt, filter, Formula, pipe, report, same } from '@barajs/formula'
import { walk } from '@barajs/fs'

export interface ListDirProps {
  /**
   * Include file pattern
   */
  include?: RegExp
  /**
   * Exclude file pattern
   */
  exclude?: RegExp
  /**
   * Override the path retrieve from previous payload.
   */
  path?: Formula | string
}

export const patternFilter = (props: ListDirProps) => async (
  filePath: string,
) => {
  let flag = true
  if (props) {
    const isNotExclude = Boolean(props.exclude === undefined)
    const isNotInclude = Boolean(props.include === undefined)
    flag = flag && (isNotInclude ? true : props.include.test(filePath))
    flag = flag && (isNotExclude ? true : !props.exclude.test(filePath))
  }
  return flag
}

const getPath = (props: ListDirProps) => (payload: any, ...rest: any[]) =>
  props && props.path
    ? typeof props.path === 'string'
      ? props.path
      : props.path(payload, ...rest)
    : payload

/**
 * List all files recursively in a directory.
 * @param props List config props
 */
export const lsDir = (props?: ListDirProps) =>
  attempt({
    to: pipe(
      getPath(props),
      walk(same()),
      filter(patternFilter(props)),
    ),
    handle: report(`Could not list all files {.}`),
  })

// Prototype:

// lsDir()(__dirname).then(data => {
//   console.log(data)
// })

// lsDir({ exclude: /list.ts$/ })(__dirname).then(data => {
//   console.log(data)
// })

// lsDir({ include: /.ts$/, exclude: /list.ts$/ })(__dirname).then(data => {
//   console.log(data)
// })

// lsDir({ exclude: /yaml.ts$/, path: __dirname })(() => __dirname).then(data => {
//   data // ?
// })

// lsDir({ exclude: /yaml.ts$/ })(__dirname).then(data => {
//   data // ?
// })
