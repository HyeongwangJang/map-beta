import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()

function main() {
  const source = fs.readFileSync(__dirname + '/package.json').toString('utf-8')
  const sourceObj = JSON.parse(source)

  sourceObj.scripts = {}
  sourceObj.devDependencies = {}

  if(sourceObj.main && sourceObj.main.startsWith('lib/')) {
    sourceObj.main = sourceObj.main.slice(4)
  }
  // dependency 설정
  sourceObj.dependencies = {}

  // peer dependency 설정
  // sourceObj.peerDependencies = 

  fs.writeFileSync(__dirname + '/lib/package.json', Buffer.from(JSON.stringify(sourceObj, null, 2), 'utf-8'))
  fs.writeFileSync(__dirname + '/lib/version.txt', Buffer.from(sourceObj.version, 'utf-8'))

  fs.copyFileSync(__dirname + '/.npmignore', __dirname + '/lib/.npmignore')
}

main()