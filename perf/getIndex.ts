import * as Benchmark from 'benchmark'
import * as t from '../src'

const suite = new Benchmark.Suite()

const A = t.intersection([
  t.type({
    type: t.literal('A')
  }),
  t.type({
    bar: t.number
  })
])
const U1 = t.union([A, t.undefined])
const U2 = t.union([t.undefined, A])

suite
  .add('getIndex (U1)', function() {
    t.getIndex(U1.types)
  })
  .add('getIndex (U2)', function() {
    t.getIndex(U2.types)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
