my website "Kaziu" 😎
====

It's my website.  
I'm Kazu, but Polish people call me "Kaziu".    
Kaziu is kawaii version of polish name "Kazimierz(カジミエジュ)"

## Languages 🈶
html, sass  
react.js 16.11.0    
typescript 3.7.2    
three.js 0.110.0    
webpack 4.41.2

## Infrastructure 🏢
AWS

## Usage 🔑
### compile js and css
development
```
$ npm run watch (or npm run build)
```

production
```
$ npm run build:production
```

(note for me)   
EC2::t3.nanoではメモリが少なすぎて、npm run build:productionすると下記エラー
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```
t3.microに変更して対処
### the case of local
```
$ cd ./dist
$ live-server .
```

## Author 👨‍🎓

[sasaki kazutaka (kaziu)](https://github.com/kazoogon)