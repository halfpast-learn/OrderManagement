import { LightningElement, api, wire } from 'lwc';

import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import getProductsById from '@salesforce/apex/ProductLoader.getProductsById';

export default class ProductCartModalWindow extends NavigationMixin(
    LightningElement
) {
    total = 0;
    currentOrderId;

    @api productIds;
    @api accountId;

    @wire(getProductsById, { ids: '$cartIds' })
    _products;

    get cartIds() {
        let ids = [];
        if (this.productIds) {
            this.productIds.forEach((e) => {
                ids.push(e.id);
            });
        }
        return ids;
    }

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

    hideModal() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }

    showNotification(title, message, variant = 'info') {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

    navigateToOrderPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.currentOrderId,
                objectApiName: 'Order__c',
                actionName: 'view'
            }
        });
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

    async checkout() {
        if (this.products.length === 0) {
            this.showNotification('Info', 'No items in cart');
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
        this.showNotification('Success', 'Checkout complete', 'Success');
        this.navigateToOrderPage();
    }
}
