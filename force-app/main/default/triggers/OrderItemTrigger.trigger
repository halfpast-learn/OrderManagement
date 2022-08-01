trigger OrderItemTrigger on OrderItem__c(before insert) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            OrderItemTriggerHandler.onBeforeInsert(Trigger.New);
        }
    }
}
