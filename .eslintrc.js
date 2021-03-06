module.exports = {
    "env": {
        "mocha": true
    },
    "globals": {
        "expect": true,
        "sinon": true
    },
    "plugins": ['vue'],
    "extends": 'elemefe',
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        }
    }
}