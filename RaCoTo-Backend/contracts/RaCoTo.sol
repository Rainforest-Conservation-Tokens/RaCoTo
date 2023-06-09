// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// imports regarding chainlink functions
import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
import {IERC20} from "./Interface/IERC20.sol";
import {IRaCoToUserGov} from "./Interface/Governance/IRaCoToUserGov.sol";

/**
 * @title Main Rainforest Token Management Contract
 * @notice This contract is for event emitting and minitng tokens
 */

contract RaCoTo is FunctionsClient {
  using Functions for Functions.Request;

  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;
  bytes32 public jsSourceHash;

  uint256 public decimalVal = 18;
  address private treasuryAddress;
  address public raCoTokenAddress;
  address public raCoOwnerAddress;

  IERC20 public raCoTokenInstance;
  IRaCoToUserGov public userGovInstance;

  mapping(address => uint256) public tokensNeededToClaimByUser;
  mapping(address => uint256) public previousTokenClaimedByUser;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

  error NotEnoughEth();
  error InvalidJSFile();

  constructor(
    address oracle,
    address _treasuryAddress,
    address _raCoTokenAddress,
    address _userGovAddress,
    bytes32 _jsSourceHash
  ) FunctionsClient(oracle) {
    treasuryAddress = _treasuryAddress;
    raCoTokenAddress = _raCoTokenAddress;
    raCoTokenInstance = IERC20(_raCoTokenAddress);
    userGovInstance = IRaCoToUserGov(_userGovAddress);
    jsSourceHash = _jsSourceHash;
  }

  modifier onlyWhitelistedOwner(address _owner) {
    require(userGovInstance.isUserWhitelisted(_owner), "Method not allowed (only whitelisted)");
    _;
  }

  /**
   * @notice Send a simple request
   *
   * @param source JavaScript source code
   * @param secrets Encrypted secrets payload
   * @param args List of arguments accessible from within the source code
   * @param subscriptionId Funtions billing subscription ID
   * @param gasLimit Maximum amount of gas used to call the client contract's `handleOracleFulfillment` function
   * @return Functions request ID
   */

  function executeRequest(
    string calldata source,
    bytes calldata secrets,
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyWhitelistedOwner(msg.sender) returns (bytes32) {
    if (keccak256(abi.encodePacked(source)) != jsSourceHash) {
      revert InvalidJSFile();
    }
    raCoOwnerAddress = msg.sender;

    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);

    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }
    if (args.length > 0) req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    latestRequestId = assignedReqID;
    return assignedReqID;
  }

  /**
   * @notice This function will run as a callback for the request made to the DON (Decentralised Oracle Network)
   *
   * @param requestId - Request ID of the DON.
   * @param response - Request response
   * @param err - Request error

   * @notice function will either return response or error but never both 
   */

  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;

    if (response.length != 0) {
      uint256 numberOfTokensToMint = uint256(bytes32(response)) * 10 ** decimalVal;
      (uint256 numberOfTokenTreasury, uint256 numberOfTokenUser) = _getTokenSplit(numberOfTokensToMint);
      // managing the token requests
      previousTokenClaimedByUser[raCoOwnerAddress] = tokensNeededToClaimByUser[raCoOwnerAddress];
      tokensNeededToClaimByUser[raCoOwnerAddress] = numberOfTokenUser;
      // Transferring tokens to the treasury
      raCoTokenInstance.transfer(treasuryAddress, numberOfTokenTreasury);
      raCoOwnerAddress = address(0);
    }

    emit OCRResponse(requestId, response, err);
  }

  /**
   * @notice User function to claim the tokens
   */
  function claimToken() public onlyWhitelistedOwner(msg.sender) {
    uint256 token = (tokensNeededToClaimByUser[msg.sender]);
    require(token != 0, "No Tokens Claimable");

    raCoTokenInstance.transfer(msg.sender, token);
    delete tokensNeededToClaimByUser[msg.sender];
  }

  /**
   * @notice To calculate the total token split
   *
   * @param _totalTokenValue - This is the total tokens to be minted
   */
  function _getTokenSplit(uint256 _totalTokenValue) private pure returns (uint256, uint256) {
    uint256 numberOfTokenInTreasury = _totalTokenValue / 100;
    uint256 numberOfTokenToUser = (_totalTokenValue * 99) / 100;
    return (numberOfTokenInTreasury, numberOfTokenToUser);
  }

  /**
   * @notice Utility function to convert a uint256 to string
   *
   * @param value - uint256 value that will be converted to string
   */

  function uint256ToString(uint256 value) internal pure returns (string memory) {
    if (value == 0) {
      return "0";
    }

    uint256 temp = value;
    uint256 digits;

    while (temp != 0) {
      digits++;
      temp /= 10;
    }

    bytes memory buffer = new bytes(digits);
    uint256 index = digits - 1;

    while (value != 0) {
      buffer[index--] = bytes1(uint8(48 + (value % 10)));
      value /= 10;
    }

    return string(buffer);
  }
}
