import { test, beforeEach, afterEach, expect } from "vitest";
import { e, SWorld, SWallet, SContract, d } from "xsuite";

let world: SWorld;
let deployer: SWallet;
let contract: SContract;

beforeEach(async () => {
  world = await SWorld.start();
  deployer = await world.createWallet();
  ({ contract } = await deployer.deployContract({
    code: "file:output/contract.wasm",
    codeMetadata: [],
    gasLimit: 10_000_000,
  }));
});

afterEach(async () => {
  world.terminate();
});

test("Test", async () => {
  const walletTowhitelist = await world.createWallet();
  const accountToWhitelist = await walletTowhitelist.getAccount();
  const addressToWhitelist = accountToWhitelist.address;

  const { returnData } = await world.query({
    callee: contract,
    funcName: "isAddressWhitelisted",
    funcArgs: [e.Addr(addressToWhitelist)]
  });
  const decodedReturnData = d.Bool().fromTop(returnData[0]);
  console.log('decodedReturnData', decodedReturnData);

  expect(decodedReturnData).toBeFalsy();
});
