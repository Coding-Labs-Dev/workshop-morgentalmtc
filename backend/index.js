const path = require('path');
if (process.env.NODE_ENV === 'dev') {
  const YAML = require('yamljs');
  const config = YAML.load(path.join(__dirname, '.env.yml'));
  Object.assign(process.env, config.dev);
} else if (process.env.NODE_ENV === 'local') {
  const YAML = require('yamljs');
  const config = YAML.load(path.join(__dirname, '.env.yml'));
  Object.assign(process.env, config.local);
} else {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;

if (isInLambda) {
  const serverlessExpress = require('aws-serverless-express');
  const server = serverlessExpress.createServer(app);
  exports.main = (event, context) => serverlessExpress.proxy(server, event, context);
} else {
  app.listen(3333, () => console.log(`Listening on 3333`));
}
