const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    purgecss.default({
      content: ["./hugo_stats.json"],
      safelist: {
        deep: [/chroma/, /data-bs-theme/]
      },
      defaultExtractor: (content) => {
        let els = JSON.parse(content).htmlElements;
        return els.tags.concat(els.classes, els.ids);
      },
    }),
    require("autoprefixer"),
  ],
};
