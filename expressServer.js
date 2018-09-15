const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const router = express.Router();

app.use(express.static(`${__dirname}/dist`));

app.engine('.html', require('ejs').renderFile);

app.set('views', `${__dirname}/dist`);

app.locals.test = 345;


router.get('/*', (req, res, next) => {
  // pass vars to ejs (index.html)
  res.locals.test = 123;
  res.render(`${__dirname}/dist/index.html`);
});

app.use('/', router);

app.listen(port);

console.log('ENV:', process.env.env);
console.log('APIROOT', process.env.apiroot);

console.log('Express serving on port', port);
