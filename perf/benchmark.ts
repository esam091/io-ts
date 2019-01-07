import * as Benchmark from 'benchmark'
import { SpaceObjectTaggedUnion, SpaceObjectUnion, valid, invalid } from './SpaceObject'

const suite = new Benchmark.Suite()

suite
  .add('space-object (tagged union, decode, valid)', function() {
    SpaceObjectTaggedUnion.decode(valid)
  })
  .add('space-object (tagged union, decode, invalid)', function() {
    SpaceObjectTaggedUnion.decode(invalid)
  })
  .add('space-object (tagged union, encode)', function() {
    SpaceObjectTaggedUnion.encode(valid)
  })
  .add('space-object (union, decode, valid)', function() {
    SpaceObjectUnion.decode(valid)
  })
  .add('space-object (union, decode, invalid)', function() {
    SpaceObjectUnion.decode(invalid)
  })
  .add('space-object (union, encode)', function() {
    SpaceObjectUnion.encode(valid)
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
