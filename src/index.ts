import { Either, Left, Right } from 'fp-ts/lib/Either'
import { Predicate } from 'fp-ts/lib/function'

/**
 * @since 1.0.0
 */
export type mixed = unknown

/**
 * @since 1.0.0
 */
export interface ContextEntry {
  readonly key: string
  readonly type: Decoder<any, any>
}
/**
 * @since 1.0.0
 */
export interface Context extends ReadonlyArray<ContextEntry> {}

/**
 * @since 1.0.0
 */
export interface ValidationError {
  readonly value: unknown
  readonly context: Context
}

/**
 * @since 1.0.0
 */
export interface Errors extends Array<ValidationError> {}

/**
 * @since 1.0.0
 */
export type Validation<A> = Either<Errors, A>

/**
 * @since 1.0.0
 */
export type Is<A> = (u: unknown) => u is A

/**
 * @since 1.0.0
 */
export type Validate<I, A> = (i: I, context: Context) => Validation<A>

/**
 * @since 1.0.0
 */
export type Decode<I, A> = (i: I) => Validation<A>

/**
 * @since 1.0.0
 */
export type Encode<A, O> = (a: A) => O

/**
 * @since 1.0.0
 */
export interface Any extends Type<any, any, any> {}

/**
 * @since 1.0.0
 */
export interface Mixed extends Type<any, any, unknown> {}

/**
 * @since 1.0.0
 */
export type TypeOf<T extends any> = T['_A']

/**
 * @since 1.0.0
 */
export type InputOf<T extends any> = T['_I']

/**
 * @since 1.0.0
 */
export type OutputOf<T extends any> = T['_O']

/**
 * @since 1.0.0
 */
export interface Decoder<I, A> {
  readonly name: string
  readonly validate: Validate<I, A>
  readonly decode: Decode<I, A>
}

/**
 * @since 1.0.0
 */
export interface Encoder<A, O> {
  readonly encode: Encode<A, O>
}

/**
 * @since 1.0.0
 */
export class Type<A, O = A, I = unknown> implements Decoder<I, A>, Encoder<A, O> {
  readonly _A!: A
  readonly _O!: O
  readonly _I!: I
  constructor(
    /** a unique name for this runtime type */
    readonly name: string,
    /** a custom type guard */
    readonly is: Is<A>,
    /** succeeds if a value of type I can be decoded to a value of type A */
    readonly validate: Validate<I, A>,
    /** converts a value of type A to a value of type O */
    readonly encode: Encode<A, O>
  ) {}

  pipe<B, IB, A extends IB, OB extends A>(
    this: Type<A, O, I>,
    ab: Type<B, OB, IB>,
    name: string = `pipe(${this.name}, ${ab.name})`
  ): Type<B, O, I> {
    return new Type(
      name,
      ab.is,
      (i, c) => {
        const validation = this.validate(i, c)
        if (validation.isLeft()) {
          return validation as any
        } else {
          return ab.validate(validation.value, c)
        }
      },
      this.encode === identity && ab.encode === identity ? (identity as any) : b => this.encode(ab.encode(b))
    )
  }
  asDecoder(): Decoder<I, A> {
    return this
  }
  asEncoder(): Encoder<A, O> {
    return this
  }
  /** a version of `validate` with a default context */
  decode(i: I): Validation<A> {
    return this.validate(i, getDefaultContext(this))
  }
}

/**
 * @since 1.0.0
 */
export const identity = <A>(a: A): A => a

/**
 * @since 1.0.0
 */
export const getFunctionName = (f: Function): string =>
  (f as any).displayName || (f as any).name || `<function${f.length}>`

/**
 * @since 1.0.0
 */
export const getContextEntry = (key: string, type: Decoder<any, any>): ContextEntry => ({ key, type })

/**
 * @since 1.0.0
 */
export const getValidationError = (value: unknown, context: Context): ValidationError => ({ value, context })

/**
 * @since 1.0.0
 */
export const getDefaultContext = (type: Decoder<any, any>): Context => [{ key: '', type }]

/**
 * @since 1.0.0
 */
export const appendContext = (c: Context, key: string, type: Decoder<any, any>): Context => {
  const len = c.length
  const r = Array(len + 1)
  for (let i = 0; i < len; i++) {
    r[i] = c[i]
  }
  r[len] = { key, type }
  return r
}

/**
 * @since 1.0.0
 */
export const failures = <T>(errors: Errors): Validation<T> => new Left(errors)

/**
 * @since 1.0.0
 */
export const failure = <T>(value: unknown, context: Context): Validation<T> =>
  failures([getValidationError(value, context)])

/**
 * @since 1.0.0
 */
export const success = <T>(value: T): Validation<T> => new Right<Errors, T>(value)

const pushAll = <A>(xs: Array<A>, ys: Array<A>): void => {
  const l = ys.length
  for (let i = 0; i < l; i++) {
    xs.push(ys[i])
  }
}

//
// basic types
//

/**
 * @since 1.0.0
 */
export class NullType extends Type<null, null, unknown> {
  readonly _tag: 'NullType' = 'NullType'
  constructor() {
    super('null', (m): m is null => m === null, (m, c) => (this.is(m) ? success(m) : failure(m, c)), identity)
  }
}

/**
 * @alias `null`
 * @since 1.0.0
 */
export const nullType: NullType = new NullType()

/**
 * @since 1.0.0
 */
export class UndefinedType extends Type<undefined, undefined, unknown> {
  readonly _tag: 'UndefinedType' = 'UndefinedType'
  constructor() {
    super(
      'undefined',
      (m): m is undefined => m === void 0,
      (m, c) => (this.is(m) ? success(m) : failure(m, c)),
      identity
    )
  }
}

const undefinedType: UndefinedType = new UndefinedType()

/**
 * @since 1.2.0
 * @deprecated
 */
export class VoidType extends Type<void, void, unknown> {
  readonly _tag: 'VoidType' = 'VoidType'
  constructor() {
    super('void', undefinedType.is, undefinedType.validate, identity)
  }
}

/**
 * @alias `void`
 * @since 1.2.0
 * @deprecated
 */
export const voidType: VoidType = new VoidType()

/**
 * @since 1.0.0
 * @deprecated
 */
export class AnyType extends Type<any, any, unknown> {
  readonly _tag: 'AnyType' = 'AnyType'
  constructor() {
    super('any', (_): _ is any => true, success, identity)
  }
}

/**
 * @since 1.0.0
 * @deprecated
 */
export const any: AnyType = new AnyType()

/**
 * @since 1.5.0
 */
export class UnknownType extends Type<unknown, unknown, unknown> {
  readonly _tag: 'UnknownType' = 'UnknownType'
  constructor() {
    super('unknown', (_): _ is unknown => true, success, identity)
  }
}

/**
 * @since 1.5.0
 */
export const unknown: UnknownType = new UnknownType()

/**
 * @since 1.0.0
 * @deprecated
 */
export class NeverType extends Type<never, never, unknown> {
  readonly _tag: 'NeverType' = 'NeverType'
  constructor() {
    super(
      'never',
      (_): _ is never => false,
      (m, c) => failure(m, c),
      /* istanbul ignore next */
      () => {
        throw new Error('cannot encode never')
      }
    )
  }
}

/**
 * @since 1.0.0
 * @deprecated
 */
export const never: NeverType = new NeverType()

/**
 * @since 1.0.0
 */
export class StringType extends Type<string, string, unknown> {
  readonly _tag: 'StringType' = 'StringType'
  constructor() {
    super(
      'string',
      (m): m is string => typeof m === 'string',
      (m, c) => (this.is(m) ? success(m) : failure(m, c)),
      identity
    )
  }
}

/**
 * @since 1.0.0
 */
export const string: StringType = new StringType()

/**
 * @since 1.0.0
 */
export class NumberType extends Type<number, number, unknown> {
  readonly _tag: 'NumberType' = 'NumberType'
  constructor() {
    super(
      'number',
      (m): m is number => typeof m === 'number',
      (m, c) => (this.is(m) ? success(m) : failure(m, c)),
      identity
    )
  }
}

/**
 * @since 1.0.0
 */
export const number: NumberType = new NumberType()

/**
 * @since 1.0.0
 */
export class BooleanType extends Type<boolean, boolean, unknown> {
  readonly _tag: 'BooleanType' = 'BooleanType'
  constructor() {
    super(
      'boolean',
      (m): m is boolean => typeof m === 'boolean',
      (m, c) => (this.is(m) ? success(m) : failure(m, c)),
      identity
    )
  }
}

/**
 * @since 1.0.0
 */
export const boolean: BooleanType = new BooleanType()

/**
 * @since 1.0.0
 */
export class AnyArrayType extends Type<Array<unknown>, Array<unknown>, unknown> {
  readonly _tag: 'AnyArrayType' = 'AnyArrayType'
  constructor() {
    super('Array', Array.isArray, (u, c) => (this.is(u) ? success(u) : failure(u, c)), identity)
  }
}

const arrayType: AnyArrayType = new AnyArrayType()

/**
 * @since 1.0.0
 */
export class AnyDictionaryType extends Type<Record<string, unknown>, Record<string, unknown>, unknown> {
  readonly _tag: 'AnyDictionaryType' = 'AnyDictionaryType'
  constructor() {
    super(
      'Dictionary',
      (u): u is { [key: string]: unknown } => u !== null && typeof u === 'object',
      (u, c) => (this.is(u) ? success(u) : failure(u, c)),
      identity
    )
  }
}

/**
 * @since 1.0.0
 */
export const Dictionary: AnyDictionaryType = new AnyDictionaryType()

/**
 * @since 1.0.0
 * @deprecated
 */
export class ObjectType extends Type<object, object, unknown> {
  readonly _tag: 'ObjectType' = 'ObjectType'
  constructor() {
    super('object', Dictionary.is, Dictionary.validate, identity)
  }
}

/**
 * @since 1.0.0
 * @deprecated
 */
export const object: ObjectType = new ObjectType()

/**
 * @since 1.0.0
 * @deprecated
 */
export class FunctionType extends Type<Function, Function, unknown> {
  readonly _tag: 'FunctionType' = 'FunctionType'
  constructor() {
    super(
      'Function',
      (m): m is Function => typeof m === 'function',
      (m, c) => (this.is(m) ? success(m) : failure(m, c)),
      identity
    )
  }
}

/**
 * @since 1.0.0
 * @deprecated
 */
export const Function: FunctionType = new FunctionType()

/**
 * @since 1.0.0
 */
export class RefinementType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'RefinementType' = 'RefinementType'
  constructor(
    name: string,
    is: RefinementType<T, A, O, I>['is'],
    validate: RefinementType<T, A, O, I>['validate'],
    encode: RefinementType<T, A, O, I>['encode'],
    readonly type: T,
    readonly predicate: Predicate<A>
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export const refinement = <T extends Any>(
  type: T,
  predicate: Predicate<TypeOf<T>>,
  name: string = `(${type.name} | ${getFunctionName(predicate)})`
): RefinementType<T, TypeOf<T>, OutputOf<T>, InputOf<T>> =>
  new RefinementType(
    name,
    (m): m is TypeOf<T> => type.is(m) && predicate(m),
    (i, c) => {
      const validation = type.validate(i, c)
      if (validation.isLeft()) {
        return validation
      } else {
        const a = validation.value
        return predicate(a) ? success(a) : failure(a, c)
      }
    },
    type.encode,
    type,
    predicate
  )

/**
 * @since 1.0.0
 */
export const Integer = refinement(number, n => n % 1 === 0, 'Integer')

type LiteralValue = string | number | boolean

/**
 * @since 1.0.0
 */
export class LiteralType<V extends LiteralValue> extends Type<V, V, unknown> {
  readonly _tag: 'LiteralType' = 'LiteralType'
  constructor(
    name: string,
    is: LiteralType<V>['is'],
    validate: LiteralType<V>['validate'],
    encode: LiteralType<V>['encode'],
    readonly value: V
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export const literal = <V extends LiteralValue>(value: V, name: string = JSON.stringify(value)): LiteralType<V> => {
  const is = (u: unknown): u is V => u === value
  return new LiteralType(name, is, (u, c) => (is(u) ? success(value) : failure(u, c)), identity, value)
}

/**
 * @since 1.0.0
 */
export class KeyofType<D extends { [key: string]: unknown }> extends Type<keyof D, keyof D, unknown> {
  readonly _tag: 'KeyofType' = 'KeyofType'
  constructor(
    name: string,
    is: KeyofType<D>['is'],
    validate: KeyofType<D>['validate'],
    encode: KeyofType<D>['encode'],
    readonly keys: D
  ) {
    super(name, is, validate, encode)
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * @since 1.0.0
 */
export const keyof = <D extends { [key: string]: unknown }>(
  keys: D,
  name: string = `(keyof ${JSON.stringify(Object.keys(keys))})`
): KeyofType<D> => {
  const is = (u: unknown): u is keyof D => string.is(u) && hasOwnProperty.call(keys, u)
  return new KeyofType(name, is, (m, c) => (is(m) ? success(m) : failure(m, c)), identity, keys)
}

/**
 * @since 1.0.0
 */
export class RecursiveType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'RecursiveType' = 'RecursiveType'
  constructor(
    name: string,
    is: RecursiveType<T, A, O, I>['is'],
    validate: RecursiveType<T, A, O, I>['validate'],
    encode: RecursiveType<T, A, O, I>['encode'],
    private runDefinition: () => T
  ) {
    super(name, is, validate, encode)
  }
  get type(): T {
    return this.runDefinition()
  }
}

/**
 * @since 1.0.0
 */
export const recursion = <A, O = A, I = unknown, T extends Type<A, O, I> = Type<A, O, I>>(
  name: string,
  definition: (self: T) => T
): RecursiveType<T, A, O, I> => {
  let cache: T
  const runDefinition = (): T => {
    if (!cache) {
      cache = definition(Self)
    }
    return cache
  }
  const Self: any = new RecursiveType<T, A, O, I>(
    name,
    (m): m is A => runDefinition().is(m),
    (m, c) => runDefinition().validate(m, c),
    a => runDefinition().encode(a),
    runDefinition
  )
  return Self
}

/**
 * @since 1.0.0
 */
export class ArrayType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'ArrayType' = 'ArrayType'
  constructor(
    name: string,
    is: ArrayType<T, A, O, I>['is'],
    validate: ArrayType<T, A, O, I>['validate'],
    encode: ArrayType<T, A, O, I>['encode'],
    readonly type: T
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export const array = <T extends Mixed>(
  type: T,
  name: string = `Array<${type.name}>`
): ArrayType<T, Array<TypeOf<T>>, Array<OutputOf<T>>, unknown> =>
  new ArrayType(
    name,
    (m): m is Array<TypeOf<T>> => arrayType.is(m) && m.every(type.is),
    (m, c) => {
      const arrayValidation = arrayType.validate(m, c)
      if (arrayValidation.isLeft()) {
        return arrayValidation
      } else {
        const xs = arrayValidation.value
        const len = xs.length
        let a: Array<TypeOf<T>> = xs
        const errors: Errors = []
        for (let i = 0; i < len; i++) {
          const x = xs[i]
          const validation = type.validate(x, appendContext(c, String(i), type))
          if (validation.isLeft()) {
            pushAll(errors, validation.value)
          } else {
            const vx = validation.value
            if (vx !== x) {
              if (a === xs) {
                a = xs.slice()
              }
              a[i] = vx
            }
          }
        }
        return errors.length ? failures(errors) : success(a)
      }
    },
    type.encode === identity ? identity : a => a.map(type.encode),
    type
  )

/**
 * @since 1.0.0
 */
export class InterfaceType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'InterfaceType' = 'InterfaceType'
  constructor(
    name: string,
    is: InterfaceType<P, A, O, I>['is'],
    validate: InterfaceType<P, A, O, I>['validate'],
    encode: InterfaceType<P, A, O, I>['encode'],
    readonly props: P
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export interface AnyProps {
  [key: string]: Any
}

const getNameFromProps = (props: Props): string =>
  `{ ${Object.keys(props)
    .map(k => `${k}: ${props[k].name}`)
    .join(', ')} }`

const useIdentity = (types: Array<Any>, len: number): boolean => {
  for (let i = 0; i < len; i++) {
    if (types[i].encode !== identity) {
      return false
    }
  }
  return true
}

/**
 * @since 1.0.0
 * @deprecated
 */
export type TypeOfProps<P extends AnyProps> = { [K in keyof P]: TypeOf<P[K]> }

/**
 * @since 1.0.0
 * @deprecated
 */
export type OutputOfProps<P extends AnyProps> = { [K in keyof P]: OutputOf<P[K]> }

/**
 * @since 1.0.0
 */
export interface Props {
  [key: string]: Mixed
}

/**
 * @alias `interface`
 * @since 1.0.0
 */
export const type = <P extends Props>(
  props: P,
  name: string = getNameFromProps(props)
): InterfaceType<P, { [K in keyof P]: TypeOf<P[K]> }, { [K in keyof P]: OutputOf<P[K]> }, unknown> => {
  const keys = Object.keys(props)
  const types = keys.map(key => props[key])
  const len = keys.length
  return new InterfaceType(
    name,
    (m): m is { [K in keyof P]: TypeOf<P[K]> } => {
      if (!Dictionary.is(m)) {
        return false
      }
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        if (!hasOwnProperty.call(m, k) || !types[i].is(m[k])) {
          return false
        }
      }
      return true
    },
    (m, c) => {
      const dictionaryValidation = Dictionary.validate(m, c)
      if (dictionaryValidation.isLeft()) {
        return dictionaryValidation
      } else {
        const o = dictionaryValidation.value
        let a = o
        const errors: Errors = []
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          if (!hasOwnProperty.call(a, k)) {
            if (a === o) {
              a = { ...o }
            }
            a[k] = a[k]
          }
          const ak = a[k]
          const type = types[i]
          const validation = type.validate(ak, appendContext(c, k, type))
          if (validation.isLeft()) {
            pushAll(errors, validation.value)
          } else {
            const vak = validation.value
            if (vak !== ak) {
              /* istanbul ignore next */
              if (a === o) {
                a = { ...o }
              }
              a[k] = vak
            }
          }
        }
        return errors.length ? failures(errors) : success(a as any)
      }
    },
    useIdentity(types, len)
      ? identity
      : a => {
          const s: { [x: string]: any } = { ...a }
          for (let i = 0; i < len; i++) {
            const k = keys[i]
            const encode = types[i].encode
            if (encode !== identity) {
              s[k] = encode(a[k])
            }
          }
          return s as any
        },
    props
  )
}

/**
 * @since 1.0.0
 */
export class PartialType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'PartialType' = 'PartialType'
  constructor(
    name: string,
    is: PartialType<P, A, O, I>['is'],
    validate: PartialType<P, A, O, I>['validate'],
    encode: PartialType<P, A, O, I>['encode'],
    readonly props: P
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 * @deprecated
 */
export type TypeOfPartialProps<P extends AnyProps> = { [K in keyof P]?: TypeOf<P[K]> }

/**
 * @since 1.0.0
 * @deprecated
 */
export type OutputOfPartialProps<P extends AnyProps> = { [K in keyof P]?: OutputOf<P[K]> }

/**
 * @since 1.0.0
 */
export const partial = <P extends Props>(
  props: P,
  name: string = `PartialType<${getNameFromProps(props)}>`
): PartialType<P, { [K in keyof P]?: TypeOf<P[K]> }, { [K in keyof P]?: OutputOf<P[K]> }, unknown> => {
  const keys = Object.keys(props)
  const types = keys.map(key => props[key])
  const len = keys.length
  const partials: Props = {}
  for (let i = 0; i < len; i++) {
    partials[keys[i]] = union([types[i], undefinedType])
  }
  return new PartialType(
    name,
    (m): m is { [K in keyof P]?: TypeOf<P[K]> } => {
      if (!Dictionary.is(m)) {
        return false
      }
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        if (!partials[k].is(m[k])) {
          return false
        }
      }
      return true
    },
    (m, c) => {
      const dictionaryValidation = Dictionary.validate(m, c)
      if (dictionaryValidation.isLeft()) {
        return dictionaryValidation
      } else {
        const o = dictionaryValidation.value
        let a = o
        const errors: Errors = []
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          const ak = a[k]
          const type = partials[k]
          const validation = type.validate(ak, appendContext(c, k, type))
          if (validation.isLeft()) {
            pushAll(errors, validation.value)
          } else {
            const vak = validation.value
            if (vak !== ak) {
              /* istanbul ignore next */
              if (a === o) {
                a = { ...o }
              }
              a[k] = vak
            }
          }
        }
        return errors.length ? failures(errors) : success(a as any)
      }
    },
    useIdentity(types, len)
      ? identity
      : a => {
          const s: { [key: string]: any } = { ...a }
          for (let i = 0; i < len; i++) {
            const k = keys[i]
            const ak = a[k]
            if (ak !== undefined) {
              s[k] = types[i].encode(ak)
            }
          }
          return s as any
        },
    props
  )
}

/**
 * @since 1.0.0
 */
export class DictionaryType<D extends Any, C extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'DictionaryType' = 'DictionaryType'
  constructor(
    name: string,
    is: DictionaryType<D, C, A, O, I>['is'],
    validate: DictionaryType<D, C, A, O, I>['validate'],
    encode: DictionaryType<D, C, A, O, I>['encode'],
    readonly domain: D,
    readonly codomain: C
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 * @deprecated
 */
export type TypeOfDictionary<D extends Any, C extends Any> = { [K in TypeOf<D>]: TypeOf<C> }

/**
 * @since 1.0.0
 * @deprecated
 */
export type OutputOfDictionary<D extends Any, C extends Any> = { [K in OutputOf<D>]: OutputOf<C> }

const refinedDictionary = refinement(Dictionary, d => Object.prototype.toString.call(d) === '[object Object]')

/**
 * @since 1.0.0
 */
export const dictionary = <D extends Mixed, C extends Mixed>(
  domain: D,
  codomain: C,
  name: string = `{ [K in ${domain.name}]: ${codomain.name} }`
): DictionaryType<D, C, { [K in TypeOf<D>]: TypeOf<C> }, { [K in OutputOf<D>]: OutputOf<C> }, unknown> => {
  const isIndexSignatureRequired = (codomain as any) !== any
  const D = isIndexSignatureRequired ? refinedDictionary : Dictionary
  return new DictionaryType(
    name,
    (m): m is { [K in TypeOf<D>]: TypeOf<C> } =>
      D.is(m) && Object.keys(m).every(k => domain.is(k) && codomain.is(m[k])),
    (m, c) => {
      const dictionaryValidation = D.validate(m, c)
      if (dictionaryValidation.isLeft()) {
        return dictionaryValidation
      } else {
        const o = dictionaryValidation.value
        const a: { [key: string]: any } = {}
        const errors: Errors = []
        const keys = Object.keys(o)
        const len = keys.length
        let changed: boolean = false
        for (let i = 0; i < len; i++) {
          let k = keys[i]
          const ok = o[k]
          const domainValidation = domain.validate(k, appendContext(c, k, domain))
          const codomainValidation = codomain.validate(ok, appendContext(c, k, codomain))
          if (domainValidation.isLeft()) {
            pushAll(errors, domainValidation.value)
          } else {
            const vk = domainValidation.value
            changed = changed || vk !== k
            k = vk
          }
          if (codomainValidation.isLeft()) {
            pushAll(errors, codomainValidation.value)
          } else {
            const vok = codomainValidation.value
            changed = changed || vok !== ok
            a[k] = vok
          }
        }
        return errors.length ? failures(errors) : success((changed ? a : o) as any)
      }
    },
    domain.encode === identity && codomain.encode === identity
      ? identity
      : a => {
          const s: { [key: string]: any } = {}
          const keys = Object.keys(a)
          const len = keys.length
          for (let i = 0; i < len; i++) {
            const k = keys[i]
            s[String(domain.encode(k))] = codomain.encode(a[k])
          }
          return s as any
        },
    domain,
    codomain
  )
}

/**
 * @since 1.0.0
 */
export class UnionType<TS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'UnionType' = 'UnionType'
  constructor(
    name: string,
    is: UnionType<TS, A, O, I>['is'],
    validate: UnionType<TS, A, O, I>['validate'],
    encode: UnionType<TS, A, O, I>['encode'],
    readonly types: TS
  ) {
    super(name, is, validate, encode)
  }
}

interface Index extends Record<string, Array<[unknown, Mixed]>> {}

const isLiteralType = (type: Mixed): type is LiteralType<any> => type instanceof LiteralType

const isInterfaceType = (type: Mixed): type is InterfaceType<Props> => type instanceof InterfaceType

const isStrictType = (type: Mixed): type is StrictType<Props> => type instanceof StrictType

export const isIntersectionType = (type: Mixed): type is IntersectionType<Array<Any>> =>
  type instanceof IntersectionType

export const isUnionType = (type: Mixed): type is UnionType<Array<Any>> => type instanceof UnionType

export const isExact = (type: Mixed): type is ExactType<Mixed> => type instanceof ExactType

export const getTypeIndex = (type: Mixed, override: Mixed = type): Index => {
  let r: Index = {}
  if (isInterfaceType(type) || isStrictType(type)) {
    for (let k in type.props) {
      const prop = type.props[k]
      if (isLiteralType(prop)) {
        const value = prop.value
        r[k] = [[value, override]]
      }
    }
  } else if (isIntersectionType(type)) {
    const types = type.types
    r = getTypeIndex(types[0], type)
    for (let i = 1; i < types.length; i++) {
      const ti = getTypeIndex(types[i], type)
      for (const k in ti) {
        if (r.hasOwnProperty(k)) {
          r[k].push(...ti[k])
        } else {
          r[k] = ti[k]
        }
      }
    }
  } else if (isUnionType(type)) {
    return getIndex(type.types)
  } else if (isExact(type)) {
    return getTypeIndex(type.type, type)
  }
  return r
}

export const getIndex = (types: Array<Mixed>): Index => {
  const r: Index = getTypeIndex(types[0])
  for (let i = 1; i < types.length; i++) {
    const ti = getTypeIndex(types[i])
    for (const k in r) {
      if (ti.hasOwnProperty(k)) {
        const ips = r[k]
        const tips = ti[k]
        loop: for (let j = 0; j < tips.length; j++) {
          const tip = tips[j]
          const ii = ips.findIndex(([v]) => v === tip[0])
          if (ii === -1) {
            ips.push(tip)
          } else if (tips[ii][1] !== ips[ii][1]) {
            delete r[k]
            break loop
          }
        }
      } else {
        delete r[k]
      }
    }
  }
  return r
}

const first = (index: Index): [string, Array<[unknown, Mixed]>] | undefined => {
  for (let k in index) {
    return [k, index[k]]
  }
  return undefined
}

/**
 * @since 1.0.0
 */
export const union = <TS extends [Mixed, Mixed, ...Array<Mixed>]>(
  types: TS,
  name: string = `(${types.map(type => type.name).join(' | ')})`
): UnionType<TS, TypeOf<TS[number]>, OutputOf<TS[number]>, unknown> => {
  const len = types.length
  const index = first(getIndex(types))
  if (index) {
    const tag = index[0]
    const pairs = index[1]
    const find = (tagValue: unknown): [number, Mixed] | undefined => {
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i]
        if (pair[0] === tagValue) {
          return [i, pair[1]]
        }
      }
    }
    const isTagValue = (u: unknown): u is LiteralValue => find(u) !== undefined
    const TagValue = new Type<LiteralValue, LiteralValue, unknown>(
      pairs.map(([v]) => JSON.stringify(v)).join(' | '),
      isTagValue,
      (m, c) => (isTagValue(m) ? success(m) : failure(m, c)),
      identity
    )
    return new UnionType(
      name,
      (u): u is TypeOf<TS[number]> => {
        if (!Dictionary.is(u)) {
          return false
        }
        const tagValue = u[tag]
        const type = find(tagValue)
        return type ? type[1].is(u) : false
      },
      (u, c) => {
        const dictionaryResult = Dictionary.validate(u, c)
        if (dictionaryResult.isLeft()) {
          return dictionaryResult
        } else {
          const d = dictionaryResult.value
          const tagValue = d[tag]
          const tagValueValidation = TagValue.validate(d[tag], appendContext(c, tag, TagValue))
          if (tagValueValidation.isLeft()) {
            return tagValueValidation
          }
          const [typeIndex, type] = find(tagValue)!
          return type.validate(d, appendContext(c, String(typeIndex), type))
        }
      },
      useIdentity(types, len) ? identity : a => find(a[tag])![1].encode(a),
      types
    )
  } else {
    return new UnionType(
      name,
      (m): m is TypeOf<TS[number]> => types.some(type => type.is(m)),
      (m, c) => {
        const errors: Errors = []
        for (let i = 0; i < len; i++) {
          const type = types[i]
          const validation = type.validate(m, appendContext(c, String(i), type))
          if (validation.isRight()) {
            return validation
          } else {
            pushAll(errors, validation.value)
          }
        }
        return failures(errors)
      },
      useIdentity(types, len)
        ? identity
        : a => {
            let i = 0
            for (; i < len - 1; i++) {
              const type = types[i]
              if (type.is(a)) {
                return type.encode(a)
              }
            }
            return types[i].encode(a)
          },
      types
    )
  }
}

/**
 * @see https://stackoverflow.com/a/50375286#50375286
 */
type UnionToIntersection<U> = (U extends any ? (u: U) => void : never) extends ((u: infer I) => void) ? I : never

/**
 * @since 1.0.0
 */
export class IntersectionType<TS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'IntersectionType' = 'IntersectionType'
  constructor(
    name: string,
    is: IntersectionType<TS, A, O, I>['is'],
    validate: IntersectionType<TS, A, O, I>['validate'],
    encode: IntersectionType<TS, A, O, I>['encode'],
    readonly types: TS
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * used in `intersection` as a workaround for #234
 * @since 1.4.2
 * @deprecated
 */
export type Compact<A> = { [K in keyof A]: A[K] }

/**
 * @since 1.0.0
 */
export function intersection<TS extends [Mixed, Mixed, ...Array<Mixed>]>(
  types: TS,
  name: string = `(${types.map(type => type.name).join(' & ')})`
): IntersectionType<TS, UnionToIntersection<TypeOf<TS[number]>>, UnionToIntersection<OutputOf<TS[number]>>, unknown> {
  const len = types.length
  return new IntersectionType(
    name,
    (m): m is any => types.every(type => type.is(m)),
    (m, c) => {
      let a = m
      const errors: Errors = []
      for (let i = 0; i < len; i++) {
        const type = types[i]
        const validation = type.validate(a, c)
        if (validation.isLeft()) {
          pushAll(errors, validation.value)
        } else {
          a = validation.value
        }
      }
      return errors.length ? failures(errors) : success(a)
    },
    useIdentity(types, len)
      ? identity
      : a => {
          let s = a
          for (let i = 0; i < len; i++) {
            const type = types[i]
            s = type.encode(s)
          }
          return s
        },
    types
  )
}

/**
 * @since 1.0.0
 */
export class TupleType<TS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'TupleType' = 'TupleType'
  constructor(
    name: string,
    is: TupleType<TS, A, O, I>['is'],
    validate: TupleType<TS, A, O, I>['validate'],
    encode: TupleType<TS, A, O, I>['encode'],
    readonly types: TS
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export function tuple<TS extends [Mixed, Mixed, ...Array<Mixed>]>(
  types: TS,
  name: string = `[${types.map(type => type.name).join(', ')}]`
): TupleType<TS, { [K in keyof TS]: TypeOf<TS[K]> }, { [K in keyof TS]: OutputOf<TS[K]> }, unknown> {
  const len = types.length
  return new TupleType(
    name,
    (m): m is any => arrayType.is(m) && m.length === len && types.every((type, i) => type.is(m[i])),
    (m, c) => {
      const arrayValidation = arrayType.validate(m, c)
      if (arrayValidation.isLeft()) {
        return arrayValidation
      } else {
        const as = arrayValidation.value
        let t: Array<any> = as
        const errors: Errors = []
        for (let i = 0; i < len; i++) {
          const a = as[i]
          const type = types[i]
          const validation = type.validate(a, appendContext(c, String(i), type))
          if (validation.isLeft()) {
            pushAll(errors, validation.value)
          } else {
            const va = validation.value
            if (va !== a) {
              /* istanbul ignore next */
              if (t === as) {
                t = as.slice()
              }
              t[i] = va
            }
          }
        }
        if (as.length > len) {
          errors.push(getValidationError(as[len], appendContext(c, String(len), never)))
        }
        return errors.length ? failures(errors) : success(t)
      }
    },
    useIdentity(types, len) ? identity : a => types.map((type, i) => type.encode(a[i])),
    types
  )
}

/**
 * @since 1.0.0
 */
export class ReadonlyType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'ReadonlyType' = 'ReadonlyType'
  constructor(
    name: string,
    is: ReadonlyType<T, A, O, I>['is'],
    validate: ReadonlyType<T, A, O, I>['validate'],
    encode: ReadonlyType<T, A, O, I>['encode'],
    readonly type: T
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export const readonly = <T extends Mixed>(
  type: T,
  name: string = `Readonly<${type.name}>`
): ReadonlyType<T, Readonly<TypeOf<T>>, Readonly<OutputOf<T>>, unknown> =>
  new ReadonlyType(
    name,
    type.is,
    (m, c) =>
      type.validate(m, c).map(x => {
        if (process.env.NODE_ENV !== 'production') {
          return Object.freeze(x)
        }
        return x
      }),
    type.encode === identity ? identity : type.encode,
    type
  )

/**
 * @since 1.0.0
 */
export class ReadonlyArrayType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'ReadonlyArrayType' = 'ReadonlyArrayType'
  constructor(
    name: string,
    is: ReadonlyArrayType<T, A, O, I>['is'],
    validate: ReadonlyArrayType<T, A, O, I>['validate'],
    encode: ReadonlyArrayType<T, A, O, I>['encode'],
    readonly type: T
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.0.0
 */
export const readonlyArray = <T extends Mixed>(
  type: T,
  name: string = `ReadonlyArray<${type.name}>`
): ReadonlyArrayType<T, ReadonlyArray<TypeOf<T>>, ReadonlyArray<OutputOf<T>>, unknown> => {
  const arrayType = array(type)
  return new ReadonlyArrayType(
    name,
    arrayType.is,
    (m, c) =>
      arrayType.validate(m, c).map(x => {
        if (process.env.NODE_ENV !== 'production') {
          return Object.freeze(x)
        } else {
          return x
        }
      }),
    arrayType.encode as any,
    type
  )
}

/**
 * @since 1.0.0
 */
export class StrictType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'StrictType' = 'StrictType'
  constructor(
    name: string,
    is: StrictType<P, A, O, I>['is'],
    validate: StrictType<P, A, O, I>['validate'],
    encode: StrictType<P, A, O, I>['encode'],
    readonly props: P
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * Specifies that only the given properties are allowed
 * @deprecated use `exact` instead
 * @since 1.0.0
 */
export const strict = <P extends Props>(
  props: P,
  name: string = `StrictType<${getNameFromProps(props)}>`
): StrictType<P, { [K in keyof P]: TypeOf<P[K]> }, { [K in keyof P]: OutputOf<P[K]> }, unknown> => {
  const exactType = exact(type(props))
  return new StrictType(name, exactType.is, exactType.validate, exactType.encode, props)
}

/**
 * @since 1.3.0
 */
export type TaggedProps<Tag extends string> = { [K in Tag]: LiteralType<any> }
/**
 * @since 1.3.0
 */
export interface TaggedRefinement<Tag extends string, A, O = A> extends RefinementType<Tagged<Tag>, A, O> {}
/**
 * @since 1.3.0
 */
export interface TaggedUnion<Tag extends string, A, O = A> extends UnionType<Array<Tagged<Tag>>, A, O> {}
/**
 * @since 1.3.0
 */
export type TaggedIntersectionArgument<Tag extends string> =
  | [Tagged<Tag>]
  | [Tagged<Tag>, Mixed]
  | [Mixed, Tagged<Tag>]
  | [Tagged<Tag>, Mixed, Mixed]
  | [Mixed, Tagged<Tag>, Mixed]
  | [Mixed, Mixed, Tagged<Tag>]
  | [Tagged<Tag>, Mixed, Mixed, Mixed]
  | [Mixed, Tagged<Tag>, Mixed, Mixed]
  | [Mixed, Mixed, Tagged<Tag>, Mixed]
  | [Mixed, Mixed, Mixed, Tagged<Tag>]
  | [Tagged<Tag>, Mixed, Mixed, Mixed, Mixed]
  | [Mixed, Tagged<Tag>, Mixed, Mixed, Mixed]
  | [Mixed, Mixed, Tagged<Tag>, Mixed, Mixed]
  | [Mixed, Mixed, Mixed, Tagged<Tag>, Mixed]
  | [Mixed, Mixed, Mixed, Mixed, Tagged<Tag>]
/**
 * @since 1.3.0
 */
export interface TaggedIntersection<Tag extends string, A, O = A>
  extends IntersectionType<TaggedIntersectionArgument<Tag>, A, O> {}
/**
 * @since 1.3.0
 */
export interface TaggedExact<Tag extends string, A, O = A> extends ExactType<Tagged<Tag>, A, O> {}
/**
 * @since 1.3.0
 */
export type Tagged<Tag extends string, A = any, O = A> =
  | InterfaceType<TaggedProps<Tag>, A, O>
  | StrictType<TaggedProps<Tag>, A, O>
  | TaggedRefinement<Tag, A, O>
  | TaggedUnion<Tag, A, O>
  | TaggedIntersection<Tag, A, O>
  | TaggedExact<Tag, A, O>
  | RecursiveType<any, A, O>

/**
 * @since 1.3.0
 */
export const isTagged = <Tag extends string>(tag: Tag): ((type: Mixed) => type is Tagged<Tag>) => {
  const f = (type: Mixed): type is Tagged<Tag> => {
    if (type instanceof InterfaceType || type instanceof StrictType) {
      return hasOwnProperty.call(type.props, tag)
    } else if (type instanceof IntersectionType) {
      return type.types.some(f)
    } else if (type instanceof UnionType) {
      return type.types.every(f)
    } else if (type instanceof RefinementType || type instanceof ExactType) {
      return f(type.type)
    } else {
      return false
    }
  }
  return f
}

const findTagged = <Tag extends string>(tag: Tag, types: TaggedIntersectionArgument<Tag>): Tagged<Tag> => {
  const len = types.length
  const is = isTagged(tag)
  let i = 0
  for (; i < len - 1; i++) {
    const type = types[i]
    if (is(type)) {
      return type
    }
  }
  return types[i] as any
}

/**
 * @since 1.3.0
 */
export const getTagValue = <Tag extends string>(tag: Tag): ((type: Tagged<Tag>) => LiteralValue) => {
  const f = (type: Tagged<Tag>): string => {
    switch (type._tag) {
      case 'InterfaceType':
      case 'StrictType':
        return type.props[tag].value
      case 'IntersectionType':
        return f(findTagged(tag, type.types))
      case 'UnionType':
        return f(type.types[0])
      case 'RefinementType':
      case 'ExactType':
      case 'RecursiveType':
        return f(type.type)
    }
  }
  return f
}

/**
 * @since 1.3.0
 */
export class TaggedUnionType<
  Tag extends string,
  TS extends Array<Tagged<Tag>>,
  A = any,
  O = A,
  I = unknown
> extends UnionType<TS, A, O, I> {
  constructor(
    name: string,
    is: TaggedUnionType<Tag, TS, A, O, I>['is'],
    validate: TaggedUnionType<Tag, TS, A, O, I>['validate'],
    encode: TaggedUnionType<Tag, TS, A, O, I>['encode'],
    types: TS,
    readonly tag: Tag
  ) {
    super(name, is, validate, encode, types) /* istanbul ignore next */ // <= workaround for https://github.com/Microsoft/TypeScript/issues/13455
  }
}

/**
 * Use `union` instead
 *
 * @since 1.3.0
 * @deprecated
 */
export const taggedUnion = <Tag extends string, TS extends Array<Tagged<Tag>>>(
  tag: Tag,
  types: TS,
  name: string = `(${types.map(type => type.name).join(' | ')})`
): TaggedUnionType<Tag, TS, TypeOf<TS[number]>, OutputOf<TS[number]>, unknown> => {
  const len = types.length
  const values = types.map(getTagValue(tag))
  const findIndex = (tagValue: LiteralValue): number => {
    let i = 0
    for (; i < len - 1; i++) {
      if (values[i] === tagValue) {
        break
      }
    }
    return i
  }
  const isTagValue = (u: unknown): u is LiteralValue => values.indexOf(u as any) !== -1
  const TagValue = new Type<LiteralValue, LiteralValue, unknown>(
    values.map(l => JSON.stringify(l)).join(' | '),
    isTagValue,
    (u, c) => (isTagValue(u) ? success(u) : failure(u, c)),
    identity
  )
  return new TaggedUnionType<Tag, TS, TypeOf<TS[number]>, OutputOf<TS[number]>, unknown>(
    name,
    (v): v is TypeOf<TS[number]> => {
      if (!Dictionary.is(v)) {
        return false
      }
      const tagValue = v[tag]
      return isTagValue(tagValue) && types[findIndex(tagValue)].is(v)
    },
    (s, c) => {
      const dictionaryValidation = Dictionary.validate(s, c)
      if (dictionaryValidation.isLeft()) {
        return dictionaryValidation
      } else {
        const d = dictionaryValidation.value
        const tagValueValidation = TagValue.validate(d[tag], appendContext(c, tag, TagValue))
        if (tagValueValidation.isLeft()) {
          return tagValueValidation
        } else {
          const i = findIndex(tagValueValidation.value)
          const type = types[i]
          return type.validate(d, appendContext(c, String(i), type))
        }
      }
    },
    useIdentity(types, len) ? identity : a => types[findIndex(a[tag])].encode(a),
    types,
    tag
  )
}

/**
 * @since 1.1.0
 */
export class ExactType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
  readonly _tag: 'ExactType' = 'ExactType'
  constructor(
    name: string,
    is: ExactType<T, A, O, I>['is'],
    validate: ExactType<T, A, O, I>['validate'],
    encode: ExactType<T, A, O, I>['encode'],
    readonly type: T
  ) {
    super(name, is, validate, encode)
  }
}

/**
 * @since 1.1.0
 */
export interface HasPropsRefinement extends RefinementType<HasProps, any, any, any> {}
/**
 * @since 1.1.0
 */
export interface HasPropsReadonly extends ReadonlyType<HasProps, any, any, any> {}
/**
 * @since 1.1.0
 */
export interface HasPropsIntersection extends IntersectionType<Array<HasProps>, any, any, any> {}
/**
 * @since 1.1.0
 */
export type HasProps =
  | HasPropsRefinement
  | HasPropsReadonly
  | HasPropsIntersection
  | InterfaceType<any, any, any, any>
  | StrictType<any, any, any, any>
  | PartialType<any, any, any, any>

const getProps = (type: HasProps): Props => {
  switch (type._tag) {
    case 'RefinementType':
    case 'ReadonlyType':
      return getProps(type.type)
    case 'InterfaceType':
    case 'StrictType':
    case 'PartialType':
      return type.props
    case 'IntersectionType':
      return type.types.reduce<Props>((props, type) => Object.assign(props, getProps(type)), {})
  }
}

/**
 * @since 1.1.0
 */
export function exact<T extends HasProps>(
  type: T,
  name: string = `ExactType<${type.name}>`
): ExactType<T, TypeOf<T>, OutputOf<T>, InputOf<T>> {
  const props: Props = getProps(type)
  return new ExactType(
    name,
    (m): m is TypeOf<T> => type.is(m) && Object.getOwnPropertyNames(m).every(k => hasOwnProperty.call(props, k)),
    (m, c) => {
      const looseValidation = type.validate(m, c)
      if (looseValidation.isLeft()) {
        return looseValidation
      } else {
        const o = looseValidation.value
        const keys = Object.getOwnPropertyNames(o)
        const len = keys.length
        const errors: Errors = []
        for (let i = 0; i < len; i++) {
          const key = keys[i]
          if (!hasOwnProperty.call(props, key)) {
            errors.push(getValidationError(o[key], appendContext(c, key, never)))
          }
        }
        return errors.length ? failures(errors) : success(o)
      }
    },
    type.encode,
    type
  )
}

/**
 * Drops the runtime type "kind"
 * @since 1.1.0
 */
export function clean<A, O = A, I = unknown>(type: Type<A, O, I>): Type<A, O, I> {
  return type as any
}

/**
 * @since 1.0.0
 */
export type PropsOf<T extends { props: any }> = T['props']

/**
 * @since 1.1.0
 */
export type Exact<T, X extends T> = T &
  { [K in ({ [K in keyof X]: K } & { [K in keyof T]: never } & { [key: string]: never })[keyof X]]?: never }

/**
 * Keeps the runtime type "kind"
 * @since 1.1.0
 */
export function alias<A, O, P, I>(
  type: PartialType<P, A, O, I>
): <
  AA extends Exact<A, AA>,
  OO extends Exact<O, OO> = O,
  PP extends Exact<P, PP> = P,
  II extends I = I
>() => PartialType<PP, AA, OO, II>
export function alias<A, O, P, I>(
  type: StrictType<P, A, O, I>
): <
  AA extends Exact<A, AA>,
  OO extends Exact<O, OO> = O,
  PP extends Exact<P, PP> = P,
  II extends I = I
>() => StrictType<PP, AA, OO, II>
export function alias<A, O, P, I>(
  type: InterfaceType<P, A, O, I>
): <
  AA extends Exact<A, AA>,
  OO extends Exact<O, OO> = O,
  PP extends Exact<P, PP> = P,
  II extends I = I
>() => InterfaceType<PP, AA, OO, II>
export function alias<A, O, I>(
  type: Type<A, O, I>
): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O>() => Type<AA, OO, I> {
  return () => type as any
}

export { nullType as null, undefinedType as undefined, arrayType as Array, type as interface, voidType as void }
