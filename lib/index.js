"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
/**
 * @since 1.0.0
 */
var Type = /** @class */ (function () {
    function Type(
    /** a unique name for this runtime type */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate, 
    /** converts a value of type A to a value of type O */
    encode) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
    }
    Type.prototype.pipe = function (ab, name) {
        var _this = this;
        if (name === void 0) { name = "pipe(" + this.name + ", " + ab.name + ")"; }
        return new Type(name, ab.is, function (i, c) {
            var validation = _this.validate(i, c);
            if (validation.isLeft()) {
                return validation;
            }
            else {
                return ab.validate(validation.value, c);
            }
        }, this.encode === exports.identity && ab.encode === exports.identity ? exports.identity : function (b) { return _this.encode(ab.encode(b)); });
    };
    Type.prototype.asDecoder = function () {
        return this;
    };
    Type.prototype.asEncoder = function () {
        return this;
    };
    /** a version of `validate` with a default context */
    Type.prototype.decode = function (i) {
        return this.validate(i, exports.getDefaultContext(this));
    };
    return Type;
}());
exports.Type = Type;
/**
 * @since 1.0.0
 */
exports.identity = function (a) { return a; };
/**
 * @since 1.0.0
 */
exports.getFunctionName = function (f) {
    return f.displayName || f.name || "<function" + f.length + ">";
};
/**
 * @since 1.0.0
 */
exports.getContextEntry = function (key, type) { return ({ key: key, type: type }); };
/**
 * @since 1.0.0
 */
exports.getValidationError = function (value, context) { return ({ value: value, context: context }); };
/**
 * @since 1.0.0
 */
exports.getDefaultContext = function (type) { return [{ key: '', type: type }]; };
/**
 * @since 1.0.0
 */
exports.appendContext = function (c, key, type) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key: key, type: type };
    return r;
};
/**
 * @since 1.0.0
 */
exports.failures = function (errors) { return new Either_1.Left(errors); };
/**
 * @since 1.0.0
 */
exports.failure = function (value, context) {
    return exports.failures([exports.getValidationError(value, context)]);
};
/**
 * @since 1.0.0
 */
exports.success = function (value) { return new Either_1.Right(value); };
var pushAll = function (xs, ys) {
    var l = ys.length;
    for (var i = 0; i < l; i++) {
        xs.push(ys[i]);
    }
};
//
// basic types
//
var isNull = function (u) { return u === null; };
/**
 * @since 1.0.0
 */
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', isNull, function (u, c) { return (isNull(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
exports.NullType = NullType;
/**
 * @alias `null`
 * @since 1.0.0
 */
exports.nullType = new NullType();
exports.null = exports.nullType;
var isUndefined = function (u) { return u === void 0; };
/**
 * @since 1.0.0
 */
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', isUndefined, function (u, c) { return (isUndefined(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
exports.UndefinedType = UndefinedType;
var undefinedType = new UndefinedType();
exports.undefined = undefinedType;
/**
 * @since 1.2.0
 * @deprecated
 */
var VoidType = /** @class */ (function (_super) {
    __extends(VoidType, _super);
    function VoidType() {
        var _this = _super.call(this, 'void', undefinedType.is, undefinedType.validate, exports.identity) || this;
        _this._tag = 'VoidType';
        return _this;
    }
    return VoidType;
}(Type));
exports.VoidType = VoidType;
/**
 * @alias `void`
 * @since 1.2.0
 * @deprecated
 */
exports.voidType = new VoidType();
exports.void = exports.voidType;
/**
 * @since 1.0.0
 * @deprecated
 */
var AnyType = /** @class */ (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        var _this = _super.call(this, 'any', function (_) { return true; }, exports.success, exports.identity) || this;
        _this._tag = 'AnyType';
        return _this;
    }
    return AnyType;
}(Type));
exports.AnyType = AnyType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.any = new AnyType();
/**
 * @since 1.5.0
 */
var UnknownType = /** @class */ (function (_super) {
    __extends(UnknownType, _super);
    function UnknownType() {
        var _this = _super.call(this, 'unknown', function (_) { return true; }, exports.success, exports.identity) || this;
        _this._tag = 'UnknownType';
        return _this;
    }
    return UnknownType;
}(Type));
exports.UnknownType = UnknownType;
/**
 * @since 1.5.0
 */
exports.unknown = new UnknownType();
/**
 * @since 1.0.0
 * @deprecated
 */
var NeverType = /** @class */ (function (_super) {
    __extends(NeverType, _super);
    function NeverType() {
        var _this = _super.call(this, 'never', function (_) { return false; }, function (u, c) { return exports.failure(u, c); }, 
        /* istanbul ignore next */
        function () {
            throw new Error('cannot encode never');
        }) || this;
        _this._tag = 'NeverType';
        return _this;
    }
    return NeverType;
}(Type));
exports.NeverType = NeverType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.never = new NeverType();
var isString = function (u) { return typeof u === 'string'; };
/**
 * @since 1.0.0
 */
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', isString, function (u, c) { return (isString(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
exports.StringType = StringType;
/**
 * @since 1.0.0
 */
exports.string = new StringType();
var isNumber = function (u) { return typeof u === 'number'; };
/**
 * @since 1.0.0
 */
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', isNumber, function (u, c) { return (isNumber(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
exports.NumberType = NumberType;
/**
 * @since 1.0.0
 */
exports.number = new NumberType();
var isBoolean = function (u) { return typeof u === 'boolean'; };
/**
 * @since 1.0.0
 */
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', isBoolean, function (u, c) { return (isBoolean(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
exports.BooleanType = BooleanType;
/**
 * @since 1.0.0
 */
exports.boolean = new BooleanType();
/**
 * @since 1.0.0
 */
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'Array', Array.isArray, function (u, c) { return (Array.isArray(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
exports.AnyArrayType = AnyArrayType;
/**
 * @since 1.6.0
 */
exports.UnknownArray = new AnyArrayType();
exports.Array = exports.UnknownArray;
var isDictionary = function (u) { return u !== null && typeof u === 'object'; };
/**
 * @since 1.0.0
 */
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'Dictionary', isDictionary, function (u, c) { return (isDictionary(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
exports.AnyDictionaryType = AnyDictionaryType;
/**
 * @since 1.6.0
 */
exports.UnknownRecord = new AnyDictionaryType();
exports.Dictionary = exports.UnknownRecord;
/**
 * @since 1.0.0
 * @deprecated
 */
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType() {
        var _this = _super.call(this, 'object', exports.UnknownRecord.is, exports.UnknownRecord.validate, exports.identity) || this;
        _this._tag = 'ObjectType';
        return _this;
    }
    return ObjectType;
}(Type));
exports.ObjectType = ObjectType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.object = new ObjectType();
var isFunction = function (u) { return typeof u === 'function'; };
/**
 * @since 1.0.0
 * @deprecated
 */
var FunctionType = /** @class */ (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType() {
        var _this = _super.call(this, 'Function', isFunction, function (u, c) { return (isFunction(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'FunctionType';
        return _this;
    }
    return FunctionType;
}(Type));
exports.FunctionType = FunctionType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.Function = new FunctionType();
/**
 * @since 1.0.0
 */
var RefinementType = /** @class */ (function (_super) {
    __extends(RefinementType, _super);
    function RefinementType(name, is, validate, encode, type, predicate) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this.predicate = predicate;
        _this._tag = 'RefinementType';
        return _this;
    }
    return RefinementType;
}(Type));
exports.RefinementType = RefinementType;
/**
 * @since 1.0.0
 */
exports.refinement = function (type, predicate, name) {
    if (name === void 0) { name = "(" + type.name + " | " + exports.getFunctionName(predicate) + ")"; }
    return new RefinementType(name, function (u) { return type.is(u) && predicate(u); }, function (i, c) {
        var validation = type.validate(i, c);
        if (validation.isLeft()) {
            return validation;
        }
        else {
            var a = validation.value;
            return predicate(a) ? exports.success(a) : exports.failure(a, c);
        }
    }, type.encode, type, predicate);
};
/**
 * @since 1.0.0
 */
exports.Integer = exports.refinement(exports.number, function (n) { return n % 1 === 0; }, 'Integer');
/**
 * @since 1.0.0
 */
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, validate, encode, value) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.value = value;
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
exports.LiteralType = LiteralType;
/**
 * @since 1.0.0
 */
exports.literal = function (value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (u) { return u === value; };
    return new LiteralType(name, is, function (u, c) { return (is(u) ? exports.success(value) : exports.failure(u, c)); }, exports.identity, value);
};
/**
 * @since 1.0.0
 */
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, validate, encode, keys) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.keys = keys;
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
exports.KeyofType = KeyofType;
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * @since 1.0.0
 */
exports.keyof = function (keys, name) {
    if (name === void 0) { name = "(keyof " + JSON.stringify(Object.keys(keys)) + ")"; }
    var is = function (u) { return exports.string.is(u) && hasOwnProperty.call(keys, u); };
    return new KeyofType(name, is, function (u, c) { return (is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity, keys);
};
/**
 * @since 1.0.0
 */
var RecursiveType = /** @class */ (function (_super) {
    __extends(RecursiveType, _super);
    function RecursiveType(name, is, validate, encode, runDefinition) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.runDefinition = runDefinition;
        _this._tag = 'RecursiveType';
        return _this;
    }
    Object.defineProperty(RecursiveType.prototype, "type", {
        get: function () {
            return this.runDefinition();
        },
        enumerable: true,
        configurable: true
    });
    return RecursiveType;
}(Type));
exports.RecursiveType = RecursiveType;
/**
 * @since 1.0.0
 */
exports.recursion = function (name, definition) {
    var cache;
    var runDefinition = function () {
        if (!cache) {
            cache = definition(Self);
        }
        return cache;
    };
    var Self = new RecursiveType(name, function (u) { return runDefinition().is(u); }, function (u, c) { return runDefinition().validate(u, c); }, function (a) { return runDefinition().encode(a); }, runDefinition);
    return Self;
};
/**
 * @since 1.0.0
 */
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
/**
 * @since 1.0.0
 */
exports.array = function (type, name) {
    if (name === void 0) { name = "Array<" + type.name + ">"; }
    return new ArrayType(name, function (u) { return exports.UnknownArray.is(u) && u.every(type.is); }, function (u, c) {
        var arrayValidation = exports.UnknownArray.validate(u, c);
        if (arrayValidation.isLeft()) {
            return arrayValidation;
        }
        else {
            var xs = arrayValidation.value;
            var len = xs.length;
            var a = xs;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var x = xs[i];
                var validation = type.validate(x, exports.appendContext(c, String(i), type));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var vx = validation.value;
                    if (vx !== x) {
                        if (a === xs) {
                            a = xs.slice();
                        }
                        a[i] = vx;
                    }
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        }
    }, type.encode === exports.identity ? exports.identity : function (a) { return a.map(type.encode); }, type);
};
/**
 * @since 1.0.0
 */
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
exports.InterfaceType = InterfaceType;
var getNameFromProps = function (props) {
    return "{ " + Object.keys(props)
        .map(function (k) { return k + ": " + props[k].name; })
        .join(', ') + " }";
};
var useIdentity = function (types, len) {
    for (var i = 0; i < len; i++) {
        if (types[i].encode !== exports.identity) {
            return false;
        }
    }
    return true;
};
/**
 * @alias `interface`
 * @since 1.0.0
 */
exports.type = function (props, name) {
    if (name === void 0) { name = getNameFromProps(props); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new InterfaceType(name, function (u) {
        if (!exports.UnknownRecord.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            if (!hasOwnProperty.call(u, k) || !types[i].is(u[k])) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        var dictionaryValidation = exports.UnknownRecord.validate(u, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var o = dictionaryValidation.value;
            var a = o;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                if (!hasOwnProperty.call(a, k)) {
                    if (a === o) {
                        a = __assign({}, o);
                    }
                    a[k] = a[k];
                }
                var ak = a[k];
                var type_1 = types[i];
                var validation = type_1.validate(ak, exports.appendContext(c, k, type_1));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var vak = validation.value;
                    if (vak !== ak) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vak;
                    }
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        }
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var encode = types[i].encode;
                if (encode !== exports.identity) {
                    s[k] = encode(a[k]);
                }
            }
            return s;
        }, props);
};
exports.interface = exports.type;
/**
 * @since 1.0.0
 */
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
exports.PartialType = PartialType;
/**
 * @since 1.0.0
 */
exports.partial = function (props, name) {
    if (name === void 0) { name = "PartialType<" + getNameFromProps(props) + ">"; }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    var partials = {};
    for (var i = 0; i < len; i++) {
        partials[keys[i]] = exports.union([types[i], undefinedType]);
    }
    return new PartialType(name, function (u) {
        if (!exports.UnknownRecord.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            if (!partials[k].is(u[k])) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        var dictionaryValidation = exports.UnknownRecord.validate(u, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var o = dictionaryValidation.value;
            var a = o;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                var type_2 = partials[k];
                var validation = type_2.validate(ak, exports.appendContext(c, k, type_2));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var vak = validation.value;
                    if (vak !== ak) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vak;
                    }
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(a);
        }
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                if (ak !== undefined) {
                    s[k] = types[i].encode(ak);
                }
            }
            return s;
        }, props);
};
/**
 * @since 1.0.0
 */
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, validate, encode, domain, codomain) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
exports.DictionaryType = DictionaryType;
var refinedDictionary = exports.refinement(exports.UnknownRecord, function (d) { return Object.prototype.toString.call(d) === '[object Object]'; });
/**
 * @since 1.6.0
 */
exports.record = function (domain, codomain, name) {
    if (name === void 0) { name = "{ [K in " + domain.name + "]: " + codomain.name + " }"; }
    var isIndexSignatureRequired = codomain !== exports.any;
    var D = isIndexSignatureRequired ? refinedDictionary : exports.UnknownRecord;
    return new DictionaryType(name, function (u) {
        return D.is(u) && Object.keys(u).every(function (k) { return domain.is(k) && codomain.is(u[k]); });
    }, function (u, c) {
        var dictionaryValidation = D.validate(u, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var o = dictionaryValidation.value;
            var a = {};
            var errors = [];
            var keys = Object.keys(o);
            var len = keys.length;
            var changed = false;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ok = o[k];
                var domainValidation = domain.validate(k, exports.appendContext(c, k, domain));
                var codomainValidation = codomain.validate(ok, exports.appendContext(c, k, codomain));
                if (domainValidation.isLeft()) {
                    pushAll(errors, domainValidation.value);
                }
                else {
                    var vk = domainValidation.value;
                    changed = changed || vk !== k;
                    k = vk;
                }
                if (codomainValidation.isLeft()) {
                    pushAll(errors, codomainValidation.value);
                }
                else {
                    var vok = codomainValidation.value;
                    changed = changed || vok !== ok;
                    a[k] = vok;
                }
            }
            return errors.length ? exports.failures(errors) : exports.success((changed ? a : o));
        }
    }, domain.encode === exports.identity && codomain.encode === exports.identity
        ? exports.identity
        : function (a) {
            var s = {};
            var keys = Object.keys(a);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                s[String(domain.encode(k))] = codomain.encode(a[k]);
            }
            return s;
        }, domain, codomain);
};
exports.dictionary = exports.record;
/**
 * @since 1.0.0
 */
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
exports.UnionType = UnionType;
var isLiteralType = function (type) { return type instanceof LiteralType; };
var isInterfaceType = function (type) { return type instanceof InterfaceType; };
var isStrictType = function (type) { return type instanceof StrictType; };
exports.isIntersectionType = function (type) {
    return type instanceof IntersectionType;
};
exports.isUnionType = function (type) { return type instanceof UnionType; };
exports.isExact = function (type) { return type instanceof ExactType; };
exports.getTypeIndex = function (type, override) {
    if (override === void 0) { override = type; }
    var _a;
    var r = {};
    if (isInterfaceType(type) || isStrictType(type)) {
        for (var k in type.props) {
            var prop = type.props[k];
            if (isLiteralType(prop)) {
                var value = prop.value;
                r[k] = [[value, override]];
            }
        }
    }
    else if (exports.isIntersectionType(type)) {
        var types = type.types;
        r = exports.getTypeIndex(types[0], type);
        for (var i = 1; i < types.length; i++) {
            var ti = exports.getTypeIndex(types[i], type);
            for (var k in ti) {
                if (r.hasOwnProperty(k)) {
                    (_a = r[k]).push.apply(_a, ti[k]);
                }
                else {
                    r[k] = ti[k];
                }
            }
        }
    }
    else if (exports.isUnionType(type)) {
        return exports.getIndex(type.types);
    }
    else if (exports.isExact(type)) {
        return exports.getTypeIndex(type.type, type);
    }
    return r;
};
exports.getIndex = function (types) {
    var r = exports.getTypeIndex(types[0]);
    for (var i = 1; i < types.length; i++) {
        var ti = exports.getTypeIndex(types[i]);
        for (var k in r) {
            if (ti.hasOwnProperty(k)) {
                var ips = r[k];
                var tips = ti[k];
                var _loop_1 = function (j) {
                    var tip = tips[j];
                    var ii = ips.findIndex(function (_a) {
                        var v = _a[0];
                        return v === tip[0];
                    });
                    if (ii === -1) {
                        ips.push(tip);
                    }
                    else if (tips[ii][1] !== ips[ii][1]) {
                        delete r[k];
                        return "break-loop";
                    }
                };
                loop: for (var j = 0; j < tips.length; j++) {
                    var state_1 = _loop_1(j);
                    switch (state_1) {
                        case "break-loop": break loop;
                    }
                }
            }
            else {
                delete r[k];
            }
        }
    }
    return r;
};
var first = function (index) {
    for (var k in index) {
        return [k, index[k]];
    }
    return undefined;
};
/**
 * @since 1.0.0
 */
exports.union = function (types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' | ') + ")"; }
    var len = types.length;
    var index = first(exports.getIndex(types));
    if (index) {
        var tag_1 = index[0];
        var pairs_1 = index[1];
        var find_1 = function (tagValue) {
            for (var i = 0; i < pairs_1.length; i++) {
                var pair = pairs_1[i];
                if (pair[0] === tagValue) {
                    return [i, pair[1]];
                }
            }
        };
        var isTagValue_1 = function (u) { return find_1(u) !== undefined; };
        var TagValue_1 = new Type(pairs_1.map(function (_a) {
            var v = _a[0];
            return JSON.stringify(v);
        }).join(' | '), isTagValue_1, function (u, c) { return (isTagValue_1(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity);
        return new UnionType(name, function (u) {
            if (!exports.UnknownRecord.is(u)) {
                return false;
            }
            var tagValue = u[tag_1];
            var type = find_1(tagValue);
            return type ? type[1].is(u) : false;
        }, function (u, c) {
            var dictionaryResult = exports.UnknownRecord.validate(u, c);
            if (dictionaryResult.isLeft()) {
                return dictionaryResult;
            }
            else {
                var d = dictionaryResult.value;
                var tagValue = d[tag_1];
                var tagValueValidation = TagValue_1.validate(d[tag_1], exports.appendContext(c, tag_1, TagValue_1));
                if (tagValueValidation.isLeft()) {
                    return tagValueValidation;
                }
                var _a = find_1(tagValue), typeIndex = _a[0], type_3 = _a[1];
                return type_3.validate(d, exports.appendContext(c, String(typeIndex), type_3));
            }
        }, useIdentity(types, len) ? exports.identity : function (a) { return find_1(a[tag_1])[1].encode(a); }, types);
    }
    else {
        return new UnionType(name, function (u) { return types.some(function (type) { return type.is(u); }); }, function (u, c) {
            var errors = [];
            for (var i = 0; i < len; i++) {
                var type_4 = types[i];
                var validation = type_4.validate(u, exports.appendContext(c, String(i), type_4));
                if (validation.isRight()) {
                    return validation;
                }
                else {
                    pushAll(errors, validation.value);
                }
            }
            return exports.failures(errors);
        }, useIdentity(types, len)
            ? exports.identity
            : function (a) {
                var i = 0;
                for (; i < len - 1; i++) {
                    var type_5 = types[i];
                    if (type_5.is(a)) {
                        return type_5.encode(a);
                    }
                }
                return types[i].encode(a);
            }, types);
    }
};
/**
 * @since 1.0.0
 */
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
exports.IntersectionType = IntersectionType;
/**
 * @since 1.0.0
 */
function intersection(types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' & ') + ")"; }
    var len = types.length;
    return new IntersectionType(name, function (u) { return types.every(function (type) { return type.is(u); }); }, function (u, c) {
        var a = u;
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_6 = types[i];
            var validation = type_6.validate(a, c);
            if (validation.isLeft()) {
                pushAll(errors, validation.value);
            }
            else {
                a = validation.value;
            }
        }
        return errors.length ? exports.failures(errors) : exports.success(a);
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = a;
            for (var i = 0; i < len; i++) {
                var type_7 = types[i];
                s = type_7.encode(s);
            }
            return s;
        }, types);
}
exports.intersection = intersection;
/**
 * @since 1.0.0
 */
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
exports.TupleType = TupleType;
/**
 * @since 1.0.0
 */
function tuple(types, name) {
    if (name === void 0) { name = "[" + types.map(function (type) { return type.name; }).join(', ') + "]"; }
    var len = types.length;
    return new TupleType(name, function (u) { return exports.UnknownArray.is(u) && u.length === len && types.every(function (type, i) { return type.is(u[i]); }); }, function (u, c) {
        var arrayValidation = exports.UnknownArray.validate(u, c);
        if (arrayValidation.isLeft()) {
            return arrayValidation;
        }
        else {
            var as = arrayValidation.value;
            var t = as;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var a = as[i];
                var type_8 = types[i];
                var validation = type_8.validate(a, exports.appendContext(c, String(i), type_8));
                if (validation.isLeft()) {
                    pushAll(errors, validation.value);
                }
                else {
                    var va = validation.value;
                    if (va !== a) {
                        /* istanbul ignore next */
                        if (t === as) {
                            t = as.slice();
                        }
                        t[i] = va;
                    }
                }
            }
            if (as.length > len) {
                errors.push(exports.getValidationError(as[len], exports.appendContext(c, String(len), exports.never)));
            }
            return errors.length ? exports.failures(errors) : exports.success(t);
        }
    }, useIdentity(types, len) ? exports.identity : function (a) { return types.map(function (type, i) { return type.encode(a[i]); }); }, types);
}
exports.tuple = tuple;
/**
 * @since 1.0.0
 * @deprecated
 */
var ReadonlyType = /** @class */ (function (_super) {
    __extends(ReadonlyType, _super);
    function ReadonlyType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyType';
        return _this;
    }
    return ReadonlyType;
}(Type));
exports.ReadonlyType = ReadonlyType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.readonly = function (type, name) {
    if (name === void 0) { name = "Readonly<" + type.name + ">"; }
    return new ReadonlyType(name, type.is, function (u, c) {
        return type.validate(u, c).map(function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            return x;
        });
    }, type.encode === exports.identity ? exports.identity : type.encode, type);
};
/**
 * @since 1.0.0
 * @deprecated
 */
var ReadonlyArrayType = /** @class */ (function (_super) {
    __extends(ReadonlyArrayType, _super);
    function ReadonlyArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyArrayType';
        return _this;
    }
    return ReadonlyArrayType;
}(Type));
exports.ReadonlyArrayType = ReadonlyArrayType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.readonlyArray = function (type, name) {
    if (name === void 0) { name = "ReadonlyArray<" + type.name + ">"; }
    var arrayType = exports.array(type);
    return new ReadonlyArrayType(name, arrayType.is, function (u, c) {
        return arrayType.validate(u, c).map(function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            else {
                return x;
            }
        });
    }, arrayType.encode, type);
};
/**
 * @since 1.0.0
 * @deprecated
 */
var StrictType = /** @class */ (function (_super) {
    __extends(StrictType, _super);
    function StrictType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'StrictType';
        return _this;
    }
    return StrictType;
}(Type));
exports.StrictType = StrictType;
/**
 * Specifies that only the given properties are allowed
 * Use `exact` instead
 * @deprecated
 * @since 1.0.0
 */
exports.strict = function (props, name) {
    if (name === void 0) { name = "StrictType<" + getNameFromProps(props) + ">"; }
    var exactType = exact(exports.type(props));
    return new StrictType(name, exactType.is, exactType.validate, exactType.encode, props);
};
/**
 * @since 1.3.0
 */
exports.isTagged = function (tag) {
    var f = function (type) {
        if (type instanceof InterfaceType || type instanceof StrictType) {
            return hasOwnProperty.call(type.props, tag);
        }
        else if (type instanceof IntersectionType) {
            return type.types.some(f);
        }
        else if (type instanceof UnionType) {
            return type.types.every(f);
        }
        else if (type instanceof RefinementType || type instanceof ExactType) {
            return f(type.type);
        }
        else {
            return false;
        }
    };
    return f;
};
var findTagged = function (tag, types) {
    var len = types.length;
    var is = exports.isTagged(tag);
    var i = 0;
    for (; i < len - 1; i++) {
        var type_9 = types[i];
        if (is(type_9)) {
            return type_9;
        }
    }
    return types[i];
};
/**
 * @since 1.3.0
 */
exports.getTagValue = function (tag) {
    var f = function (type) {
        switch (type._tag) {
            case 'InterfaceType':
            case 'StrictType':
                return type.props[tag].value;
            case 'IntersectionType':
                return f(findTagged(tag, type.types));
            case 'UnionType':
                return f(type.types[0]);
            case 'RefinementType':
            case 'ExactType':
            case 'RecursiveType':
                return f(type.type);
        }
    };
    return f;
};
/**
 * @since 1.3.0
 * @deprecated
 */
var TaggedUnionType = /** @class */ (function (_super) {
    __extends(TaggedUnionType, _super);
    function TaggedUnionType(name, is, validate, encode, types, tag) {
        var _this = _super.call(this, name, is, validate, encode, types) /* istanbul ignore next */ // <= workaround for https://github.com/Microsoft/TypeScript/issues/13455
         || this;
        _this.tag = tag;
        return _this;
    }
    return TaggedUnionType;
}(UnionType));
exports.TaggedUnionType = TaggedUnionType;
/**
 * Use `union` instead
 *
 * @since 1.3.0
 * @deprecated
 */
exports.taggedUnion = function (tag, types, name) {
    if (name === void 0) { name = "(" + types.map(function (type) { return type.name; }).join(' | ') + ")"; }
    var len = types.length;
    var values = types.map(exports.getTagValue(tag));
    var findIndex = function (tagValue) {
        var i = 0;
        for (; i < len - 1; i++) {
            if (values[i] === tagValue) {
                break;
            }
        }
        return i;
    };
    var isTagValue = function (u) { return values.indexOf(u) !== -1; };
    var TagValue = new Type(values.map(function (l) { return JSON.stringify(l); }).join(' | '), isTagValue, function (u, c) { return (isTagValue(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity);
    return new TaggedUnionType(name, function (v) {
        if (!exports.UnknownRecord.is(v)) {
            return false;
        }
        var tagValue = v[tag];
        return isTagValue(tagValue) && types[findIndex(tagValue)].is(v);
    }, function (s, c) {
        var dictionaryValidation = exports.UnknownRecord.validate(s, c);
        if (dictionaryValidation.isLeft()) {
            return dictionaryValidation;
        }
        else {
            var d = dictionaryValidation.value;
            var tagValueValidation = TagValue.validate(d[tag], exports.appendContext(c, tag, TagValue));
            if (tagValueValidation.isLeft()) {
                return tagValueValidation;
            }
            else {
                var i = findIndex(tagValueValidation.value);
                var type_10 = types[i];
                return type_10.validate(d, exports.appendContext(c, String(i), type_10));
            }
        }
    }, useIdentity(types, len) ? exports.identity : function (a) { return types[findIndex(a[tag])].encode(a); }, types, tag);
};
/**
 * @since 1.1.0
 */
var ExactType = /** @class */ (function (_super) {
    __extends(ExactType, _super);
    function ExactType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ExactType';
        return _this;
    }
    return ExactType;
}(Type));
exports.ExactType = ExactType;
var getProps = function (type) {
    switch (type._tag) {
        case 'RefinementType':
        case 'ReadonlyType':
            return getProps(type.type);
        case 'InterfaceType':
        case 'StrictType':
        case 'PartialType':
            return type.props;
        case 'IntersectionType':
            return type.types.reduce(function (props, type) { return Object.assign(props, getProps(type)); }, {});
    }
};
/**
 * @since 1.1.0
 */
function exact(type, name) {
    if (name === void 0) { name = "ExactType<" + type.name + ">"; }
    var props = getProps(type);
    return new ExactType(name, function (u) { return type.is(u) && Object.getOwnPropertyNames(u).every(function (k) { return hasOwnProperty.call(props, k); }); }, function (u, c) {
        var looseValidation = type.validate(u, c);
        if (looseValidation.isLeft()) {
            return looseValidation;
        }
        else {
            var o = looseValidation.value;
            var keys = Object.getOwnPropertyNames(o);
            var len = keys.length;
            var errors = [];
            for (var i = 0; i < len; i++) {
                var key = keys[i];
                if (!hasOwnProperty.call(props, key)) {
                    errors.push(exports.getValidationError(o[key], exports.appendContext(c, key, exports.never)));
                }
            }
            return errors.length ? exports.failures(errors) : exports.success(o);
        }
    }, type.encode, type);
}
exports.exact = exact;
/**
 * Drops the runtime type "kind"
 * @since 1.1.0
 * @deprecated
 */
function clean(type) {
    return type;
}
exports.clean = clean;
function alias(type) {
    return function () { return type; };
}
exports.alias = alias;
