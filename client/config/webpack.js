const zeppelinSolidityHotLoaderOptions = {
  network: 'development',
  // you can stop loader from automatic compile/push/updgrade
  // action by setting disabled flag to true, but it will still
  // serve .json files from file system
  disabled: true,
}

module.exports = {
  zeppelinSolidityHotLoader: {
      test: /\.sol$/,
      use: [ 
        { loader: 'json-loader' },
        {
          loader: 'zeppelin-solidity-hot-loader',
          options: zeppelinSolidityHotLoaderOptions,
        },
      ],
    },
  zeppelinSolidityHotLoaderOptions,
};
