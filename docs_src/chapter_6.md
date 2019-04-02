# Chapter 6. Purely functional state

We're going to investigate how to write purely functional programs that need to manipulate state, through the example of
*random number generation*. Not particularly exciting in and of itself, but the idea is simple enough to make for a good
introduction.

## Generating random numbers using side effects

In bog-standard TypeScript/JavaScript, the universe of options available to you to generate a random number comprises
`Math.random`... and that's it.

``` typescript
> let randomNumber = Math.random();
undefined
> randomNumber
0.8158681035026218
```

::: danger

Do not use `Math.random` in situations that call for cryptographically secure random numbers (i.e.  encryption, hashing
passwords, generating passwords, etc.). That is not its intended use and it is not suitable for such purposes. If you
have a need for secure randomness, start with [Node's `crypto` module][node_crypto] or the [Web Crypto API][web_crypto]. 
:::

[node_crypto]: https://nodejs.org/dist/latest-v10.x/docs/api/crypto.html#crypto_crypto "Crypto | Node.js Documentation"
[web_crypto]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API "Web Crypto API | MDN"
