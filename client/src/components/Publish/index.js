import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";
import ipfs from '../ipfs/ipfsApi.js'

import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';


export default class Publish extends Component {
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          route: window.location.pathname.replace("/", ""),

          /////// Ipfs Upload
          buffer: null,
          ipfsHash: '',

          /////// NFT
          photo_marketplace: null, // Instance of contract
          totalSupply: 0,
          photoslist: [],         // Array for NFT

          photoData: [],
          photoDataAll: []
        };

        /////// Ipfs Upload
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    ///////--------------------- Functions of ipfsUpload ---------------------------  
    captureFile(event) {
        event.preventDefault()
        const file = event.target.files[0]
        
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)  // Read bufffered file

        // Callback
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('=== buffer ===', this.state.buffer)
        }
    }
      
    onSubmit(event) {
        const { accounts, photo_marketplace, web3 } = this.state;

        event.preventDefault()

        ipfs.files.add(this.state.buffer, (error, result) => {
          // In case of fail to upload to IPFS
          if (error) {
            console.error(error)
            return
          }

          // In case of successful to upload to IPFS
          this.setState({ ipfsHash: result[0].hash })
          console.log('=== ipfsHash ===', this.state.ipfsHash)

          const ipfsHashOfPhoto = this.state.ipfsHash

          // Append to array of NFT
          this.state.photo_marketplace.methods.mint(ipfsHashOfPhoto).send({ from: accounts[0] })
          .once('receipt', (receipt) => {
            this.setState({
              photoslist: [...this.state.photoslist, ipfsHashOfPhoto]
            })

            console.log('=== receipt ===', receipt);
            console.log('=== receipt.events.Transfer.returnValues.tokenId ===', receipt.events.Transfer.returnValues.tokenId);
            console.log('=== receipt.events.Transfer.returnValues.to ===', receipt.events.Transfer.returnValues.to);

            let tokenId = receipt.events.Transfer.returnValues.tokenId
            let ownerAddr = receipt.events.Transfer.returnValues.to
            let reputationCount = 0
            this.setState({ photoData: [tokenId, ownerAddr, reputationCount] })
            this.setState({ photoDataAll: [...this.state.photoDataAll, this.state.photoData] })
          })
          console.log('=== photoslist ===', this.state.photoslist)
          console.log('=== photoData ===', this.state.photoData)      
          console.log('=== photoDataAll ===', this.state.photoDataAll)
        })
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
        try {
          PhotoNFTFactory = require("../../../../build/contracts/PhotoNFTFactory.json"); // Load ABI of contract of PhotoNFTFactory
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

            if (instancePhotoNFTFactory) {
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled,
                    isMetaMask, photo_marketplace: instancePhotoNFTFactory}, () => {
                      this.refreshValues(instancePhotoNFTFactory);
                      setInterval(() => {
                        this.refreshValues(instancePhotoNFTFactory);
                    }, 5000);
                });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }


            //---------------- NFT（Always load listed NFT data）------------------
            const { photo_marketplace } = this.state;

            const totalSupply = await photo_marketplace.methods.totalSupply().call()
            this.setState({ totalSupply: totalSupply })

            // Load photoslist
            for (var i=1; i<=totalSupply; i++) {
              const color = await photo_marketplace.methods.photoslist(i - 1).call()
              this.setState({
                photoslist: [...this.state.photoslist, color]
              })
            }
            console.log('======== photoslist ========', this.state.photoslist)

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

    render()  {
        return (
          <div className={styles.left}>
            <br />
            <h4>Publish</h4>
            <p>Please upload your photo from here!</p>

            <Box bg="salmon" color="white" fontSize={4} p={3} width={[1, 1, 0.5]}>
              <h2>Upload your photo to IPFS</h2>

              <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} />
                <Button size={'small'}><input type='submit' /></Button>
              </form>
            </Box>
          </div>
        );
    }
}
