const fs = require("fs");
const path = require("path");

// https://stackoverflow.com/a/22185855/4651874
function copyRecursiveSync(src, dest) {
  let exists = fs.existsSync(src);
  let stats = exists && fs.statSync(src);
  let isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    console.log(`Making directory ${dest}`);
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function (childItemName) {
      console.log(`Copying ${childItemName}`);
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    console.log(`Copying ${src} to ${dest}`);
    fs.copyFileSync(src, dest);
  }
}

// Squirrel won't package up unexpected files unless they are in the "resources" folder
// See https://github.com/electron-userland/electron-forge/issues/135#issuecomment-991376807
module.exports = function (extractPath, electronVersion, platform, arch, done) {
  // https://github.com/serialport/node-serialport/issues/2464#issuecomment-1122454950
  copyRecursiveSync(
    path.join("node_modules", "serialport"),
    path.join(extractPath, "resources", "app", "node_modules", "serialport")
  );
  copyRecursiveSync(
    path.join("node_modules", "@serialport"),
    path.join(extractPath, "resources", "app", "node_modules", "@serialport")
  );
  copyRecursiveSync(
    path.join("node_modules", "debug"),
    path.join(extractPath, "resources", "app", "node_modules", "debug")
  );
  copyRecursiveSync(
    path.join("node_modules", "ms"),
    path.join(extractPath, "resources", "app", "node_modules", "ms")
  );
  copyRecursiveSync(
    path.join("node_modules", "node-gyp-build"),
    path.join(extractPath, "resources", "app", "node_modules", "node-gyp-build")
  );

  console.log("Done copying files");
  done();
};
