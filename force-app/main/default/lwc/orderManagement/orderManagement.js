import { LightningElement, wire } from 'lwc';

import { CurrentPageReference } from 'lightning/navigation';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getProducts from '@salesforce/apex/ProductLoader.getProducts';
import getTypePicklistValues from '@salesforce/apex/ProductLoader.getTypePicklistValues';
import getFamilyPicklistValues from '@salesforce/apex/ProductLoader.getFamilyPicklistValues';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';
import ISMANAGER_FIELD from '@salesforce/schema/User.IsManager__c';

import UserId from '@salesforce/user/Id';

export default class OrderManagement extends LightningElement {
    accountId;
    error;

    searchString;
    selectedType = '%';
    selectedFamily = '%';

    products;
    cart = [];

    showDetailsModal = false;
    showCartModal = false;
    showCreateProductModal = false;

    currentProductId;

    @wire(CurrentPageReference)
    handleResult({ state }) {
        if (state) {
            this.accountId = state.c__recordId;
        } else {
            this.error = 'error';
        }
    }

    @wire(getRecord, {
        recordId: '$accountId',
        fields: [NAME_FIELD, ACCOUNT_NUMBER_FIELD]
    })
    account;

    @wire(getFamilyPicklistValues)
    _families;

    @wire(getTypePicklistValues)
    _types;

    @wire(getRecord, { recordId: UserId, fields: ISMANAGER_FIELD })
    user;

    get isManager() {
        return getFieldValue(this.user.data, ISMANAGER_FIELD);
    }

    get hasAccountData() {
        return this.account && this.account.data;
    }

    get name() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }

    get number() {
        return getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD);
    }

    get types() {
        let result = [{ value: '%', label: 'No filter' }];
        if (this._types.data) {
            for (let type of this._types.data) {
                result.push({ value: type, label: type });
            }
        }
        return result;
    }

    get families() {
        let result = [{ value: '%', label: 'No filter' }];
        if (this._families.data) {
            for (let family of this._families.data) {
                result.push({ value: family, label: family });
            }
        }
        return result;
    }

    handleSearchInputChange({ detail: { value } }) {
        this.searchString = value;
        this.loadProducts(
            this.searchString,
            this.selectedType,
            this.selectedFamily
        );
    }

    handleTypeChange({ target: { value } }) {
        this.selectedType = value;
        this.loadProducts(
            this.searchString,
            this.selectedType,
            this.selectedFamily
        );
    }

    handleFamilyChange({ target: { value } }) {
        this.selectedFamily = value;
        this.loadProducts(
            this.searchString,
            this.selectedType,
            this.selectedFamily
        );
    }

    openDetails(event) {
        this.currentProductId = event.target.dataset.id;
        this.showDetailsModal = true;
    }

    closeDetails() {
        this.showDetailsModal = false;
    }

    openCart() {
        this.showCartModal = true;
    }

    closeCart() {
        this.showCartModal = false;
    }

    addProductToCart(event) {
        let productId = event.target.dataset.id;
        if (this.cart.some((e) => e.id === productId)) {
            this.cart.filter((e) => e.id === productId)[0].amount += 1;
        } else {
            this.cart.push({ id: productId, amount: 1 });
        }
        console.log(this.cart);
        this.showNotification('Success', 'Product added to cart', 'success');
    }

    clearCart() {
        this.cart = [];
        this.closeCart();
    }

    openCreateProductModal() {
        this.showCreateProductModal = true;
    }

    closeCreateProductModal() {
        this.showCreateProductModal = false;
    }

    showNotification(title, message, variant = 'info') {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

    connectedCallback() {
        this.loadProducts(
            this.searchString,
            this.selectedType,
            this.selectedFamily
        );
    }

    async loadProducts(searchString, selectedType, selectedFamily) {
        const result = await getProducts({
            searchString,
            selectedType,
            selectedFamily
        });
        this.products = result.products;
    }
}
