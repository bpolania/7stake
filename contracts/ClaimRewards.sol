// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakingContract is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant STAKER_ROLE = keccak256("STAKER_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    mapping (address => uint256) public rewards;

    constructor(address admin) {
        _setupRole(ADMIN_ROLE, admin);
        _setRoleAdmin(STAKER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(VALIDATOR_ROLE, ADMIN_ROLE);
    }

    function depositReward(address staker, uint256 amount) external {
        require(hasRole(VALIDATOR_ROLE, msg.sender), "Caller is not a validator");
        rewards[staker] += amount;
    }

    function addRoleToAccount(bytes32 role, address account) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        grantRole(role, account);
    }

    function claimRewardAsStaker() external {
        require(hasRole(STAKER_ROLE, msg.sender), "Caller is not a staker");
        _claimReward(msg.sender);
    }

    function claimRewardAsValidator(address staker) external {
        require(hasRole(VALIDATOR_ROLE, msg.sender), "Caller is not a validator");
        _claimReward(staker);
    }

    function _claimReward(address staker) private ReentrancyGuard {
        require(rewards[staker] > 0, "No reward to claim");

        uint256 reward = rewards[staker];
        rewards[staker] = 0;

        uint256 adminPart = (reward * 25) / 100;
        uint256 stakerPart = reward - adminPart;

        (bool adminPay, ) = getRoleMember(ADMIN_ROLE, 0).call{value: adminPart}("");
        require(adminPay, "Admin payment failed");

        (bool stakerPay, ) = staker.call{value: stakerPart}("");
        require(stakerPay, "Staker payment failed");
    }
    receive() external payable {}
}
