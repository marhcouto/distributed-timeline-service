import jose from "node-jose"


export const createKeyPair = async (userName) => {
    const keystore = jose.JWK.createKeyStore(); 
    const props = {
        alg: 'ES256',
        use: 'sig',
        kid: userName
    }  
    await keystore.generate("EC", "P-256", props);
    return keystore;
}

export const buildSignedMessage = async (keyName, keystore, message) => {
    const key = await keystore.get(keyName);
    return await jose.JWS.createSign(key).
      update(JSON.stringify(message)).
      final();
}

export const extractSignedMessage = async (keyName, keystore, signedMessage) => {
    const key = await keystore.get(keyName);
    const message = await jose.JWS.createVerify(key).verify(signedMessage);
    return JSON.parse(JSON.parse(message.payload.toString()));
}


export const buildMessageWithKey = async (keyName, keystore, message) => {
    const key = await keystore.get(keyName);
    return {
        content: message,
        key: key
    };
}
