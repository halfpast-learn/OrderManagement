@isTest
private class ProductTriggerTest {
    private class RestMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            String fullJson = '{"success": true, "word": "test", "rowcount": 5, "data": [{"id": 3205,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/3205"},{"id": 4381,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/4381"},{"id": 4382,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/4382"},{"id": 5660,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/5660"},{"id": 7118,"imageurl": "http://www.glyffix.com/Image/ShowUploadedImage/7118"}],"errormessage": ""}';

            HTTPResponse res = new HTTPResponse();
            res.setHeader('Content-Type', 'text/json');
            res.setBody(fullJson);
            res.setStatusCode(200);
            return res;
        }
    }
    @isTest
    static void TestOnAfterUpdate() {
        Test.setMock(HttpCalloutMock.class, new RestMock());
        Product__c testProduct = new Product__c(
            Name = 'TestProduct',
            Description__c = 'TestProduct description',
            Type__c = 'Type 1',
            Family__c = 'Family 1',
            Price__c = 100,
            Image__c = ''
        );
        insert testProduct;
        testProduct.Image__c = '';
        Test.startTest();
        update testProduct;
        Test.stopTest();
        System.assertEquals(
            'http://www.glyffix.com/Image/ShowUploadedImage/3205',
            [SELECT Id, Image__c FROM Product__c WHERE Id = :testProduct.Id]
            .Image__c
        );
    }
}
