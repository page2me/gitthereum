const path = require('path')
const Client = require('./client')


;(async () => {
    // const client = new Client(path.resolve(__dirname, '../chain'))
    const client = new Client(path.resolve(__dirname, '../real-chain'), {
        env: {
            'GNUPGHOME': path.resolve(__dirname, '../keys')
        }
    })
    // const result = await client._lsFiles()
    // console.log(result)

    // // const result2 = await client._execGPG('--homedir ../keys --list-keys')
    // // console.log(result2)

    // const result3 = await client._exec('echo $GNUPGHOME')
    // console.log(result3)

    // const balance = await client.getBalance('0AC51CBC5C8832457EDB42F334B0AF0B3E84D636')
    // const balance = await client.getBalance('34B0/AF0B/3E84/D636')
    // console.log(balance)
    const { to, amount, fee } = process.env
    const Ramount = parseInt(amount || 100)
    const Rfee = parseInt(fee || 100)
    const commitHash = await client.transfer(to, Ramount, Rfee);
    console.log(commitHash)

    // const status = await client.checkTransactionStatus('f32d1ee69b88d8ac42b41dfea6e5e43c01f2d4cd')
    // console.log(status)

    if(process.env.SAFE == 1) {
        console.log(`SAFE is true, deleting temporary transaction ${commitHash}`)
        await client._execGit(`checkout -f master`)
        await client._execGit(`branch -D transactions/${commitHash}`)
    } else {
        console.log(`SAFE is not true, publishing transaction ${commitHash}`)
        const result = await client.pushTransactionToRemote(commitHash)
        console.log(result)
    }
})()

