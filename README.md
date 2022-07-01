# Wave Portal
### A simple Dapp to wave an address and leave messages down with Smart Contract. Connect through metamask wallet with Rinkeby network to test the functionality.

### PREVIEW:

<p align="center">
<img src="https://user-images.githubusercontent.com/62827213/175799624-377c09e4-ad08-4549-b0ac-02d9e168cd88.PNG" width=60% height=30%>
</p>
<p align="center">
    <em>Dapp Landing Page</em>
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/62827213/175799758-1449d1c8-272b-46fd-887a-a8d53cbbc89d.PNG" width=60% height=30%>
</p>
<p align="center">
    <em>After Connecting Wallet</em>
</p>

[Live Preview](https://drop-me-msg.janus9.repl.co) 

## Project Setup
```
npm init -y
npm install --save-dev hardhat
npm hardhat
```
### HardHat Environment
Compiling Smart Contract
```
npx hardhat compile
```
Deploying to your local Hardhat Blockchain
1. Start a Hardhat Node
   ```
   npx hardhat node
   ```
2. Deploy Smart Contract in `localhost` or `rinkeby` network
    ```
    npx hardhat run --network localhost scripts/deploy.js
    ```
    ```
    npx hardhat run --network rinkeby scripts/deploy.js
    ```
