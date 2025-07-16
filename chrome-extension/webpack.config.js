const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  entry: {
    "background/service-worker": "./src/background/service-worker.js",
    "content-scripts/main-content": "./src/content-scripts/main-content.js",
    "popup/popup": "./src/popup/popup.js",
    "options/options": "./src/options/options.js",
    "dashboard/dashboard": "./src/dashboard/dashboard.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "src/assets", to: "assets", noErrorOnMissing: true },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./src/popup/popup.html",
      filename: "popup/popup.html",
      chunks: ["popup/popup"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/options/options.html",
      filename: "options/options.html",
      chunks: ["options/options"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/dashboard/dashboard.html",
      filename: "dashboard/dashboard.html",
      chunks: ["dashboard/dashboard"],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  devtool: "cheap-module-source-map",
}
