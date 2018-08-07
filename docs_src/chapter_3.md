# Chapter 3. Functional data structures

We said in the introduction that functional programs don't update variables or modify mutable data structures (except in
iterative loops, of course). So what kinds of data structures *can* we use? *Functional data structures*, of course!
This chapter talks about how we define data types in functional programming and a related logical branching technique
called *pattern matching*. It has a ton of exercises, too, to provide practice writing and generalizing pure functions.
In general, the book is trying to lead us to higher level functional abstractions - things like *monoids*, *functors*,
*monads*, and other structures with weird names borrowed from [category theory][wikip_cat].

## Defining functional data structures

A functional data structure is only operated on with pure functions. Pure functions cannot modify data in place or
perform side effects. Thus, by definition, functional data structures are immutable.

Let's start by talking about everyone's favorite functional data structure - a singly linked list. Of course, we're
going to dive into some new TypeScript syntax, as well.

```typescript
```

[wikip_cat]: https://en.wikipedia.org/wiki/Category_theory "Category theory - Wikipedia"
