"use strict";

// external modules
const path = require("path");
const webpack = require("webpack");

// variables
const node_dir = __dirname + "/node_modules";

// development, testing and diagnosis
const build_env = process.env.BUILD_ENV === "production" ? "production" : "development";
const build_diagnosis = !!process.env.BUILD_DIAGNOSIS;

const config = {
    watch: true,
    mode: build_env,
    plugins: [
    ],

    entry: {
        // externals and styles from the external libraries
       

        // application
        app: [
            "./frontend/styles/styles.scss"
        ],
    },

    output: {
        path: path.join(__dirname, "backend/dj_erfi6/erfi_manager/static"),
        publicPath: "/static/",
        filename: "[name].bundle.js",
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, "frontend"),
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {"loader": "css-loader", "options": {"minimize": true}}
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  'style-loader',
                  // Translates CSS into CommonJS
                  'css-loader',
                  // Compiles Sass to CSS
                  'sass-loader',
                ],
            },
           
        ],
    }
};

if (build_env === "production") {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                drop_debugger: true,
            }
        })
    );
} else if (build_env === "development") {
    // source map for troubleshooting
    config.devtool = "cheap-module-source-map";
}

// Bundle Analyzer
if (build_diagnosis) {
    config.plugins = config.plugins.concat([
        new BundleAnalyzerPlugin(),
        new BundleTracker({filename: "./webpack-stats.json"}),
    ]);
}

module.exports = config;