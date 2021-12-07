import { Address, BaseAddress, Transaction, TransactionUnspentOutput, TransactionWitnessSet} from '@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js';

// console.log(Address.from_bech32(""));
var paymentAddr =
// "addr_test1qpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5ewvxwdrt70qlcpeeagscasafhffqsxy36t90ldv06wqrk2qum8x5w";
"addr_test1qqk3gxl2puy90jv6u5hfpj9khz3va9ljhxs4eaur5tjk7fnraj5378zauu6wlg85g6nkp9w35kfjlxa645yd7jeraf0qpguk3d";

const foobar = async () => {
  const baseAddr = BaseAddress.from_address(
    Address.from_bech32(paymentAddr)
  );
  const paymentKeyHash = Buffer.from(
    baseAddr.payment_cred().to_keyhash().to_bytes()
  ).toString('hex');
  const stakeKeyHash = Buffer.from(
    baseAddr.stake_cred().to_keyhash().to_bytes()
  ).toString('hex');

  console.log(paymentKeyHash);
  console.log(stakeKeyHash);
};

// TODO: this should be retrieved instead of hardcoded
const getProtocolParameters = async () => {
  return {
    linearFee: {
      minFeeA: p.min_fee_a.toString(),
      minFeeB: p.min_fee_b.toString(),
    },
    minUtxo: "1000000",
    poolDeposit: "500000000",
    keyDeposit: "2000000",
    maxValSize: "5000",
    maxTxSize: 16384,
    priceMem: 5.77e-2,
    priceStep: 7.21e-5,
  };
};

const balanceTx = async (txCBOR) => {
  const tx = Transaction.from_bytes(Buffer.from(txCBOR, 'hex'));
  const protocolParameters = getProtocolParameters();

  const utxos = (await window.cardano.getUtxos()).map((utxo) =>
    TransactionUnspentOutput.from_bytes(fromHex(utxo))
  );

  return tx;
};

const appendAndSubmit = async (txCBOR, witnessSetCBOR) => {
  const tx = Transaction.from_bytes(
    Buffer.from(txCBOR, 'hex')
  );
  const witnessSet = TransactionWitnessSet.from_bytes(
    Buffer.from(witnessSetCBOR, 'hex')
  );

  const transaction = Transaction.new(tx.body(), witnessSet);
  const txHash = await window.cardano.submitTx(
    Buffer.from(transaction.to_bytes(), 'hex').toString('hex')
  );
  console.log(txHash);
};

window["appendAndSubmit"] = appendAndSubmit;
window["balanceTx"] = balanceTx;
window["foobar"] = foobar;
window["getProtocolParameters"] = getProtocolParameters;

// import { _Z4facti } from './factorial.wasm';
// console.log('---- Sync Wasm Module');
// const factorial = _Z4facti;
// console.log(factorial); // [native code]
// console.log(factorial(1));
// console.log(factorial(2));
// console.log(factorial(3));

// import('./factorial.wasm').then(({ _Z4facti: AsyncFactorial }) => {
//   console.log('---- Async Wasm Module');
//   console.log(AsyncFactorial); // [native code]
//   console.log(AsyncFactorial(1));
//   console.log(AsyncFactorial(2));
//   console.log(AsyncFactorial(3));
// });
