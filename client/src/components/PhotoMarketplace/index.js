import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";

import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';


export default class PhotoMarketplace extends Component {
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          route: window.location.pathname.replace("/", ""),

          /////// NFT
          allPhotos: [],
          
          photoslist: [],         // Array for NFT

          photoData: [],
          photoDataAll: []
        };

        this.buyPhotoNFT = this.buyPhotoNFT.bind(this);
        this.addReputation = this.addReputation.bind(this);
    }

    ///---------------------------------
    /// Functions of buying a photo NFT 
    ///---------------------------------
    buyPhotoNFT = async (e) => {
        const { accounts, photoNFTMarketPlace, photoNFTFactory } = this.state;
        
        console.log('=== value of buyPhotoNFT ===', e.target.value);

        const _photoNFT = e.target.value;
        const photo = await photoNFTFactory.methods.getPhotoByNFTAddress(_photoNFT).call();
        const buyAmount = await photo.photoPrice;
        const txReceipt1 = await photoNFTMarketPlace.methods.buyPhotoNFT(_photoNFT).send({ from: accounts[0], value: buyAmount });
        console.log('=== response of buyPhotoNFT ===', txReceipt1);
    }


    ///--------------------------
    /// Functions of reputation 
    ///---------------------------
    addReputation = async () => {
        const { accounts, photoNFTMarketPlace } = this.state;

        let _from2 = "0x2cb2418B11B66E331fFaC7FFB0463d91ef8FE8F5"
        let _to2 = accounts[0]
        let _tokenId2 = 1
        const response_1 = await photoNFTMarketPlace.methods.reputation(_from2, _to2, _tokenId2).send({ from: accounts[0] })
        console.log('=== response of reputation function ===', response_1);      // Debug

        const response_2 = await photoNFTMarketPlace.methods.getReputationCount(_tokenId2).call()
        console.log('=== response of getReputationCount function ===', response_2);      // Debug
    }


    ///------------------------------------- 
    /// NFT（Always load listed NFT data）
    ///-------------------------------------
    getAllPhotos = async () => {
        const { photoNFTFactory } = this.state

        const allPhotos = await photoNFTFactory.methods.getAllPhotos().call()
        console.log('=== allPhotos ===', allPhotos)

        this.setState({ allPhotos: allPhotos })
        return allPhotos
    }


    //////////////////////////////////// 
    /// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
          this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
          return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let PhotoNFTFactory = {};
        let PhotoNFTMarketPlace = {};
        try {
          PhotoNFTFactory = require("../../../../build/contracts/PhotoNFTFactory.json");
          PhotoNFTMarketPlace = require("../../../../build/contracts/PhotoNFTMarketPlace.json");
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instancePhotoNFTFactory = null;
            let instancePhotoNFTMarketPlace = null;
            let deployedNetwork = null;

            // Create instance of contracts
            if (PhotoNFTFactory.networks) {
              deployedNetwork = PhotoNFTFactory.networks[networkId.toString()];
              if (deployedNetwork) {
                instancePhotoNFTFactory = new web3.eth.Contract(
                  PhotoNFTFactory.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instancePhotoNFTFactory ===', instancePhotoNFTFactory);
              }
            }

            if (PhotoNFTMarketPlace.networks) {
              deployedNetwork = PhotoNFTMarketPlace.networks[networkId.toString()];
              if (deployedNetwork) {
                instancePhotoNFTMarketPlace = new web3.eth.Contract(
                  PhotoNFTMarketPlace.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instancePhotoNFTMarketPlace ===', instancePhotoNFTMarketPlace);
              }
            }

            if (instancePhotoNFTFactory || instancePhotoNFTMarketPlace) {
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                this.setState({ 
                    web3, 
                    ganacheAccounts, 
                    accounts, 
                    balance, 
                    networkId, 
                    networkType, 
                    hotLoaderDisabled,
                    isMetaMask, 
                    photoNFTFactory: instancePhotoNFTFactory, 
                    photoNFTMarketPlace: instancePhotoNFTMarketPlace }, () => {
                      this.refreshValues(instancePhotoNFTFactory);
                      setInterval(() => {
                        this.refreshValues(instancePhotoNFTFactory);
                    }, 5000);
                });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }

            ///@dev - NFT（Always load listed NFT data
            const allPhotos = await this.getAllPhotos();
            this.setState({ allPhotos: allPhotos })
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };

    componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
    }

    refreshValues = (instancePhotoNFTFactory) => {
        if (instancePhotoNFTFactory) {
          console.log('refreshValues of instancePhotoNFTFactory');
        }
    }

    render() {
        const { web3, allPhotos } = this.state;

        return (
            <div className={styles.contracts}>
              <h2>NFT based Photo MarketPlace</h2>

              { allPhotos.map((photo, key) => {
                return (
                  <div key={key} className="">
                    <div className={styles.widgets}>
                      <Card width={'30%'} bg="primary">

                        <h4>Photo name: { photo.photoNFTName } ({ photo.photoNFTSymbol })</h4>

                        <Image
                          alt="random unsplash image"
                          borderRadius={8}
                          height="100%"
                          maxWidth='100%'
                          src={ `https://ipfs.io/ipfs/${photo.ipfsHashOfPhoto}` }
                        />

                        <span style={{ padding: "20px" }}></span>

                        <p>Price: { web3.utils.fromWei(`${photo.photoPrice}`, 'ether') } ETH</p>

                        <p>NFT Address: { photo.photoNFT }</p>

                        <p>Owner: { photo.ownerAddress }</p>

                        <p>Reputation Count: { photo.reputation }</p>
                        
                        <br />

                        <Button size={'small'} value={ photo.photoNFT } onClick={this.buyPhotoNFT}> Buy </Button>

                        <span style={{ padding: "5px" }}></span>

                        <Button size={'small'} onClick={this.addReputation}> Rep </Button> 

                        <span style={{ padding: "5px" }}></span>
                      </Card>
                    </div>
                  </div>
                )
              }) }
            </div>
        );
    }
}
