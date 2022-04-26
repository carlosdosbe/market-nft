
const deploy = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account", deployer.address);
  const MarketOS = await ethers.getContractFactory("MarketOS");
  const deployed = await MarketOS.deploy(10000);

  console.log("MarketOS is deployed at: ", deployed.address);
};

deploy()
  .then(() => process.exit(0))
  .catch((error => {
    console.log(error);
    process.exit(1);
}));