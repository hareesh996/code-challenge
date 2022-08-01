const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { ...nxPreset,
    presets: [
        '@babel/preset-typescript',
      ]
};
