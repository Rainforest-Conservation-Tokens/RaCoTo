const { ethers } = require("hardhat")

async function main() {
  const TokenContract = await ethers.getContractFactory("RCToken")
  const token = await TokenContract.deploy()

  console.log("Rainforest Conservation Token (RCT) is deployed successfully")
  console.log(token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
