# remarkable-variables

Plugin for Remarkable md parser to extract variables from md files

## Install
npm i remarkable-variables --save

## Usage
```
const Remarkable = require('remarkable');
const RemarkableVariables = require('remarkable-variables');
const md = new Remarkable();
md.use(RemarkableVariables);
```

## Demo
```
const Remarkable = require('remarkable');
const RemarkableVariables = require('remarkable-variables');
const md = new Remarkable();
md.use(RemarkableVariables);

const text = `$ world = "world"
# Hello {{world}}`

md.render(text)

console.log(md.variables);

```

Result
```
[
  'world = "world"'
]
```