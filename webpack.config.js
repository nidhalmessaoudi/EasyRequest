const path = require("path");

const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

dotenv.config();

const webpackConfig = {
  mode: process.env.MODE,
  entry: "./src/index.ts",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    historyApiFallback: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      node_modules: path.join(__dirname, "node_modules"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Easy Request",
      publicPath: "/",
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
};

if (process.env.MODE === "development") {
  webpackConfig.devtool = "inline-source-map";
}

module.exports = webpackConfig;
