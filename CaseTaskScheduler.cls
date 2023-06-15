/*
Class Name : CaseTaskScheduler
Created By : Shiva Shankar
Created date : 16-04-2023
Description: once Help component insert a record into a database that time case should be create,case status should be open and Queue should be mentors
Last Modifyed Date : 16-04-2023
*/
global class CaseTaskScheduler{
    // this method contains a insert operation , and case status should be open and Queue should be mentors
    @AuraEnabled
    global static void createCase(String subject, String name, String email,String reason,String details) {
        // Create a new case record
        Group supportGroup = [SELECT Id,Name FROM Group WHERE Type ='Queue' AND Name = 'Mentors' LIMIT 1];
        Case newCase = new Case();
        newCase.Reason=reason;
        newCase.Subject = subject;
        newCase.SuppliedName = name;
        newCase.SuppliedEmail = email;
        newCase.Description=details;
        newCase.Status = 'Open';
        newCase.OwnerId = supportGroup.Id;
        insert newCase;
        System.debug(newcase+'-----------new case');
    }
}