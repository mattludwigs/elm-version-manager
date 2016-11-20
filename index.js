#!/usr/bin/env node

"use strict";

var Promise = require("promise");
var zlib = require("zlib");
var tar = require("tar");
var request = require("request");
var fs = require("fs-extra");
var os = require("os");
var program = require("commander");
var chalk = require("chalk");

var URL_BASE = "https://dl.bintray.com/elmlang/elm-platform/";
var EVM_DIR = os.homedir() + "/evm";

var packageJson = require("./package.json");
var arch = process.arch;
var operatingSystem = process.platform;
var filename = operatingSystem + "-" + arch + ".tar.gz";
var elmBins = [
  "make",
  "repl",
  "package",
  "reactor"
]
var versionPattern = /([0-9]\D.[0-9].?([0-9]?))|(master)/g

if (process.platform === 'win32') {
    var usrBin = os.homedir() + "/Appdata/Local/Elm Version Manager";
} else {
    var usrBin = "/usr/local/bin";
}


var hasEvmDir = function() {
  return new Promise(function(resolve, reject) {
    fs.readdir(homeDir, function(error, paths) {
      var hasDir = paths.some(function(p) {
        return p === "evm";
      });

      if (hasDir) {
        reject("Has evm dir");
      } else {
        resolve();
      }
    });
  });
}

var createEvmDir = function() {
  console.log("INFO creating evm folder");

  return new Promise(function(resolve, reject) {
    var homeDir = os.homedir();
    fs.mkdir(EVM_DIR, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}


var isVersionInstall = function(version) {
  return fs.readdirSync(EVM_DIR)
    .some(function(file) {
      return file === version;
    });
}


var listEvmDir = function() {
  fs.readdir(EVM_DIR, function(err, files) {
    if (files === undefined || files.length === 0) {
      console.log(chalk.yellow("😱  Oh no! It looks like you don't have any versions of Elm installed. try running:\n\nevm install 0.18.0\n\nThis will install the newest version of Elm for you. Then just run:\n\nevm use 0.18.0\n\nThen you are ready to get rolling! 🚀"));
      return;
    }
    files.forEach(function(f) {
      console.log(chalk.yellow("- " + f));
    });
  });
}


var use = function(version) {
  if (isVersionInstall(version)) {
    console.log(chalk.yellow("Using: " + version + "\n"));

    elmBins.forEach(function(bin) {
      fs.unlink(usrBin + '/elm-' + bin, function(err) {
        if (err && err.code !== "ENOENT") {
          console.log(chalk.red(err.message));
          return;
        }

        if (process.platform === 'win32') {
          fs.copySync(EVM_DIR + "/" + version + "/" + "elm-" + bin + '.exe', usrBin + "/elm-" + bin + '.exe');
        } else {
          fs.symlinkSync(EVM_DIR + "/" + version + "/" + "elm-" + bin, usrBin + '/elm-' + bin);
        }
        
        console.log(chalk.green("🚀 " + " elm-" + bin + " good to go!"));
      });
    });
  } else {
    console.log(chalk.red(version + " appears to not be installed, to install please run:\n\n" + "evm install " + version + "\n"));
  }
}


var install = function(version) {
  var url = URL_BASE + version + "/" + filename;
  var desPath = EVM_DIR + "/" + version;

  console.log(chalk.yellow("Downloading Elm binaries from " + url));

  request.get(url, function(err, response) {
    if (err) {
      console.log(chalk.red("Error communitcating with URL: " + url + " " + error));
    }

    if (response.statusCode == 404) {
      console.log(chalk.red("Unfortunately, there are currently no Elm Platform binaries available for your operating system and architecture.\n\nIf you would like to build Elm from source, there are instructions at https://github.com/elm-lang/elm-platform#build-from-source\n"));
      return;
    }
  })
    .pipe(zlib.createGunzip())
    .pipe(tar.Extract({path: desPath, strip: 1})
      .on("end", function() {
        console.log(chalk.yellow("\nDownloaded " + version + " 🍻\n"));

        elmBins.forEach(function(exec) {
          fs.stat(desPath + "/" + "elm-" + exec, function(err, stat) {
            if (err) {
              console.log(chalk.red("Error " + err.message));
              return;
            } else if (!stat.isFile()) {
              console.log(chalk.red("Error file: " + "elm-" + exec + "is not a file"));
              return;
            } else {
              console.log(chalk.green("☁️ 🚀 ☁️  installed elm-" + exec + " for version: " + version));
            }
          });
        });
      })
    );
}


var remove = function(version) {
  console.log(chalk.yellow("Removing Elm version: " + version + "\n"));
  fs.remove(EVM_DIR + "/" + version, function(err) {
    if (err) {
      console.log(chalk.red(err.message));
      return;
    }
    console.log(chalk.yellow("Ok " + version + " is removed"));
  });
}


var removeAll = function() {
  console.log(chalk.yellow("Removing all Elm versions\n"));
  try {
    var versions = fs.readdirSync(EVM_DIR);
    versions.forEach(remove);
  } finally {
    console.log(chalk.yellow("Ok"));
  }
}


var listRemote = function() {
  console.log(chalk.yellow("Getting information from server ⛵\n"));
  request.get(URL_BASE, function(err, response) {
    if (err) {
      console.log(chalk.red("Error communitcating with URL: " + url + " " + error));
    };

    if (response.statusCode == 404) {
      console.log(chalk.red("Unfortunately, there the package binaries cannot be found"));
      return;
    }

    response.body.split(" ")
      .filter(function(s) {
        return s.indexOf("href=") > -1;
      })
      .forEach(function(version) {
        var v = version.match(versionPattern)[0].replace("/", "");
        console.log(chalk.yellow("- " + v));
      });
  });
}

program
  .version(packageJson.version)
  .command("install <version>")
  .description("installs version")
  .alias("i")
  .action(function(version) {
    hasEvmDir()
      .then(function() {
        createEvmDir()
          .then(function() {
            install(version);
          })
      }, function(err) {
        install(version);
      });
  });

program
  .command("list")
  .alias("ls")
  .description("lists out versions installed")
  .action(listEvmDir);


program
  .command("remove <version>")
  .description("removes a version that is installed")
  .alias("rm")
  .action(remove);


program
  .command("use <version>")
  .description("Sets up system to use a certain version of elm")
  .action(use);

program
  .command("list-remote")
  .alias("lsrm")
  .description("Lists the possible versions to download from")
  .action(listRemote);


program
  .command("remove-all")
  .alias("rma")
  .description("removes all of your Elm versions")
  .action(removeAll)


program.parse(process.argv);
