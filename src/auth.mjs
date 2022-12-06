import jose from "node-jose"


export const createKeyPair = async () => {
    const keystore = jose.JWK.createKeyStore(); 
    const props = {
        alg: 'ES256',
        use: 'sig',
        kid: 'my-key'
    }  
    await keystore.generate("EC", "P-256", props);
    return keystore;
}