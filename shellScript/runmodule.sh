REPOSITORY=/home/ec2-user
USER=$1
cd $REPOSITORY
cp -r Truffle_test/common $REPOSITORY/$USER/common
mkdir $REPOSITORY/$USER/module
cd $REPOSITORY/$USER/module
truffle init
cp $REPOSITORY/$USER/common/truffle-config.js truffle-config.js
rm ./contracts/Migrations.sol

mkdir build
mkdir build/contracts
cp ../common/build/contracts/ERC20Test.json ./build/contracts/
cp ../common/build/contracts/ERC20TokenInterface.json ./build/contracts/
cp ../common/build/contracts/Migrations.json ./build/contracts/
cp ../common/migrations/2_deploy_contracts.js ./migrations/
npm install js-sha3

cp ../common/test/erc20test.js ./test/

cp $REPOSITORY/$USER/*.sol ./contracts/
cp $REPOSITORY/$USER/initialize.js ./test/

python ../common/GetVersionInfo.py contracts/Target.sol truffle-config.js
truffle test --show-events >& output.txt
echo "end"