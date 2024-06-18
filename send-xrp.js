import xrpl from 'xrpl';

const wallet = xrpl.Wallet.fromSeed("sEdVW9RBjGg5VVVMrrhGrm9g3gwFUst");
console.log(wallet.address); // rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH

export async function main() {
    console.log("Connecting to Testnet...");
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    console.log("Getting a wallet from the Testnet faucet...");
    const { wallet, balance } = await client.fundWallet();

    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet.address,
        "Amount": xrpl.xrpToDrops("15"),
        "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    });
    const max_ledger = prepared.LastLedgerSequence;
    console.log("Prepared transaction instructions:", prepared);
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP");
    console.log("Transaction expires after ledger:", max_ledger);

    const signed = wallet.sign(prepared);
    console.log("Identifying hash:", signed.hash);
    console.log("Signed blob:", signed.tx_blob);

    const tx = await client.submitAndWait(signed.tx_blob);
    console.log("Transaction result:", tx.result.meta.TransactionResult);
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2));

    client.disconnect();
}

