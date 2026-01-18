// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract BatchRegistry is AccessControl {
    using ECDSA for bytes32;

    // ========== ROLES ==========
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant CHEMIST_ROLE = keccak256("CHEMIST_ROLE");

    // ========== STATUS ENUM ==========
    enum Status {
        Created,            // 0
        Dispatched,         // 1
        InTransit,          // 2
        Received,           // 3
        Sold,               // 4
        Expired,            // 5
        Recalled,           // 6
        Other               // 7
    }

    struct Batch {
        bytes32 id;
        bytes32 qrHash;
        string medicineName;
        address manufacturer;
        uint256 createdAt;
        uint8 currentStatus;
    }

    struct StatusUpdate {
        uint256 timestamp;
        uint8 status;
        address updatedBy;
        string note;
    }

    mapping(bytes32 => Batch) private batches;
    mapping(bytes32 => StatusUpdate[]) private statusHistory;

    // ========== EVENTS ==========
    event BatchCreated(
        bytes32 indexed batchId,
        string medicineName,
        address indexed manufacturer,
        uint256 createdAt
    );
    event StatusUpdated(
        bytes32 indexed batchId,
        uint8 status,
        address indexed updatedBy,
        uint256 timestamp,
        string note
    );

    // ========== CONSTRUCTOR ==========
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin == address(0) ? _msgSender() : admin);
        _grantRole(MANUFACTURER_ROLE, _msgSender());
    }

    // ========== MODIFIERS ==========
    modifier batchExists(bytes32 _id) {
        require(batches[_id].createdAt != 0, "Batch: not exists");
        _;
    }

    modifier onlyAuthorized() {
        require(
            hasRole(DISTRIBUTOR_ROLE, _msgSender()) ||
            hasRole(CHEMIST_ROLE, _msgSender()) ||
            hasRole(MANUFACTURER_ROLE, _msgSender()),
            "not authorized"
        );
        _;
    }

    // ========== CORE FUNCTIONS ==========

    function createBatch(
        bytes32 _batchId,
        string calldata _medicineName,
        bytes32 _qrHash,
        address _manufacturer
    ) external onlyRole(MANUFACTURER_ROLE) {
        require(_batchId != bytes32(0), "invalid id");
        require(batches[_batchId].createdAt == 0, "Batch exists");

        batches[_batchId] = Batch({
            id: _batchId,
            qrHash: _qrHash,
            medicineName: _medicineName,
            manufacturer: _manufacturer,
            createdAt: block.timestamp,
            currentStatus: uint8(Status.Created)
        });

        statusHistory[_batchId].push(
            StatusUpdate({
                timestamp: block.timestamp,
                status: uint8(Status.Created),
                updatedBy: _msgSender(),
                note: "Created"
            })
        );

        emit BatchCreated(_batchId, _medicineName, _manufacturer, block.timestamp);
        emit StatusUpdated(_batchId, uint8(Status.Created), _msgSender(), block.timestamp, "Created");
    }

    function updateStatus(
        bytes32 _batchId,
        uint8 _status,
        string calldata _note
    ) external batchExists(_batchId) onlyAuthorized {
        require(_status <= uint8(Status.Other), "invalid status");

        batches[_batchId].currentStatus = _status;

        statusHistory[_batchId].push(
            StatusUpdate({
                timestamp: block.timestamp,
                status: _status,
                updatedBy: _msgSender(),
                note: _note
            })
        );

        emit StatusUpdated(_batchId, _status, _msgSender(), block.timestamp, _note);
    }

    // ========== SECURE VERIFICATION ==========
    function verifyBatch(bytes32 _batchId, bytes32 _qrHash)
        external
        view
        batchExists(_batchId)
        onlyAuthorized
        returns (bool)
    {
        return batches[_batchId].qrHash == _qrHash;
    }

    function verifyBatchSignature(bytes32 _batchId, bytes calldata signature)
        external
        view
        batchExists(_batchId)
        onlyAuthorized
        returns (bool)
    {
        bytes32 storedHash = batches[_batchId].qrHash;
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(storedHash);
        address recovered = ECDSA.recover(ethHash, signature);
        return recovered == batches[_batchId].manufacturer;
    }

    // ========== READ FUNCTIONS (Role-based) ==========
    function getBatchDetails(bytes32 _batchId)
        external
        view
        batchExists(_batchId)
        onlyAuthorized
        returns (
            bytes32 id,
            string memory medicineName,
            address manufacturer,
            uint256 createdAt,
            uint8 currentStatus,
            bytes32 qrHash
        )
    {
        Batch memory b = batches[_batchId];
        return (b.id, b.medicineName, b.manufacturer, b.createdAt, b.currentStatus, b.qrHash);
    }

    // ========== PUBLIC VERIFICATION (for Consumers) ==========
    function publicVerifyBatch(bytes32 _batchId, bytes32 _qrHash)
        external
        view
        batchExists(_batchId)
        returns (
            bool valid,
            string memory medicineName,
            address manufacturer,
            uint8 currentStatus,
            uint256 createdAt
        )
    {
        Batch memory b = batches[_batchId];
        bool isValid = (b.qrHash == _qrHash);
        return (isValid, b.medicineName, b.manufacturer, b.currentStatus, b.createdAt);
    }

    // ========== STATUS HISTORY ==========
    function getStatusCount(bytes32 _batchId)
        external
        view
        batchExists(_batchId)
        onlyAuthorized
        returns (uint256)
    {
        return statusHistory[_batchId].length;
    }

    function getStatusByIndex(bytes32 _batchId, uint256 index)
        external
        view
        batchExists(_batchId)
        onlyAuthorized
        returns (
            uint256 timestamp,
            uint8 status,
            address updatedBy,
            string memory note
        )
    {
        StatusUpdate storage s = statusHistory[_batchId][index];
        return (s.timestamp, s.status, s.updatedBy, s.note);
    }

    // ========== ADMIN ==========
    function grantRoleTo(address account, bytes32 role)
        external
        onlyRole(getRoleAdmin(role))
    {
        _grantRole(role, account);
    }
}
