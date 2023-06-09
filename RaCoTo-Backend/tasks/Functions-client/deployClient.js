const { types } = require("hardhat/config")
const { networks } = require("../../networks")

task("functions-deploy-client", "Deploys the FunctionsConsumer contract")
  .addOptionalParam("verify", "Set to true to verify client contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    if (network.name === "hardhat") {
      throw Error(
        'This command cannot be used on a local hardhat chain.  Specify a valid network or simulate an FunctionsConsumer request locally with "npx hardhat functions-simulate".'
      )
    }

    console.log(`Deploying FunctionsConsumer contract to ${network.name}`)

    const oracleAddress = networks[network.name]["functionsOracleProxy"]

    console.log("\n__Compiling Contracts__")
    await run("compile")

    const jsSourceHash = "0x810974c17ef6a76d4ea2dd6fddf0fb941d286017d5a57671542452ada7aac6b9"
    const TokenContract = await ethers.getContractFactory("RCToken")
    const Token = await TokenContract.deploy()

    const TreasuryContract = await ethers.getContractFactory("Treasury")
    const Treasury = await TreasuryContract.deploy(Token.address)

    const RaCoToUserContract = await ethers.getContractFactory("RaCoToUserGov")
    const RaCoToUser = await RaCoToUserContract.deploy()

    const clientContractFactory = await ethers.getContractFactory("RaCoTo")
    const clientContract = await clientContractFactory.deploy(
      oracleAddress,
      Treasury.address,
      Token.address,
      RaCoToUser.address,
      jsSourceHash
    )

    console.log(
      `\nWaiting ${networks[network.name].confirmations} blocks for transaction ${
        clientContract.deployTransaction.hash
      } to be confirmed...`
    )
    await clientContract.deployTransaction.wait(networks[network.name].confirmations)

    const verifyContract = taskArgs.verify

    if (verifyContract && !!networks[network.name].verifyApiKey && networks[network.name].verifyApiKey !== "UNSET") {
      try {
        console.log("\nVerifying contract...")
        await clientContract.deployTransaction.wait(Math.max(6 - networks[network.name].confirmations, 0))
        await run("verify:verify", {
          address: clientContract.address,
          constructorArguments: [oracleAddress, Treasury.address, Token.address, RaCoToUser.address, jsSourceHash],
        })
        console.log("Contract verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log("Error verifying contract.  Delete the build folder and try again.")
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract) {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      )
    }

    console.log(`\nFunctionsConsumer contract deployed to ${clientContract.address} on ${network.name}`)
  })
