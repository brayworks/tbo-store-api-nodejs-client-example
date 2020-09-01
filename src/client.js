import Auth from '@aws-amplify/auth';
import RestAPI from '@aws-amplify/api-rest';

// A hack to allow using Amplify from server side as nodejs does not have native 'fetch' method:
// see more: https://github.com/aws-amplify/amplify-js/issues/1066
import * as fetch from 'node-fetch';
global['fetch'] = fetch;

import fs from 'fs';

Auth.configure({
    mandatorySignIn: true,
    region: 'eu-west-1',
    userPoolId: 'change me',
    identityPoolId: 'change me',
    userPoolWebClientId: 'change me'
});

RestAPI.configure({
    endpoints: [
        {
            name: 'boApi',
            endpoint: 'https://int.api.thebasket.online',
            region: 'eu-west-1'
        }
    ]
});

const headers = {
    'Content-Type': 'application/json',
};

export const signIn = async (username, password) => {
    try {
        const resp = await Auth.signIn(username, password);
        console.log(JSON.stringify(resp, null, 2))
        return resp;
    } catch (e) {
        console.log(e)
    }
};

export const getStoreByName = async (name) => {
    console.log(`fetching store`)
    const storesResponse = await RestAPI.get('boApi', `/sellers/stores`, { headers, timeout: 25000 });
    const filteredStores = storesResponse.items.filter(item => item.name === name);

    return filteredStores.length > 0 ? filteredStores[0] : null;
};

export const createProduct = async (storeId, product) => {
    console.log(`creating product`)

    const createResponse = await RestAPI.post('boApi', `/sellers/stores/${storeId}/products`, { headers, body: product });

    return createResponse.id;
};

export const getProduct = async (storeId, productId) => {
    console.log(`get product`)
    
    return await RestAPI.get('boApi', `/sellers/stores/${storeId}/products/${productId}`, { headers });
};

export const addProductImage = async (storeId, productId, imagePath, mimeType) => {
    console.log(`adding product image from ${imagePath}`)
    const { url } = await RestAPI.post('boApi', `/sellers/stores/${storeId}/products/${productId}/images`, { headers, body: { contentType: mimeType} });

    const stats = fs.statSync(imagePath);
    const fileSizeInBytes = stats.size;

    let readStream = fs.createReadStream(imagePath);

    const result = await fetch(url, {
        method: 'PUT',
        headers: {
            "content-length": fileSizeInBytes,
            "content-type": mimeType,
        },
        body: readStream
    })

    console.log(JSON.stringify(result, null, 2))

    return result;
};