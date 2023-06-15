import { LightningElement,track,wire } from 'lwc';
import getUserPathCurrent from '@salesforce/apex/GenerateOTP.getUser';
import getUserPathCurrentUpdate from '@salesforce/apex/GenerateOTP.userUpdate';
import Id from '@salesforce/user/Id';
import getusrpathStepNum from '@salesforce/apex/GenerateOTP.getusrpathStepNum';
import userpathStepNum from '@salesforce/apex/GenerateOTP.userpathStepNum';

export default class CustomSalesPaths extends LightningElement {

    @track verifyOtp = false;
    @track tutorialPage = false;
    @track register = false;
    @track showDownload = false;
    @track helpComment=false;
    @track feedbackComponent=false;
    @track pathNum;
    @track pathNumUpdate;
    @track activeStep = 'Start';
    @track customFormModal = false;
    @track url ;
    @track uniqueTitles=[];
    @track submittedData = [];
    @track targetname=[];
    @track subData=[];
    @track StepNum;


    customShowModalPopup() {
        this.customFormModal = true;
    }
    customHideModalPopup()
    {
        this.customFormModal = false;
    }
    connectedCallback()
    {
        const storedData = localStorage.getItem('submittedData');
            if (storedData) {
                this.submittedData = JSON.parse(storedData);
                this.generateUniqueTitles();
            }
        this.pathMoveback();
        // localStorage.clear();
    }

    //return the current pathnum usr1
    getCurrentUserPathNum()
    {
        return new Promise((resolve, reject) => {
            getUserPathCurrent({ usrId: Id })
              .then(result => {
                this.pathNum = result;
                console.log('getCurrentUserPathNum ===>', JSON.stringify(result));
                resolve();
              })
              .catch(error => {
                console.log('error in getCurrentUserPathNum====>', JSON.stringify(error));
                reject(error);
              });
          });
    }

    // return the current pathStep usr2
    getCurrentUserPathStepNum()
    {
        return new Promise((resolve, reject) => {
            getusrpathStepNum({ usrsId: Id })
              .then(result => {
                this.StepNum = result;
                console.log('getCurrentUserPathStepNum ===>', JSON.stringify(result));
                resolve();
              })
              .catch(error => {
                console.log('error in getCurrentUserPathStepNum====>', JSON.stringify(error));
                reject(error);
              });
          });
    }

    //Update the current path value usr1
    userUpdateNum(num)
    {
        return new Promise((resolve, reject) => {
            getUserPathCurrentUpdate({num: num})
            .then(result => {
            console.log('result==userUpdate=',JSON.stringify(result));
            resolve();   
            })
            .catch(error => {
                console.error('error===',JSON.stringify(error));
                reject(error);
            });
        });
        
    }

    // Update the move path value usr2
    userpathUpdate(num4)
    {
        console.log('num4=====>',num4);
        return new Promise((resolve, reject) => {
            userpathStepNum({num1: num4})
            .then(result => {
            console.log('result==num4===>',JSON.stringify(result));
            resolve();   
            })
            .catch(error => {
                console.error('error===num4===>',JSON.stringify(error));
                reject(error);
            });
        });
    }

    // Once click button move to next path
    async pathIncovingFun() 
    {
        await this.getCurrentUserPathNum();
            console.log('getCurrentUserPathNum=======>',this.pathNum);
            const pathItems = this.template.querySelectorAll('.slds-path__item');
            for (let i = this.pathNum; i< pathItems.length; i++) {
                if (pathItems[i].classList.contains('slds-is-active') && pathItems[i + 1] && this.pathNum != 5) {
                    console.log('It Is In If In pathMoveFun');
                    pathItems[i].classList.remove('slds-is-active');
                    pathItems[i].classList.add('slds-is-complete');
                    pathItems[i + 1].classList.add('slds-is-active');
                    this.activeStep = pathItems[i + 1].querySelector('.slds-path__title').textContent;
                    if(this.activeStep == 'Verification')
                    {
                        localStorage.clear();
                        console.log('Clearing the loacal storgae In path Incoving method');
                    }
                    console.log('this.activeStep=====',this.activeStep);
                    console.log('this.activeStep=====',this.activeStep);
                    this.pathNumUpdate=i+1;
                    this.userUpdateNum(this.pathNumUpdate);
                    this.pathConditional(this.activeStep);

                    this.checkingtemplate(this.activeStep);
                }
                else if (pathItems[i].classList.contains('slds-is-active') && this.pathNum == 5)
                {
                    console.log('It Is In Else If In pathMoveFun');
                    pathItems[i].classList.remove('slds-is-active');
                    pathItems[i].classList.add('slds-is-complete');
                    this.activeStep = pathItems[i].querySelector('.slds-path__title').textContent;

                    this.tutorialPage=false;
                    this.register = true;
                    this.feedbackComponent=false;
                    this.showDownload=false;
                    this.helpComment=false;
                    this.verifyOtp = false;
                }
                break;
            }
            
    }
    // path move back based on stepNum
    async pathMoveback()
    {
        await this.getCurrentUserPathStepNum();
        console.log('stepNum=====>',this.StepNum);
        if(this.StepNum == 0)
        {
            await this.getCurrentUserPathNum();
                console.log('getCurrentUserPathNum=======>InConnectedCallBack====>',this.pathNum);
                const pathItems = this.template.querySelectorAll('.slds-path__item');
                for (let i = 1; i< pathItems.length; i++) {
                        if(i <= this.pathNum)
                        {
                            pathItems[this.pathNum-i].classList.remove('slds-is-active');
                            pathItems[this.pathNum-i].classList.add('slds-is-complete');
                            pathItems[this.pathNum].classList.add('slds-is-active');
                            this.activeStep = pathItems[this.pathNum].querySelector('.slds-path__title').textContent;
                            if(this.activeStep == 'Verification')
                            {
                                localStorage.clear();
                                console.log('Clearing the loacal storgae In path Move Back method');
                            }
                            console.log('this.activeStep=====',this.activeStep);
                            this.pathConditional(this.activeStep);
                        }    
                    }
                this.checkingtemplate(this.activeStep);
        }
        else if(this.StepNum == 2)
        {
            await this.getCurrentUserPathNum();
            console.log('step 2======>',this.pathNum);
            const pathItems = this.template.querySelectorAll('.slds-path__item');
                for (let i = 1; i< pathItems.length; i++) {
                        if(i <= this.pathNum)
                        {
                            pathItems[this.pathNum-i].classList.remove('slds-is-active');
                            pathItems[this.pathNum-i].classList.add('slds-is-complete');
                            pathItems[3].classList.remove('slds-is-active');
                            pathItems[3].classList.remove('slds-is-complete');
                            pathItems[4].classList.add('slds-is-active');
                            pathItems[this.StepNum].classList.add('slds-is-active');
                            pathItems[this.pathNum].classList.add('slds-is-active');
                            this.activeStep = pathItems[this.pathNum].querySelector('.slds-path__title').textContent;
                            console.log('this.activeStep=====',this.activeStep);
                            this.pathConditional(this.activeStep);
                        }    
                    }
                this.checkingtemplate(this.activeStep);
        }
        else if(this.StepNum == 3)
        {
            await this.getCurrentUserPathNum();
            console.log('step 3======>',this.pathNum);
            const pathItems = this.template.querySelectorAll('.slds-path__item');
                for (let i = 1; i< pathItems.length; i++) {
                        if(i <= this.pathNum)
                        {
                            pathItems[this.pathNum-i].classList.remove('slds-is-active');
                            pathItems[this.pathNum-i].classList.add('slds-is-complete');
                            pathItems[this.pathNum].classList.add('slds-is-active');
                            pathItems[4].classList.add('slds-is-active');
                            pathItems[this.StepNum].classList.add('slds-is-complete');
                            this.activeStep = pathItems[this.pathNum].querySelector('.slds-path__title').textContent;
                            console.log('this.activeStep=====',this.activeStep);
                            this.pathConditional(this.activeStep);
                        }    
                    }
                this.checkingtemplate(this.activeStep);
        }
    }
    //pathMoveOnce is using for call register tab in customSalesPath Component
    pathMoveOnce()         
    {
		this.pathIncovingFun();
	}

    handleStatusChange(event)
    {
        //executes when finish in the lightning flow
        if (event.detail.status === 'FINISHED') {
            console.log('after flow====>');
			this.pathMoveOnce();
            this.customFormModal = false;
            this.register = true;
            this.showDownload = false;
            console.log('register=====');
            this.verifyOtp = true;
        }
    }

    handleNext()
    {
        this.pathIncovingFun();
	}

    handleDataEvent(event)
    { 
        const data = event.detail;
        const isDuplicate = this.submittedData.some(obj => {
        return obj.ids === data.ids && obj.titles === data.titles && obj.targetname === data.targetname;
        });
        if (!isDuplicate) {
            this.subData.push(data);
            this.submittedData.push(data);
            console.log('submit data========', JSON.stringify(this.submittedData));
            this.generateUniqueTitles();
        }
        localStorage.setItem('submittedData', JSON.stringify(this.submittedData));
        this.pathIncovingFun();
    }

    async handleTutorailClick(event)
    {
        await this.getCurrentUserPathNum();
        console.log('pathNum===Tutorial====',this.pathNum);
        if(this.pathNum != 0 && this.pathNum != 1 )
        {
            console.log('pathNum===Tutorial====if===',this.pathNum);
            await this.userUpdateNum(2);
            this.pathMoveback();
        }
    }

    async handleDownloadClick()
    {
        await this.getCurrentUserPathNum();
        console.log('pathNum===Download====',this.pathNum);
        if(this.pathNum != 0 && this.pathNum != 1 )
        {
            console.log('this subdata =======>',this.submittedData.length);
            if(this.submittedData.length != 0)
            {
                // this.showDownload = true;
                await this.userpathUpdate(0);
                await this.userUpdateNum(3);
                this.pathMoveback();
            }
        }
	}

    async handleFeedBAckClick()
    {
        await this.getCurrentUserPathNum();
        console.log('pathNum===Feedback====',this.pathNum);
        if(this.pathNum != 0 && this.pathNum != 1 )
        {
            this.pathMoveBackConditional(4); 
        }
    }

    handleFeedtoHelp()
    {
        this.pathIncovingFun();
	}
    
    async handleHelpClick()
    {
        await this.getCurrentUserPathNum();
        console.log('pathNum===Help====',this.pathNum);
        if(this.pathNum != 0 && this.pathNum != 1 )
        {
            this.pathMoveBackConditional(5); 
        }   
    }
    handleHelpComment()
    {
        this.pathIncovingFun();
    }

    // path conditonal Tutorial, Download, Feedback
    pathConditional(activetab)
    {
        if(activetab == 'Tutorial')
        {
            if(this.subData.length == 0)
            {
                const pathItems = this.template.querySelectorAll('.slds-path__item');
                for (let i =4; i< pathItems.length; i++) 
                {
                    if(i <= 5)
                    {
                        pathItems[i].classList.add('slds-is-active');
                        pathItems[3].classList.remove('slds-is-active');
                    }
                }
            }
            else if(this.subData.length >=1)
            {
                const pathItems = this.template.querySelectorAll('.slds-path__item');
                for (let i =3; i< pathItems.length; i++) 
                {
                    if(i <= 5)
                    {
                        pathItems[i].classList.add('slds-is-active');
                    }
                }
            }
            
        }
        else if(activetab == 'Download')
        {
            const pathItems = this.template.querySelectorAll('.slds-path__item');
            for (let i =4; i< pathItems.length; i++) 
            {
                if(i <= 5)
                {
                    pathItems[i].classList.add('slds-is-active');
                }
            }
        }
        else if(activetab == 'Feedback')
        {
            const pathItems = this.template.querySelectorAll('.slds-path__item');
            pathItems[5].classList.add('slds-is-active');
        }
    }
    async pathMoveBackConditional(num2)
    {
        await this.getCurrentUserPathNum();
        const pathItems = this.template.querySelectorAll('.slds-path__item'); 
        this.activeStep = pathItems[this.pathNum].querySelector('.slds-path__title').textContent;
        console.log('activeStep in handleHelpClick====>',this.activeStep);

        if(this.activeStep == 'Tutorial')
        {
            await this.userpathUpdate(2);
            await this.userUpdateNum(num2);
            this.pathMoveback();
        }
        else if(this.activeStep == 'Download')
        {
            await this.userpathUpdate(3);
            await this.userUpdateNum(num2);
            this.pathMoveback();
        }
        else
        {
            await this.userUpdateNum(num2);
            this.pathMoveback();
        }
    }

    //************************************************Dont touch from here************************************************************************************

    downloadFile(event)
    {
        const selectedId = event.target.value;
        console.log('selectedId============'+selectedId);
        this.url = 'https://raagvitech172-dev-ed.lightning.force.com/sfc/servlet.shepherd/document/download/' + selectedId;   
        let link = document.createElement('a');
        link.setAttribute('href', this.url);
        link.setAttribute('download', '');
        link.click();
       
    }
    generateUniqueTitles() 
    {
        const titleSet = new Set();
        this.uniqueTitles = [];
        if (this.submittedData && this.submittedData.length > 0) {
            this.submittedData.forEach(obj => {
                const titles = obj.titles;
                const ids = obj.ids;
                for (let i = 0; i < titles.length; i++) {
                    const title = titles[i];
                    const id = ids[i];
                    const key = title + '-' + id;
                    if (!titleSet.has(key)) {
                        titleSet.add(key);
                        this.uniqueTitles.push({
                            title,
                            id
                        });
                    }
                }
            });
        }
    }
    checkingtemplate(stepName)
    {
        if(stepName =='Verification') {
            console.log('verication cc====');
            this.register = true;
            this.showDownload=false;
            this.verifyOtp = true;
            this.tutorialPage = false;
            this.feedbackComponent = false;
            this.helpComment = false;
        } 
        else if (stepName == 'Tutorial') {
            console.log('i am cc tutorial');
            this.tutorialPage = true;
            this.register = true;
            this.showDownload=false;
            this.feedbackComponent=false;
            this.helpComment=false;
            this.verifyOtp = false;
        }
        else if(stepName == 'Download') {
            console.log('i am cc download');
            this.tutorialPage = false;
            this.register = true;
            this.showDownload=true;
            this.feedbackComponent=false;
            this.helpComment=false;
            this.verifyOtp = false;  
        }
        else if(stepName == 'Feedback'){
            console.log(' i am cc feedback');
            this.feedbackComponent=true;
            this.register = true;
            this.tutorialPage=false;
            this.showDownload=false;
            this.helpComment=false;
            this.verifyOtp = false;
        }
        else if(stepName == 'Help'){
            console.log('i am cc help');
            this.tutorialPage=false;
            this.register = true;
            this.feedbackComponent=false;
            this.showDownload=false;
            this.helpComment=true;
            this.verifyOtp = false;
        }     
    }    

}