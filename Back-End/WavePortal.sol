// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    // This will be used to generate a random number
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);
    /*
    * I Created a struct here named Wave.
    * A struct is basically a custom datatype where we can customize what we want to hold inside it.
    */
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
    * I declare a variable waves that lets me store an array of structs.
    * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    /* This is an address => uint mapping, meaning I can associate an address
        a number! In this case, I'll be storing the address with the last time
        the user waved at us 
    */
    mapping(address => uint256) public lastWavedAt;

    /*
    * Now it requires a string called _message. This is the message our user
    * sends us from the frontend!
    */

    constructor() payable {
        console.log("We have been constructed!");

        // Set the initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // Make sure current timestamp is at least 15 min bigger than the last timestamp we stored
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 30 sec"
        );

        // Update current timestamp we have for the user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved w/ message %s", msg.sender, _message);
        /*
        * This is where I actually store the wave data in the array.
        */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        // Give a 1% chance that the user wins the prize
        if (seed <= 1) {
            console.log("%s won!", msg.sender);

            // Send Prize
        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
    * I added a function getAllWaves which will return the struct array, waves to us
    * This will make it easy to retrieve the waves from our website!
    */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}