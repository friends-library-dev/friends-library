module.exports = {
  "presets": [
    "babel-preset-gatsby",
    "@babel/preset-flow",
  ],
  "plugins": [
    [
      "babel-plugin-ttag",
      {
        "resolve": {
          "translations": process.env.GATSBY_LANG === "es" ? "es.po" : "default",
        },
      },
    ],
  ],
}
