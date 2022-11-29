export default class Server {
    constructor(configs) {
        this.dhtServerIp = {
            ip: '172.0.0.1',
            port: '8000'
        };
        this.timelineServerIp = {
            ip: '172.0.0.1',
            port: '8000'
        };
        this.bootstrapNodes = [];
        
        Object.assign(this, configs);
    }
}