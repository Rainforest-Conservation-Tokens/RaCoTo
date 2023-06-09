const { assert, expect } = require("chai")
const { ethers } = require("hardhat")
const fs = require("fs")

describe("RAINFOREST CONSERVATION TOKEN USER GOVERNANCE TESTS", () => {
  const _proofURI = "STRING"
  const _owner = "0x3294ea3cD6247dEC04c2e23df60bB9c724058b51"
  const _geoJSON = "f3ceac63-34cb-e9d6-e436-f0c42cafff10"
  const file = fs.readFileSync("./ChainlinkFunctionSources/GlobalForestWatch/queryCO2NetFlux.js").toString()
  let RaCoToUser, clientContract, Token, Treasury

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    const oracleAddress = "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4"
    const jsSourceHash = "0x810974c17ef6a76d4ea2dd6fddf0fb941d286017d5a57671542452ada7aac6b9"
    const TokenContract = await ethers.getContractFactory("RCToken")
    Token = await TokenContract.deploy()

    const TreasuryContract = await ethers.getContractFactory("Treasury")
    Treasury = await TreasuryContract.deploy(Token.address)

    const RaCoToUserContract = await ethers.getContractFactory("RaCoToUserGov")
    RaCoToUser = await RaCoToUserContract.deploy()

    const clientContractFactory = await ethers.getContractFactory("RaCoTo")
    clientContract = await clientContractFactory.deploy(
      oracleAddress,
      Treasury.address,
      Token.address,
      RaCoToUser.address,
      jsSourceHash
    )
  })

  describe("register rainforest owner", () => {
    it("registering for the first time", async () => {
      await RaCoToUser.register(_proofURI)
      assert.equal((await RaCoToUser.s_waitingToBeWhitelisted(_owner)).toString(), _proofURI)
    })

    it("duplicate registration", async () => {
      await RaCoToUser.register(_proofURI)
      await expect(RaCoToUser.register(_proofURI)).to.be.revertedWithCustomError(
        RaCoToUser,
        "AlreadySentProofOfOwnership"
      )
    })
  })

  describe("whitelisting rainforest owner", () => {
    it("whitelisting", async () => {
      await RaCoToUser.register(_proofURI)
      await expect(RaCoToUser.whitelistRainforestOwner(_owner)).to.emit(RaCoToUser, "whitelistedOwner")
      assert.equal((await RaCoToUser.s_proofOfOwnership(_owner)).toString(), _proofURI)
      assert.equal((await RaCoToUser.s_waitingToBeWhitelisted(_owner)).toString(), "")
    })

    it("rejection", async () => {
      await RaCoToUser.register(_proofURI)
      await expect(RaCoToUser.rejectRainforestOwner(_owner)).to.emit(RaCoToUser, "rejectedOwner")
      assert.equal((await RaCoToUser.s_waitingToBeWhitelisted(_owner)).toString(), "")
    })
  })

  describe("contract flow of code", () => {
    it("execute request", async () => {
      await RaCoToUser.register(_proofURI)
      await expect(RaCoToUser.whitelistRainforestOwner(accounts[0].address, _geoJSON)).to.emit(
        RaCoToUser,
        "whitelistedOwner"
      )
      assert.equal((await RaCoToUser.isUserWhitelisted(accounts[0].address)).toString(), "true")
      assert.equal((await RaCoToUser.getgeoJSON(accounts[0].address)).toString(), _geoJSON)

      await Token.mint(clientContract.address, ethers.utils.parseUnits("1000000000", 18))
      console.log((await Token.balanceOf(clientContract.address)).toString())

      await clientContract.fulfillRequest2(
        "0xdc5759521ecfcfb9de9aa5a3a8f3d45d12f2047944784880386f11f50a1cd339",
        "0x0000000000000000000000000000000000000000000000000000000000029f6c",
        "0x"
      )
    })
  })
})
