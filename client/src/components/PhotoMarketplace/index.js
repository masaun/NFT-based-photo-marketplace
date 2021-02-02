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

    this.getTestData = this.getTestData.bind(this);
    this.addReputation = this.addReputation.bind(this);
  }


  ///////--------------------- Functions of reputation ---------------------------
  addReputation = async () => {
    const { accounts, photo_marketplace } = this.state;

    let _from2 = "0x2cb2418B11B66E331fFaC7FFB0463d91ef8FE8F5"
    let _to2 = accounts[0]
    let _tokenId2 = 1
    const response_1 = await photo_marketplace.methods.reputation(_from2, _to2, _tokenId2).send({ from: accounts[0] })
    console.log('=== response of reputation function ===', response_1);      // Debug

    const response_2 = await photo_marketplace.methods.getReputationCount(_tokenId2).call()
    console.log('=== response of getReputationCount function ===', response_2);      // Debug
  }


  ///////--------------------- Functions of testFunc ---------------------------  
  getTestData = async () => {

    const { accounts, photo_marketplace, web3 } = this.state;
    console.log('=== accounts[0] ===', accounts[0]);      // Debug


    let _from = accounts[0]
    let _to = "0x2cb2418B11B66E331fFaC7FFB0463d91ef8FE8F5"
    let _tokenId = 1
    const response_buy = await photo_marketplace.methods.buy(_from, _to, _tokenId).send({ from: accounts[0] })
    console.log('=== response of buy function ===', response_buy);      // Debug


    const response_1 = await photo_marketplace.methods.testFunc().send({ from: accounts[0] })
    console.log('=== response of testFunc function ===', response_1);      // Debug   
  }

 
  //////////////////////////////////// 
  ///// Ganache
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
    console.log('=== photoData（＠componentDidMount）===', this.state.photoData)      
    console.log('=== photoDataAll（＠componentDidMount）===', this.state.photoDataAll)

    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
 
    let PhotoMarketPlace = {};
    try {
      PhotoMarketPlace = require("../../../../build/contracts/PhotoMarketPlace.json"); // Load ABI of contract of PhotoMarketPlace
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

        let instancePhotoMarketPlace = null;
        let deployedNetwork = null;

        // Create instance of contracts
        if (PhotoMarketPlace.networks) {
          deployedNetwork = PhotoMarketPlace.networks[networkId.toString()];
          if (deployedNetwork) {
            instancePhotoMarketPlace = new web3.eth.Contract(
              PhotoMarketPlace.abi,
              deployedNetwork && deployedNetwork.address,
            );
            console.log('=== instancePhotoMarketPlace ===', instancePhotoMarketPlace);
          }
        }

        if (instancePhotoMarketPlace) {
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled,
            isMetaMask, photo_marketplace: instancePhotoMarketPlace }, () => {
              this.refreshValues(instancePhotoMarketPlace);
              setInterval(() => {
                this.refreshValues(instancePhotoMarketPlace);
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

  refreshValues = (instancePhotoMarketPlace) => {
    if (instancePhotoMarketPlace) {
      console.log('refreshValues of instancePhotoMarketPlace');
    }
  }

  render() {
    const {} = this.state;

    return (
        <div className={styles.contracts}>

          <h2>NFT based Photo MarketPlace</h2>

          { this.state.photoslist.map((photo, key) => {
            return (
              <div key={key} className="">
                <div className={styles.widgets}>
                  <Card width={'30%'} bg="primary">

                    <h4>Photo #{ key + 1 }</h4>

                    <Image
                      alt="random unsplash image"
                      borderRadius={8}
                      height="100%"
                      maxWidth='100%'
                      src={ `https://ipfs.io/ipfs/${photo}` }
                    />

                    <span style={{ padding: "20px" }}></span>

                    <br />

                    <Button size={'small'} onClick={this.getTestData}> Buy </Button>

                    <span style={{ padding: "5px" }}></span>

                    <Button size={'small'} onClick={this.addReputation}> Rep </Button> 

                    <span style={{ padding: "5px" }}></span>

                    <p>Price: 1.5 ETH (e.g.)</p>

                    <p>NFT Address: 0x5bc111G543B66E331fFaC7FFB0463d91fd9FE8G7 (e.g.)</p>

                    <p>Owner: 0x1cb241G111B66E331fFaC7FFB0463d91fd8FE8F5 (e.g.)</p>

                    <p>Reputation Count: 1</p>
                  </Card>
                </div>
              </div>
            )
          }) }
        </div>
    );
  }
}
