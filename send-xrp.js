import xrpl from 'xrpl';

//creating a wallet using secret value
const wallet = xrpl.Wallet.fromSeed("sEdVW9RBjGg5VVVMrrhGrm9g3gwFUst");
console.log(wallet.address);

export async function main() {
  //Connecting to XRP Ledger Testnet
    console.log("Connecting to Testnet...");
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    console.log("Getting a wallet from the Testnet faucet...");
    const { wallet, balance } = await client.fundWallet();//requesting funds from the testnet faucet


    //Preparing a payment transaction
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,//sender's address
        "Amount": xrpl.xrpToDrops("30"),//sending 30 XRP
        "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"//destination address
    });
    const max_ledger = prepared.LastLedgerSequence;

    //logging prepared transaction data
    console.log("Prepared transaction instructions:", prepared);
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP");//converting transaction fee from drops to XRP
    console.log("Transaction expires after ledger:", max_ledger);


    //Signing the transaction with the wallet secert key
    const signed = wallet.sign(prepared);
    console.log("Identifying hash:", signed.hash);//transaction hash
    console.log("Signed blob:", signed.tx_blob);//signed transaction data
    //Submitting the signed transaction and awaiting for confirmation
    const tx = await client.submitAndWait(signed.tx_blob);
    console.log("Transaction result:", tx.result.meta.TransactionResult);//printing result
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2));//Changes in account balance after the transaction

    client.disconnect();
}

