const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackObfuscator = require('webpack-obfuscator');
const obfuscatorConfig = require('./obfuscator.config');

const config = (env, options) => {
  const isProduction = options.mode == "production";

  // config rules typescript
  const rulesTypescript = {
    test: /\.(ts|tsx)$/,
    exclude: [/node_modules/, /dist/],
    use: [
      "babel-loader"
    ]
  }

  if (isProduction) {
    rulesTypescript.use = [
      {
        loader: WebpackObfuscator.loader,
        options: {
            rotateStringArray: true
        }
      },
      ...rulesTypescript.use
    ]
  }


  // config plugins
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]

  if (isProduction) {
    plugins.push(new WebpackObfuscator(obfuscatorConfig));
  }

  return {
    entry: {
      inject: "./src/index.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@": path.resolve("src"),
        "@@": path.resolve()
      }
    },
    module: {
      rules: [
        rulesTypescript,
        {
          test: /\.(scss|sass|css)$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  localIdentName: "[local]___[hash:base64:5]"
                }
              }
            },
            "sass-loader"
          ]
        },
        {
          test: /\.(jpg|png|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "./assets/images"
              }
            }
          ]
        },
        {
          test: /\.(ttf|woff|jfproj)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "./assets/fonts"
              }
            }
          ]
        }
      ]
    },
    plugins,
    devServer: {
      hot: true,
      port: 3000
    }
  }
}

module.exports = config
