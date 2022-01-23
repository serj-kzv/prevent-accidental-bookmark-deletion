module.exports = (env, argv) => {
    return [
        {
            entry: './src/content.js',
            output: {
                path: distDir,
                filename: 'content.js'
            },
            plugins: [new CleanWebpackPlugin()].concat(plugins),
            ...cfg
        }
    ];
};