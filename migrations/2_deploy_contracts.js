const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
 deployer.deploy(Voting, ['1', '2', '3','4'].map(name => web3.utils.asciiToHex(name)));
};