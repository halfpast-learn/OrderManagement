import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import NAME_FIELD from '@salesforce/schema/Account.Name'
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber'
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

export default class OrderManagement extends LightningElement {
    recordId;
    error;

    @wire(CurrentPageReference)
    handleResult({state}) {
        if (state) {
            this.recordId = state.c__recordId;
        }
        else {
            error = 'error';
        }
    };
    
    @wire(getRecord, {recordId:"$recordId", fields:[NAME_FIELD, ACCOUNT_NUMBER_FIELD]})
    account;

    get name() {
        return getFieldValue(this.account.data, NAME_FIELD);
    }
    get number() {
        return getFieldValue(this.account.data, ACCOUNT_NUMBER_FIELD);
    }

    get hasAccountData() {
        return this.account && this.account.data;
    }
}