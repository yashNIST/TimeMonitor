from fabric.api import local

def webpack():
    local('rm -rf Dashboard/static/bundles/stage/*')
    local('rm -rf Dashboard/static/bundles/prod/*')
    local('webpack --config webpack.stage.config.js --progress --colors')
    local('webpack --config webpack.prod.config.js --progress --colors')