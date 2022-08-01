import { LightningElement, api, wire } from 'lwc';

import { createRecord } from 'lightning/uiRecordApi';

import getProductsById from '@salesforce/apex/ProductLoader.getProductsById';

export default class ProductCartModalWindow extends LightningElement {
    @api productIds;
    total = 0;
    @api accountId;
    currentOrderId;

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
    async checkout() {
        if (this.products.length === 0) {
            return;
        }
        await this.createOrder();
        for (let product of this.products) {
            this.createOrderItem(
                product.Name,
                product.Id,
                product.Price__c,
                product.amount
            );
        }
        this.clearCart();
    }
    async createOrder() {
        let fields = {
            Name: `Order-${Math.random().toString()}`,
            AccountId__c: this.accountId
        };
        let objectRecordDetails = { apiName: 'Order__c', fields };
        await createRecord(objectRecordDetails).then(
            (result) => (this.currentOrderId = result.id)
        );
    }
    createOrderItem(name, productId, price, quantity) {
        let fields = {
            Name: name,
            OrderId__c: this.currentOrderId,
            ProductId__c: productId,
            Price__c: price,
            Quantity__c: quantity
        };
        let objectRecordDetails = { apiName: 'OrderItem__c', fields };
        createRecord(objectRecordDetails);
    }
    hideModal() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }

    connectedCallback() {
        console.log(this.productIds);
    }
}
