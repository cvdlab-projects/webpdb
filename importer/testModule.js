var importer = require("./importDb")

// (rootDir, isRecursive, dbType)
importer.runImport("../testdata/lg", false, "proteins");
