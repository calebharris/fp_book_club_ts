# Chapter 1. What is functional programming?

We construct our programs using only *pure functions* - functions that have no *side effects*.

A function has a side effect if it does anything other than return a value. Examples:
* Modifying a variable
* Modifying a data structure in place
* Setting a field on an object
* Throwing an exception or halting with an error
* Printing to the console or reading user input
* Reading from or writing to a file
* Drawing on the screen

## Benefits of FP: a simple example

We'll walk through refactoring a simple program to remove side effects and demonstrate some TypeScript syntax. We'll
also touch on two import concepts in functional programming: *referential transparency* and the *substitution model*.

See [the code repository](https://github.com/calebharris/fp_book_club_ts/tree/master/fpbookclub/intro) for expanded,
runnable versions of these examples.

### A program with side effects
```typescript
class Cafe {                               //class keyword introduces a class, just
                                           //  like every other OO language

  buyCoffee(cc: CreditCard): Coffee {      //method of a class introduced by a name
                                           //  followed by ()
                                           //`cc: CreditCard` defines parameter
                                           //  named `cc` of type `CreditCard`
                                           //`: Coffee` declares the return type of
                                           //  the method. compiler will error if the
                                           //  method can possibly not return a
                                           //  `Coffee` object
    const cup = new Coffee();
    cc.charge(cup.price);                  //side effect: actually charges the card
    return cup;
  }
}
```

The line `cc.charge(cup.price)` is an example of a side effect. Charging a credit card involves some interaction
with the outside world. But the function's return value is just a `Coffee`, meaning this interactions are not easily
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

The side effect still happens. But we have regained some testability because we can pass in a mock `Payments` object.
However, any mock will be awkward to use, because it will have to do things like maintain internal state that we can
inspect after the call to `charge()`. This all feels like overkill if we just want to test that buyCoffee creates a
charge equal to the price of a cup of coffee.
