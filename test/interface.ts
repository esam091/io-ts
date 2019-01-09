import * as assert from 'assert'
import * as t from '../src/index'
import { assertSuccess, assertFailure, assertStrictEqual, assertDeepEqual, DateFromNumber } from './helpers'

describe('interface', () => {
  it('should succeed validating a valid value', () => {
    const T = t.interface({ a: t.string })
    assertSuccess(T.decode({ a: 's' }))
  })

  it('should emit expected keys while decoding (#214)', () => {
    const T1 = t.type({ a: t.any })
    assert.deepEqual(T1.decode({}).value, { a: undefined })
    assert.deepEqual(T1.decode(Object.create(null)).value, { a: undefined })

    const T2 = t.type({ a: t.union([t.number, t.undefined]) })
    const input = {}
    assert.deepEqual(T2.decode(input).value, { a: undefined })
    assert.deepEqual(input, {})

    const jsonTurnaround = <A>(type: t.Codec<A>, a: A): t.Validation<A> => {
      return type.decode(JSON.parse(JSON.stringify(type.encode(a))))
    }
    assert.deepEqual(jsonTurnaround(T2, { a: undefined }).value, { a: undefined })
  })

  it('should keep unknown properties', () => {
    const T = t.interface({ a: t.string })
    const validation = T.decode({ a: 's', b: 1 })
    if (validation.isRight()) {
      assert.deepEqual(validation.value, { a: 's', b: 1 })
    } else {
      assert.ok(false)
    }
  })

  it('should return the same reference if validation succeeded and nothing changed', () => {
    const T = t.interface({ a: t.string })
    const value = { a: 's' }
    assertStrictEqual(T.decode(value), value)
  })

  it('should return the a new reference if validation succeeded and something changed', () => {
    const T = t.interface({ a: DateFromNumber, b: t.number })
    assertDeepEqual(T.decode({ a: 1, b: 2 }), { a: new Date(1), b: 2 })
  })

  it('should fail validating an invalid value', () => {
    const T = t.interface({ a: t.string })
    assertFailure(T.decode(1), ['Invalid value 1 supplied to : { a: string }'])
    assertFailure(T.decode({}), ['Invalid value undefined supplied to : { a: string }/a: string'])
    assertFailure(T.decode({ a: 1 }), ['Invalid value 1 supplied to : { a: string }/a: string'])
  })

  it('should support the alias `type`', () => {
    const T = t.type({ a: t.string })
    assertSuccess(T.decode({ a: 's' }))
  })

  it('should serialize a deserialized', () => {
    const T = t.type({ a: DateFromNumber })
    assert.deepEqual(T.encode({ a: new Date(0) }), { a: 0 })
  })

  it('should return the same reference when serializing', () => {
    const T = t.type({ a: t.number })
    assert.strictEqual(T.encode, t.identity)
  })

  it('should type guard', () => {
    const T1 = t.type({ a: t.number })
    assert.strictEqual(T1.is({ a: 0 }), true)
    assert.strictEqual(T1.is(undefined), false)

    const T2 = t.type({ a: DateFromNumber })
    assert.strictEqual(T2.is({ a: new Date(0) }), true)
    assert.strictEqual(T2.is({ a: 0 }), false)
    assert.strictEqual(T2.is(undefined), false)

    const T3 = t.type({ a: t.union([t.number, t.undefined]) })
    assert.strictEqual(T3.is({ a: 1 }), true)
    assert.strictEqual(T3.is({ a: undefined }), true)
    assert.strictEqual(T3.is({}), false)
    assert.strictEqual(T3.is(Object.create(null)), false)
  })

  it('should preserve additional properties while encoding', () => {
    const T = t.type({ a: DateFromNumber })
    const x = { a: new Date(0), b: 'foo' }
    assert.deepEqual(T.encode(x), { a: 0, b: 'foo' })
  })
})
