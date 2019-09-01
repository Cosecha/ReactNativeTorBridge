"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require("path");
var fs = require("mz/fs");
var compareVersions = require("compare-versions");

var pkg = require(path.join(process.cwd(), "package.json"));

function getFileNames(dirPath) {
  return fs.readdir(dirPath).catch(function (e) {
    return console.error("[getFileNames] ", e);
  });
}

function readFile(file, readDirPath) {
  return fs.readFile(path.join(readDirPath, file), "utf-8").catch(function (e) {
    return console.error("[readFile] ", e);
  });
}

function parseFile(fileData, _ref) {
  var templateName = _ref.templateName,
      packageName = _ref.packageName,
      app = _ref.app,
      rnVersion = _ref.rnVersion;

  var kotlinPackage = void 0;
  var javaPackage = void 0;

  // TODO: figure out a better way to handle one off breaking changes
  if (rnVersion && compareVersions(rnVersion, "0.47.2") < 0) {
    kotlinPackage = `
    override fun createJSModules(): List<Class<out JavaScriptModule>> {
        return emptyList()
    }

    `;

    javaPackage = `
    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    `;
  } else {
    kotlinPackage = "";
    javaPackage = "";
  }

  return fileData.replace(/{{template}}/g, templateName).replace(/{{packageName}}/g, packageName).replace(/{{app}}/g, app).replace(/{{kotlinPackage}}/g, kotlinPackage).replace(/{{javaPackage}}/g, javaPackage);
}

function readAndWriteFiles(files, paths, config) {
  var readDirPath = paths.readDirPath,
      writeDirPath = paths.writeDirPath;

  return _promise2.default.all(files.map(function (file) {
    readFile(file, readDirPath).then(function (fileData) {
      var parsedFile = parseFile(fileData, config);
      var fileName = file.replace("Template", config.templateName);
      return fs.writeFile(path.join(writeDirPath, fileName), parsedFile);
    });
  })).catch(function (e) {
    return console.error("[readAndWriteFiles] ", e);
  });
}

module.exports = {
  pkg,
  getFileNames,
  readFile,
  parseFile,
  readAndWriteFiles
};