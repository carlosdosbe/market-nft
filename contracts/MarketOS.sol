// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Base64.sol";

contract MarketOS is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _idCounter;
    uint256 immutable maxSupply;
    address owner;

    constructor(uint256 _maxSupply) ERC721("MarketOS", "MKOS") {
        maxSupply = _maxSupply;
        owner = msg.sender;
    }

    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }

    function mint() public {
        uint256 current = _idCounter.current();
        require(current < maxSupply, "No MarketOS left");
        _safeMint(msg.sender, current);
        _idCounter.increment();
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721 Metadata: URI query for none existent roken"
        );

        string memory jsonURI = Base64.encode(
            abi.encodePacked(
                '{ "name": "MarketOS #',
                tokenId,
                '", " description": "MarketOS" are randomized avatars stored on chain to tech DAPP development", "image"',
                "// TODO: Calculate image URL",
                '"}'
            )
        );

        return
            string(abi.encodePacked("data:application/json;base64,", jsonURI));
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
