// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProofOfCredit {
    struct Borrower {
        uint256 creditScore;
        uint256 totalRepayments;
        bool registered;
    }

    address public owner;
    address public immutable initialOwner;

    mapping(address => Borrower) public borrowers;
    mapping(address => bool) public lenders;

    error NotOwner();
    error NotLender();
    error ZeroAddress();
    error BorrowerAlreadyRegistered();
    error BorrowerNotRegistered();
    error LenderAlreadyRegistered();

    event BorrowerRegistered(address indexed borrower);
    event RepaymentRecorded(address indexed borrower, uint256 newCreditScore, uint256 totalRepayments);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event LenderRegistered(address indexed lender);

    constructor() {
        owner = msg.sender;
        initialOwner = msg.sender;

        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyLender() {
        if (!lenders[msg.sender]) revert NotLender();
        _;
    }

    /// @notice Registers the caller as a borrower.
    /// @dev Reverts if the caller is already registered.
    function registerBorrower() external {
        Borrower storage borrower = borrowers[msg.sender];
        if (borrower.registered) revert BorrowerAlreadyRegistered();

        borrower.registered = true;

        emit BorrowerRegistered(msg.sender);
    }

    /// @notice Transfers contract ownership to a new owner.
    /// @param newOwner Address of the new owner.
    /// @dev Callable only by the current owner.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /// @notice Registers a lender allowed to record repayments.
    /// @param lender Address to authorize as lender.
    /// @dev Callable only by the contract owner.
    function registerLender(address lender) external onlyOwner {
        if (lender == address(0)) revert ZeroAddress();
        if (lenders[lender]) revert LenderAlreadyRegistered();

        lenders[lender] = true;

        emit LenderRegistered(lender);
    }

    /// @notice Records a repayment for a borrower and updates credit score.
    /// @param borrowerAddr Address of the borrower.
    /// @dev Callable only by registered lenders.
    /// Adds +10 per repayment and an additional +5 bonus every 5 repayments.
    function recordRepayment(address borrowerAddr) external onlyLender {
        Borrower storage borrower = borrowers[borrowerAddr];
        if (!borrower.registered) revert BorrowerNotRegistered();

        uint256 newRepayments;
        uint256 newCreditScore;

        unchecked {
            newRepayments = borrower.totalRepayments + 1;
            newCreditScore = borrower.creditScore + 10;
            if (newRepayments % 5 == 0) {
                newCreditScore += 5;
            }
        }

        borrower.totalRepayments = newRepayments;
        borrower.creditScore = newCreditScore;

        emit RepaymentRecorded(borrowerAddr, newCreditScore, newRepayments);
    }

    /// @notice Returns whether a borrower is eligible for credit.
    /// @param borrowerAddr Address of the borrower.
    /// @return True if borrower is registered and has score >= 50.
    function getEligibility(address borrowerAddr) external view returns (bool) {
        Borrower storage borrower = borrowers[borrowerAddr];
        return borrower.registered && borrower.creditScore >= 50;
    }

    /// @notice Returns full borrower profile data.
    /// @param borrowerAddr Address of the borrower.
    /// @return Borrower struct containing score, repayments, and registration status.
    function getBorrower(address borrowerAddr) external view returns (Borrower memory) {
        return borrowers[borrowerAddr];
    }
}
