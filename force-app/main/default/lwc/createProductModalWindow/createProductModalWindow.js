import { LightningElement } from 'lwc';

import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateProductModalWindow extends LightningElement {
    name;
    description;
    type;
    family;
    price;
    image;

    handleNameChange({ target: { value } }) {
        this.name = value;
    }

    handleDescriptionChange({ target: { value } }) {
        this.description = value;
    }

    handleTypeChange({ target: { value } }) {
        this.type = value;
    }

    handleFamilyChange({ target: { value } }) {
        this.family = value;
    }

    handlePriceChange({ target: { value } }) {
        this.price = value;
    }

    handleImageChange({ target: { value } }) {
        this.image = value;
    }

    createProduct() {
        let fields = {
            Name: this.name,
            Description__c: this.description,
            Type__c: this.type,
            Family__c: this.family,
            Price__c: this.price,
            Image__c: this.image
        };
        let objectRecordDetails = { apiName: 'Product__c', fields };
        createRecord(objectRecordDetails)
            .then(() => {
                this.showNotification('Success', 'Product created', 'Success');
                this.hideModal();
            })
            .catch((error) => {
                this.showNotification('Error', error, 'Error');
                this.hideModal();
            });
    }

    hideModal() {
        this.dispatchEvent(new CustomEvent('closecreateproduct'));
    }

    showNotification(title, message, variant = 'info') {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}
