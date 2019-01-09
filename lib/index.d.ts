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
export interface Any extends Type<any, any, any> {
}
/**
 * @since 1.0.0
 */
export interface Mixed extends Type<any, any, unknown> {
}
/**
 * @since 1.0.0
 */
export declare type TypeOf<T extends any> = T['_A'];
/**
 * @since 1.0.0
 */
export declare type InputOf<T extends any> = T['_I'];
/**
 * @since 1.0.0
 */
export declare type OutputOf<T extends any> = T['_O'];
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
export declare class Type<A, O = A, I = unknown> implements Decoder<I, A>, Encoder<A, O> {
    /** a unique name for this runtime type */
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
    /** a unique name for this runtime type */
    name: string, 
    /** a custom type guard */
    is: Is<A>, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate: Validate<I, A>, 
    /** converts a value of type A to a value of type O */
    encode: Encode<A, O>);
    pipe<B, IB, A extends IB, OB extends A>(this: Type<A, O, I>, ab: Type<B, OB, IB>, name?: string): Type<B, O, I>;
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
export declare const getContextEntry: (key: string, type: Decoder<any, any>) => ContextEntry;
/**
 * @since 1.0.0
 */
export declare const getValidationError: (value: unknown, context: Context) => ValidationError;
/**
 * @since 1.0.0
 */
export declare const getDefaultContext: (type: Decoder<any, any>) => Context;
/**
 * @since 1.0.0
 */
export declare const appendContext: (c: Context, key: string, type: Decoder<any, any>) => Context;
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
export declare class NullType extends Type<null, null, unknown> {
    readonly _tag: 'NullType';
    constructor();
}
export interface NullT extends NullType {
}
/**
 * @alias `null`
 * @since 1.0.0
 */
export declare const nullType: NullT;
/**
 * @since 1.0.0
 */
export declare class UndefinedType extends Type<undefined, undefined, unknown> {
    readonly _tag: 'UndefinedType';
    constructor();
}
export interface UndefinedT extends UndefinedType {
}
declare const undefinedType: UndefinedT;
/**
 * @since 1.2.0
 * @deprecated
 */
export declare class VoidType extends Type<void, void, unknown> {
    readonly _tag: 'VoidType';
    constructor();
}
export interface VoidT extends VoidType {
}
/**
 * @alias `void`
 * @since 1.2.0
 * @deprecated
 */
export declare const voidType: VoidT;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class AnyType extends Type<any, any, unknown> {
    readonly _tag: 'AnyType';
    constructor();
}
export interface AnyT extends AnyType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const any: AnyT;
/**
 * @since 1.5.0
 */
export declare class UnknownType extends Type<unknown, unknown, unknown> {
    readonly _tag: 'UnknownType';
    constructor();
}
export interface UnknownT extends UnknownType {
}
/**
 * @since 1.5.0
 */
export declare const unknown: UnknownT;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class NeverType extends Type<never, never, unknown> {
    readonly _tag: 'NeverType';
    constructor();
}
export interface NeverT extends NeverType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const never: NeverT;
/**
 * @since 1.0.0
 */
export declare class StringType extends Type<string, string, unknown> {
    readonly _tag: 'StringType';
    constructor();
}
export interface StringT extends StringType {
}
/**
 * @since 1.0.0
 */
export declare const string: StringT;
/**
 * @since 1.0.0
 */
export declare class NumberType extends Type<number, number, unknown> {
    readonly _tag: 'NumberType';
    constructor();
}
export interface NumberT extends NumberType {
}
/**
 * @since 1.0.0
 */
export declare const number: NumberT;
/**
 * @since 1.0.0
 */
export declare class BooleanType extends Type<boolean, boolean, unknown> {
    readonly _tag: 'BooleanType';
    constructor();
}
export interface BooleanT extends BooleanType {
}
/**
 * @since 1.0.0
 */
export declare const boolean: BooleanT;
/**
 * @since 1.0.0
 */
export declare class AnyArrayType extends Type<Array<unknown>, Array<unknown>, unknown> {
    readonly _tag: 'AnyArrayType';
    constructor();
}
export interface UnknownArrayT extends AnyArrayType {
}
/**
 * @since 1.6.0
 */
export declare const UnknownArray: UnknownArrayT;
/**
 * @since 1.0.0
 */
export declare class AnyDictionaryType extends Type<Record<string, unknown>, Record<string, unknown>, unknown> {
    readonly _tag: 'AnyDictionaryType';
    constructor();
}
export interface UnknownRecordT extends AnyDictionaryType {
}
/**
 * @since 1.6.0
 */
export declare const UnknownRecord: UnknownRecordT;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class ObjectType extends Type<object, object, unknown> {
    readonly _tag: 'ObjectType';
    constructor();
}
export interface ObjectT extends ObjectType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const object: ObjectT;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare class FunctionType extends Type<Function, Function, unknown> {
    readonly _tag: 'FunctionType';
    constructor();
}
export interface FunctionT extends FunctionType {
}
/**
 * @since 1.0.0
 * @deprecated
 */
export declare const Function: FunctionT;
/**
 * @since 1.0.0
 */
export declare class RefinementType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: T;
    readonly predicate: Predicate<A>;
    readonly _tag: 'RefinementType';
    constructor(name: string, is: RefinementType<T, A, O, I>['is'], validate: RefinementType<T, A, O, I>['validate'], encode: RefinementType<T, A, O, I>['encode'], type: T, predicate: Predicate<A>);
}
/**
 * @since 1.6.0
 */
export interface RefinementT<T extends Any> extends RefinementType<T, TypeOf<T>, OutputOf<T>, InputOf<T>> {
}
/**
 * @since 1.0.0
 */
export declare const refinement: <T extends Any>(type: T, predicate: Predicate<T["_A"]>, name?: string) => RefinementT<T>;
/**
 * @since 1.0.0
 */
export declare const Integer: RefinementT<NumberT>;
declare type LiteralValue = string | number | boolean;
/**
 * @since 1.0.0
 */
export declare class LiteralType<V extends LiteralValue> extends Type<V, V, unknown> {
    readonly value: V;
    readonly _tag: 'LiteralType';
    constructor(name: string, is: LiteralType<V>['is'], validate: LiteralType<V>['validate'], encode: LiteralType<V>['encode'], value: V);
}
export interface LiteralT<V extends LiteralValue> extends LiteralType<V> {
}
/**
 * @since 1.0.0
 */
export declare const literal: <V extends LiteralValue>(value: V, name?: string) => LiteralT<V>;
/**
 * @since 1.0.0
 */
export declare class KeyofType<D extends Record<string, unknown>> extends Type<keyof D, keyof D, unknown> {
    readonly keys: D;
    readonly _tag: 'KeyofType';
    constructor(name: string, is: KeyofType<D>['is'], validate: KeyofType<D>['validate'], encode: KeyofType<D>['encode'], keys: D);
}
export interface KeyofT<D extends Record<string, unknown>> extends KeyofType<D> {
}
/**
 * @since 1.0.0
 */
export declare const keyof: <D extends Record<string, unknown>>(keys: D, name?: string) => KeyofT<D>;
/**
 * @since 1.0.0
 */
export declare class RecursiveType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    private runDefinition;
    readonly _tag: 'RecursiveType';
    constructor(name: string, is: RecursiveType<T, A, O, I>['is'], validate: RecursiveType<T, A, O, I>['validate'], encode: RecursiveType<T, A, O, I>['encode'], runDefinition: () => T);
    readonly type: T;
}
/**
 * @since 1.0.0
 */
export declare const recursion: <A, O = A, I = unknown, T extends Type<A, O, I> = Type<A, O, I>>(name: string, definition: (self: T) => T) => RecursiveType<T, A, O, I>;
/**
 * @since 1.0.0
 */
export declare class ArrayType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: T;
    readonly _tag: 'ArrayType';
    constructor(name: string, is: ArrayType<T, A, O, I>['is'], validate: ArrayType<T, A, O, I>['validate'], encode: ArrayType<T, A, O, I>['encode'], type: T);
}
/**
 * @since 1.6.0
 */
export interface ArrayT<T extends Mixed> extends ArrayType<T, Array<TypeOf<T>>, Array<OutputOf<T>>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const array: <T extends Mixed>(type: T, name?: string) => ArrayT<T>;
/**
 * @since 1.0.0
 */
export declare class InterfaceType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
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
export interface InterfaceT<P extends Props> extends InterfaceType<P, {
    [K in keyof P]: TypeOf<P[K]>;
}, {
    [K in keyof P]: OutputOf<P[K]>;
}, unknown> {
}
/**
 * @alias `interface`
 * @since 1.0.0
 */
export declare const type: <P extends Props>(props: P, name?: string) => InterfaceT<P>;
/**
 * @since 1.0.0
 */
export declare class PartialType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
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
export interface PartialT<P extends Props> extends PartialType<P, {
    [K in keyof P]?: TypeOf<P[K]>;
}, {
    [K in keyof P]?: OutputOf<P[K]>;
}, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const partial: <P extends Props>(props: P, name?: string) => PartialT<P>;
/**
 * @since 1.0.0
 */
export declare class DictionaryType<D extends Any, C extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
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
export interface RecordT<D extends Mixed, C extends Mixed> extends DictionaryType<D, C, {
    [K in TypeOf<D>]: TypeOf<C>;
}, {
    [K in OutputOf<D>]: OutputOf<C>;
}, unknown> {
}
/**
 * @since 1.6.0
 */
export declare const record: <D extends Mixed, C extends Mixed>(domain: D, codomain: C, name?: string) => RecordT<D, C>;
/**
 * @since 1.0.0
 */
export declare class UnionType<TS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly types: TS;
    readonly _tag: 'UnionType';
    constructor(name: string, is: UnionType<TS, A, O, I>['is'], validate: UnionType<TS, A, O, I>['validate'], encode: UnionType<TS, A, O, I>['encode'], types: TS);
}
interface Index extends Record<string, Array<[unknown, Mixed]>> {
}
export declare const isIntersectionType: (type: Mixed) => type is IntersectionType<Any[], any, any, unknown>;
export declare const isUnionType: (type: Mixed) => type is UnionType<Any[], any, any, unknown>;
export declare const isExact: (type: Mixed) => type is ExactType<Mixed, any, any, unknown>;
export declare const getTypeIndex: (type: Mixed, override?: Mixed) => Index;
export declare const getIndex: (types: Mixed[]) => Index;
/**
 * @since 1.6.0
 */
export interface UnionT<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends UnionType<TS, TypeOf<TS[number]>, OutputOf<TS[number]>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const union: <TS extends [Mixed, Mixed, ...Mixed[]]>(types: TS, name?: string) => UnionT<TS>;
/**
 * @see https://stackoverflow.com/a/50375286#50375286
 */
declare type UnionToIntersection<U> = (U extends any ? (u: U) => void : never) extends ((u: infer I) => void) ? I : never;
/**
 * @since 1.0.0
 */
export declare class IntersectionType<TS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly types: TS;
    readonly _tag: 'IntersectionType';
    constructor(name: string, is: IntersectionType<TS, A, O, I>['is'], validate: IntersectionType<TS, A, O, I>['validate'], encode: IntersectionType<TS, A, O, I>['encode'], types: TS);
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
export interface IntersectionT<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends IntersectionType<TS, UnionToIntersection<TypeOf<TS[number]>>, UnionToIntersection<OutputOf<TS[number]>>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare function intersection<TS extends [Mixed, Mixed, ...Array<Mixed>]>(types: TS, name?: string): IntersectionT<TS>;
/**
 * @since 1.0.0
 */
export declare class TupleType<TS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly types: TS;
    readonly _tag: 'TupleType';
    constructor(name: string, is: TupleType<TS, A, O, I>['is'], validate: TupleType<TS, A, O, I>['validate'], encode: TupleType<TS, A, O, I>['encode'], types: TS);
}
/**
 * @since 1.6.0
 */
export interface TupleT<TS extends [Mixed, Mixed, ...Array<Mixed>]> extends TupleType<TS, {
    [K in keyof TS]: TypeOf<TS[K]>;
}, {
    [K in keyof TS]: OutputOf<TS[K]>;
}, unknown> {
}
/**
 * @since 1.0.0
 */
export declare function tuple<TS extends [Mixed, Mixed, ...Array<Mixed>]>(types: TS, name?: string): TupleT<TS>;
/**
 * @since 1.0.0
 */
export declare class ReadonlyType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: T;
    readonly _tag: 'ReadonlyType';
    constructor(name: string, is: ReadonlyType<T, A, O, I>['is'], validate: ReadonlyType<T, A, O, I>['validate'], encode: ReadonlyType<T, A, O, I>['encode'], type: T);
}
/**
 * @since 1.6.0
 */
export interface ReadonlyT<T extends Mixed> extends ReadonlyType<T, Readonly<TypeOf<T>>, Readonly<OutputOf<T>>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const readonly: <T extends Mixed>(type: T, name?: string) => ReadonlyT<T>;
/**
 * @since 1.0.0
 */
export declare class ReadonlyArrayType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: T;
    readonly _tag: 'ReadonlyArrayType';
    constructor(name: string, is: ReadonlyArrayType<T, A, O, I>['is'], validate: ReadonlyArrayType<T, A, O, I>['validate'], encode: ReadonlyArrayType<T, A, O, I>['encode'], type: T);
}
/**
 * @since 1.6.0
 */
export interface ReadonlyArrayT<T extends Mixed> extends ReadonlyArrayType<T, ReadonlyArray<TypeOf<T>>, ReadonlyArray<OutputOf<T>>, unknown> {
}
/**
 * @since 1.0.0
 */
export declare const readonlyArray: <T extends Mixed>(type: T, name?: string) => ReadonlyArrayT<T>;
/**
 * @since 1.0.0
 */
export declare class StrictType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly props: P;
    readonly _tag: 'StrictType';
    constructor(name: string, is: StrictType<P, A, O, I>['is'], validate: StrictType<P, A, O, I>['validate'], encode: StrictType<P, A, O, I>['encode'], props: P);
}
/**
 * @since 1.6.0
 */
export interface StrictT<P extends Props> extends StrictType<P, {
    [K in keyof P]: TypeOf<P[K]>;
}, {
    [K in keyof P]: OutputOf<P[K]>;
}, unknown> {
}
/**
 * Specifies that only the given properties are allowed
 * @deprecated use `exact` instead
 * @since 1.0.0
 */
export declare const strict: <P extends Props>(props: P, name?: string) => StrictT<P>;
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
export declare const isTagged: <Tag extends string>(tag: Tag) => (type: Mixed) => type is Tagged<Tag, any, any>;
/**
 * @since 1.3.0
 */
export declare const getTagValue: <Tag extends string>(tag: Tag) => (type: Tagged<Tag, any, any>) => LiteralValue;
/**
 * @since 1.3.0
 */
export declare class TaggedUnionType<Tag extends string, TS extends Array<Tagged<Tag>>, A = any, O = A, I = unknown> extends UnionType<TS, A, O, I> {
    readonly tag: Tag;
    constructor(name: string, is: TaggedUnionType<Tag, TS, A, O, I>['is'], validate: TaggedUnionType<Tag, TS, A, O, I>['validate'], encode: TaggedUnionType<Tag, TS, A, O, I>['encode'], types: TS, tag: Tag);
}
/**
 * @since 1.6.0
 */
export interface TaggedUnionT<Tag extends string, TS extends [Tagged<Tag>, Tagged<Tag>, ...Array<Tagged<Tag>>]> extends TaggedUnionType<Tag, TS, TypeOf<TS[number]>, OutputOf<TS[number]>, unknown> {
}
/**
 * Use `union` instead
 *
 * @since 1.3.0
 * @deprecated
 */
export declare const taggedUnion: <Tag extends string, TS extends [Tagged<Tag, any, any>, Tagged<Tag, any, any>, ...Tagged<Tag, any, any>[]]>(tag: Tag, types: TS, name?: string) => TaggedUnionT<Tag, TS>;
/**
 * @since 1.1.0
 */
export declare class ExactType<T extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: T;
    readonly _tag: 'ExactType';
    constructor(name: string, is: ExactType<T, A, O, I>['is'], validate: ExactType<T, A, O, I>['validate'], encode: ExactType<T, A, O, I>['encode'], type: T);
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
export interface ExactT<T extends HasProps> extends ExactType<T, TypeOf<T>, OutputOf<T>, InputOf<T>> {
}
/**
 * @since 1.1.0
 */
export declare function exact<T extends HasProps>(type: T, name?: string): ExactT<T>;
/**
 * Drops the runtime type "kind"
 * @since 1.1.0
 * @deprecated
 */
export declare function clean<A, O = A, I = unknown>(type: Type<A, O, I>): Type<A, O, I>;
/**
 * @since 1.0.0
 * @deprecated
 */
export declare type PropsOf<T extends {
    props: any;
}> = T['props'];
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
 * Keeps the runtime type "kind"
 * @since 1.1.0
 * @deprecated
 */
export declare function alias<A, O, P, I>(type: PartialType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => PartialType<PP, AA, OO, II>;
export declare function alias<A, O, P, I>(type: StrictType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => StrictType<PP, AA, OO, II>;
export declare function alias<A, O, P, I>(type: InterfaceType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => InterfaceType<PP, AA, OO, II>;
export { nullType as null, undefinedType as undefined, UnknownArray as Array, type as interface, voidType as void, UnknownRecord as Dictionary, record as dictionary };
