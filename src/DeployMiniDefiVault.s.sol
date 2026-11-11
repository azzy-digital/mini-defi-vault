// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MiniDefiVault} from "../src/MiniDefiVault.sol";

contract DeployMiniDefiVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        new MiniDefiVault();

        vm.stopBroadcast();
    }
}