// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProofOfCredit {
    enum CreditTier {
        None,
        Bronze,
        Silver,
        Gold
    }

    struct Borrower {
        uint256 creditScore;
        uint256 totalRepayments;
        bool registered;
    }

    address public owner;
    address public immutable initialOwner;
    uint256 public eligibilityThreshold = 50;

    mapping(address => Borrower) public borrowers;
    mapping(address => bool) public lenders;
    mapping(address => bytes32[]) public creditHistoryHashes;

    error NotOwner();
    error NotLender();
    error ZeroAddress();
    error BorrowerAlreadyRegistered();
    error BorrowerNotRegistered();
    error LenderAlreadyRegistered();

    event BorrowerRegistered(address indexed borrower);
    event RepaymentRecorded(address indexed borrower, uint256 newScore, bytes32 metadataHash);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event LenderRegistered(address indexed lender);
    event EligibilityThresholdUpdated(uint256 oldValue, uint256 newValue);

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

    /// @notice Updates the global eligibility threshold.
    /// @param newThreshold New minimum score required for eligibility.
    /// @dev Callable only by the contract owner.
    function setEligibilityThreshold(uint256 newThreshold) external onlyOwner {
        uint256 oldThreshold = eligibilityThreshold;
        eligibilityThreshold = newThreshold;

        emit EligibilityThresholdUpdated(oldThreshold, newThreshold);
    }

    /// @notice Records a repayment for a borrower and updates credit score.
    /// @param borrowerAddr Address of the borrower.
    /// @param metadataHash Hash anchor for off-chain repayment metadata.
    /// @dev Callable only by registered lenders.
    /// Adds +10 per repayment and an additional +5 bonus every 5 repayments.
    function recordRepayment(address borrowerAddr, bytes32 metadataHash) external onlyLender {
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
        creditHistoryHashes[borrowerAddr].push(metadataHash);

        emit RepaymentRecorded(borrowerAddr, newCreditScore, metadataHash);
    }

    /// @notice Returns whether a borrower is eligible for credit.
    /// @param borrowerAddr Address of the borrower.
    /// @return True if borrower is registered and has score >= eligibilityThreshold.
    function getEligibility(address borrowerAddr) external view returns (bool) {
        Borrower storage borrower = borrowers[borrowerAddr];
        return borrower.registered && borrower.creditScore >= eligibilityThreshold;
    }

    /// @notice Returns the deterministic credit tier derived from score.
    /// @param borrowerAddr Address of the borrower.
    /// @return CreditTier classification for the borrower.
    function getCreditTier(address borrowerAddr) public view returns (CreditTier) {
        uint256 score = borrowers[borrowerAddr].creditScore;
        if (score == 0) {
            return CreditTier.None;
        }
        if (score < 50) {
            return CreditTier.Bronze;
        }
        if (score < 80) {
            return CreditTier.Silver;
        }

        return CreditTier.Gold;
    }

    /// @notice Returns full borrower profile data.
    /// @param borrowerAddr Address of the borrower.
    /// @return Borrower struct containing score, repayments, and registration status.
    function getBorrower(address borrowerAddr) external view returns (Borrower memory) {
        return borrowers[borrowerAddr];
    }
}
