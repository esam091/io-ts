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
export declare type TypeOf<RT extends Any> = RT['_A'];
/**
 * @since 1.0.0
 */
export declare type InputOf<RT extends Any> = RT['_I'];
/**
 * @since 1.0.0
 */
export declare type OutputOf<RT extends Any> = RT['_O'];
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
export declare class NullType extends Type<null> {
    readonly _tag: 'NullType';
    constructor();
}
/**
 * @alias `null`
 * @since 1.0.0
 */
export declare const nullType: NullType;
/**
 * @since 1.0.0
 */
export declare class UndefinedType extends Type<undefined> {
    readonly _tag: 'UndefinedType';
    constructor();
}
declare const undefinedType: UndefinedType;
/**
 * @since 1.2.0
 */
export declare class VoidType extends Type<void> {
    readonly _tag: 'VoidType';
    constructor();
}
/**
 * @alias `void`
 * @since 1.2.0
 */
export declare const voidType: VoidType;
/**
 * @since 1.0.0
 */
export declare class AnyType extends Type<any> {
    readonly _tag: 'AnyType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const any: AnyType;
/**
 * @since 1.5.0
 */
export declare class UnknownType extends Type<unknown> {
    readonly _tag: 'UnknownType';
    constructor();
}
/**
 * @since 1.5.0
 */
export declare const unknown: UnknownType;
/**
 * @since 1.0.0
 */
export declare class NeverType extends Type<never> {
    readonly _tag: 'NeverType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const never: NeverType;
/**
 * @since 1.0.0
 */
export declare class StringType extends Type<string> {
    readonly _tag: 'StringType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const string: StringType;
/**
 * @since 1.0.0
 */
export declare class NumberType extends Type<number> {
    readonly _tag: 'NumberType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const number: NumberType;
/**
 * @since 1.0.0
 */
export declare class BooleanType extends Type<boolean> {
    readonly _tag: 'BooleanType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const boolean: BooleanType;
/**
 * @since 1.0.0
 */
export declare class AnyArrayType extends Type<Array<unknown>> {
    readonly _tag: 'AnyArrayType';
    constructor();
}
declare const arrayType: AnyArrayType;
/**
 * @since 1.0.0
 */
export declare class AnyDictionaryType extends Type<{
    [key: string]: unknown;
}> {
    readonly _tag: 'AnyDictionaryType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const Dictionary: AnyDictionaryType;
/**
 * @since 1.0.0
 */
export declare class ObjectType extends Type<object> {
    readonly _tag: 'ObjectType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const object: ObjectType;
/**
 * @since 1.0.0
 */
export declare class FunctionType extends Type<Function> {
    readonly _tag: 'FunctionType';
    constructor();
}
/**
 * @since 1.0.0
 */
export declare const Function: FunctionType;
/**
 * @since 1.0.0
 */
export declare class RefinementType<RT extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: RT;
    readonly predicate: Predicate<A>;
    readonly _tag: 'RefinementType';
    constructor(name: string, is: RefinementType<RT, A, O, I>['is'], validate: RefinementType<RT, A, O, I>['validate'], encode: RefinementType<RT, A, O, I>['encode'], type: RT, predicate: Predicate<A>);
}
/**
 * @since 1.0.0
 */
export declare const refinement: <RT extends Any>(type: RT, predicate: Predicate<RT["_A"]>, name?: string) => RefinementType<RT, RT["_A"], RT["_O"], RT["_I"]>;
/**
 * @since 1.0.0
 */
export declare const Integer: RefinementType<NumberType, number, number, unknown>;
/**
 * @since 1.0.0
 */
export declare class LiteralType<V extends string | number | boolean> extends Type<V> {
    readonly value: V;
    readonly _tag: 'LiteralType';
    constructor(name: string, is: LiteralType<V>['is'], validate: LiteralType<V>['validate'], encode: LiteralType<V>['encode'], value: V);
}
/**
 * @since 1.0.0
 */
export declare const literal: <V extends string | number | boolean>(value: V, name?: string) => LiteralType<V>;
/**
 * @since 1.0.0
 */
export declare class KeyofType<D extends {
    [key: string]: unknown;
}> extends Type<keyof D> {
    readonly keys: D;
    readonly _tag: 'KeyofType';
    constructor(name: string, is: KeyofType<D>['is'], validate: KeyofType<D>['validate'], encode: KeyofType<D>['encode'], keys: D);
}
/**
 * @since 1.0.0
 */
export declare const keyof: <D extends {
    [key: string]: unknown;
}>(keys: D, name?: string) => KeyofType<D>;
/**
 * @since 1.0.0
 */
export declare class RecursiveType<RT extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    private runDefinition;
    readonly _tag: 'RecursiveType';
    constructor(name: string, is: RecursiveType<RT, A, O, I>['is'], validate: RecursiveType<RT, A, O, I>['validate'], encode: RecursiveType<RT, A, O, I>['encode'], runDefinition: () => RT);
    readonly type: RT;
}
/**
 * @since 1.0.0
 */
export declare const recursion: <A, O = A, I = unknown, RT extends Type<A, O, I> = Type<A, O, I>>(name: string, definition: (self: RT) => RT) => RecursiveType<RT, A, O, I>;
/**
 * @since 1.0.0
 */
export declare class ArrayType<RT extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: RT;
    readonly _tag: 'ArrayType';
    constructor(name: string, is: ArrayType<RT, A, O, I>['is'], validate: ArrayType<RT, A, O, I>['validate'], encode: ArrayType<RT, A, O, I>['encode'], type: RT);
}
/**
 * @since 1.0.0
 */
export declare const array: <RT extends Mixed>(type: RT, name?: string) => ArrayType<RT, RT["_A"][], RT["_O"][], unknown>;
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
 * @alias `interface`
 * @since 1.0.0
 */
export declare const type: <P extends Props>(props: P, name?: string) => InterfaceType<P, { [K in keyof P]: P[K]["_A"]; }, { [K in keyof P]: P[K]["_O"]; }, unknown>;
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
 * @since 1.0.0
 */
export declare const partial: <P extends Props>(props: P, name?: string) => PartialType<P, { [K in keyof P]?: P[K]["_A"] | undefined; }, { [K in keyof P]?: P[K]["_O"] | undefined; }, unknown>;
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
 * @since 1.0.0
 */
export declare const dictionary: <D extends Mixed, C extends Mixed>(domain: D, codomain: C, name?: string) => DictionaryType<D, C, { [K in D["_A"]]: C["_A"]; }, { [K in D["_O"]]: C["_O"]; }, unknown>;
/**
 * @since 1.0.0
 */
export declare class UnionType<RTS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly types: RTS;
    readonly _tag: 'UnionType';
    constructor(name: string, is: UnionType<RTS, A, O, I>['is'], validate: UnionType<RTS, A, O, I>['validate'], encode: UnionType<RTS, A, O, I>['encode'], types: RTS);
}
interface Index extends Record<string, Array<[unknown, Mixed]>> {
}
export declare const isIntersectionType: (type: Mixed) => type is IntersectionType<Any[], any, any, unknown>;
export declare const isUnionType: (type: Mixed) => type is UnionType<Any[], any, any, unknown>;
export declare const isExact: (type: Mixed) => type is ExactType<Mixed, any, any, unknown>;
export declare const getTypeIndex: (type: Mixed, override?: Mixed) => Index;
export declare const getIndex: (types: Mixed[]) => Index;
/**
 * @since 1.0.0
 */
export declare const union: <RTS extends Mixed[]>(types: RTS, name?: string) => UnionType<RTS, RTS[number]["_A"], RTS[number]["_O"], unknown>;
/**
 * @since 1.0.0
 */
export declare class IntersectionType<RTS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly types: RTS;
    readonly _tag: 'IntersectionType';
    constructor(name: string, is: IntersectionType<RTS, A, O, I>['is'], validate: IntersectionType<RTS, A, O, I>['validate'], encode: IntersectionType<RTS, A, O, I>['encode'], types: RTS);
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
 * @since 1.0.0
 */
export declare function intersection<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed, E extends Mixed>(types: [A, B, C, D, E], name?: string): IntersectionType<[A, B, C, D, E], TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D> & TypeOf<E>, OutputOf<A> & OutputOf<B> & OutputOf<C> & OutputOf<D> & OutputOf<E>, unknown>;
export declare function intersection<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed>(types: [A, B, C, D], name?: string): IntersectionType<[A, B, C, D], TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D>, OutputOf<A> & OutputOf<B> & OutputOf<C> & OutputOf<D>, unknown>;
export declare function intersection<A extends Mixed, B extends Mixed, C extends Mixed>(types: [A, B, C], name?: string): IntersectionType<[A, B, C], TypeOf<A> & TypeOf<B> & TypeOf<C>, OutputOf<A> & OutputOf<B> & OutputOf<C>, unknown>;
export declare function intersection<A extends Mixed, B extends Mixed>(types: [A, B], name?: string): IntersectionType<[A, B], TypeOf<A> & TypeOf<B>, OutputOf<A> & OutputOf<B>, unknown>;
export declare function intersection<A extends Mixed>(types: [A], name?: string): IntersectionType<[A], TypeOf<A>, OutputOf<A>, unknown>;
/**
 * @since 1.0.0
 */
export declare class TupleType<RTS extends Array<Any>, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly types: RTS;
    readonly _tag: 'TupleType';
    constructor(name: string, is: TupleType<RTS, A, O, I>['is'], validate: TupleType<RTS, A, O, I>['validate'], encode: TupleType<RTS, A, O, I>['encode'], types: RTS);
}
/**
 * @since 1.0.0
 */
export declare function tuple<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed, E extends Mixed>(types: [A, B, C, D, E], name?: string): TupleType<[A, B, C, D, E], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>, TypeOf<E>], [OutputOf<A>, OutputOf<B>, OutputOf<C>, OutputOf<D>, OutputOf<E>], unknown>;
export declare function tuple<A extends Mixed, B extends Mixed, C extends Mixed, D extends Mixed>(types: [A, B, C, D], name?: string): TupleType<[A, B, C, D], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>], [OutputOf<A>, OutputOf<B>, OutputOf<C>, OutputOf<D>], unknown>;
export declare function tuple<A extends Mixed, B extends Mixed, C extends Mixed>(types: [A, B, C], name?: string): TupleType<[A, B, C], [TypeOf<A>, TypeOf<B>, TypeOf<C>], [OutputOf<A>, OutputOf<B>, OutputOf<C>], unknown>;
export declare function tuple<A extends Mixed, B extends Mixed>(types: [A, B], name?: string): TupleType<[A, B], [TypeOf<A>, TypeOf<B>], [OutputOf<A>, OutputOf<B>], unknown>;
export declare function tuple<A extends Mixed>(types: [A], name?: string): TupleType<[A], [TypeOf<A>], [OutputOf<A>], unknown>;
/**
 * @since 1.0.0
 */
export declare class ReadonlyType<RT extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: RT;
    readonly _tag: 'ReadonlyType';
    constructor(name: string, is: ReadonlyType<RT, A, O, I>['is'], validate: ReadonlyType<RT, A, O, I>['validate'], encode: ReadonlyType<RT, A, O, I>['encode'], type: RT);
}
/**
 * @since 1.0.0
 */
export declare const readonly: <RT extends Mixed>(type: RT, name?: string) => ReadonlyType<RT, Readonly<RT["_A"]>, Readonly<RT["_O"]>, unknown>;
/**
 * @since 1.0.0
 */
export declare class ReadonlyArrayType<RT extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: RT;
    readonly _tag: 'ReadonlyArrayType';
    constructor(name: string, is: ReadonlyArrayType<RT, A, O, I>['is'], validate: ReadonlyArrayType<RT, A, O, I>['validate'], encode: ReadonlyArrayType<RT, A, O, I>['encode'], type: RT);
}
/**
 * @since 1.0.0
 */
export declare const readonlyArray: <RT extends Mixed>(type: RT, name?: string) => ReadonlyArrayType<RT, ReadonlyArray<RT["_A"]>, ReadonlyArray<RT["_O"]>, unknown>;
/**
 * @since 1.0.0
 */
export declare class StrictType<P, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly props: P;
    readonly _tag: 'StrictType';
    constructor(name: string, is: StrictType<P, A, O, I>['is'], validate: StrictType<P, A, O, I>['validate'], encode: StrictType<P, A, O, I>['encode'], props: P);
}
/**
 * Specifies that only the given properties are allowed
 * @deprecated use `exact` instead
 * @since 1.0.0
 */
export declare const strict: <P extends Props>(props: P, name?: string) => StrictType<P, { [K in keyof P]: P[K]["_A"]; }, { [K in keyof P]: P[K]["_O"]; }, unknown>;
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
export declare const getTagValue: <Tag extends string>(tag: Tag) => (type: Tagged<Tag, any, any>) => string | number | boolean;
/**
 * @since 1.3.0
 */
export declare class TaggedUnionType<Tag extends string, RTS extends Array<Tagged<Tag>>, A = any, O = A, I = unknown> extends UnionType<RTS, A, O, I> {
    readonly tag: Tag;
    constructor(name: string, is: TaggedUnionType<Tag, RTS, A, O, I>['is'], validate: TaggedUnionType<Tag, RTS, A, O, I>['validate'], encode: TaggedUnionType<Tag, RTS, A, O, I>['encode'], types: RTS, tag: Tag);
}
/**
 * Use `union` instead
 *
 * @since 1.3.0
 * @deprecated
 */
export declare const taggedUnion: <Tag extends string, RTS extends Tagged<Tag, any, any>[]>(tag: Tag, types: RTS, name?: string) => TaggedUnionType<Tag, RTS, RTS[number]["_A"], RTS[number]["_O"], unknown>;
/**
 * @since 1.1.0
 */
export declare class ExactType<RT extends Any, A = any, O = A, I = unknown> extends Type<A, O, I> {
    readonly type: RT;
    readonly _tag: 'ExactType';
    constructor(name: string, is: ExactType<RT, A, O, I>['is'], validate: ExactType<RT, A, O, I>['validate'], encode: ExactType<RT, A, O, I>['encode'], type: RT);
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
 * @since 1.1.0
 */
export declare function exact<RT extends HasProps>(type: RT, name?: string): ExactType<RT, TypeOf<RT>, OutputOf<RT>, InputOf<RT>>;
/**
 * Drops the runtime type "kind"
 * @since 1.1.0
 */
export declare function clean<A, O = A, I = unknown>(type: Type<A, O, I>): Type<A, O, I>;
/**
 * @since 1.0.0
 */
export declare type PropsOf<T extends {
    props: any;
}> = T['props'];
/**
 * @since 1.1.0
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
 */
export declare function alias<A, O, P, I>(type: PartialType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => PartialType<PP, AA, OO, II>;
export declare function alias<A, O, P, I>(type: StrictType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => StrictType<PP, AA, OO, II>;
export declare function alias<A, O, P, I>(type: InterfaceType<P, A, O, I>): <AA extends Exact<A, AA>, OO extends Exact<O, OO> = O, PP extends Exact<P, PP> = P, II extends I = I>() => InterfaceType<PP, AA, OO, II>;
export { nullType as null, undefinedType as undefined, arrayType as Array, type as interface, voidType as void };
