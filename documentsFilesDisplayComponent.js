import { LightningElement,track,wire,api } from 'lwc';
import getFiles from '@salesforce/apex/WorkspaceDocumentWrapper.getFiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
export default class DocumentsFilesDisplayComponent extends NavigationMixin(LightningElement) {

    @track workspaceDocuments;
    @track JavaQuestionsList=false;
    @track salesforceQuestions=false;
    @track javaScriptQuestionsList = false;
    @track muleSoftQuestionsList = false;
    @api   submittedTitles= [];
    @track data =[];
    @track questions = [
        {
            question: "1. What is Salesforce?",
            options: [" An RCM system", " A Chrome extension"," A CRM system",  " An app on your laptop"],
            answer: " A CRM system"
        },
        {
            question: "2. What type of objects are included with Salesforce?",
            options: [" Custom Objects"," Standard Objects"," Basic Objects", " Functional Objects"],
            answer: " Standard Objects"
        },
        {
            question: "3. How many reports and dashboards can you subscribe to in total?",
            options: [" Five", " Four", " Three", " Two"],
            answer: " Five"
        }
    ];
    @track javaQuestions=[
        {
            question:"1. Which of these are selection statements in Java?",
            options:[" Continue()"," break()"," for()"," if()"],
            answer: " if()"
        },
        {
            question: "2. Identify the modifier which cannot be used for constructor",
            options: [" Private"," Static"," Public", " protected"],
            answer: " Static"
        },
        {
            question: "3. What is the size of float and double in java?",
            options: [" 32 And 64", " 64 And 64", " 32 And 32", " 64 And 32"],
            answer: " 32 And 64"
        },

    ];


    @track javaScriptQuestions=[
        {
            question:"1.Which type of JavaScript language is ___",
            options:[" Object-Oriented"," Object-Based"," Assembly-language"," High-level"],
            answer: " Object-Based"
        },
        {
            question: "2. The function and var are known as:",
            options: [" Keywords"," Data types"," Declaration statements", " Prototypes"],
            answer: " Declaration statements"
        },
        {
            question: "3. Which one of the following is the correct way for calling the JavaScript code?",
            options: [" Preprocessor", " Triggering Event", " RMI", " Function/Method"],
            answer: " Function/Method"
        },

    ];

    @track muleSoftQuestions=[
        {
            question:"1. What MuleSoft API-led connectivity layer is intended to expose part of a backend database without business logic?",
            options:[" Data"," System"," Process"," Experience"],
            answer: " System"
        },
        {
            question: "2. What DataWeave 2.0 type can be used as input to a map operation?",
            options: [" Object"," Array"," String", " Map"],
            answer: " Array"
        },
        {
            question: "3. Which keyword do you use to create a new function in DataWeave?",
            options: [" function", " fun", " func", " None of these"],
            answer: " fun"
        },

    ]

  
    @track customFormModal = false; 
    customHideModalPopup() {     
        this.customFormModal = false;
    }

    @track selectId;
    @track targetname;

    customShowModalPopup(event) { 
        this.customFormModal = true;
        this.targetname=event.target.value;
        this.selectId=event.target.dataset.id;
        console.log('targetname------------',this.targetname);

        console.log('value------------',this.selectId); 
        if( this.targetname == 'Salesforce')  {
            console.log('i am in salesforceQuestions');
           this.salesforceQuestions=true; 
           this.JavaQuestionsList=false;
           this.javaScriptQuestionsList = false;
           this.muleSoftQuestionsList = false;
        } 
        else if(this.targetname == 'Java') {
            console.log('i am in java questions');
            this.salesforceQuestions=false;
            this.JavaQuestionsList=true;
            this.javaScriptQuestionsList = false;
            this.muleSoftQuestionsList = false;
        }   
        else if(this.targetname == 'JavaScript') {
            console.log('i am in javaScript questions');
            this.salesforceQuestions=false;
            this.JavaQuestionsList=false;
            this.javaScriptQuestionsList = true;
            this.muleSoftQuestionsList= false;
        }   
        else if(this.targetname == 'MuleSoft') {
            console.log('i am in MuleSoft questions');
            this.salesforceQuestions=false;
            this.JavaQuestionsList=false;
            this.javaScriptQuestionsList = false;
            this.muleSoftQuestionsList = true;
        }    
    }

    previewHandler(event){
        console.log(event.target.dataset.id)
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes:{ 
                pageName:'filePreview'
            },
            state:{ 
                selectedRecordId: event.target.dataset.id
            }
        })
    }

    @wire(getFiles)
    wiredGetFiles({data , error}) {
        if (data) {
            console.log("+++++data++++", JSON.stringify(data));
            this.workspaceDocuments = data;
            this.data=this.workspaceDocuments;
            console.log('workspaceDocuments: ', JSON.stringify(this.workspaceDocuments));
            console.log('data: ', JSON.stringify(this.workspaceDocuments));
        } else if (error) {
            console.error(error);
        }
    }

    //user select the questions and ans 
    @track selectedAnswers = {};
    handleChange(event) {
        let question = event.target.name;
        let answer = event.target.value;
        this.selectedAnswers[question] = answer;
    }

    @api submittedIds = [];

    handelOnClick() {
        console.log('i am in a handle on click');
        console.log('selectId===========',this.selectId);
        console.log('targetname-----------',this.targetname);
        let correctAnswers = 0;
        if(this.targetname == 'Salesforce') { 
            console.log(' i am in a salesforce of if');
            for (let i = 0; i < this.questions.length; i++) {
                let question = this.questions[i];
                if (this.selectedAnswers[question.question] === question.answer) {
                    correctAnswers++;
                }
            }
            
        }
        else if(this.targetname == 'Java') {
            console.log(' i am in a java of else if');
            for (let i = 0; i < this.javaQuestions.length; i++) {
                let question = this.javaQuestions[i];
                if (this.selectedAnswers[question.question] === question.answer) {
                    correctAnswers++;
                }
            }       
        }
        else if(this.targetname == 'JavaScript') {
            console.log(' i am in a JavaScript of else if');
            for (let i = 0; i < this.javaScriptQuestions.length; i++) {
                let question = this.javaScriptQuestions[i];
                if (this.selectedAnswers[question.question] === question.answer) {
                    correctAnswers++;
                }
            }       
        }
        else if(this.targetname == 'MuleSoft') {
            console.log(' i am in a MuleSoft of else if');
            for (let i = 0; i < this.muleSoftQuestions.length; i++) {
                let question = this.muleSoftQuestions[i];
                if (this.selectedAnswers[question.question] === question.answer) {
                    correctAnswers++;
                }
            }       
        }

        console.log('correct answers',correctAnswers);
        if(correctAnswers <= 1) {
            console.log('i am in a log of wrong anserws ');
            const myDemoEvent = new CustomEvent('helpevent');
            this.dispatchEvent(myDemoEvent);
            const toastEvent = new ShowToastEvent({
                title: 'Incorrect Answers',
                message: 'You got ' + correctAnswers + ' out of ' + this.questions.length + ' questions correct!',
                variant: 'error',
            });
            this.dispatchEvent(toastEvent);
            this.customFormModal = false;
        }

        else if (correctAnswers > 1) {
            console.log('i am in a inside if');
            this.submittedIds.push(this.selectId);

            for (let id of this.submittedIds) {
                const documentObj = this.data.find(item => item.documents.some(doc => doc.id === id));
                if (documentObj) {
                    const title = documentObj.documents.find(doc => doc.id === id)?.title;
                    if (title) {
                        this.submittedTitles.push(title);
                    }
                }
            }
            console.log('submittedTitles============='+this.submittedTitles);
            console.log('ids =============='+this.submittedIds);
            const myDataEvent = new CustomEvent('dataevent', {
                detail: {
                    titles: this.submittedTitles,
                    ids: this.submittedIds,
                    targetname: this.targetname,
                }
            });
            this.dispatchEvent(myDataEvent);

            const toastEvent = new ShowToastEvent({
                title: 'correct Answers',
                message: 'You got ' + correctAnswers + ' out of ' + this.questions.length + ' questions correct!',
                variant: 'Success',
            });
            this.dispatchEvent(toastEvent);
            this.customFormModal = false;
                
        }
    }
}