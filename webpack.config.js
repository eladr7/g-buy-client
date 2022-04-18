const { resolve } = require("path");

const context = resolve(__dirname, "src");

module.exports = {
  context,

  module: {
    rules: [
      { test: /\.s?css/, use: ["style-loader", "css-loader", "sass-loader"] },
      {
        test: /\.tsx?/,
        loader: "babel-loader",
        options: {
          presets: ["minimal"],
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
          ],
        },
        include: context,
      },
    ],
  },
};
