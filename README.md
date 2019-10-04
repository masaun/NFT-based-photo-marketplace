# NFT based Photo MarketPlace

***

## 【Introduction of NFT based Photo MarketPlace】
- NFT based Photo MarketPlace is the peer-to-peer Marketplace for buy and sell of photos which was uploaded by users.
- It assume that uploaded photos in this marketplace are used as photos of news article.
- Even if user has smartphone which include function of camera, anyone can become sellers by uploading photos in this MarketPlace.
  - It mean that if user who is seller live in poor region and doesn't has bank account and so on, they can earn money by selling photos in this marketplace.
- All of being uploaded photos are tokenized as NFT（Non-Fungible token). 
- Uploaded photos buy/sell by using DAI for preventing risk of high volatility of crypto currency.


&nbsp;


***

## 【Setup】

### Setup private network by using Ganache
1. Download Ganache from link below  
https://www.trufflesuite.com/ganache  


2. Execute Ganache   

&nbsp;



### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
http://127.0.0.1:7545

```

&nbsp;


### Setup backend
1. Deploy contracts to private network of Ganache
```
(root directory)

$ npm run migrate
```

&nbsp;


### Setup frontend
1. Execute command below in root directory.
```

$ npm run client
```

2. Access to browser by using link 
```
http://127.0.0.1:3000
```

&nbsp;

***


## 【Work flow】

&nbsp;

***

## 【References】
- Gitcoin（The Road to Devcon5）
https://gitcoin.co/issue/ConsenSys/Road-To-Devcon-Relay/2
https://gitcoin.co/issue/ConsenSys/ConsenSysGrants-Challenges/5/3497

- Documents

