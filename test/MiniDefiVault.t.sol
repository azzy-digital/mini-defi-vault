// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MiniDefiVault} from "../src/MiniDefiVault.sol";

contract MiniDefiVaultTest is Test {
    MiniDefiVault vault;
    address alice = makeAddr("alice");

    function setUp() public {
        vault = new MiniDefiVault();
        vm.deal(alice, 10 ether);
    }

    function testDeposit() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();

        assertEq(vault.balances(alice), 1 ether);
        assertEq(vault.totalDeposits(), 1 ether);
    }

    function testWithdraw() public {
        vm.startPrank(alice);

        vault.deposit{value: 2 ether}();
        vault.withdraw(1 ether);

        vm.stopPrank();

        assertEq(vault.balances(alice), 1 ether);
        assertEq(address(vault).balance, 1 ether);
    }

    function testCannotDepositZero() public {
        vm.startPrank(alice);
        vm.expectRevert(bytes("Deposit must be greater than zero"));
        vault.deposit{value: 0}();
        vm.stopPrank();
    }

    function testCannotWithdrawMoreThanBalance() public {
        vm.startPrank(alice);
        vm.expectRevert(bytes("Insufficient balance"));
        vault.withdraw(1 ether);
        vm.stopPrank();
    }
}