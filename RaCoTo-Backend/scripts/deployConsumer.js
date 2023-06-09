const { ethers } = require("hardhat")

async function main() {
  const oracleAddress = ""

  const [deployer] = await ethers.getSigner()
  const ConsumerContract = await ethers.getContractFactory("FunctionsConsumer")
  const consumerContractDeployed = await ConsumerContract.deploy(oracleAddress)

  console.log("Chainlink Function Consumer is deployed")
  console.log(consumerContractDeployed)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
