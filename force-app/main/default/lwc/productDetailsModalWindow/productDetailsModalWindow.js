import { LightningElement, api } from 'lwc';

export default class ProductDetailsModalWindow extends LightningElement {
    @api recordId;

    hideModal() {
        this.dispatchEvent(new CustomEvent('closedetails'));
    }
}
