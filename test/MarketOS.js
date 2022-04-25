const { expect } = require("chai");

describe("MarketOS Contract", () => {
  const setup = async({ maxSupply = 10000 }) => {
    const [owner] = await ethers.getSigners();
    const MarketOS = await ethers.getContractFactory("MarketOS");
    const deployed = await MarketOS.deploy(maxSupply);

    return {
      owner,
      deployed,
    }
  }

  describe("Deployment", () => {
    it('Sets max supply to passed param', async () => {
      const maxSupply = 4000;
      const { deployed } = await setup({ maxSupply });
      const returnedMaxSupply = await deployed.getMaxSupply();
      expect(maxSupply).to.equal(returnedMaxSupply);
    })
  });

  describe ("Minting", () => {
    it("Mints a new token and assigns it to owner", async () => {
      const { owner, deployed } = await setup({});
      await deployed.mint();
      const ownerOfMinted = await deployed.ownerOf(0);
      expect(ownerOfMinted).to.equal(owner.address);
    });

    it("Has a minting limit", async () => {
      const maxSupply = 2;
      const { deployed } = await setup({ maxSupply });

      await Promise.all([deployed.mint(), deployed.mint()]);

      expect(deployed.mint()).to.be.revertedWith("No MarketOs left");
    });
  });

  
  describe("tokenURI", () => {
    it("Returns valid metadata", async () => {
      const { deployed } = await setup({});

      await deployed.mint();

      const tokenURI = await deployed.tokenURI(0);
      const stringfiedTokenURI = await tokenURI.toString();
      const [, base64JSON] = stringfiedTokenURI.split(
        "data:application/json;base64,"
      );

      const stringfiedMetadata = Buffer.from(base64JSON, "base64").toString("ascii");

      const metadata = JSON.parse(stringfiedMetadata);

      expect(metadata).to.have.all.keys("name", "description", "image");
    });
  });

});