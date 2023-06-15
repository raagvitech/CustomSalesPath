/*
Class Name : GenerateOTP
Created By : PavanKumar
Created date : 21-04-2023
Description: I have received data flows from Apex using Invocable Method generate OTP in Currrent User email and received OTP from email enter that OTP value in OTP Verification
Last Modifyed Date : 25-04-2023
*/
public with sharing class GenerateOTP {

    @InvocableMethod (label = 'Send Otp Flow' description = 'send Otp')
    public static void otpFromFlow(List<FlowInputs> request) {
        System.debug('request======='+request);
        String otps = request[0].otps;
        String emails = request[0].emails;
        String firstName = request[0].firstName;
        // Retrieve the email template based on the developer name
        EmailTemplate template = [SELECT Id, Name, DeveloperName, Subject, Body FROM EmailTemplate 
                                                                WHERE DeveloperName ='Email_SendOtp'];
        String htmlSubject = template.Subject.replace('{!Contact.Name}', firstName);
        System.debug('=======htmlSubject=========='+ htmlSubject);
        String htmlBody = template.Body.replace('{!Otp}', otps);
        System.debug('=======htmlBody=========='+ htmlBody);

        OrgWideEmailAddress org = [SELECT Id, Address FROM OrgWideEmailAddress where DisplayName = 'VerificationCode'];
       
        Messaging.Singleemailmessage email = new Messaging.Singleemailmessage();
        email.setOrgWideEmailAddressId(org.Id);
        email.setToAddresses(new List<String>{emails});
        email.setSubject(htmlSubject);
        email.setHtmlBody(htmlBody);
        System.debug('=======email=========='+email);
        // Send the email message
        Messaging.SendEmailResult[] results = Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{email});
        // Check if the email was sent successfully
        if (results[0].isSuccess()) {
            System.debug('Email sent successfully');
        } else {
            System.debug('Failed to send email: ' + results[0].getErrors()[0].getMessage());
        }  
    }

    public class FlowInputs {
        @InvocableVariable public String otps;
        @InvocableVariable public String emails;
        @InvocableVariable public String firstName;
    }
    
    @AuraEnabled
    public static String verifyOtp(String otp) {
        System.debug('otp====='+otp);
        String userId = UserInfo.getUserId();
        User currentUser = [SELECT Id, Name, OTPs__c FROM User WHERE Id = :userId];
        System.debug('currentUser======='+ currentUser);
        if (currentUser != null && currentUser.OTPs__c.equals(otp)) {
            System.debug('OTP matched with current user record: ' + currentUser.Id);
            currentUser.OTPs__c = '';
            Update currentUser;
            return 'Verified';   
        } else {
            System.debug('OTP not found in current user record');
            return 'Please Enter Valid OTP';
        }
    }
    
    @AuraEnabled
    public static Integer getUser(String usrId) {
        System.debug('usrId======='+usrId);
        User usr = [SELECT Id, Name, PathNum__c FROM User WHERE Id = :usrId];
        Integer num = Integer.valueOf(usr.PathNum__c);
        System.debug('usr======='+usr);
        return num;
    }

    @AuraEnabled
    public static Integer userUpdate(Integer num) {
        System.debug('num------>'+num);
        User usrUpdat = [SELECT Id, Name, PathNum__c FROM User WHERE Id = :UserInfo.getUserId()];
        System.debug('usrUpdat====1==='+usrUpdat);
        usrUpdat.PathNum__c = num;
        Update usrUpdat;
        System.debug('usrUpdate====11==='+usrUpdat.PathNum__c);
        Integer numTwo = Integer.valueOf(usrUpdat.PathNum__c);
        return numTwo;
    }

    @AuraEnabled
    public static Integer getusrpathStepNum(String usrsId) {
        System.debug('usrsId======='+usrsId);
        User usrs = [SELECT Id, Name, PathStepNum__c FROM User WHERE Id = :usrsId];
        Integer num1 = Integer.valueOf(usrs.PathStepNum__c);
        System.debug('users======='+usrs);
        return num1;
    }

    @AuraEnabled
    public static Integer userpathStepNum(Integer num1) {
        System.debug('num1------>'+num1);
        User usrUpdat = [SELECT Id, Name, PathStepNum__c FROM User WHERE Id = :UserInfo.getUserId()];
        System.debug('usrUpdat===2===='+usrUpdat);
        usrUpdat.PathStepNum__c = num1;
        Update usrUpdat;
        System.debug('usrUpdate====22==='+usrUpdat.PathStepNum__c);
        Integer numTwo = Integer.valueOf(usrUpdat.PathStepNum__c);
        return numTwo;
    }

}