@isTest
private class OrderTriggerTest {
    private class RestMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            String fullJson = '{"data":[{"id":1250, "imageurl":"testurl.com"}]}';

            HTTPResponse res = new HTTPResponse();
            res.setHeader('Content-Type', 'text/json');
            res.setBody(fullJson);
            res.setStatusCode(200);
            return res;
        }
    }
    @isTest
    static void TestOnBeforeUpdate() {
        Test.setMock(HttpCalloutMock.class, new RestMock());
        Product__c testProduct = new Product__c(
            Name = 'TestProduct',
            Description__c = 'TestProduct description',
            Type__c = 'Type 1',
            Family__c = 'Family 1',
            Price__c = 100
        );
        insert testProduct;

        Order__c order = new Order__c(Name = 'testOrder');
        insert order;

        OrderItem__c orderItem = new OrderItem__c(
            Name = 'test item',
            Quantity__c = 10,
            Price__c = 5,
            OrderId__c = order.id,
            ProductId__c = testProduct.Id
        );
        Test.startTest();
        insert orderItem;
        Test.stopTest();
        order = [
            SELECT Id, TotalPrice__c, TotalProductCount__c
            FROM Order__c
            WHERE Id = :order.Id
        ][0];
        system.assertEquals(
            orderItem.Quantity__c * orderItem.Price__c,
            order.TotalPrice__c
        );
        system.assertEquals(orderItem.Quantity__c, order.TotalProductCount__c);
    }
}
