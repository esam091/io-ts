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

const isTagged = t.isTagged('type')

suite
  .add('isTagged', function() {
    isTagged(A)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
