import { Either } from 'fp-ts/lib/Either';
import { Predicate } from 'fp-ts/lib/function';
/**
 * @since 1.0.0
 */
export declare type mixed = unknown;
/**
 * @since 1.0.0
 */
export interface ContextEntry {
    readonly key: string;
    readonly type: Decoder<any, any>;
}
/**
 * @since 1.0.0
 */
export interface Context extends ReadonlyArray<ContextEntry> {
}
/**
 * @since 1.0.0
 */
export interface ValidationError {
    readonly value: unknown;
    readonly context: Context;
}
/**
 * @since 1.0.0
 */
export interface Errors extends Array<ValidationError> {
}
/**
 * @since 1.0.0
 */
export declare type Validation<A> = Either<Errors, A>;
/**
 * @since 1.0.0
 */
export declare type Is<A> = (u: unknown) => u is A;
/**
 * @since 1.0.0
 */
export declare type Validate<I, A> = (i: I, context: Context) => Validation<A>;
/**
 * @since 1.0.0
 */
export declare type Decode<I, A> = (i: I) => Validation<A>;
/**
 * @since 1.0.0
 */
export declare type Encode<A, O> = (a: A) => O;
/**
 * @since 1.0.0
 */
export interface Any extends Codec<any, any, any> {
}
/**
 * @since 1.0.0
 */
export interface Mixed extends Codec<any, any, unknown> {
}
/**
 * @since 1.0.0
 */
export declare type TypeOf<C extends any> = C['_A'];
/**
 * @since 1.0.0
 */
export declare type InputOf<C extends any> = C['_I'];
/**
 * @since 1.0.0
 */
export declare type OutputOf<C extends any> = C['_O'];
/**
 * @since 1.0.0
 */
export interface Decoder<I, A> {
    readonly name: string;
    readonly validate: Validate<I, A>;
    readonly decode: Decode<I, A>;
}
/**
 * @since 1.0.0
 */
export interface Encoder<A, O> {
    readonly encode: Encode<A, O>;
}
/**
 * @since 1.0.0
 */
export declare class Codec<A, O = A, I = unknown> implements Decoder<I, A>, Encoder<A, O> {
    /** a unique name for this codec */
    readonly name: string;
    /** a custom type guard */
    readonly is: Is<A>;
    /** succeeds if a value of type I can be decoded to a value of type A */
    readonly validate: Validate<I, A>;
    /** converts a value of type A to a value of type O */
    readonly encode: Encode<A, O>;
    readonly _A: A;
    readonly _O: O;
    readonly _I: I;
    constructor(
    /** a unique name for this codec */
    name: string, 
    /** a custom type guard */
    is: Is<A>, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate: Validate<I, A>, 
    /** converts a value of type A to a value of type O */
    encode: Encode<A, O>);
    pipe<B, IB, A extends IB, OB extends A>(this: Codec<A, O, I>, ab: Codec<B, OB, IB>, name?: string): Codec<B, O, I>;
    asDecoder(): Decoder<I, A>;
    asEncoder(): Encoder<A, O>;
    /** a version of `validate` with a default context */
    decode(i: I): Validation<A>;
}
/**
 * @since 1.0.0
 */
export declare const identity: <A>(a: A) => A;
/**
 * @since 1.0.0
 */
export declare const getFunctionName: (f: Function) => string;
/**
 * @since 1.0.0
 */
export declare const getContextEntry: (key: string, decoder: Decoder<any, any>) => ContextEntry;
/**
 * @since 1.0.0
 */
export declare const getValidationError: (value: unknown, context: Context) => ValidationError;
/**
 * @since 1.0.0
 */
export declare const getDefaultContext: (decoder: Decoder<any, any>) => Context;
/**
 * @since 1.0.0
 */
export declare const appendContext: (c: Context, key: string, decoder: Decoder<any, any>) => Context;
/**
 * @since 1.0.0
 */
export declare const failures: <T>(errors: Errors) => Either<Errors, T>;
/**
 * @since 1.0.0
 */
export declare const failure: <T>(value: unknown, context: Context) => Either<Errors, T>;
/**
 * @since 1.0.0
 */
export declare const success: <T>(value: T) => Either<Errors, T>;
/**
 * @since 1.0.0
 */
export declare class NullType extends Codec<null, null, unknown> {
    readonly _tag: 'NullType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface NullC extends NullType {
}
/**
 * Use `null` instead
 * @alias `null`
 * @since 1.0.0
 * @deprecated
 */
export declare const nullType: NullC;
/**
 * @since 1.0.0
 */
export declare class UndefinedType extends Codec<undefined, undefined, unknown> {
    readonly _tag: 'UndefinedType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface UndefinedC extends UndefinedType {
}
declare const undefinedCodec: UndefinedC;
/**
 * @since 1.2.0
 * @deprecated
 */
export declare class VoidType extends Codec<void, void, unknown> {
    readonly _tag: 'VoidType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface VoidC extends VoidType {
}
/**
 * @alias `void`
 * @since 1.2.0
 * @deprecated
 */
export declare const voidType: VoidC;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class AnyType extends Codec<any, any, unknown> {
    readonly _tag: 'AnyType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface AnyC extends AnyType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const any: AnyC;
/**
 * @since 1.5.0
 */
export declare class UnknownType extends Codec<unknown, unknown, unknown> {
    readonly _tag: 'UnknownType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface UnknownC extends UnknownType {
}
/**
 * @since 1.5.0
 */
export declare const unknown: UnknownC;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class NeverType extends Codec<never, never, unknown> {
    readonly _tag: 'NeverType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface NeverC extends NeverType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const never: NeverC;
/**
 * @since 1.0.0
 */
export declare class StringType extends Codec<string, string, unknown> {
    readonly _tag: 'StringType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface StringC extends StringType {
}
/**
 * @since 1.0.0
 */
export declare const string: StringC;
/**
 * @since 1.0.0
 */
export declare class NumberType extends Codec<number, number, unknown> {
    readonly _tag: 'NumberType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface NumberC extends NumberType {
}
/**
 * @since 1.0.0
 */
export declare const number: NumberC;
/**
 * @since 1.0.0
 */
export declare class BooleanType extends Codec<boolean, boolean, unknown> {
    readonly _tag: 'BooleanType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface BooleanC extends BooleanType {
}
/**
 * @since 1.0.0
 */
export declare const boolean: BooleanC;
/**
 * @since 1.0.0
 */
export declare class AnyArrayType extends Codec<Array<unknown>, Array<unknown>, unknown> {
    readonly _tag: 'AnyArrayType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface UnknownArrayC extends AnyArrayType {
}
/**
 * @since 1.6.0
 */
export declare const UnknownArray: UnknownArrayC;
/**
 * @since 1.0.0
 */
export declare class AnyDictionaryType extends Codec<Record<string, unknown>, Record<string, unknown>, unknown> {
    readonly _tag: 'AnyDictionaryType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface UnknownRecordC extends AnyDictionaryType {
}
/**
 * @since 1.6.0
 */
export declare const UnknownRecord: UnknownRecordC;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class ObjectType extends Codec<object, object, unknown> {
    readonly _tag: 'ObjectType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface ObjectC extends ObjectType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const object: ObjectC;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class FunctionType extends Codec<Function, Function, unknown> {
    readonly _tag: 'FunctionType';
    constructor();
}
/**
 * @since 1.6.0
 */
export interface FunctionC extends FunctionType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const Function: FunctionC;
/**
 * @since 1.0.0
 */
export declare class RefinementType<C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly type: C;
    readonly predicate: Predicate<A>;
    readonly _tag: 'RefinementType';
    constructor(name: string, is: RefinementType<C, A, O, I>['is'], validate: RefinementType<C, A, O, I>['validate'], encode: RefinementType<C, A, O, I>['encode'], type: C, predicate: Predicate<A>);
}
/**
 * @since 1.6.0
 */
export interface RefinementC<C extends Any> extends RefinementType<C, TypeOf<C>, OutputOf<C>, InputOf<C>> {
}
/**
 * @since 1.0.0
 */
export declare const refinement: <C extends Any>(codec: C, predicate: Predicate<C["_A"]>, name?: string) => RefinementC<C>;
/**
 * @since 1.0.0
 */
export declare const Integer: RefinementC<NumberC>;
declare type LiteralValue = string | number | boolean;
/**
 * @since 1.0.0
 */
export declare class LiteralType<V extends LiteralValue> extends Codec<V, V, unknown> {
    readonly value: V;
    readonly _tag: 'LiteralType';
    constructor(name: string, is: LiteralType<V>['is'], validate: LiteralType<V>['validate'], encode: LiteralType<V>['encode'], value: V);
}
/**
 * @since 1.6.0
 */
export interface LiteralC<V extends LiteralValue> extends LiteralType<V> {
}
/**
 * @since 1.0.0
 */
export declare const literal: <V extends LiteralValue>(value: V, name?: string) => LiteralC<V>;
/**
 * @since 1.0.0
 */
export declare class KeyofType<D extends Record<string, unknown>> extends Codec<keyof D, keyof D, unknown> {
    readonly keys: D;
    readonly _tag: 'KeyofType';
    constructor(name: string, is: KeyofType<D>['is'], validate: KeyofType<D>['validate'], encode: KeyofType<D>['encode'], keys: D);
}
/**
 * @since 1.6.0
 */
export interface KeyofC<D extends Record<string, unknown>> extends KeyofType<D> {
}
/**
 * @since 1.0.0
 */
export declare const keyof: <D extends Record<string, unknown>>(keys: D, name?: string) => KeyofC<D>;
/**
 * @since 1.0.0
 */
export declare class RecursiveType<C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    private runDefinition;
    readonly _tag: 'RecursiveType';
    constructor(name: string, is: RecursiveType<C, A, O, I>['is'], validate: RecursiveType<C, A, O, I>['validate'], encode: RecursiveType<C, A, O, I>['encode'], runDefinition: () => C);
    readonly type: C;
}
/**
 * @since 1.0.0
 */
export declare const recursion: <A, O = A, I = unknown, T extends Codec<A, O, I> = Codec<A, O, I>>(name: string, definition: (self: T) => T) => RecursiveType<T, A, O, I>;
/**
 * @since 1.0.0
 */
export declare class ArrayType<C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly type: C;
    readonly _tag: 'ArrayType';
    constructor(name: string, is: ArrayType<C, A, O, I>['is'], validate: ArrayType<C, A, O, I>['validate'], encode: ArrayType<C, A, O, I>['encode'], type: C);
}
/**
 * @since 1.6.0
 */
export interface ArrayC<C extends Mixed> extends ArrayType<C, Array<TypeOf<C>>, Array<OutputOf<C>>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const array: <C extends Mixed>(codec: C, name?: string) => ArrayC<C>;
/**
 * @since 1.0.0
 */
export declare class InterfaceType<P, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly props: P;
    readonly _tag: 'InterfaceType';
    constructor(name: string, is: InterfaceType<P, A, O, I>['is'], validate: InterfaceType<P, A, O, I>['validate'], encode: InterfaceType<P, A, O, I>['encode'], props: P);
}
/**
 * @since 1.0.0
 */
export interface AnyProps {
    [key: string]: Any;
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type TypeOfProps<P extends AnyProps> = {
    [K in keyof P]: TypeOf<P[K]>;
};
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type OutputOfProps<P extends AnyProps> = {
    [K in keyof P]: OutputOf<P[K]>;
};
/**
 * @since 1.0.0
 */
export interface Props {
    [key: string]: Mixed;
}
/**
 * @since 1.6.0
 */
export interface TypeC<P extends Props> extends InterfaceType<P, {
    [K in keyof P]: TypeOf<P[K]>;
}, {
    [K in keyof P]: OutputOf<P[K]>;
}, unknown> {
}
/**
 * @alias `interface`
 * @since 1.0.0
 */
export declare const type: <P extends Props>(props: P, name?: string) => TypeC<P>;
/**
 * @since 1.0.0
 */
export declare class PartialType<P, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly props: P;
    readonly _tag: 'PartialType';
    constructor(name: string, is: PartialType<P, A, O, I>['is'], validate: PartialType<P, A, O, I>['validate'], encode: PartialType<P, A, O, I>['encode'], props: P);
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type TypeOfPartialProps<P extends AnyProps> = {
    [K in keyof P]?: TypeOf<P[K]>;
};
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type OutputOfPartialProps<P extends AnyProps> = {
    [K in keyof P]?: OutputOf<P[K]>;
};
/**
 * @since 1.6.0
 */
export interface PartialC<P extends Props> extends PartialType<P, {
    [K in keyof P]?: TypeOf<P[K]>;
}, {
    [K in keyof P]?: OutputOf<P[K]>;
}, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const partial: <P extends Props>(props: P, name?: string) => PartialC<P>;
/**
 * @since 1.0.0
 */
export declare class DictionaryType<D extends Any, C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly domain: D;
    readonly codomain: C;
    readonly _tag: 'DictionaryType';
    constructor(name: string, is: DictionaryType<D, C, A, O, I>['is'], validate: DictionaryType<D, C, A, O, I>['validate'], encode: DictionaryType<D, C, A, O, I>['encode'], domain: D, codomain: C);
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type TypeOfDictionary<D extends Any, C extends Any> = {
    [K in TypeOf<D>]: TypeOf<C>;
};
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type OutputOfDictionary<D extends Any, C extends Any> = {
    [K in OutputOf<D>]: OutputOf<C>;
};
/**
 * @since 1.6.0
 */
export interface RecordC<D extends Mixed, C extends Mixed> extends DictionaryType<D, C, {
    [K in TypeOf<D>]: TypeOf<C>;
}, {
    [K in OutputOf<D>]: OutputOf<C>;
}, unknown> {
}
/**
 * @since 1.6.0
 */
export declare const record: <D extends Mixed, C extends Mixed>(domain: D, codomain: C, name?: string) => RecordC<D, C>;
/**
 * @since 1.0.0
 */
export declare class UnionType<CS extends Array<Any>, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly types: CS;
    readonly _tag: 'UnionType';
    constructor(name: string, is: UnionType<CS, A, O, I>['is'], validate: UnionType<CS, A, O, I>['validate'], encode: UnionType<CS, A, O, I>['encode'], types: CS);
}
interface Index extends Record<string, Array<[unknown, Mixed]>> {
}
export declare const isIntersectionCodec: (codec: Mixed) => codec is IntersectionType<Any[], any, any, unknown>;
export declare const isUnionCodec: (codec: Mixed) => codec is UnionType<Any[], any, any, unknown>;
export declare const isExactCodec: (codec: Mixed) => codec is ExactType<Mixed, any, any, unknown>;
/**
 * @internal
 */
export declare const getTypeIndex: (codec: Mixed, override?: Mixed) => Index;
/**
 * @internal
 */
export declare const getIndex: (types: Mixed[]) => Index;
/**
 * @since 1.6.0
 */
export interface UnionC<CS extends [Mixed, Mixed, ...Array<Mixed>]> extends UnionType<CS, TypeOf<CS[number]>, OutputOf<CS[number]>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const union: <CS extends [Mixed, Mixed, ...Mixed[]]>(types: CS, name?: string) => UnionC<CS>;
/**
 * @see https://stackoverflow.com/a/50375286#50375286
 */
declare type UnionToIntersection<U> = (U extends any ? (u: U) => void : never) extends ((u: infer I) => void) ? I : never;
/**
 * @since 1.0.0
 */
export declare class IntersectionType<CS extends Array<Any>, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly types: CS;
    readonly _tag: 'IntersectionType';
    constructor(name: string, is: IntersectionType<CS, A, O, I>['is'], validate: IntersectionType<CS, A, O, I>['validate'], encode: IntersectionType<CS, A, O, I>['encode'], types: CS);
}
/**
 * used in `intersection` as a workaround for #234
 * @since 1.4.2
 * @deprecated
 */
export declare type Compact<A> = {
    [K in keyof A]: A[K];
};
/**
 * @since 1.6.0
 */
export interface IntersectionC<CS extends [Mixed, Mixed, ...Array<Mixed>]> extends IntersectionType<CS, UnionToIntersection<TypeOf<CS[number]>>, UnionToIntersection<OutputOf<CS[number]>>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare function intersection<CS extends [Mixed, Mixed, ...Array<Mixed>]>(types: CS, name?: string): IntersectionC<CS>;
/**
 * @since 1.0.0
 */
export declare class TupleType<CS extends Array<Any>, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly types: CS;
    readonly _tag: 'TupleType';
    constructor(name: string, is: TupleType<CS, A, O, I>['is'], validate: TupleType<CS, A, O, I>['validate'], encode: TupleType<CS, A, O, I>['encode'], types: CS);
}
/**
 * @since 1.6.0
 */
export interface TupleC<CS extends [Mixed, Mixed, ...Array<Mixed>]> extends TupleType<CS, {
    [K in keyof CS]: TypeOf<CS[K]>;
}, {
    [K in keyof CS]: OutputOf<CS[K]>;
}, unknown> {
}
/**
 * @since 1.0.0
 */
export declare function tuple<CS extends [Mixed, Mixed, ...Array<Mixed>]>(types: CS, name?: string): TupleC<CS>;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class ReadonlyType<C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly type: C;
    readonly _tag: 'ReadonlyType';
    constructor(name: string, is: ReadonlyType<C, A, O, I>['is'], validate: ReadonlyType<C, A, O, I>['validate'], encode: ReadonlyType<C, A, O, I>['encode'], type: C);
}
/**
 * @since 1.6.0
 */
export interface ReadonlyC<C extends Mixed> extends ReadonlyType<C, {
    readonly [K in keyof TypeOf<C>]: TypeOf<C>[K];
}, {
    readonly [K in keyof OutputOf<C>]: OutputOf<C>[K];
}, unknown> {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const readonly: <C extends Mixed>(codec: C, name?: string) => ReadonlyC<C>;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class ReadonlyArrayType<C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly type: C;
    readonly _tag: 'ReadonlyArrayType';
    constructor(name: string, is: ReadonlyArrayType<C, A, O, I>['is'], validate: ReadonlyArrayType<C, A, O, I>['validate'], encode: ReadonlyArrayType<C, A, O, I>['encode'], type: C);
}
/**
 * @since 1.6.0
 */
export interface ReadonlyArrayC<C extends Mixed> extends ReadonlyArrayType<C, ReadonlyArray<TypeOf<C>>, ReadonlyArray<OutputOf<C>>, unknown> {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const readonlyArray: <C extends Mixed>(codec: C, name?: string) => ReadonlyArrayC<C>;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class StrictType<P, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly props: P;
    readonly _tag: 'StrictType';
    constructor(name: string, is: StrictType<P, A, O, I>['is'], validate: StrictType<P, A, O, I>['validate'], encode: StrictType<P, A, O, I>['encode'], props: P);
}
/**
 * @since 1.6.0
 */
export interface StrictC<P extends Props> extends StrictType<P, {
    [K in keyof P]: TypeOf<P[K]>;
}, {
    [K in keyof P]: OutputOf<P[K]>;
}, unknown> {
}
/**
 * Specifies that only the given properties are allowed
 * Use `exact` instead
 * @deprecated
 * @since 1.0.0
 */
export declare const strict: <P extends Props>(props: P, name?: string) => StrictC<P>;
/**
 * @since 1.3.0
 */
export declare type TaggedProps<Tag extends string> = {
    [K in Tag]: LiteralType<any>;
};
/**
 * @since 1.3.0
 */
export interface TaggedRefinement<Tag extends string, A, O = A> extends RefinementType<Tagged<Tag>, A, O> {
}
/**
 * @since 1.3.0
 */
export interface TaggedUnion<Tag extends string, A, O = A> extends UnionType<Array<Tagged<Tag>>, A, O> {
}
/**
 * @since 1.3.0
 */
export declare type TaggedIntersectionArgument<Tag extends string> = [Tagged<Tag>] | [Tagged<Tag>, Mixed] | [Mixed, Tagged<Tag>] | [Tagged<Tag>, Mixed, Mixed] | [Mixed, Tagged<Tag>, Mixed] | [Mixed, Mixed, Tagged<Tag>] | [Tagged<Tag>, Mixed, Mixed, Mixed] | [Mixed, Tagged<Tag>, Mixed, Mixed] | [Mixed, Mixed, Tagged<Tag>, Mixed] | [Mixed, Mixed, Mixed, Tagged<Tag>] | [Tagged<Tag>, Mixed, Mixed, Mixed, Mixed] | [Mixed, Tagged<Tag>, Mixed, Mixed, Mixed] | [Mixed, Mixed, Tagged<Tag>, Mixed, Mixed] | [Mixed, Mixed, Mixed, Tagged<Tag>, Mixed] | [Mixed, Mixed, Mixed, Mixed, Tagged<Tag>];
/**
 * @since 1.3.0
 */
export interface TaggedIntersection<Tag extends string, A, O = A> extends IntersectionType<TaggedIntersectionArgument<Tag>, A, O> {
}
/**
 * @since 1.3.0
 */
export interface TaggedExact<Tag extends string, A, O = A> extends ExactType<Tagged<Tag>, A, O> {
}
/**
 * @since 1.3.0
 */
export declare type Tagged<Tag extends string, A = any, O = A> = InterfaceType<TaggedProps<Tag>, A, O> | StrictType<TaggedProps<Tag>, A, O> | TaggedRefinement<Tag, A, O> | TaggedUnion<Tag, A, O> | TaggedIntersection<Tag, A, O> | TaggedExact<Tag, A, O> | RecursiveType<any, A, O>;
/**
 * @since 1.3.0
 */
export declare const isTagged: <Tag extends string>(tag: Tag) => (codec: Mixed) => codec is Tagged<Tag, any, any>;
/**
 * @since 1.3.0
 */
export declare const getTagValue: <Tag extends string>(tag: Tag) => (codec: Tagged<Tag, any, any>) => LiteralValue;
/**
 * @since 1.3.0
 * @deprecated
 */
export declare class TaggedUnionType<Tag extends string, CS extends Array<Tagged<Tag>>, A = any, O = A, I = unknown> extends UnionType<CS, A, O, I> {
    readonly tag: Tag;
    constructor(name: string, is: TaggedUnionType<Tag, CS, A, O, I>['is'], validate: TaggedUnionType<Tag, CS, A, O, I>['validate'], encode: TaggedUnionType<Tag, CS, A, O, I>['encode'], types: CS, tag: Tag);
}
/**
 * @since 1.6.0
 */
export interface TaggedUnionC<Tag extends string, CS extends [Tagged<Tag>, Tagged<Tag>, ...Array<Tagged<Tag>>]> extends TaggedUnionType<Tag, CS, TypeOf<CS[number]>, OutputOf<CS[number]>, unknown> {
}
/**
 * Use `union` instead
 *
 * @since 1.3.0
 * @deprecated
 */
export declare const taggedUnion: <Tag extends string, CS extends [Tagged<Tag, any, any>, Tagged<Tag, any, any>, ...Tagged<Tag, any, any>[]]>(tag: Tag, types: CS, name?: string) => TaggedUnionC<Tag, CS>;
/**
 * @since 1.1.0
 */
export declare class ExactType<C extends Any, A = any, O = A, I = unknown> extends Codec<A, O, I> {
    readonly type: C;
    readonly _tag: 'ExactType';
    constructor(name: string, is: ExactType<C, A, O, I>['is'], validate: ExactType<C, A, O, I>['validate'], encode: ExactType<C, A, O, I>['encode'], type: C);
}
/**
 * @since 1.1.0
 */
export interface HasPropsRefinement extends RefinementType<HasProps, any, any, any> {
}
/**
 * @since 1.1.0
 */
export interface HasPropsReadonly extends ReadonlyType<HasProps, any, any, any> {
}
/**
 * @since 1.1.0
 */
export interface HasPropsIntersection extends IntersectionType<Array<HasProps>, any, any, any> {
}
/**
 * @since 1.1.0
 */
export declare type HasProps = HasPropsRefinement | HasPropsReadonly | HasPropsIntersection | InterfaceType<any, any, any, any> | StrictType<any, any, any, any> | PartialType<any, any, any, any>;
/**
 * @since 1.6.0
 */
export interface ExactC<C extends HasProps> extends ExactType<C, TypeOf<C>, OutputOf<C>, InputOf<C>> {
}
/**
 * @since 1.1.0
 */
export declare function exact<C extends HasProps>(codec: C, name?: string): ExactC<C>;
/**
 * Drops the codec "kind"
 * @since 1.1.0
 * @deprecated
 */
export declare function clean<A, O = A, I = unknown>(codec: Codec<A, O, I>): Codec<A, O, I>;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type PropsOf<C extends {
    props: any;
}> = C['props'];
/**
 * @since 1.1.0
 * @deprecated
 */
export declare type Exact<T, X extends T> = T & {
    [K in ({
        [K in keyof X]: K;
    } & {
        [K in keyof T]: never;
    } & {
        [key: string]: never;
    })[keyof X]]?: never;
};
/**
 * Keeps the codec "kind"
 * @since 1.1.0
 * @deprecated
 */
export declare function alias<A, O, P, I>(codec: PartialType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => PartialType<PP, AA, OO, II>;
export declare function alias<A, O, P, I>(codec: StrictType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => StrictType<PP, AA, OO, II>;
export declare function alias<A, O, P, I>(codec: InterfaceType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => InterfaceType<PP, AA, OO, II>;
export { nullType as null, undefinedCodec as undefined, UnknownArray as Array, type as interface, voidType as void, Codec as Type, UnknownRecord as Dictionary, record as dictionary };
