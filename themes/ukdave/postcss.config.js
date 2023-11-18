const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    purgecss({
      content: ["./hugo_stats.json"],
      safelist: {
        deep: [/chroma/]
      },
      options: {
        defaultExtractor: (content) => {
          let els = JSON.parse(content).htmlElements;
          return els.tags.concat(els.classes, els.ids);
        },
      },
    }),
    require("autoprefixer"),
  ],
};
