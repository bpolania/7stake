# 7Stake

### Install
`npm install`

# Environmental Variables

Rename  the `sample.env` file to `.env`
Add your Private Keys to the `.env` file

### Test
`npx hardhat test`

### Deploy

#### Aurora
`npx hardhat run scripts/deploy.js --network testnet_aurora`

#### Ethereum Goerli
`npx hardhat run scripts/deploy.js --network goerli`

### Deployed Contracts

#### Aurora
- DepositContract deployed to: `0xc2b32973d03d906d8c166aa026b749C325C09161`
- BatchDeposit deployed to: `0x316d3b6452192b5f210b71032eb37F1DA858fEdD`

#### Ethereum Goerli
- DepositContract deployed to: `0x8C82fe6e0818851c9bB485ef40743C694ca7FFf5`
- BatchDeposit deployed to: `0x29fB04d8259D564fd9ebB6Ffe4e2C5b6Dc1920E9`