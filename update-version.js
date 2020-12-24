console.log('version updating...');

const fs = require('fs');
const { version } = require('os');
const path = require('path');

function updateByFile(filename) {
  if (!fs.existsSync(filename)) {
    console.log('update version failed!');
    return;
  }

  let content = fs.readFileSync(path.join(__dirname, filename)).toString('utf-8');
  fs.writeFileSync(filename + '.bak', content);
  const patternVersionApp = /VERSION_APP([\s]*)=(?<version>[0-9]+)[\r\n]+/gm;
  const patternVersionUi = /VERSION_UI([\s]*)=(?<version>[0-9]+)[\r\n]+/gm;
  const matchApp = patternVersionApp.exec(content);
  const matchUi = patternVersionUi.exec(content);


  if (matchApp.groups && matchUi.groups) {
    const versionApp = matchApp.groups.version;
    const versionUi = matchUi.groups.version;

    content = content.replace(versionApp, (f) => {
      return Number(versionApp) + 1;
    });
    content = content.replace(versionUi, (f) => {
      return Number(versionUi) + 1;
    });
  }

  fs.writeFileSync(filename, content);
}


updateByFile('./env/dev.env');
updateByFile('./env/prod.env');