import { LightningElement, track ,wire} from 'lwc';
import createFeedback from '@salesforce/apex/AccordionHandler.createFeedback';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class FeedbackForm extends LightningElement {

    @track isShowModal = false;
    @track isDisabled = true;
    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    @track selectedRating;
  
    @track showFeedbackForm = true;
    @track showFeedbackSuccess = false;
    ratingOptions = [
        { label: 'Excellent', value: 'Excellent' },
        { label: 'Very Good', value: 'Very Good' },
        { label: 'Good', value: 'Good' },
        { label: 'Average', value: 'Average'},
        { label: 'Poor', value: 'Poor'},
    ];
    @track firstname;
    @track lastname;
    @track reason;
    @track suggestions;
    handleSubmit() {
        createFeedback({
            firstname: this.firstname,
            lastname: this.lastname,
            reason:this.reason,
            suggestions:this.suggestions
          
        });
            this.showFeedbackForm = false;
            this.showFeedbackSuccess = true;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Thank You For Your Responce!!',
                    message: 'thankYou!!',
                    variant: 'success'
               
            }));
            this.isShowModal=false;
            const myDemoEvent = new CustomEvent('feedbackevent');
            this.dispatchEvent(myDemoEvent);
        }
       
 
        get saveButtonDisabled() {
            return !(this.firstname && this.lastname && this.reason && this.suggestions);
        }
        
    handlechange(event){
        this[event.target.name] = event.target.value;
        console.log('hndle input -------',event.target.value);
    }
}