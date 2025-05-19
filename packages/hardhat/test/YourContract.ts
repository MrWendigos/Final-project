import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingContract } from "../typechain-types";

describe("VotingContract", function () {
  let votingContract: VotingContract;

  before(async () => {
    const VotingContractFactory = await ethers.getContractFactory("VotingContract");
    votingContract = (await VotingContractFactory.deploy()) as VotingContract;
    await votingContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the owner correctly", async function () {
      const [owner] = await ethers.getSigners();
      expect(await votingContract.owner()).to.equal(owner.address);
    });
  });

  describe("Voting Sessions", function () {
    it("Should allow the owner to create a voting session", async function () {
      //const [owner] = await ethers.getSigners();
      const description = "Test Voting Session";
      const candidates = ["Alice", "Bob"];
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 3600;

      await votingContract.createVotingSession(description, candidates, startTime, endTime);

      const session = await votingContract.votingSessions(0);
      expect(session.description).to.equal(description);
      expect(session.startTime).to.equal(BigInt(startTime));
      expect(session.endTime).to.equal(BigInt(endTime));
      expect(session.exists).to.equal(true);
    });

    it("Should allow a user to vote during an active session", async function () {
      const [, voter] = await ethers.getSigners();

      await votingContract.connect(voter).vote(0, 0);

      const results = await votingContract.getResults(0);
      expect(results[0][0]).to.equal("Alice");
      expect(results[1][0]).to.equal(BigInt(1));
    });

    it("Should prevent voting outside the voting period", async function () {
      const description = "Expired Session";
      const candidates = ["Charlie"];
      const endTime = Math.floor(Date.now() / 1000) - 10;

      await votingContract.createVotingSession(description, candidates, endTime - 3600, endTime);

      await expect(votingContract.vote(1, 0)).to.be.revertedWith("Voting is not active");
    });

    it("Should return correct results after voting", async function () {
      const results = await votingContract.getResults(0);

      const [names, votes] = results;
      expect(names[0]).to.equal("Alice");
      expect(votes[0]).to.equal(BigInt(1));
      expect(names[1]).to.equal("Bob");
      expect(votes[1]).to.equal(BigInt(0));
    });
  });
});
