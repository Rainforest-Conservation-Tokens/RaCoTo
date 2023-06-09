const { ethers } = require("hardhat")

async function main() {
  await run("verify:verify", {
    address: "0xf402df1324b6c143031594f9da668b4e0c6c035c",
    constructorArguments: [],
  })
  console.log("Contract verified")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
