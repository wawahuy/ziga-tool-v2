const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackObfuscator = require('webpack-obfuscator');
const HTMLWebpackPlugin = require('html-webpack-plugin');
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
  } else {
    plugins.push(new HTMLWebpackPlugin({ template: path.resolve(__dirname, 'public/dev.html') }))
  }

  return {
    entry: {
      inject: "./src/index.tsx"
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
                  localIdentName: "[local]"
                }
                // modules: {
                //   localIdentName: "[local]___[hash:base64:5]"
                // }
              }
            },
            "sass-loader"
          ]
        },
        {
          test: /\.(jpg|png|gif|svg|ttf|woff|jfproj)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "/"
              }
            }
          ]
        }
      ]
    },
    plugins,
    devServer: {
      hot: true,
      port: 3000,
      disableHostCheck : true
    }
  }
}

module.exports = config
