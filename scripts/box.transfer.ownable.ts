import { ethers, upgrades } from 'hardhat'
import utils from './utils'
import config from '../config'

import boxContract from '../artifacts/contracts/token/RarePizzasBox.sol/RarePizzasBox.json';

// transfer ownership of the admin interface from the signer to some owner
async function main() {
  const [deployer] = await ethers.getSigners()
  const provider = new ethers.providers.AlchemyProvider(config.NETWORK, utils.getAlchemyAPIKey(config));
  const wallet = new ethers.Wallet(utils.getDeploymentKey(config), provider)

  const instanceAddress = utils.getProxyAddress(config)
  const newOwner = utils.getProxyAdminAddress(config)

  console.log('Connecting to instance')

  const contract = new ethers.Contract(instanceAddress, boxContract.abi, wallet);

  const current = await contract.getBitcoinPriceInWei()
  //verify we can query something
  console.log(`current BTC-ETH Price: ${current.toString() / 10 ** 18}`)

  console.log('Transferring Ownable From', wallet.address)
  // The owner of the ProxyAdmin can upgrade our contracts
  await contract.transferOwnership(newOwner)
  console.log('Successfully Transferred Ownable To', newOwner)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
