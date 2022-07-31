import { LightningElement } from 'lwc';

export default class ProductCartModalWindow extends LightningElement {
    hideModal() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }
}
