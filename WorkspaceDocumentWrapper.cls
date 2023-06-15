/*
Class Name : WorkspaceDocumentWrapper
Created By : Shiva Shankar
Created date : 21-04-2023
Description: Using wrapper class in contentworkspace having a two libraries Java And Salesforce send all details of those two libraries into a JS
Last Modifyed Date : 24-04-2023
*/

//created a wrapper class 
public class WorkspaceDocumentWrapper {
    @AuraEnabled public String workspaceName {get;set;}
    @AuraEnabled public String paragraph {get;set;}
    @AuraEnabled public List<DocumentWrapper> documents {get;set;}
    //here passsing the LIbraries Name ,paragragh and files stroing 
    public WorkspaceDocumentWrapper(String workspaceName, String paragraph, List<DocumentWrapper> documents) {
        this.workspaceName = workspaceName;
        this.documents = documents;
        this.paragraph = paragraph;
    }
    
    public class DocumentWrapper {
        @AuraEnabled public String id {get;set;}
        @AuraEnabled public String title {get;set;}
        @AuraEnabled public String fileType {get;set;}
        @AuraEnabled public String lastModifiedDate {get;set;}
        
        public DocumentWrapper(String id, String title, String fileType, String lastModifiedDate) {
            this.id = id;
            this.title = title;
            this.fileType = fileType;
            this.lastModifiedDate = lastModifiedDate;
        }
    }
    // this method contains send the files of an a salesforce,java and paragraph 
    @AuraEnabled(cacheable=true)
    public static List<WorkspaceDocumentWrapper> getFiles() {  
        //creating a one object WorkspaceDocumentWrapper for storing all data into that object 
        List<WorkspaceDocumentWrapper> workspaceDocuments = new List<WorkspaceDocumentWrapper>(); 
        //fetching the libraries names
        List<ContentWorkspace> workspaces = [SELECT Id, Name FROM ContentWorkspace WHERE Name IN ('Salesforce', 'Java', 'JavaScript', 'MuleSoft')];
       
        for(ContentWorkspace workspace : workspaces) {
            //here fetching all the details of an a documents like title and ids 
            List<ContentWorkspaceDoc> documents = [SELECT ContentDocument.Id, ContentDocument.Title, ContentDocument.FileType, ContentDocument.LastModifiedDate
                                                   FROM ContentWorkspaceDoc WHERE ContentWorkspaceId = :workspace.Id];
            System.debug('documents========'+documents);
            String paragraph = '';
            if (workspace.Name == 'Salesforce') {
                paragraph = 'Salesforce is the customer company. We make cloud-based software designed to help businesses connect to their customers in a whole new way, so they can find more prospects, close more deals, and wow customers with amazing service.Customer 360, our complete suite of products, unites your sales, service, marketing, commerce.';
            } else if (workspace.Name == 'Java') {
                paragraph = 'Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible. It is intended to let application developers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation.';
            } else if (workspace.Name == 'JavaScript') {
                paragraph = 'JavaScript is a lightweight, interpreted programming language. It is designed for creating network-centric applications. It is complimentary to and integrated with Java. JavaScript is very easy to implement because it is integrated with HTML. It is open and cross-platform.';
            } else if (workspace.Name == 'MuleSoft') {
                paragraph = 'Mule ESB is a lightweight and highly scalable Java-based enterprise service bus (ESB) and integration platform provided by MuleSoft. Mule ESB allows developer to connect applications easily and quickly. Regardless of various technologies used by applications, Mule ESB enables easy integration of applications, enabling them to exchange data.';
            }
            //adding all the details into workspaceDocuments , LIbraries Names , paragraph and all documents 
            workspaceDocuments.add(new WorkspaceDocumentWrapper(workspace.Name, paragraph, getDocumentWrappers(documents)));
        }
        System.debug('workspaceDocuments---------'+workspaceDocuments);
        return workspaceDocuments;
    }
    // here this method contains fetching all the files of an a libraries 
    private static List<DocumentWrapper> getDocumentWrappers(List<ContentWorkspaceDoc> documents) {
        //created a one object and storing all files into that object
        List<DocumentWrapper> documentWrappers = new List<DocumentWrapper>();
        
        for(ContentWorkspaceDoc doc : documents) {
            documentWrappers.add(new DocumentWrapper(doc.ContentDocument.Id, doc.ContentDocument.Title, doc.ContentDocument.FileType, doc.ContentDocument.LastModifiedDate.format()));
        }
        System.debug('documentWrappers----------'+documentWrappers);
        return documentWrappers;
    }
}
