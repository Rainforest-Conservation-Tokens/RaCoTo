// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "./Interface/IERC20.sol";

contract Treasury is Ownable {
  address public raCoTokenAddress;
  address private _owner;
  IERC20 public tokenInstance;

  constructor(address _raCoTokenAddress) {
    raCoTokenAddress = _raCoTokenAddress;
    tokenInstance = IERC20(_raCoTokenAddress);
    _owner = msg.sender;
  }

  function claimTreasuryTokens() public onlyOwner {
    uint256 balance = tokenInstance.balanceOf(address(this));
    tokenInstance.transfer(msg.sender, balance);
  }
}
