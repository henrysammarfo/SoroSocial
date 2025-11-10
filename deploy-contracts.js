// SoroSocial Contract Deployment Script
// This script deploys all Soroban smart contracts to Stellar testnet

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const RPC_URL = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const ADMIN_ADDRESS = process.env.CONTRACT_ADMIN_ADDRESS;

if (!ADMIN_SECRET_KEY) {
  console.error('❌ ADMIN_SECRET_KEY not found in environment variables');
  process.exit(1);
}

if (!ADMIN_ADDRESS) {
  console.error('❌ CONTRACT_ADMIN_ADDRESS not found in environment variables');
  process.exit(1);
}

console.log('🚀 Starting SoroSocial contract deployment...');
console.log(`Network: ${NETWORK}`);
console.log(`Admin Address: ${ADMIN_ADDRESS}`);
console.log(`RPC URL: ${RPC_URL}`);

const contracts = [
  'sorosocial_users',
  'sorosocial_trading', 
  'sorosocial_reputation'
];

const deploymentResults = {};

async function deployContract(contractName) {
  console.log(`\n📦 Building contract: ${contractName}...`);
  
  try {
    // Build the contract
    execSync(`cargo build --target wasm32v1-none --release --package ${contractName}`, {
      stdio: 'inherit',
      cwd: 'contracts'
    });
    
    console.log(`✅ Built ${contractName} successfully`);
    
    // Get WASM file path
    const wasmPath = path.join('contracts', 'target', 'wasm32v1-none', 'release', `${contractName}.wasm`);
    
    if (!fs.existsSync(wasmPath)) {
      throw new Error(`WASM file not found at ${wasmPath}`);
    }
    
    console.log(`🚀 Deploying ${contractName} to ${NETWORK}...`);
    
    // Deploy the contract
    const deployCommand = `stellar contract deploy --wasm ${wasmPath} --source ${ADMIN_SECRET_KEY} --network ${NETWORK}`;
    
    console.log(`Executing: ${deployCommand}`);
    
    const result = execSync(deployCommand, { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
    
    console.log(`✅ Deployed ${contractName}: ${result}`);
    
    // Store deployment result
    deploymentResults[contractName] = {
      contractId: result,
      wasmPath: wasmPath,
      deployedAt: new Date().toISOString()
    };
    
    // Initialize the contract (call constructor)
    console.log(`🔧 Initializing ${contractName}...`);
    
    let initCommand;
    if (contractName === 'sorosocial_users') {
      initCommand = `stellar contract invoke --source ${ADMIN_SECRET_KEY} --network ${NETWORK} --contract-id ${result} -- __constructor --admin ${ADMIN_ADDRESS}`;
    } else if (contractName === 'sorosocial_trading') {
      // For trading contract, we need the users contract ID
      const usersContractId = deploymentResults['sorosocial_users']?.contractId;
      if (!usersContractId) {
        throw new Error('Users contract must be deployed before trading contract');
      }
      initCommand = `stellar contract invoke --source ${ADMIN_SECRET_KEY} --network ${NETWORK} --contract-id ${result} -- __constructor --admin ${ADMIN_ADDRESS} --users_contract ${usersContractId}`;
    } else if (contractName === 'sorosocial_reputation') {
      // For reputation contract, we need the trading contract ID
      const tradingContractId = deploymentResults['sorosocial_trading']?.contractId;
      if (!tradingContractId) {
        throw new Error('Trading contract must be deployed before reputation contract');
      }
      initCommand = `stellar contract invoke --source ${ADMIN_SECRET_KEY} --network ${NETWORK} --contract-id ${result} -- __constructor --admin ${ADMIN_ADDRESS} --trading_contract ${tradingContractId}`;
    }
    
    if (initCommand) {
      console.log(`Executing: ${initCommand}`);
      const initResult = execSync(initCommand, { 
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim();
      
      console.log(`✅ Initialized ${contractName}: ${initResult}`);
    }
    
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    throw error;
  }
}

async function generateFrontendConfig() {
  console.log('\n📝 Generating frontend configuration...');
  
  const config = {
    testnet: {
      sorosocial_users: deploymentResults['sorosocial_users']?.contractId || '',
      sorosocial_trading: deploymentResults['sorosocial_trading']?.contractId || '',
      sorosocial_reputation: deploymentResults['sorosocial_reputation']?.contractId || '',
    },
    deploymentInfo: {
      network: NETWORK,
      deployedAt: new Date().toISOString(),
      adminAddress: ADMIN_ADDRESS
    }
  };
  
  // Write deployment results
  fs.writeFileSync('deployment-testnet.json', JSON.stringify(deploymentResults, null, 2));
  console.log('💾 Saved deployment results to deployment-testnet.json');
  
  // Update frontend .env.local
  const envPath = '../frontend/.env.local';
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update contract addresses
    envContent = envContent.replace(
      /NEXT_PUBLIC_SOROSOCIAL_USERS_CONTRACT=.*/,
      `NEXT_PUBLIC_SOROSOCIAL_USERS_CONTRACT=${config.testnet.sorosocial_users}`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_SOROSOCIAL_TRADING_CONTRACT=.*/,
      `NEXT_PUBLIC_SOROSOCIAL_TRADING_CONTRACT=${config.testnet.sorosocial_trading}`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_SOROSOCIAL_REPUTATION_CONTRACT=.*/,
      `NEXT_PUBLIC_SOROSOCIAL_REPUTATION_CONTRACT=${config.testnet.sorosocial_reputation}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated frontend .env.local with contract addresses');
  }
  
  return config;
}

async function main() {
  try {
    console.log('🎯 Starting deployment process...');
    
    // Deploy contracts in order
    for (const contractName of contracts) {
      await deployContract(contractName);
    }
    
    // Generate configuration files
    const config = await generateFrontendConfig();
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log('\n📊 Deployment Summary:');
    console.log('========================');
    Object.entries(deploymentResults).forEach(([name, info]) => {
      console.log(`${name}: ${info.contractId}`);
    });
    
    console.log('\n✅ All contracts deployed to Stellar testnet');
    console.log('✅ Frontend configuration updated');
    console.log('✅ Ready for integration testing');
    
  } catch (error) {
    console.error('\n💥 Deployment failed:', error.message);
    process.exit(1);
  }
}

main();