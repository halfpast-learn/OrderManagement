trigger OrderItemTrigger on OrderItem__c(after insert) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            OrderItemTriggerHandler.onAfterInsert(Trigger.New);
        }
    }
}
