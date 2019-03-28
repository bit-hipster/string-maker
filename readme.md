# StringMaker
The String Builder Library for Node JS and Javascript

# Usage
```
//index.js file is what is brought in by npm
//strmaker.js is what you should include in your web project

const { StringBuilder } = require('./index.js')

let sb = new StringBuilder('last')
        .append('thing')
        .append('to')
        .append('write')
        .prepend('The')
        .hold('START ***','*** END')
        .append('1')
for(var i = 2; i <= 30; i++ ){
  sb.append('.item')
    .append(i)
}

sb.append('.item')
  .release('prepend');

console.log(sb.toString(' '));

```
