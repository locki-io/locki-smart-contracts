import { describe, test, beforeEach, afterEach, expect } from "vitest";
import { e, SWorld, SWallet, SContract, d } from "xsuite";

let world: SWorld;
let deployer: SWallet;
let contract: SContract;
let addressToWhitelist: string;

beforeEach(async () => {
  world = await SWorld.start();
  deployer = await world.createWallet();
  ({ contract } = await deployer.deployContract({
    code: "file:output/contract.wasm",
    codeMetadata: [],
    gasLimit: 10_000_000,
  }));

  const walletTowhitelist = await world.createWallet();
  const accountToWhitelist = await walletTowhitelist.getAccount();
  addressToWhitelist = accountToWhitelist.address;
});

afterEach(async () => {
  world.terminate();
});

const isAddressWhitelisted = async (address: string) => {
  const { returnData } = await world.query({
    callee: contract,
    funcName: "isAddressWhitelisted",
    funcArgs: [e.Addr(addressToWhitelist)],
  });
  const decodedReturnData = d.Bool().fromTop(returnData[0]);
  return decodedReturnData;
}

const whitelistedAddressLength = async () => {
  const { returnData } = await world.query({
    callee: contract,
    funcName: "getWhitelistedAddressesLength",
    funcArgs: [],
  });
  const decodedReturnData = d.Usize().fromTop(returnData[0]);
  return decodedReturnData;
}

describe("locki-whitelist", async () => {
  test("check if the address is not whitelisted initially", async () => {
    const addressWhitelisted = await isAddressWhitelisted(addressToWhitelist);
    const lenWhitelistedAddresses = await whitelistedAddressLength();

    expect(addressWhitelisted).toBeFalsy();
    expect(lenWhitelistedAddresses).toBe(0n);
  });

  test("the address should be whitelisted", async () => {
    await deployer.callContract({
      callee: contract,
      gasLimit: 5_000_000,
      funcName: "addNewAddressToWhitelist",
      funcArgs: [e.Addr(addressToWhitelist)],
    });

    const addressWhitelisted = await isAddressWhitelisted(addressToWhitelist);
    const lenWhitelistedAddresses = await whitelistedAddressLength();

    expect(addressWhitelisted).toBeTruthy();
    expect(lenWhitelistedAddresses).toBe(1n);
  });

  test("the address should be removed from whitelist", async () => {
    await deployer.callContract({
      callee: contract,
      gasLimit: 5_000_000,
      funcName: "removeAddressToWhitelist",
      funcArgs: [e.Addr(addressToWhitelist)],
    });

    const addressWhitelisted = await isAddressWhitelisted(addressToWhitelist);
    const lenWhitelistedAddresses = await whitelistedAddressLength();

    expect(addressWhitelisted).toBeFalsy();
    expect(lenWhitelistedAddresses).toBe(0n);
  });
});
