import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";





function Transfer({ address, setBalance, privateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    const address = toHex(secp256k1.getPublicKey(privateKey))
    setSender(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("")
  const setValue = (setter) => (evt) => setter(evt.target.value);
  async function transfer(evt) {
    evt.preventDefault();
    const amount = parseInt(sendAmount);
    try {
      const response = await server.post(`send`, {
        sender,
        amount,
        recipient,
      });

      const {balance} = response.data
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Private Key
        <input placeholder="Type in private key..." onChange={onChange}></input>
      </label>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <div>
        Sender Address: {sender}
      </div>
      
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}
export default Transfer;