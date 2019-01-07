import * as Benchmark from 'benchmark'
import * as t from '../src'

const suite = new Benchmark.Suite()

const TUA = t.type(
  {
    type: t.literal('a'),
    foo: t.string
  },
  'TUA'
)

const TUB = t.intersection(
  [
    t.type({
      type: t.literal('b')
    }),
    t.type({
      bar: t.number
    })
  ],
  'TUB'
)

const DateFromNumber = new t.Type<Date, number>(
  'DateFromNumber',
  (v): v is Date => v instanceof Date,
  (s, c) =>
    t.number.validate(s, c).chain(n => {
      const d = new Date(n)
      return isNaN(d.getTime()) ? t.failure(n, c) : t.success(d)
    }),
  a => a.getTime()
)

const TUC = t.type(
  {
    type: t.literal('c'),
    baz: DateFromNumber
  },
  'TUC'
)

export const TU = t.taggedUnion('type', [TUA, TUB, TUC])

const U = t.union([TUA, TUB, TUC])

const valid = { type: 'a' as 'a', foo: 'foo' }

const invalid = { type: 'D' }

// const makeType = <L extends string>(L: L) =>
//   t.type(
//     {
//       type: t.literal(L),
//       a: t.string,
//       b: t.number,
//       c: t.boolean
//     },
//     L
//   )

// const TU = t.taggedUnion('type', ['A', 'B', 'C', 'D', 'E'].map(makeType) as any)
// const U = t.union(['A', 'B', 'C', 'D', 'E'].map(makeType) as any)

// const valid = { type: 'E', a: 'a' }
// const invalid = { type: 'Z' }

suite
  // .add('taggedUnion (valid)', function() {
  //   TU.decode(valid)
  // })
  // .add('taggedUnion (invalid)', function() {
  //   TU.decode(invalid)
  // })
  // .add('taggedUnion (encode)', function() {
  //   TU.encode(valid)
  // })
  .add('union (valid)', function() {
    U.decode(valid)
  })
  .add('union (invalid)', function() {
    U.decode(invalid)
  })
  .add('union (encode)', function() {
    U.encode(valid)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
