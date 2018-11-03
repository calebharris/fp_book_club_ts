# Chapter 1. What is functional programming?

We construct our programs using only *pure functions* - functions that have no *side effects*.

A function has a side effect if it does anything other than return a value. Examples:
* Modifying any state, such as a variable or data structure, in place
* Throwing an exception or exiting the program with an error
* Reading or writing a file
* Making a network request

## Benefits of FP: a simple example

We'll walk through refactoring a simple program to remove side effects and demonstrate some TypeScript syntax. We'll
also touch on two import concepts in functional programming: *referential transparency* and the *substitution model*.

See [the code repository](https://github.com/calebharris/fp_book_club_ts/tree/master/fpbookclub/intro) for expanded,
runnable versions of these examples.

### A program with side effects
```typescript
// `class` keyword introduces a class
class Cafe {

  // method of a class introduced by a
  // name followed by ()
  buyCoffee(cc: CreditCard): Coffee {   // `cc: CreditCard` defines parameter
                                        //  named `cc` of type `CreditCard`
                                        //
                                        // `: Coffee` declares the return type
                                        // of the method. compiler will error
                                        // if the method doesn't return a
                                        // `Coffee` object

    const cup = new Coffee();
    cc.charge(cup.price);               // side effect: charges the card
    return cup;
  }
}
```

The line `cc.charge(cup.price)` is an example of a side effect. Charging a credit card involves some interaction
with the outside world. But the function's return value is just a `Coffee`, meaning this interaction is not easily
observable, making our function difficult to test. We can improve modularity and testability by introducing a
`Payments` object that encapsulates the payment processing logic and removing it from `CreditCard`.

### Adding a Payments object
```typescript
class Cafe {
  buyCoffee(cc: CreditCard, p: Payments): Coffee {
    const cup = new Coffee();
    p.charge(cc, cup.price);
    return cup;
  }
}
```

The side effect still happens. But we have improved testability because we can pass in a mock `Payments` object.
However, any mock will be awkward to use, because it will have to do things like maintain internal state that we can
inspect after the call to `charge()`. This is a bit much if all we want is to test that buyCoffee charges the correct
amount for a cup of coffee. It's also going to be tough to reuse buyCoffee. Say we wanted to buy 10 coffees: there is
no obvious way to do that without contacting the payment processor 10 times!

### A functional solution: removing the side effects
```typescript
// buyCoffee now returns a pair, or tuple, of the
// purchased Coffee  and its associated Charge
buyCoffee(cc: CreditCard): [Coffee, Charge] {
  const cup = new Coffee();
  const charge = new Charge(cc, cup.price);
  return [cup, charge];
}
```

Here, we've removed the side effect. Instead of immediately interacting with the payment processor, `buyCoffee` returns
a new `Charge` value object along with the `Coffee`. We can think of this as a description of what we want to happen,
rather than detailed instructions on how to accomplish it. Actually *interpreting* the meaning of `Charge` objects is
now a concern for elsewhere. In fact, `Cafe` no longer has any knowledge of how the process of charging the card works.
Let's look at `Charge` more closely:

```typescript
class Charge {
  readonly cc: CreditCard;    // once a Charge is created, it should never
  readonly amount: number;    // change, hence the `readonly` markers

  constructor(cc: CreditCard, amount: number) {
    this.cc = cc;
    this.amount = amount;
  }

  /**
   * Returns a new Charge containing the sum of the amounts of this Charge
   * and the other Charge
   **/
  combine(other: Charge): Charge {
    if (this.cc == other.cc) {
      return new Charge(this.cc, this.amount + other.amount);
    } else {
      throw new Error("Can't combine charges to different cards");
    }
  }
}
```

`Charge` is an immutable value object, equipped with a `combine()` function to merge two charges into one. Now we have
a way to more easily represent the idea of purchasing 10 coffees. We just need to combine the 10 charges into one.

```typescript
buyCoffees(cc: CreditCard, n: number): [Coffee[], Charge] {
  const cards: CreditCard[] = new Array(n).fill(cc);
  const purchases = Array.from(cards, cc => this.buyCoffee(cc));

  // this part is a bit ugly, but we're just splitting the array of
  // [Coffee, Charge] tuples into one Coffee array and one Charge array
  const [coffs, chgs] = purchases.reduce(
    ([coffees, charges], [coffee, charge]) => {
        coffees.push(coffee);
        charges.push(charge);
        return [coffees, charges];
    },
    [new Array(), new Array()]
  );

  // reduce the list of Charges to one by sequentially applying combine()
  return [coffs, chgs.reduce((l, r) => l.combine(r))];
}
```

Our functional solution has significant advantages over the previous two iterations. It's easier to test, since all we
need to do is assert that the `Charge` objects have the expected values in their `cc` and `amount` properties. It's
also easier to combine simple, low-level behavior into more advanced functionality. Look how straightforward it was to
implement batch charging! Finally, we can imagine that the library for communicating with the payment processor is made
simpler by this approach. It only needs to issue the correct commands for any given value of `Charge`.

::: tip Note
If you've been following along in *Functional Programming in Scala*, you may have noticed that the Scala code
corresponding to these snippets is more compact and elegant. For instance, TypeScript doesn't have the notion of
`case` classes, requiring us to write a little more boilerplate to achieve the same end. It also lacks an `unzip`
for easily separating a sequence of tuples into a tuple of sequences. In general, TypeScript's standard library (which
is really just JavaScript's) is less comprehensive than Scala's.

On the other hand, TypeScript has better destructuring support (e.g. `const [coffees, charges] = ...`) and is a
relatively thin enhancement to JavaScript, giving it great applicability to web programming. Many people find the
experience of developing software with Node.js to be a joy (and, conversely, developing with anything JVM-based to be a
constant time-suck).

Later on, we'll have to employ some advanced, potentially difficult-to-understand techniques to get the same expressive
power from TypeScript's types as we can with Scala's. Still, TypeScript is a powerful, easy-to-deploy, and
rapidly-evolving language that drastically improves our ability to manage and maintain large JavaScript projects.
:::

## Definition of a pure function

The book differentiates between "functions" and "procedures", stating that the phrase "pure function" is redundant. But
given the preponderance of using "function" to mean any semi-cohesive, addressable sequence of code, we'll stick with
explicitly calling functions "pure" when it matters. Consider a function `f`, with an input type of `A` and an output
type of `B`. In both Scala and TypeScript, the type of `f` is written as `A => B`. Then `f` is pure if it relates every
value of `A` to exactly one value of `B`, the output value is determined solely by the input value, and `f` takes no
other actions that change the meaning of the program.

Some examples of pure functions:
* Integer addition
* Index of substring in string, if the string is immutable

The concept of *referential transparency*, which is a property of *expressions*, formalizes purity. Any part of a
program that can be evaluated to a result is an expression (meaning that a function is one kind of expression), and it
is referentially transparent (or RT) if its every occurence in a program can be replaced by its result without altering
the meaning of the program. More formally:

::: tip Referential transparency and purity
An expression `e` is *referentially transparent* if, for all programs `p`, all occurrences of `e` in `p` can be
replaced by the result of evaluating `e` without changing the meaning of `p`. A function `f` is *pure* if the
expression `f(x)` is referentially transparent for all referentially transparent `x`.
:::

Referential transparency allows us to reason about programs using the substitution model, wherein we discover the
meaning of program by repeatedly replacing expressions with their results.
