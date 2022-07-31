trigger ProductTrigger on Product__c(after insert, after update) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            ProductTriggerHandler.onAfterInsert(Trigger.New);
        } else if (Trigger.isUpdate) {
            ProductTriggerHandler.onAfterUpdate(Trigger.New);
        }
    }
}
