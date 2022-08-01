import { LightningElement, api, wire } from 'lwc';

import getProductsById from '@salesforce/apex/ProductLoader.getProductsById';

export default class ProductCartModalWindow extends LightningElement {
    @api productIds;
    total = 0;

    get cartIds() {
        let ids = [];
        if (this.productIds) {
            this.productIds.forEach((e) => {
                ids.push(e.id);
            });
        }
        return ids;
    }

    @wire(getProductsById, { ids: '$cartIds' })
    _products;

    get products() {
        let convertedProductIds = JSON.parse(JSON.stringify(this.productIds));
        let products = [];
        this.total = 0;
        for (let _product of this._products.data) {
            let product = Object.create(_product);
            product.amount = convertedProductIds.filter(
                (e) => e.id === _product.Id
            )[0].amount;
            product.total = product.amount * product.Price__c;
            this.total += product.total;
            products.push(product);
        }
        return products;
    }
    clearCart() {
        this.dispatchEvent(new CustomEvent('clearcart'));
        this.total = 0;
    }
    checkout() {
        console.log('checkout');
    }
    hideModal() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }

    connectedCallback() {
        console.log(this.productIds);
    }
}
