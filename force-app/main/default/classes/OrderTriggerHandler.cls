public with sharing class OrderTriggerHandler {
    public static void onBeforeUpdate(Map<Id, Order__c> ordersMap) {
        updateTotals(ordersMap);
    }
    static void updateTotals(Map<Id, Order__c> ordersMap) {
        // get related orderItems
        Set<Id> ids = ordersMap.keySet();
        List<OrderItem__c> orderItems = new List<OrderItem__c>(
            [
                SELECT Id, Price__c, Quantity__c, OrderId__c
                FROM OrderItem__c
                WHERE OrderId__c IN :ids
            ]
        );

        // populate order-orderItems map
        Map<Id, List<OrderItem__c>> result = new Map<Id, List<OrderItem__c>>();
        for (OrderItem__c orderItem : orderItems) {
            if (!result.ContainsKey(orderItem.OrderId__c)) {
                result.put(orderItem.OrderId__c, new List<OrderItem__c>());
            }
            result.get(orderItem.OrderId__c).add(orderItem);
        }

        // calculate totals
        for (Id id : result.keySet()) {
            ordersMap.get(id).TotalPrice__c = 0;
            ordersMap.get(id).TotalProductCount__c = 0;
            for (OrderItem__c orderItem : result.get(id)) {
                ordersMap.get(id).TotalPrice__c +=
                    orderItem.Price__c * orderItem.Quantity__c;
                ordersMap.get(id).TotalProductCount__c += orderItem.Quantity__c;
            }
        }
    }
}
