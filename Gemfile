source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(URI.open('https://pages.github.com/versions.json').read)

gem 'jekyll-redirect-from'
gem 'github-pages', versions['github-pages']
