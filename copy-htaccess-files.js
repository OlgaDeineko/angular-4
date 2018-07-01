let fs = require('fs-extra');

fs.stat('dist/index.html', (err, stat) => {
  if (err === null) {
    fs.createReadStream('.htaccess-root').pipe(fs.createWriteStream('dist/.htaccess'));
  }
});

fs.stat('dist/login-app/index.html', (err, stat) => {
  if (err === null) {
    fs.createReadStream('.htaccess-apps').pipe(fs.createWriteStream('dist/login-app/.htaccess'));
  }
});

fs.stat('dist/register-app/index.html', (err, stat) => {
  if (err === null) {
    fs.createReadStream('.htaccess-apps').pipe(fs.createWriteStream('dist/register-app/.htaccess'));
  }
});
