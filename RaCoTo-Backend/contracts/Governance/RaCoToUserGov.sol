// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";

contract RaCoToUserGov is Ownable {
  struct proofOfOwnership {
    string geoJSON;
    string proofURI;
  }
  mapping(address => proofOfOwnership) public s_Ownerdetails;
  mapping(address => string) public s_waitingToBeWhitelisted;

  event whitelistedOwner(address _owner);
  event rejectedOwner(address _owner);

  error AlreadySentProofOfOwnership();

  function register(string memory _proofURI) public {
    bytes memory EmptyStringTest = bytes(s_waitingToBeWhitelisted[msg.sender]);
    if (EmptyStringTest.length != 0) {
      revert AlreadySentProofOfOwnership();
    }
    s_waitingToBeWhitelisted[msg.sender] = _proofURI;
  }

  function whitelistRainforestOwner(address _owner, string memory _geoJSON) public onlyOwner {
    s_Ownerdetails[_owner].proofURI = s_waitingToBeWhitelisted[_owner];
    s_Ownerdetails[_owner].geoJSON = _geoJSON;
    delete s_waitingToBeWhitelisted[_owner];
    emit whitelistedOwner(_owner);
  }

  function rejectRainforestOwner(address _owner) public onlyOwner {
    delete s_waitingToBeWhitelisted[_owner];
    emit rejectedOwner(_owner);
  }

  function isUserWhitelisted(address _owner) public view returns (bool) {
    bytes memory userRegitered = bytes(s_Ownerdetails[_owner].proofURI);
    if (userRegitered.length != 0) {
      return true;
    } else {
      return false;
    }
  }

  function getgeoJSON(address _owner) public view returns (string memory) {
    return s_Ownerdetails[_owner].geoJSON;
  }
}
