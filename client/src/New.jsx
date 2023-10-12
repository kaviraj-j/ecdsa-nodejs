import React from 'react'

function New({privateKey, publicKey}) {
  return (
    <div>
        <h1>You're given 100 ETH!</h1>
        <div>
        Your Private Key: {privateKey}
        </div>
        <div>
        Your public key: {publicKey}
        </div>
    </div>
  )
}

export default New