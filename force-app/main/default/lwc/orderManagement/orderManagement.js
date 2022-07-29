import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import NAME_FIELD from '@salesforce/schema/Account.Name'
import ACCOUNT_NUMBER_FIELD from '@salesforce/schema/Account.AccountNumber'
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';

export default class OrderManagement extends LightningElement {
    recordId;
    error;
    products=[{Name:'test name', Description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus luctus nulla vel consectetur. Mauris blandit dignissim libero. In sollicitudin lectus id felis scelerisque eleifend. Aliquam tortor elit, lobortis sed condimentum ac, porta bibendum mauris. Vestibulum id iaculis ex. Fusce pharetra ullamcorper ante, eget tempus mi efficitur vitae. Vivamus tempor nisl id sem maximus aliquam.'}, {Name:'test name2', Description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus luctus nulla vel consectetur. Mauris blandit dignissim libero. In sollicitudin lectus id felis scelerisque eleifend. Aliquam tortor elit, lobortis sed condimentum ac, porta bibendum mauris. Vestibulum id iaculis ex. Fusce pharetra ullamcorper ante, eget tempus mi efficitur vitae. Vivamus tempor nisl id sem maximus aliquam.'}];
    types=[{id:'type1', Name:'type1'}, {id:'type2', Name:'type2'}];
    families=[{id:'fam1', Name: 'fammmmmmmmmmmm1'}, {id:'fam2', Name:'fam2'}];
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