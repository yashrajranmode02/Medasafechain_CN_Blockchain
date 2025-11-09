const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatchRegistry (v2 with roles + QR hash)", function () {
  let registry, owner, manufacturer, distributor, chemist, customer;
  const toBytes32 = (str) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));

  beforeEach(async function () {
    [owner, manufacturer, distributor, chemist, customer] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("BatchRegistry");
    registry = await Registry.deploy(owner.address);
    await registry.deployed();

    // Grant roles
    await registry.connect(owner).grantRoleTo(manufacturer.address, await registry.MANUFACTURER_ROLE());
    await registry.connect(owner).grantRoleTo(distributor.address, await registry.DISTRIBUTOR_ROLE());
    await registry.connect(owner).grantRoleTo(chemist.address, await registry.CHEMIST_ROLE());
  });

  it("should allow manufacturer to create a batch", async function () {
    const batchId = toBytes32("BATCH001");
    const qrHash = toBytes32("QR_PAYLOAD");

    await registry.connect(manufacturer).createBatch(batchId, "Paracetamol", qrHash, manufacturer.address);

    const details = await registry.getBatchDetails(batchId);
    expect(details.id).to.equal(batchId);
    expect(details.medicineName).to.equal("Paracetamol");
    expect(details.manufacturer).to.equal(manufacturer.address);
  });

  it("should revert if non-manufacturer tries to create", async function () {
    const batchId = toBytes32("BATCH002");
    const qrHash = toBytes32("QR_PAYLOAD");

    await expect(
      registry.connect(customer).createBatch(batchId, "DrugX", qrHash, customer.address)
    ).to.be.revertedWith("AccessControl: account");
  });

  it("should let distributor update status", async function () {
    const batchId = toBytes32("BATCH003");
    const qrHash = toBytes32("HASH3");

    await registry.connect(manufacturer).createBatch(batchId, "Ibuprofen", qrHash, manufacturer.address);
    await registry.connect(distributor).updateStatus(batchId, 1, "Dispatched to chemist");

    const count = await registry.getStatusCount(batchId);
    expect(count).to.equal(2); // Created + Dispatched

    const [, status, updatedBy, note] = await registry.getStatusByIndex(batchId, 1);
    expect(status).to.equal(1); // Status.Dispatched
    expect(updatedBy).to.equal(distributor.address);
    expect(note).to.equal("Dispatched to chemist");
  });

  it("should allow chemist to mark as received", async function () {
    const batchId = toBytes32("BATCH004");
    const qrHash = toBytes32("HASH4");

    await registry.connect(manufacturer).createBatch(batchId, "Amoxicillin", qrHash, manufacturer.address);
    await registry.connect(chemist).updateStatus(batchId, 3, "Received and verified");

    const latest = await registry.getStatusByIndex(batchId, 1);
    expect(latest.note).to.equal("Received and verified");
  });

  it("should verify batch by QR hash", async function () {
    const batchId = toBytes32("BATCH005");
    const qrHash = toBytes32("HASH5");

    await registry.connect(manufacturer).createBatch(batchId, "Vitamin C", qrHash, manufacturer.address);
    const verified = await registry.verifyBatch(batchId, qrHash);
    expect(verified).to.be.true;
  });

  it("should verify signature signed by manufacturer", async function () {
    const batchId = toBytes32("BATCH006");
    const qrHash = toBytes32("HASH6");

    await registry.connect(manufacturer).createBatch(batchId, "Painkiller", qrHash, manufacturer.address);

    // manufacturer signs the QR hash
    const signature = await manufacturer.signMessage(ethers.utils.arrayify(qrHash));

    const verified = await registry.verifyBatchSignature(batchId, signature);
    expect(verified).to.be.true;
  });
});
