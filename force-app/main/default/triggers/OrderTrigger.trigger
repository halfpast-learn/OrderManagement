trigger OrderTrigger on Order__c(after insert, before update) {
    if (Trigger.isBefore) {
        if (Trigger.isUpdate) {
            OrderTriggerHandler.onBeforeUpdate(Trigger.NewMap);
        }
    }
}
