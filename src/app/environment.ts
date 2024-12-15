const { writeFile } = require('fs');
const { argv } = require('yargs');
require('dotenv').config();

const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = `./src/environments/environment.${
  isProduction ? 'prod' : 'ts'
}.ts`;
const envConfigFile = `export const environment = {
  production: ${isProduction},
  firebaseApiKey: '${process.env.FIREBASE_API}'
};
`;

writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Output generated at ${targetPath}`);
  }
});
