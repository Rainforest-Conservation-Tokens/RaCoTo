const { ethers } = require("hardhat")

async function main() {
  const oracleAddress = "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4"
  const jsSourceHash = "0x810974c17ef6a76d4ea2dd6fddf0fb941d286017d5a57671542452ada7aac6b9"
  const TokenContract = await ethers.getContractFactory("RCToken")
  const Token = await TokenContract.deploy()

  const TreasuryContract = await ethers.getContractFactory("Treasury")
  const Treasury = await TreasuryContract.deploy(Token.address)

  const RaCoToUserContract = await ethers.getContractFactory("RaCoToUserGov")
  const RaCoToUser = await RaCoToUserContract.deploy()

  const RaCoToContract = await ethers.getContractFactory("RaCoTo")
  const RaCoTo = await RaCoToContract.deploy(
    oracleAddress,
    Treasury.address,
    Token.address,
    RaCoToUser.address,
    jsSourceHash
  )

  console.log("\nRainforest Conservation Contract is deployed successfully\n")
  console.log(RaCoTo.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
