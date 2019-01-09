import * as t from '../src';
export declare const T5: t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>;
export declare const R1: t.RefinementT<t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>>;
declare type R = {
    a: number;
    b: R | undefined | null;
};
export declare const Rec1: t.RecursiveType<t.Type<R, R, unknown>, R, R, unknown>;
export declare const A1: t.ArrayT<t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>>;
export declare const P5: t.PartialT<{
    e: t.PartialT<{
        d: t.PartialT<{
            c: t.PartialT<{
                b: t.PartialT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>;
export declare const D5: t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.NumberT>>>>>;
export declare const U1: t.UnionT<[t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.NumberT>>>>>]>;
export declare const I1: t.IntersectionT<[t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.NumberT>>>>>]>;
export declare const Tu1: t.TupleT<[t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.RecordT<t.StringT, t.NumberT>>>>>]>;
export declare const RO1: t.ReadonlyT<t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>>;
export declare const RA1: t.ReadonlyArrayT<t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>>;
export declare const S5: t.StrictT<{
    e: t.StrictT<{
        d: t.StrictT<{
            c: t.StrictT<{
                b: t.StrictT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>;
export declare const TU1: t.TaggedUnionT<"type", [t.TypeT<{
    type: t.LiteralT<true>;
    foo: t.StringT;
}>, t.TypeT<{
    type: t.LiteralT<false>;
    bar: t.NumberT;
}>]>;
export declare const E1: t.ExactT<t.TypeT<{
    e: t.TypeT<{
        d: t.TypeT<{
            c: t.TypeT<{
                b: t.TypeT<{
                    a: t.StringT;
                }>;
            }>;
        }>;
    }>;
}>>;
export {};
