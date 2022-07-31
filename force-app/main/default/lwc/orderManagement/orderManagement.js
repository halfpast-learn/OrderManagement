import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

import getProducts from '@salesforce/apex/ProductLoader.getProducts';
import getTypePicklistValues from '@salesforce/apex/ProductLoader.getTypePicklistValues';
import getFamilyPicklistValues from '@salesforce/apex/ProductLoader.getFamilyPicklistValues';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber';

export default class OrderManagement extends LightningElement {
    recordId;
    error;

    searchString;
    selectedType = '%';
    selectedFamily = '%';

    products;

    @wire(CurrentPageReference)
    handleResult({ state }) {
        if (state) {
            this.recordId = state.c__recordId;
        } else {
            this.error = 'error';
        }
    }

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [NAME_FIELD, ACCOUNT_NUMBER_FIELD]
    })
    account;

    @wire(getFamilyPicklistValues)
    _families;

    @wire(getTypePicklistValues)
    _types;

    get name() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }
    get number() {
        return getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD);
    }
    get hasAccountData() {
        return this.account && this.account.data;
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

    handleInputChange({ detail: { value } }) {
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
