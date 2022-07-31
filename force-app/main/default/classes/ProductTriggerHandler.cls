public with sharing class ProductTriggerHandler {
    public static void onAfterInsert(List<Product__c> products) {
        if (!System.isFuture() && !System.isBatch()) {
            List<String> productIds = new List<String>();
            for (Product__c product : products) {
                productIds.add(product.Id);
            }

            updateImages(productIds);
        }
    }
    public static void onAfterUpdate(List<Product__c> products) {
        if (!System.isFuture() && !System.isBatch()) {
            List<String> productIds = new List<String>();
            for (Product__c product : products) {
                productIds.add(product.Id);
            }

            updateImages(productIds);
        }
    }

    @future(callout=true)
    static void updateImages(List<String> ids) {
        List<Product__c> products = [
            SELECT Id, Name, Image__c
            FROM Product__c
            WHERE Id IN :ids
        ];
        for (Product__c product : products) {
            if (product.Image__c == '' || product.Image__c == null) {
                String imageURL = getImageURL(product.Name);
                product.Image__c = imageURL;
            }
        }
        update products;
    }

    static String getImageURL(String productName) {
        HttpRequest request = new HttpRequest();
        request.setEndpoint(
            'http://www.glyffix.com/api/Image?word=' + productName
        );
        request.setMethod('GET');

        Http http = new Http();
        HttpResponse response = http.send(request);

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(
            response.getBody()
        );
        List<Object> data = (List<Object>) result.get('data');
        Map<String, Object> entry = (Map<String, Object>) data[0];
        return (String) entry.get('imageurl');
    }
}
