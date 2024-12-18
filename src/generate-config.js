const fs = require("fs");
const path = require("path");

const dir = "src/configuration";
const file = "config.ts";
const token = `export const firebaseToken: String = '${process.env.FIREBASE_API_KEY}'`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    console.log("src doesn't exist, creating now", process.cwd());
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.log(`Error while creating ${dir}. Error is ${error}`);
      process.exit(1);
    }
  }
  try {
    fs.writeFileSync(dir + "/" + file, token);
    console.log("Created successfully in", process.cwd());
    if (fs.existsSync(dir + "/" + file)) {
      console.log("File is created", path.resolve(dir + "/" + file));
      const str = fs.readFileSync(dir + "/" + file).toString();
      console.log(str);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
