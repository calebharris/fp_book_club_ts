# fp_book_club_ts
Exercises and notes from [Functional Programming in Scala][fpinscala] translated to [TypeScript][ts].

This repository is essentially split into two halves. One half generates the website containing the notes, and one half
contains TypeScript code illustrating the notes. So there are two directories at the top level:

* `site/` - source files for the VuePress-powered notes website
* `code/` - runnable examples and rudimentary FP library in TypeScript

There is a third top-level directory, `docs/`, which contains the output of running VuePress on the sources in `site/`.
The `docs/` directory is required by GitHub pages, on which the site is hosted.

## Running the code

1. Install the version of node specified in `/code/.node-version` (10.6.0 as of this writing). On a Mac, using nodenv,
   do:
   ```
   $ brew update
   $ brew upgrade node-build
   $ nodenv install 10.6.0
   ```
2. `cd code/` and install dependencies:
   ```
   $ npm install
   ```
3. Run the TypeScript REPL...
   ```
   $ npm run console

   > fp_book_club_ts@0.0.1 console ~/code/fp_book_club_ts
   > ts-node

   > console.log("Hi there!");
   Hi there!
   undefined
   >
   ```
4. ...Or run the tests...
   ```
   $ npm test

   > fp_book_club_ts@0.0.1 test ~/code/fp_book_club_ts
   > jest

    PASS  libfpts/intro/cafe.test.ts
     ✓ returns a Coffee (51ms)

     console.log libfpts/intro/impure_example.ts:13
       Side effect! Charging the credit card...

   Test Suites: 1 passed, 1 total
   Tests:       1 passed, 1 total
   Snapshots:   0 total
   Time:        0.896s, estimated 1s
   ```
5. ...Or run the affected tests on every file change...
   ```
   $ npm run test:watch
   ```
6. ...Or run all the tests on every file change...
   ```
   $ npm run test:watchAll
   ```

We use [Jest][jest] as our test framework, via [ts-jest][ts-jest]. In addition to the top-level scripts listed above,
you can invoke Jest with arbitrary arguments with `npm test -- [--jestArg1 --jestArg2 ...]`. To see everything Jest can
do for you, run `npm test -- --help`.

## Working with the documentation

The notes, under `site/src`, are meant to be deployed using [GitHub Pages][ghpages]. We use [VuePress][vuepress] to
write the notes in Markdown and render them to plain old HTML.

To update the notes:
1. `cd site/` and run `npm run docs:dev`, and point your browser to the address displayed by VuePress, which is likely
   http://localhost:8080.
2. Edit the source files in `site/src/`, proofreading as you go in the browser.
3. When you're done, run `npm run docs:build`, which will output the static site contents into `site/out/`.
4. `cd ../` to return to the project root director, and run `npm pages:cp` to copy the static site content into `docs/`,
   as required by GitHub Pages. Commit all the changes under both `site/src/` and `docs/`, merge to master if necessary,
   and push.
4. GitHub looks for changes to the static site assets under `docs/`. If it finds changes, it redeployes the site at
   http://calebharris.github.io/fp_book_club_ts.

[fpinscala]: https://www.manning.com/books/functional-programming-in-scala "Functional Programming in Scala"
[ghpages]: https://pages.github.com "GitHub Pages"
[jest]: https://jestjs.io/en/ "Jest"
[ts]: https://www.typescriptlang.org "TypeScript"
[ts-jest]: https://github.com/kulshekhar/ts-jest "ts-jest"
[vuepress]: https://vuepress.vuejs.org "VuePress"
