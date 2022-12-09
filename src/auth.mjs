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

export const buildSignedTimeline = async (keyName, keystore, timeline) => {
    const key = await keystore.get(keyName);
    return await jose.JWS.createSign(key).
      update(JSON.stringify(timeline)).
      final();
}

export const extractSignedTimeline = async (keyName, keystore, signedTimeline) => {
    const key = await keystore.get(keyName);
    const timeline = await jose.JWS.createVerify(key).verify(signedTimeline);
    return JSON.parse(timeline.payload.toString('utf-8'));
}

export const getPublicKey = async (keyName, keystore) => {
    return await keystore.get(keyName);
}
