"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inquirer = require("inquirer");
var path = require("path");
var isValid = require("is-valid-path");
var mkdir = require("mkdirp-promise");
var logSymbols = require("log-symbols");

var successIcon = logSymbols.success,
    errorIcon = logSymbols.error;


var fileOperations = require("./file-operations");
var pkg = fileOperations.pkg,
    getFileNames = fileOperations.getFileNames,
    readAndWriteFiles = fileOperations.readAndWriteFiles;


var rnVersion = pkg.dependencies["react-native"];

var templateNameRegex = /\w+/;
var promptConfig = [{
  type: "input",
  name: "templateName",
  message: "What is your bridge module called?",
  default: "ExampleBridge",
  validate: function validate(input) {
    return templateNameRegex.test(input);
  }
}, {
  type: "checkbox",
  name: "bridgeType",
  message: "What type of bridge would you like to create?",
  default: ["Native Module", "Native UI Component"],
  choices: ["Native Module", "Native UI Component"]
}, {
  type: "checkbox",
  name: "environment",
  message: "What OS & languages would you like to support?",
  default: ["Android/Java", "iOS/Objective-C"],
  choices: ["Android/Java", "Android/Kotlin", "iOS/Swift", "iOS/Objective-C"]
}, {
  type: "input",
  name: "jsPath",
  message: "What directory should we deliver your JS files to?",
  default: ".",
  validate: function validate(input) {
    return isValid(input);
  }
}];

var environmentMap = {
  "Android/Java": createJavaEnvironment,
  "Android/Kotlin": createKotlinEnvironment,
  "iOS/Swift": createSwiftEnvironment,
  "iOS/Objective-C": createObjCEnvironment
};

function init() {
  inquirer.prompt(promptConfig).then(function (result) {
    var environment = result.environment,
        bridgeType = result.bridgeType,
        templateName = result.templateName,
        jsPath = result.jsPath;


    var templateFolder = bridgeType.length > 1 ? "combined" : bridgeType[0] === "Native Module" ? "modules" : "ui-components";

    var promises = environment.map(function (env) {
      return environmentMap[env](templateName, templateFolder);
    });

    promises.push(createJSEnvironment(templateName, templateFolder, jsPath));

    _promise2.default.all(promises).then(function () {
      console.log(`${successIcon} Your bridge module was successfully created! 🎉`);
    });
  }).catch(function (e) {
    console.log(`${errorIcon} Oh no! 💩  Something went wrong with creating your bridge module.\nPlease report any errors here: https://github.com/peggyrayzis/react-native-create-bridge/issues\n\nError: ${e}`);
  });
}

function createJavaEnvironment(templateName, templateFolder) {
  var appPath = path.join(process.cwd(), "android", "app", "src", "main", "java", "com", pkg.name);

  var readDirPath = path.join(__dirname, "..", "templates", templateFolder, "android-java");

  return mkdir(path.join(appPath, templateName.toLowerCase())).then(function (writeDirPath) {
    var paths = {
      readDirPath,
      writeDirPath: writeDirPath ? writeDirPath : path.join(appPath, templateName.toLowerCase())
    };

    getFileNames(readDirPath).then(function (files) {
      return readAndWriteFiles(files, paths, {
        templateName,
        packageName: templateName.toLowerCase(),
        app: pkg.name.toLowerCase(),
        rnVersion
      });
    });
  });
}

function createKotlinEnvironment(templateName, templateFolder) {
  var appPath = path.join(process.cwd(), "android", "app", "src", "main", "java", "com", pkg.name);

  var readDirPath = path.join(__dirname, "..", "templates", templateFolder, "android-kotlin");

  return mkdir(path.join(appPath, templateName.toLowerCase())).then(function (writeDirPath) {
    var paths = {
      readDirPath,
      writeDirPath: writeDirPath ? writeDirPath : path.join(appPath, templateName.toLowerCase())
    };

    return getFileNames(readDirPath).then(function (files) {
      return readAndWriteFiles(files, paths, {
        templateName,
        packageName: templateName.toLowerCase(),
        app: pkg.name.toLowerCase(),
        rnVersion
      });
    });
  });
}

function createSwiftEnvironment(templateName, templateFolder) {
  var readDirPath = path.join(__dirname, "..", "templates", templateFolder, "ios-swift");

  var paths = {
    readDirPath,
    writeDirPath: path.join(process.cwd(), "ios")
  };

  return getFileNames(readDirPath).then(function (files) {
    return readAndWriteFiles(files, paths, { templateName });
  });
}

function createObjCEnvironment(templateName, templateFolder) {
  var readDirPath = path.join(__dirname, "..", "templates", templateFolder, "ios-objc");

  var paths = {
    readDirPath,
    writeDirPath: path.join(process.cwd(), "ios")
  };

  return getFileNames(readDirPath).then(function (files) {
    return readAndWriteFiles(files, paths, { templateName });
  });
}

function createJSEnvironment(templateName, templateFolder, jsPath) {
  var readDirPath = path.join(__dirname, "..", "templates", templateFolder, "js");

  return mkdir(jsPath).then(function () {
    var paths = {
      readDirPath,
      writeDirPath: jsPath
    };

    return getFileNames(readDirPath).then(function (files) {
      return readAndWriteFiles(files, paths, { templateName });
    });
  });
}

module.exports = {
  name: "new-module",
  description: "bridges React Native modules & UI components",
  func: init
};