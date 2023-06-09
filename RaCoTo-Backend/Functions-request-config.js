const fs = require("fs")

// Loads environment variables from .env file (if it exists)
require("dotenv").config()

const Location = {
  Inline: 0,
  Remote: 1,
}

const CodeLanguage = {
  JavaScript: 0,
}

const ReturnType = {
  uint: "uint256",
  uint256: "uint256",
  int: "int256",
  int256: "int256",
  string: "string",
  bytes: "Buffer",
  Buffer: "Buffer",
}

const requestConfig = {
  codeLocation: Location.Inline,
  codeLanguage: CodeLanguage.JavaScript,
  // String containing the source code to be executed
  // for CO2 net flux query, use:
  source: fs.readFileSync("./ChainlinkFunctionSources/GlobalForestWatch/queryCO2NetFlux.js").toString(),
  // Secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
  secrets: { gfwAuthHeader: process.env.gfwAuthHeader ?? "" },
  perNodeSecrets: [],
  walletPrivateKey: process.env["PRIVATE_KEY"],
  // Args (string only array) can be accessed within the source code with `args[index]` (ie: args[0]).
  // for example, use those
  // for the CO2 net Flux Query:
  args: ["0", "1680300000.0"],
  expectedReturnType: ReturnType.uint256,
  secretsURLs: [],
}

module.exports = requestConfig
