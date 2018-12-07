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
          "translations": process.env.LANG === "es" ? "es.po" : "default",
        },
      },
    ],
  ],
}
