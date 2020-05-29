const path = require('path');
const projectRoot = path.resolve('./')
console.log(path.relative(projectRoot,'./src/app.ts'))
module.exports = projectRoot;