public with sharing class OrderItemTriggerHandler {
    public static void onAfterInsert(List<OrderItem__c> orderItems) {
        updateRelatedOrders(orderItems);
    }
    static void updateRelatedOrders(List<OrderItem__c> orderItems) {
        List<Id> orderIds = new List<Id>();
        for (OrderItem__c orderItem : orderItems) {
            orderIds.add(orderItem.OrderId__c);
        }
        update [SELECT Id FROM Order__c WHERE Id IN :orderIds];
    }
}
