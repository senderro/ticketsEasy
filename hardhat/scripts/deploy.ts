import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {

  // Endereço inicial do proprietário
  const initialOwner = "0xEf46E92aAdbE55a5011a46817573fBa5eC957167";
  const easytickets = await hre.viem.deployContract("EasyTickets", [initialOwner], {});
  console.log(
    `easytickets with with value ${initialOwner} deployed to ${easytickets.address}`
  );


}

// Execute o script e trate erros
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});