module.exports = {
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'MaximeQuixiz',
                    name: 'negoview-launcher'
                },
                prerelease: false
            }
        }
    ]
};