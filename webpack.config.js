var path = require("path");
module.exports = {
    entry: {
        app: ["./app/main.js"]
    },
    output: {
        path: "./dist",
        publicPath: "public/",
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        // configuration regarding modules
        rules: [
            {
                enforce: "pre",
                use: [{loader: 'eslint-loader', options: {
                    fix: true,
                }}],
                test: /\.js$/,
                exclude: /node_modules/,
            },
            {
                loader: "raw-loader",
                test: /\.html$/,
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|png|cur)$/,
                use: [ 'file-loader' ]
            }
        ]
    },
};
