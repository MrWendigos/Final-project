import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the VotingContract using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const deployment = await deploy("VotingContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  log(`✅ VotingContract deployed at address: ${deployment.address}`);
  log(`👋 Contract deployed by: ${deployer}`);
};

export default deployVotingContract;

deployVotingContract.tags = ["VotingContract"];
