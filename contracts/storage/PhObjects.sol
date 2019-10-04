pragma solidity ^0.5.0;


contract PhObjects {

    struct Photo {
        uint256 tokenId;
        address curretOwnerAddr;
        string ipfsHash;
        uint256 reputation;
    }


    struct ExampleObject {
        uint exampleId;
        string exampleName;
        address exampleAddr;
    }

}
