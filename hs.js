var item = require('hotshell').item
var exec = require('hotshell').exec

item({desc: 'julienmoumne.github.io'}, function () {

    var linux = exec('uname').indexOf('Linux') > -1
    var browser = linux ? 'sensible-browser' : 'open'

    item({key: 's', cmd: 'bundle exec jekyll serve --trace'})
    item({key: 'u', desc: 'update GitHub Pages gem', cmd: 'bundle update'})
    item({key: 'o', desc: 'open', cmd: browser + ' http://127.0.0.1:4000/'})
})
