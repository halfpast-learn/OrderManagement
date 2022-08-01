trigger OrderTrigger on Order__c(before insert, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            OrderTriggerHandler.onBeforeInsert(Trigger.New);
        }
        if (Trigger.isUpdate) {
            OrderTriggerHandler.onBeforeUpdate(Trigger.New);
        }
    }
}
