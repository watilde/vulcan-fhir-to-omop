const fs = require('fs')
const path = require('path')
const parser = require('convert-csv2json')
const TARGET_DIR = path.join(__dirname, '../src/mapping')

const convert = (item) => {
  const lines = parser.csv2json(item, ',')
  const out = {};
  for (let i = 0; lines.length > i; i++) {
    for (const key in lines[i]) {
      if (lines[i][key] === '') continue;
      if (out[key] ) {
        if (typeof out[key] === 'string') out[key] = [out[key]];
        out[key].push(lines[i][key])
      } else {
        out[key] = lines[i][key];
      }
    }
  }
  return JSON.stringify(out, null, 2)
}

const list = fs.readdirSync(TARGET_DIR).filter(item => item.endsWith('.csv'))
list.forEach((item) => {
  const file = fs.readFileSync(path.join(TARGET_DIR, item), 'utf8')
  const out = convert(file)
  fs.writeFileSync(path.join(TARGET_DIR, item.replace('csv', 'json')), out)
})