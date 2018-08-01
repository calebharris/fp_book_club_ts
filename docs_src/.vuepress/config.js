module.exports = {
  base: "/fp_book_club_ts/",
  dest: "docs",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Chapters", link: "/chapter_1"},
      { text: "GitHub", link: "https://github.com/calebharris/fp_book_club_ts" }
    ],
    sidebar: [
      "/chapter_1"
    ]
  }
}
