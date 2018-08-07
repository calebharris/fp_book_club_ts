module.exports = {
  base: "/fp_book_club_ts/",
  dest: "docs",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Chapters",
        items: [
          { text: "Chapter 1", link: "/chapter_1" },
          { text: "Chapter 2", link: "/chapter_2" },
          { text: "Chapter 3", link: "/chapter_3" }
        ]
      },
      { text: "GitHub", link: "https://github.com/calebharris/fp_book_club_ts" }
    ],
    sidebar: [
      "/chapter_1",
      "/chapter_2",
      "/chapter_3"
    ],
    sidebarDepth: 2
  }
}
