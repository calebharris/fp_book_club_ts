# fp_book_club_ts
Exercises and notes from [Functional Programming in Scala][fpinscala] translated to [TypeScript][ts].

## Working with the documentation

The notes, under docs_src, are meant to be deployed using [GitHub Pages][ghpages]. We use [VuePress][vuepress] to write
the notes in Markdown and render them to plain old HTML.

To update the notes:
1. run `npm run docs:dev`, and point your browser to the address displayed by VuePress, which is likely
   http://localhost:8080.
2. Edit the source files in `docs_src/`, proofreading as you go in the browser.
3. When you're done, run `npm run docs:build`, which will result in changes to the HTML under `docs/`. Commit all the
   changes under both `docs_src/` and `docs/`, merge to master if necessary, and push.
4. GitHub looks for changes to the static site assets under `docs/`. If it finds changes, it redeployes the site at
   http://calebharris.github.io/fp_book_club_ts.

[fpinscala]: https://www.manning.com/books/functional-programming-in-scala "Functional Programming in Scala"
[ghpages]: https://pages.github.com "GitHub Pages"
[ts]: https://www.typescriptlang.org "TypeScript"
[vuepress]: https://vuepress.vuejs.org "VuePress"
