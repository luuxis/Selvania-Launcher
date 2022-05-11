const net = require('net');

class status {
    constructor(ip = '0.0.0.0', port = 25565) {
        this.ip = ip
        this.port = port
    }

    getStatus() {
        return new Promise((resolve) => {
            let start = new Date();
            let client = net.connect(this.port, this.ip, () => {
                client.write(Buffer.from([0xFE, 0x01]))
            });

            client.setTimeout(5 * 1000)

            client.on('data', (data) => {
                if (data != null && data != '') {
                    var infos = data.toString().split("\x00\x00\x00")
                    resolve({ error: false, ms: Math.round(new Date() - start), players: infos[4].replace(/\u0000/g, '') })
                }
                client.end()
            });

            client.on('timeout', () => {
                resolve({ error: true })
                client.end()
            });

            client.on('err', (err) => {
                resolve({ error: true })
                console.error(err)
            })
        })
    }
}

export default status;