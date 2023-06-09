// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRaCoToUserGov {
  function isUserWhitelisted(address _owner) external view returns (bool);

  function getgeoJSON(address _owner) external view returns (string memory);
}
