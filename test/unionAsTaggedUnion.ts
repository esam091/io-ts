import * as assert from 'assert'
import * as t from '../src/index'
import { assertSuccess, assertFailure, assertStrictEqual, DateFromNumber } from './helpers'

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

const TUC = t.exact(
  t.type({
    type: t.literal('c'),
    baz: DateFromNumber
  }),
  'TUC'
)

const TUD = t.intersection(
  [
    t.type({
      bar: t.number
    }),
    t.type({
      type: t.literal('d')
    })
  ],
  'TUD'
)

const T = t.union([TUA, TUB, TUC, TUD])

describe('union as tagged union', () => {
  it('should succeed validating a valid value', () => {
    assertSuccess(T.decode({ type: 'a', foo: 'foo' }))
    assertSuccess(T.decode({ type: 'b', bar: 1 }))
    assertSuccess(T.decode({ type: 'c', baz: 0 }))
  })

  it('should return the same reference if validation succeeded', () => {
    const value = { type: 'a', foo: 'foo' }
    assertStrictEqual(T.decode(value), value)
  })

  it('should fail validating an invalid value', () => {
    assertFailure(T.decode(true), ['Invalid value true supplied to : (TUA | TUB | TUC | TUD)'])
    assertFailure(T.decode({ type: 'D' }), [
      'Invalid value "D" supplied to : (TUA | TUB | TUC | TUD)/type: "a" | "b" | "c" | "d"'
    ])
    assertFailure(T.decode({ type: 'a' }), [
      'Invalid value undefined supplied to : (TUA | TUB | TUC | TUD)/0: TUA/foo: string'
    ])
    assertFailure(T.decode({ type: 'b' }), [
      'Invalid value undefined supplied to : (TUA | TUB | TUC | TUD)/1: TUB/bar: number'
    ])
    assertFailure(T.decode({ type: 'c' }), [
      'Invalid value undefined supplied to : (TUA | TUB | TUC | TUD)/2: TUC/baz: DateFromNumber'
    ])
  })

  it('should serialize a deserialized', () => {
    assert.deepEqual(T.encode({ type: 'a', foo: 'foo' }), { type: 'a', foo: 'foo' })
    assert.deepEqual(T.encode({ type: 'b', bar: 1 }), { type: 'b', bar: 1 })
    assert.deepEqual(T.encode({ type: 'c', baz: new Date(0) }), { type: 'c', baz: 0 })
  })

  it('should return the same reference when serializing', () => {
    const T = t.union([TUA, TUB])
    assert.strictEqual(T.encode, t.identity)
  })

  it('should type guard', () => {
    assert.strictEqual(T.is({ type: 'a', foo: 'foo' }), true)
    assert.strictEqual(T.is({ type: 'b', bar: 1 }), true)
    assert.strictEqual(T.is({ type: 'c', baz: new Date(0) }), true)
    assert.strictEqual(T.is(true), false)
    assert.strictEqual(T.is({ type: 'a' }), false)
  })

  it('should work when tag values are numbers', () => {
    const A = t.type(
      {
        type: t.literal(1),
        foo: t.string
      },
      'A'
    )

    const B = t.type(
      {
        type: t.literal(2),
        bar: t.number
      },
      'B'
    )

    const C = t.type(
      {
        type: t.literal(3),
        baz: DateFromNumber
      },
      'C'
    )

    const U = t.union([A, B, C], 'U')

    assert.strictEqual(U.is({ type: 1, foo: 'foo' }), true)
    assert.strictEqual(U.is({ type: 1, foo: 0 }), false)
    assert.strictEqual(U.is({ type: 2, bar: 0 }), true)
    assert.strictEqual(U.is({ type: 2, bar: 'bar' }), false)
    assert.strictEqual(U.is({ type: 4 }), false)
    assert.strictEqual(U.is({ type: '1', foo: 'foo' }), false)

    assertSuccess(U.decode({ type: 1, foo: 'foo' }))
    assertFailure(U.decode({ type: 1, foo: 0 }), ['Invalid value 0 supplied to : U/0: A/foo: string'])
    assertSuccess(U.decode({ type: 2, bar: 0 }))
    assertFailure(U.decode({ type: 2, bar: 'bar' }), ['Invalid value "bar" supplied to : U/1: B/bar: number'])
    assertFailure(U.decode({ type: 4 }), ['Invalid value 4 supplied to : U/type: 1 | 2 | 3'])

    assert.deepEqual(U.encode({ type: 3, baz: new Date(0) }), { type: 3, baz: 0 })
  })

  it('should work when tag values are booleans', () => {
    const A = t.type(
      {
        type: t.literal(true),
        foo: t.string
      },
      'A'
    )

    const B = t.type(
      {
        type: t.literal(false),
        bar: t.number
      },
      'B'
    )

    const U = t.union([A, B], 'U')

    assert.strictEqual(U.is({ type: true, foo: 'foo' }), true)
    assert.strictEqual(U.is({ type: true, foo: 0 }), false)
    assert.strictEqual(U.is({ type: false, bar: 0 }), true)
    assert.strictEqual(U.is({ type: false, bar: 'bar' }), false)
    assert.strictEqual(U.is({ type: 3 }), false)

    assertSuccess(U.decode({ type: true, foo: 'foo' }))
    assertFailure(U.decode({ type: true, foo: 0 }), ['Invalid value 0 supplied to : U/0: A/foo: string'])
    assertSuccess(U.decode({ type: false, bar: 0 }))
    assertFailure(U.decode({ type: false, bar: 'bar' }), ['Invalid value "bar" supplied to : U/1: B/bar: number'])
    assertFailure(U.decode({ type: 3 }), ['Invalid value 3 supplied to : U/type: true | false'])
  })

  it('should work when tag values are both strings and numbers with the same string representation', () => {
    const A = t.type(
      {
        type: t.literal(1),
        foo: t.string
      },
      'A'
    )

    const B = t.type(
      {
        type: t.literal('1'),
        bar: t.number
      },
      'B'
    )

    const U = t.union([A, B], 'U')

    assert.strictEqual(U.is({ type: 1, foo: 'foo' }), true)
    assert.strictEqual(U.is({ type: 1, bar: 'bar' }), false)
    assert.strictEqual(U.is({ type: '1', foo: 'foo' }), false)
    assert.strictEqual(U.is({ type: '1', bar: 2 }), true)
    assert.strictEqual(U.is({ type: 3 }), false)

    assertSuccess(U.decode({ type: 1, foo: 'foo' }))
    assertFailure(U.decode({ type: 1, bar: 'bar' }), ['Invalid value undefined supplied to : U/0: A/foo: string'])
    assertSuccess(U.decode({ type: '1', bar: 2 }))
    assertFailure(U.decode({ type: '1', foo: 'foo' }), ['Invalid value undefined supplied to : U/1: B/bar: number'])
    assertFailure(U.decode({ type: 3 }), ['Invalid value 3 supplied to : U/type: 1 | "1"'])
  })
})

describe('getTypeIndex', () => {
  const A = t.type({ type: t.literal('A'), a: t.string })
  const B = t.type({ type: t.literal('B'), b: t.number })
  const C = t.union([A, B])
  const I = t.intersection([
    t.type({
      type: t.literal('I')
    }),
    t.type({
      i: t.number
    })
  ])
  const StrictA = t.strict({ type: t.literal('A') })
  const ExactA = t.exact(A)

  it('InterfaceType', () => {
    assert.deepEqual(t.getTypeIndex(t.string), {})
    assert.deepEqual(t.getTypeIndex(t.type({ a: t.string })), {})
    assert.deepEqual(t.getTypeIndex(A), { type: [['A', A]] })
  })

  it('UnionType', () => {
    assert.deepEqual(t.getTypeIndex(t.union([t.number, t.string])), {})
    assert.deepEqual(t.getTypeIndex(t.union([A, t.string])), {})
    assert.deepEqual(t.getTypeIndex(C), { type: [['A', A], ['B', B]] })
    assert.deepEqual(t.getTypeIndex(t.union([A, A])), { type: [['A', A]] })
    assert.deepEqual(t.getTypeIndex(t.union([A, B, t.type({ type: t.literal('A'), a: t.number })])), {})
  })

  it('IntersectionType', () => {
    assert.deepEqual(t.getTypeIndex(I), { type: [['I', I]] })
    const AA = t.intersection([A, A])
    assert.deepEqual(t.getTypeIndex(AA), { type: [['A', AA], ['A', AA]] })
    const AB = t.intersection([A, t.type({ type2: t.literal('B') })])
    assert.deepEqual(t.getTypeIndex(AB), { type: [['A', AB]], type2: [['B', AB]] })
  })

  it('StrictType', () => {
    assert.deepEqual(t.getTypeIndex(StrictA), { type: [['A', StrictA]] })
  })

  it('ExactType', () => {
    assert.deepEqual(t.getTypeIndex(ExactA), { type: [['A', ExactA]] })
  })
})

describe('getIndex', () => {
  it('should return a valid index', () => {
    const A = t.type({ type: t.literal('A') })
    assert.deepEqual(t.getIndex([A, A]), { type: [['A', A]] })
    const DuplicatedA = t.type({ type: t.literal('A') })
    assert.deepEqual(t.getIndex([A, DuplicatedA]), {})
    const B = t.type({ type: t.literal('B') })
    assert.deepEqual(t.getIndex([A, B]), { type: [['A', A], ['B', B]] })
    assert.deepEqual(t.getIndex([TUA]), { type: [['a', TUA]] })
    assert.deepEqual(t.getIndex([TUA, TUB]), { type: [['a', TUA], ['b', TUB]] })
    assert.deepEqual(t.getIndex([TUC]), { type: [['c', TUC]] })
    assert.deepEqual(t.getIndex([TUA, TUB, TUC]), { type: [['a', TUA], ['b', TUB], ['c', TUC]] })
    assert.deepEqual(t.getIndex(T.types), { type: [['a', TUA], ['b', TUB], ['c', TUC], ['d', TUD]] })
    const StrictA = t.strict({ type: t.literal('A') })
    assert.deepEqual(t.getIndex([StrictA, StrictA]), { type: [['A', StrictA]] })
    const B2 = t.type({ type2: t.literal('B') })
    assert.deepEqual(t.getIndex([A, B2]), {})
  })
})
