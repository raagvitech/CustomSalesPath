/*
Class Name : CreateCaseAndTaskScheduler
Created By : Shiva Shankar
Created date : 17-04-2023
Description: To run schedule JOb in every half an hour, when case status should be open and the queue is mentors then only this class will run
Last Modifyed Date : 18-04-2023
*/
global class CreateCaseAndTaskScheduler implements Schedulable, Database.Batchable<sObject> {
    List<Case> openCases;    
    global void execute(SchedulableContext sc) {
        openCases = [SELECT Id, Status, OwnerId, Owner.Type 
                     FROM Case 
                     WHERE Status = 'Open' AND Owner.Type = 'Queue' AND Owner.Name = 'Mentors'];     
        
        if (openCases.size() > 0) {
            Database.executeBatch(this);
        }
    }  
    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Status, OwnerId, Owner.Type 
                                         FROM Case 
                                         WHERE Status = 'Open' AND Owner.Type = 'Queue' AND Owner.Name = 'Mentors']);
    } 
    global void execute(Database.BatchableContext bc, List<Case> scope) {
        Group supportGroup = [SELECT Id 
                              FROM Group 
                              WHERE Type = 'Queue' AND Name = 'Support' LIMIT 1];        
        List<Task> tasksToCreate = new List<Task>();  
        for (Case c : scope) {
            Task t = new Task();
            t.WhatId = c.Id;
            t.OwnerId = supportGroup.Id;
            tasksToCreate.add(t); 
            c.Status = 'Closed';
            c.OwnerId = supportGroup.Id;
        }        
        if (tasksToCreate.size() > 0) {
            insert tasksToCreate;
        }       
        if (scope.size() > 0) {
            update scope;
        }
    }    
    global void finish(Database.BatchableContext bc) {       
    }
}