import { LightningElement,track } from 'lwc';
import verifyOtp from '@salesforce/apex/GenerateOTP.verifyOtp';
export default class OtpVerification extends LightningElement {
    
    @track isShowModal = false;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

    @track otp;
    @track textMessageTrue=false;

    handleOtpChange(event) {
        this.otp = event.target.value;
        console.log('otp===',this.otp);
    }

    handleVerify(event) {
        verifyOtp({otp: this.otp})
        .then(result => {
            if(result=='Verified') {
                this.textMessageTrue = false;
                this.isShowModal = false;
                const myDemoEvent = new CustomEvent('demoevent');
                this.dispatchEvent(myDemoEvent);
            } else {
                this.textMessageTrue = true;
                this.isShowModal = true;
            }
            
        })
        .catch(error => {
            console.error('error===',JSON.stringify(error));
        });
    }
    
}