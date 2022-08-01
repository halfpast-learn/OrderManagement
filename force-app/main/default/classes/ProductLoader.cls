public with sharing class ProductLoader {
    @AuraEnabled
    public static ResultWrapper getProducts(
        String searchString,
        String selectedType,
        String selectedFamily
    ) {
        searchString = searchString == null ? '%' : '%' + searchString + '%';
        selectedType = selectedType == null ? '%' : selectedType;
        selectedFamily = selectedFamily == null ? '%' : selectedFamily;
        return new ResultWrapper(searchString, selectedType, selectedFamily);
    }

    @AuraEnabled(Cacheable=true)
    public static List<String> getTypePicklistValues() {
        SObjectField typeField = SObjectType.Product__c.fields.Type__c.getSObjectField();
        List<PicklistEntry> entries = typeField.getDescribe()
            .getPicklistValues();

        List<String> entryValues = new List<String>();
        for (PicklistEntry entry : entries) {
            entryValues.add(entry.getValue());
        }
        return entryValues;
    }

    @AuraEnabled(Cacheable=true)
    public static List<String> getFamilyPicklistValues() {
        SObjectField familyField = SObjectType.Product__c.fields.Family__c.getSObjectField();
        List<PicklistEntry> entries = familyField.getDescribe()
            .getPicklistValues();

        List<String> entryValues = new List<String>();
        for (PicklistEntry entry : entries) {
            entryValues.add(entry.getValue());
        }
        return entryValues;
    }

    @AuraEnabled(Cacheable=true)
    public static List<Product__c> getProductsById(List<String> ids) {
        return [
            SELECT Id, Name, Type__c, Family__c, Price__c
            FROM Product__c
            WHERE Id IN :ids
        ];
    }

    public class ResultWrapper {
        @AuraEnabled
        public List<Product__c> products;

        public ResultWrapper(
            String searchString,
            String selectedType,
            String selectedFamily
        ) {
            this.products = [
                SELECT Id, Name, Description__c, Type__c, Family__c
                FROM Product__c
                WHERE
                    (Name LIKE :searchString
                    OR Description__c LIKE :searchString)
                    AND Type__c LIKE :selectedType
                    AND Family__c LIKE :selectedFamily
            ];
        }
    }
}
