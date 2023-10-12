import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { getRandomBytesSync } from "ethereum-cryptography/random.js";
import New from "./New";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from "axios";
import { useRef, useState, useEffect } from "react"



function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  // const [accountCreated, setAccountCreated] = useState(false)

  const [newPrivateKey, setNewPrivateKey] = useState("")
  const [newPublicKey, setNewPublicKey] = useState("")
  
  

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function createNewAccount() {
    const privateKey = toHex(getRandomBytesSync(32))
    const address = toHex(secp256k1.getPublicKey(privateKey));
    console.log("priv:" + privateKey)
    console.log("pub:" + address)
    const response = await server.post("new", {
      newPublicKey: address
    })
    // const response = await axios.post("http://localhost:3042/new", {newPublicKey})
    setNewPrivateKey(privateKey)
    setNewPublicKey(address)  
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Public Key
        <input placeholder="Type in address" value={address} onChange={onChange}></input>
      </label>
      <div>
        Address: {address}
      </div>
      <div className="balance">Balance: {balance}</div>
      <div>
            <Popup trigger=
                {<button  onClick={createNewAccount} className="button">New Account</button>} 
                modal nested>
                  
                {
                    close => (
                      
                        <div className='modal'>
                          <button className="button" onClick={createNewAccount}> Click to view new account credentials </button>
                          <button className="button" onClick={() => close()}> X </button>
                            <div className='content'>
                                <New privateKey={newPrivateKey} publicKey={newPublicKey}/>
                            </div>
                            
                        </div>
                    )
                    
                }
            </Popup>
        </div>
    </div>
  );
}
export default Wallet;