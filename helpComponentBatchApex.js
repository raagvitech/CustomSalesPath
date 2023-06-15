import { LightningElement,track } from 'lwc';
import createCase from '@salesforce/apex/CaseTaskScheduler.createCase';
export default class HelpComponentBatchApex extends LightningElement {

    @track subject;
    @track name;
    @track email;
    @track reason;
    @track details;
    @track isShowModal = false;
    @track showFeedbackForm=true;
    

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    get options() {
        return [
            { label: 'Installation', value: 'Installation' },
            { label: 'Equipment Complexity', value: 'Equipment Complexity' },
            { label: 'Performance', value: 'Performance' },
            { label: 'Breakdown', value: 'Breakdown' },
            { label: 'Equipment Design', value: 'Equipment Design' },
            { label: 'Feedback', value: 'Feedback' },
            { label: 'Other', value: 'Other' },

        ];
    }
    get saveButtonDisabled() {
        return !this.name || !this.email || !this.subject;
    }

    handleInputChange(event) {
        this[event.target.name] = event.target.value;
        console.log('hndle input -------',event.target.value);
        
    }

    handleSubmit() {
     
        createCase({
            subject: this.subject,
            name: this.name,
            email: this.email,
            reason:this.reason,
            details:this.details
            
        });
        this.isShowModal=false;
        console.log('contact',this.details);
        console.log('created'); 
        const myDemoEvent = new CustomEvent('helpevent');
        this.dispatchEvent(myDemoEvent);
    }
}