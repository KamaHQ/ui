const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const targetPath = path.join(__dirname, "dist");

module.exports = {
    devtool: "source-map",
    node: {
        __filename: true,
        __dirname: true
    },
    entry: path.join(__dirname, "src", "index.js"),
    output: {
        path: targetPath,
        filename: "[name]-[hash].js"
    },
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: path.join(__dirname, "node_modules")
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf$|\.eot|\.js\.map/,
                loader: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
            inject: "body"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    devServer: {
        port: 3000,
        inline: true,
        contentBase: targetPath,
        proxy: {
            '/': {
                target: process.env.PROXY_TARGET || "http://demo.kama.zone/",
                compress: false,
                secure: false,
                changeOrigin: true
            }
        }
    }
};
