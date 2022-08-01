public with sharing class OrderTriggerHandler {
    public static void onBeforeUpdate(List<Order__c> orders) {
        updateTotals(orders);
    }
    static void updateTotals(List<Order__c> ordersList) {
        Map<Id, Order__c> orders = new Map<Id, Order__c>();
        for (Order__c order : ordersList) {
            orders.put(order.Id, order);
        }
        Set<Id> ids = orders.keySet();
        List<OrderItem__c> orderItems = new List<OrderItem__c>(
            [
                SELECT Id, Price__c, Quantity__c, OrderId__c
                FROM OrderItem__c
                WHERE OrderId__c IN :ids
            ]
        );

        Map<Id, List<OrderItem__c>> result = new Map<Id, List<OrderItem__c>>();
        for (OrderItem__c orderItem : orderItems) {
            if (!result.ContainsKey(orderItem.OrderId__c)) {
                result.put(orderItem.OrderId__c, new List<OrderItem__c>());
            }
            result.get(orderItem.OrderId__c).add(orderItem);
        }

        for (Id id : result.keySet()) {
            orders.get(id).TotalPrice__c = 0;
            orders.get(id).TotalProductCount__c = 0;
            for (OrderItem__c orderItem : result.get(id)) {
                orders.get(id).TotalPrice__c +=
                    orderItem.Price__c * orderItem.Quantity__c;
                orders.get(id).TotalProductCount__c += orderItem.Quantity__c;
                system.debug(
                    'total price: ' +
                    String.valueOf(orders.get(id).TotalPrice__c)
                );
            }
        }
    }
}
