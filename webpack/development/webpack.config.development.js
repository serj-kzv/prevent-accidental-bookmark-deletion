const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const terserConfig = require('./terser.config.development.js');
const distDir = path.resolve(__dirname, '../../', 'dist');
const srcDir = path.resolve(__dirname, '../../', 'src');
const cfg = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [srcDir, 'node_modules'],
        fallback: {
            fs: 'empty'
        }
    },
    target: 'web',
    watchOptions: {
        ignored: ['node_modules'],
        poll: 500
    },
    optimization: {
        minimizer: [new TerserPlugin(terserConfig)]
    }
};

module.exports = (env, argv) => {
    return [
        {
            entry: `${srcDir}/Main.ts`,
            output: {
                path: distDir,
                filename: 'Main.js',
                clean: true
            },
            devtool: 'source-map',
            plugins: [
                new CopyPlugin({
                    patterns: [
                        {
                            from: `${srcDir}/assets`,
                            to: `${distDir}/assets`,
                            noErrorOnMissing: true
                        },
                        {
                            from: `${srcDir}/manifest.json`,
                            to: `${distDir}/manifest.json`
                        },
                        {
                            from: `${srcDir}/background.html`,
                            to: `${distDir}/background.html`
                        },
                    ],
                })
            ],
            ...cfg
        }
    ];
};