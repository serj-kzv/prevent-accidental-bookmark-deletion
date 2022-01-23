const development = require('./development/webpack.config.development.js');
const production = require('./production/webpack.config.production.js');
const modes = {
    development,
    production
};

module.exports = (env, argv) => {
    console.log('Webpack configuration:', modes[argv.mode](env, argv))
    return modes[argv.mode](env, argv);
};