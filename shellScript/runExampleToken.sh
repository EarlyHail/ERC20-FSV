#!/bin/bash
REPOSITORY=/home/ec2-user
TOKENPATH=/Truffle_test/top100tokens
TOKEN=$1
OUTPUT=$REPOSITORY/$TOKENPATH/$TOKEN/output.txt

if [ -f "$OUTPUT" ]; then
	exit 1
fi

cd $REPOSITORY
mkdir $REPOSITORY/$TOKEN
cp -r Truffle_test/common $REPOSITORY/$TOKEN/common
mkdir $REPOSITORY/$TOKEN/module
cd $REPOSITORY/$TOKEN/module
truffle init
cp $REPOSITORY/$TOKEN/common/truffle-config.js truffle-config.js
rm ./contracts/Migrations.sol

mkdir build
mkdir build/contracts
cp ../common/build/contracts/ERC20Test.json ./build/contracts/
cp ../common/build/contracts/ERC20TokenInterface.json ./build/contracts/
cp ../common/build/contracts/Migrations.json ./build/contracts/
cp ../common/migrations/2_deploy_contracts.js ./migrations/
npm install js-sha3

cp ../common/test/erc20test.js ./test/

cp $REPOSITORY/$TOKENPATH/$TOKEN/*.sol ./contracts/
cp $REPOSITORY/$TOKENPATH/$TOKEN/initialize.js ./test/

python ../common/GetVersionInfo.py contracts/Target.sol truffle-config.js
truffle test --show-events >& output.txt

cp  $REPOSITORY/$TOKEN/module/output.txt $REPOSITORY/$TOKENPATH/$TOKEN/output.txt