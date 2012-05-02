var importer = require("./import")

// (rootDir, isRecursive, username, password, dbname, hostname, port)
importer.runImport("../testdata/lg", false, "webpdb", "w3bpdb", "pdbimporttest", "127.0.0.1", 5984);