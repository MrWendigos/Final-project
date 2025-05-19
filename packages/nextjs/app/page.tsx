"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount, useWalletClient } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import VotingContractJSON from "~~/public/VotingContract.json";

const VOTING_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const VotingContractABI = VotingContractJSON.abi;

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  useEffect(() => {
    if (walletClient) {
      const provider = new ethers.providers.Web3Provider(walletClient as unknown as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingContractABI, signer);
      setContract(contractInstance);
    }
  }, [walletClient]);
  const createVotingSession = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    const description = "Election 2024";
    const candidates = ["Candidate 1", "Candidate 2"];
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    try {
      const tx = await contract.createVotingSession(description, candidates, startTime, endTime, { gasLimit: 500000 });
      await tx.wait();
      alert("Voting session created successfully!");
    } catch (error) {
      console.error("Error creating voting session:", error);
    }
  };
  const checkVotingSession = async (sessionId: number) => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      const session = await contract.votingSessions(sessionId);
      console.log("Session Details:", session);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const vote = async (sessionId: number, candidateIndex: number) => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    try {
      const tx = await contract.vote(sessionId, candidateIndex);
      await tx.wait();
      alert("Vote cast successfully!");
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };
  const [sessions, setSessions] = useState<any[]>([]);

  const loadSessions = async () => {
    if (!contract) return;

    const sessionCount = await contract.votingSessionCount();
    const loadedSessions = [];

    for (let i = 0; i < sessionCount; i++) {
      try {
        const session = await contract.votingSessions(i);
        loadedSessions.push({
          id: i,
          description: session.description,
          startTime: session.startTime.toString(),
          endTime: session.endTime.toString(),
          exists: session.exists,
        });
      } catch (error) {
        console.error(`Error fetching session ${i}:`, error);
      }
    }

    setSessions(loadedSessions);
  };

  useEffect(() => {
    loadSessions();
  }, [contract]);

  const transferOwnership = async (newOwner: string) => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }

    if (!ethers.utils.isAddress(newOwner)) {
      console.error("Invalid Ethereum address");
      return;
    }

    try {
      const tx = await contract.transferOwnership(newOwner, { gasLimit: 20000 });
      await tx.wait();
      console.log("Ownership transferred successfully");
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Voting App</span>
        </h1>
        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>
      </div>
      <div className="sessions-list">
        <h2>Existing Voting Sessions</h2>
        {sessions.length === 0 && <p>No sessions available.</p>}
        {sessions.map(session => (
          <div key={session.id} className="session border p-4 mb-2">
            <p>
              <strong>Session ID:</strong> {session.id}
            </p>
            <p>
              <strong>Description:</strong> {session.description}
            </p>
            <p>
              <strong>Start Time:</strong> {new Date(parseInt(session.startTime) * 1000).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong> {new Date(parseInt(session.endTime) * 1000).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex flex-col items-center">
          <button className="btn btn-primary my-2" onClick={createVotingSession}>
            Create Voting Session
          </button>
          <button className="btn btn-secondary my-2" onClick={() => checkVotingSession(0)}>
            Check First Session
          </button>
          <button className="btn btn-primary my-2" onClick={() => vote(1, 0)}>
            Vote for Candidate 1
          </button>
          <button className="btn btn-primary my-2" onClick={() => vote(1, 1)}>
            Vote for Candidate 2
          </button>
          <button
            onClick={() => transferOwnership("0xe848F62De65caFB93D36205E206A08c4db7EcEbE")}
            className="btn btn-primary"
          >
            Transfer Ownership
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
