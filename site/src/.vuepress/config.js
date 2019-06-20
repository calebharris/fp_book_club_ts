const mdContainer = require("markdown-it-container");

module.exports = {
  base: "/fp_book_club_ts/",
  dest: "out",
  markdown: {
    extendMarkdown: md => {
      // Creates hidden-by-default, expandable blocks, meant for exercise answers
      md.use(mdContainer, "answer", {
        marker: "?",
        render (tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return '<details><summary>Answer</summary>\n';
          } else {
            return '</details>\n';
          }
        }
      });
    },
    lineNumbers: true
  },
  themeConfig: {
    lastUpdated: true,
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Chapters",
        items: [
          { text: "Chapter 1", link: "/chapter_1" },
          { text: "Chapter 2", link: "/chapter_2" },
          { text: "Chapter 3", link: "/chapter_3" },
          { text: "Chapter 4", link: "/chapter_4" },
          { text: "Chapter 5", link: "/chapter_5" },
          { text: "Chapter 6", link: "/chapter_6" }
        ]
      },
      { text: "GitHub", link: "https://github.com/calebharris/fp_book_club_ts" }
    ],
    sidebar: [
      "/chapter_1",
      "/chapter_2",
      "/chapter_3",
      "/chapter_4",
      "/chapter_5",
      "/chapter_6"
    ],
    sidebarDepth: 2
  },
  title: "Functional Programming in TypeScript"
}
