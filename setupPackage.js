import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'

const __dirname = path.resolve()

// 소스 폴더 : lib
// 배포 폴더: dist

function main() {
  const packageJson = fs.readFileSync(__dirname + '/package.json').toString('utf-8')
  const parsedPackageJson = JSON.parse(packageJson)

  // dist 폴더 삭제
  fs.rmSync('dist', { recursive: true, force: true })
  
  // lib 폴더를 dist 로 복사
  fse.copy('lib', 'dist', e =>{
    if(e) return console.error(e);
    
    parsedPackageJson.scripts = {}
    parsedPackageJson.devDependencies = {}
  
    if(parsedPackageJson.main && parsedPackageJson.main.startsWith('dist/')) {
      parsedPackageJson.main = parsedPackageJson.main.slice(4)
    }
    // dependency 설정
    // parsedPackageJson.dependencies = {}
  
    // peer dependency 설정
  
    // dist에 package.json, version.txt, .npmignore 생성
    fs.writeFileSync(__dirname + '/dist/package.json', Buffer.from(JSON.stringify(parsedPackageJson, null, 2), 'utf-8'))
    fs.writeFileSync(__dirname + '/dist/version.txt', Buffer.from(parsedPackageJson.version, 'utf-8'))
  
    fs.copyFileSync(__dirname + '/.npmignore', __dirname + '/dist/.npmignore')
  });

}

main()