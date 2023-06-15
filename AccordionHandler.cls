/*
Class Name : AccordionHandler
Created By : Shiva Shankar
Created date : 12-04-2023
Description: this class contains insert record into Feedback__c object 
Last Modifyed Date : 24-04-2023
*/
public with sharing class AccordionHandler {
    
    // This method creates a new record in the Feedback__c object and sends an automatic response email
    @AuraEnabled
    public static void createFeedback(String firstname, String lastname, String reason, String suggestions) {
        String userId = UserInfo.getUserId();
        User currentUser = [SELECT Id, Name, Email FROM User WHERE Id = :userId];
        
        Feedback__c newFeedback = new Feedback__c();
        newFeedback.Name = firstname+lastname;
        newFeedback.Feedback_Rating__c = reason;
        newFeedback.Suggestions__c = suggestions;
        insert newFeedback;
        
        sendAutoResponseEmail(currentUser.Email, firstname);
        System.debug('currentUser.Email========='+currentUser.Email);
        System.debug('firstname.firstname========='+firstname);

        System.debug('insert====' + newFeedback);
    }
    
    // This method sends an automatic response email
    public static void sendAutoResponseEmail(String recipientEmail, String recipientName) {
        OrgWideEmailAddress org = [SELECT Id, Address FROM OrgWideEmailAddress where DisplayName = 'Feedback CustomSalesPath'];

        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setOrgWideEmailAddressId(org.Id);
        email.setToAddresses(new List<String>{ recipientEmail });
        System.debug('setToAddresses============'+recipientEmail);
        email.setSubject('Thanks for your valuable feedback');
        email.setPlainTextBody('Dear ' + recipientName + ',\n\nThanks for your valuable feedback. \nWe appreciate your input and will take it into consideration.');
        Messaging.SendEmailResult[] results = Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ email });
        System.debug('results------------'+email);
        if (results[0].isSuccess()) {
            System.debug('Email sent successfully.');
        } else {
            System.debug('Failed to send  email: ' + results[0].getErrors()[0].getMessage());
        }
    }
}