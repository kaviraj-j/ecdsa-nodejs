const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.post("/new", async (req, res) => {
  const { newPublicKey } = req.body;
  console.log("public key: " + newPublicKey);
  balances[newPublicKey] = 100;
  res.send({ balances });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
