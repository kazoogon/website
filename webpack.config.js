const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [

    // JS Section /////////////////////////////////////////////////////////
    {
        mode: "development",
        entry: "./src/index.tsx",
        output: {
            path: `${__dirname}/dist`,
            filename: "index.js"
        },
        module: {
            rules: [
                {
                    // 拡張子.ts もしくは.tsx の場合
                    test: /\.tsx?$/,
                    // compile typescript
                    use: "ts-loader"
                },
                {
                    test: /\.svg$/,
                    loader: "react-svg-loader",
                    options: {
                        svgo: {
                            plugins: [
                                { removeTitle: false }
                            ],
                            floatPrecision: 2
                        }
                    }
                },
                {
                    test: /\.(vert|frag|glsl)$/,
                    use: {
                        loader: 'webpack-glsl-loader'
                    }
                }
            ]
        },
        // import 文で.tsや.tsxファイルを解決
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
    },

    // CSS Section ////////////////////////////////////////////////////////////
    {
        mode: "development",
        // resolve: {
        //     modules: [
        //         Path.resolve(__dirname, './src/sass'),
        //         Path.resolve(__dirname, './node_modules'),
        //     ],
        // },
        entry: {
            "index" : "./src/sass/index.scss",
        },
        output: {
            // path: path,
            // filename: '[name].css',
            path: `${__dirname}/dist`,
            filename: "index.css"
        },
        plugins: [
            new ExtractTextPlugin('[name].css'),
        ],
        module: {
            rules: [
                {
                    test: /\.scss$|\.css$/,
                    loader: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: { sourceMap: true }
                            },
                            {
                                loader: 'postcss-loader',
                                options: { sourceMap: true }
                            },
                            {
                                loader: 'sass-loader',
                                options: { sourceMap: true }
                            },
                        ]
                    })
                },
                {
                    test: /\.(jpg|jpeg|png|gif)$/,
                    loader: 'file-loader?name=images/[name].[ext]'
                }
            ]
        }
    },
];
