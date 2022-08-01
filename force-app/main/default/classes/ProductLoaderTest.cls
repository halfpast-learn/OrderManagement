@isTest
private class ProductLoaderTest {
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
    static void TestLoadProducts() {
        Test.setMock(HttpCalloutMock.class, new RestMock());
        Product__c testProduct = new Product__c(
            Name = 'TestProduct',
            Description__c = 'TestProduct description',
            Type__c = 'Type 1',
            Family__c = 'Family 1',
            Price__c = 100
        );
        insert testProduct;
        Test.startTest();
        ProductLoader.ResultWrapper productsWrapper = ProductLoader.getProducts(
            'TestProduct description',
            '%',
            '%'
        );
        Test.stopTest();
        System.assert(productsWrapper.products.size() == 1);
        System.assertEquals('TestProduct', productsWrapper.products[0].Name);
    }

    @isTest
    static void TestGetTypePicklistValues() {
        Test.startTest();
        List<String> result = ProductLoader.getTypePicklistValues();
        Test.stopTest();
        System.assert(result.size() > 0);
        System.assert(result.contains('Type 1'));
    }

    @isTest
    static void TestGetFamilyPicklistValues() {
        Test.startTest();
        List<String> result = ProductLoader.getFamilyPicklistValues();
        Test.stopTest();
        System.assert(result.size() > 0);
        System.assert(result.contains('Family 1'));
    }

    @isTest
    static void TestGetProductsById() {
        Test.setMock(HttpCalloutMock.class, new RestMock());
        Product__c testProduct = new Product__c(
            Name = 'TestProduct',
            Description__c = 'TestProduct description',
            Type__c = 'Type 1',
            Family__c = 'Family 1',
            Price__c = 100
        );
        insert testProduct;
        List<String> ids = new List<String>();
        ids.add(String.valueOf(testProduct.Id));
        Test.startTest();
        List<Product__c> result = ProductLoader.getProductsById(ids);
        Test.stopTest();
        System.assert(result.size() == 1);
        System.assertEquals(testProduct.Name, result[0].Name);
    }
}
