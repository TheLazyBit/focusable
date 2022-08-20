// deriving the Z function in js

// const fact = n => n === 0 ? 1 : n*fact(n-1)
// console.log(fact(4))
//
// const fact2_ = (fac) => n => n === 0 ? 1 : n*fac(fac)(n-1)
// const fact2 = n => fact2_(fact2_)(n)
// console.log(fact2(4))
//
// const fact3_ = (fac) => {
//     let f = n => fac(fac)(n);
//     return n => n === 0 ? 1 : n*f(n-1)
// }
// console.log(fact3_(fact3_)(4))
//
//
// const fact4_ = (fac) => {
//     return (
//         f => n => n === 0 ? 1 : n*f(n-1)
//     )(
//         n => fac(fac)(n)
//     )
// }
// console.log(fact4_(fact4_)(4))
//
// const fact__ = f => n => n === 0 ? 1 : n*f(n-1)
// const fact5_ = (fac) =>
//     (
//         fact__
//     )(
//         n => fac(fac)(n)
//     )
// console.log(fact5_(fact5_)(4))
//
// const fact6_ = () => {
//     let inner = self =>
//         (
//             fact__
//         )(
//             n => self(self)(n)
//         )
//     return inner(inner)
// }
// console.log(fact6_()(4))
//
// const fact7_ = () => {
//     return (inner => inner(inner))
//     (self => fact__(n => self(self)(n)))
// }
// console.log(fact7_()(4))
//
// const fact8_ = () =>
//     (u => u(u))
//     (u => fact__(n => u(u)(n)))
//
// console.log(fact8_()(4))
//
// const setup = (f) =>
//     (u => u(u))
//     (u => f(n => u(u)(n)))
//
// console.log(setup(fact__)(4))
//
// const fact9 = setup(fact => n => n === 0 ? 1 : n*fact(n-1))
//
// console.log(fact9(4))
//
// const Z = (f) =>
//     (u => f(n => u(u)(n)))
//     (u => f(n => u(u)(n)))
//
//

((tl) => {
    tl.printBoolean = (a) => a(() => console.log('true'))(() => console.log('false'))();

    // boolean
    console.log('\n\nbools');
    tl.true = (a) => (b) => a;
    tl.false = (a) => (b) => b;
    tl.printBoolean(tl.true);
    tl.printBoolean(tl.false);


    console.log('\n\nand');
    tl.and = (a) => (b) => a(b)(tl.false);
    tl.printBoolean(tl.and(tl.false)(tl.false));
    tl.printBoolean(tl.and(tl.false)(tl.true));
    tl.printBoolean(tl.and(tl.true)(tl.false));
    tl.printBoolean(tl.and(tl.true)(tl.true));


    console.log('\n\nnot');
    tl.not = (a) => a(tl.false)(tl.true);
    tl.printBoolean(tl.not(tl.true));
    tl.printBoolean(tl.not(tl.false));


    console.log('\n\nif');
    tl.if = (when) => (then) => (other) => when(then)(other);
    tl.if(tl.true)(() => console.log('yes'))(() => console.log('no'))();
    tl.if(tl.false)(() => console.log('yes'))(() => console.log('no'))();


    console.log('\n\nor');
    tl.or = (a) => (b) => tl.if(a)(a)(b);
    tl.printBoolean(tl.or(tl.false)(tl.false));
    tl.printBoolean(tl.or(tl.false)(tl.true));
    tl.printBoolean(tl.or(tl.true)(tl.false));
    tl.printBoolean(tl.or(tl.true)(tl.true));


    console.log('\n\nnumbers');
    tl.zero = (f) => (x) => x;
    tl.succ = (number) => (f) => (x) => f(number(f)(x));
    tl.one = tl.succ(tl.zero);
    tl.two = tl.succ(tl.one);
    tl.three = tl.succ(tl.two);
    tl.four = tl.succ(tl.three);
    tl.five = tl.succ(tl.four);
    tl.six = tl.succ(tl.five);
    tl.seven = tl.succ(tl.six);
    tl.eight = tl.succ(tl.seven);
    tl.nine = tl.succ(tl.eight);

    tl.printNumber = (number) => console.log(number((x) => x + '|')('N:'));
    tl.printNumberAsInt = (number) => console.log(number((x) => x + 1)(0));
    tl.printNumber(tl.zero);
    tl.printNumber(tl.one);
    tl.printNumber(tl.two);
    tl.printNumber(tl.three);
    tl.printNumber(tl.four);
    tl.printNumber(tl.five);
    tl.printNumber(tl.six);
    tl.printNumber(tl.seven);
    tl.printNumber(tl.eight);
    tl.printNumber(tl.nine);

    console.log('\n\npred');
    tl.pred = (number) => (f) => (x) => number((g) => (h) => h(g(f)))((u) => x)((u) => u);
    tl.printNumber(tl.pred(tl.three));
    tl.printNumber(tl.pred(tl.two));
    tl.printNumber(tl.pred(tl.one));
    tl.printNumber(tl.pred(tl.zero));


    console.log('\n\nplus');
    tl.plus = (n1) => (n2) => (f) => (x) => n1(f)(n2(f)(x));
    tl.printNumber(tl.plus(tl.one)(tl.two));
    tl.printNumber(tl.plus(tl.three)(tl.two));


    console.log('\n\nminus');
    tl.minus = (n1) => (n2) => n2(tl.pred)(n1);
    tl.printNumber(tl.minus(tl.three)(tl.two));
    tl.printNumber(tl.minus(tl.nine)(tl.five));


    console.log('\n\nmult');
    tl.mult = (n1) => (n2) => (f) => n1(n2(f));

    tl.printNumber(tl.mult(tl.one)(tl.two));
    tl.printNumber(tl.mult(tl.three)(tl.two));

    console.log('\n\nisZero');
    tl.isZero = (number) => number((x) => tl.false)(tl.true);

    tl.printBoolean(tl.isZero(tl.zero));
    tl.printBoolean(tl.isZero(tl.one));
    tl.printBoolean(tl.isZero(tl.two));

    console.log('\n\nlessThanEquals');
    tl.lessThanEquals = (n1) => (n2) => tl.isZero(tl.minus(n1)(n2));

    tl.printBoolean(tl.lessThanEquals(tl.zero)(tl.two));
    tl.printBoolean(tl.lessThanEquals(tl.three)(tl.two));
    tl.printBoolean(tl.lessThanEquals(tl.six)(tl.six));

    console.log('\n\nequals');
    tl.equals = (n1) => (n2) => tl.and(tl.isZero(tl.minus(n1)(n2)))(tl.isZero(tl.minus(n2)(n1)));

    tl.printBoolean(tl.equals(tl.seven)(tl.nine));
    tl.printBoolean(tl.equals(tl.three)(tl.two));
    tl.printBoolean(tl.equals(tl.six)(tl.six));

    console.log('\n\nfactorial');
    tl.Z = (f) => ((u) => f((n) => u(u)(n))) ((u) => f(n => u(u)(n)));

    tl.fact = (n) => tl.Z(
        (fact) => (n) => tl.if(
            tl.isZero(n)
        )(
            () => tl.one
        )(
            () => tl.mult(n)(fact(tl.pred(n))())
        )
    )(n)();

    tl.printNumberAsInt(tl.fact(tl.four));
    tl.printNumberAsInt(tl.fact(tl.six));

    console.log('\n\npair');
    tl.pair = (a) => (b) => (z) => z(a)(b);
    tl.first = (pair) => pair((a) => (b) => a);
    tl.second = (pair) => pair((a) => (b) => b);
    tl.printPair = (pair) => console.log(tl.first(pair) + ';' + tl.second(pair));

    tl.printPair(tl.pair('a')('b'));


    console.log('\n\nlist');
    tl.nil = tl.pair(tl.true)(tl.true);
    tl.isNil = tl.first;
    tl.cons = (h) => (t) => tl.pair(tl.false)(tl.pair(h)(t));
    tl.head = (list) => tl.first(tl.second(list));
    tl.tail = (list) => tl.second(tl.second(list));

    tl.printList = (list) => console.log('[' + tl.Z(
        (toString) => (_list) => tl.if(
            tl.isNil(_list)
        )(
            () => ''
        )(
            () => tl.head(_list) + ';' + toString(tl.tail(_list))()
        )
    )(list)() + ']');

    tl.someList = tl.cons('c')(tl.cons('b')(tl.cons('a')(tl.nil)));

    tl.printList(tl.someList);

    console.log('\n\nwhile');
    tl.while = (test) => (updateTestValue) => (testValue) => (func) => (x) => tl.Z(
        (repeat) => (test) => (updateTestValue) => (testValue) => (func) => (x) => tl.if(
            test(testValue)
        )(
            () => repeat(test)(updateTestValue)(updateTestValue(testValue))(func)(func(x))()
        )(
            () => x
        )
    )(test)(updateTestValue)(testValue)(func)(x)();

    console.log('\n\npowersOfTwo');
    tl.powerOfTwo = (pow) => tl.while(n => tl.not(tl.isZero(n)))(tl.pred)(pow)(
        n => tl.plus(n)(n)
    )(tl.one);

    tl.printNumberAsInt(tl.powerOfTwo(tl.zero));
    tl.printNumberAsInt(tl.powerOfTwo(tl.one));
    tl.printNumberAsInt(tl.powerOfTwo(tl.two));
    tl.printNumberAsInt(tl.powerOfTwo(tl.four));
    tl.printNumberAsInt(tl.powerOfTwo(tl.five));
    tl.printNumberAsInt(tl.powerOfTwo(tl.six));
})({});