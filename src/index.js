import {
    signIn,
    getStoreByName,
    createProduct,
    getProduct,
    addProductImage
} from './client.js';

const code = '' + Math.random();
const categoryId = '83a476a2-b801-11ea-8fd4-020c627cd19e';

const productData = {
    categoryIds: [categoryId],
    vat: 21.00,
    unitNetPrice: 12.12,
    unitGrossPrice: 21.49,
    discountUnitNetPrice: 9.12,
    discountUnitGrossPrice: 10.49,
    stock: 11.3,
    enabled: true,
    taxable: true,
    code,
    barcode: '1000000001',
    name: "[Test] Awesome product " + code,
    description: "Lorem ipsum " + code,
    tags: [{ "value": "test", "order": 0 }],
    producer: 'Test Producer',
    size: 12,
    unitOfMeasure: 'kg'
};

const productImagePath = './logo.png'


const completeFlow = async () => {
    await signIn('marcin@thebasket.online', 'Password_1');

    const store = await getStoreByName('mystore');
    console.log(`Found store: ${JSON.stringify(store, null, 2)}`);

    const productId = await createProduct(store.id, productData);
    console.log(`Created product ${productId}`);

    const product = await getProduct(store.id, productId);
    console.log(JSON.stringify(product, null, 2));

    await addProductImage(store.id, productId, productImagePath, "image/png" );
    console.log('waiting for image to process...');
    await new Promise(resolve => setTimeout(resolve, 5000))

    const productWithImage = await getProduct(store.id, productId)
    console.log(JSON.stringify(productWithImage, null, 2));
};

completeFlow()
    .catch(e => console.error(e));