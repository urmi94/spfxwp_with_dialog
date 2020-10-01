import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { ISPListItem } from './BroadcastAnnouncementsWebPart';
import styles from './BroadcastAnnouncementsWebPart.module.scss';

export default class CustomDialog extends BaseDialog {  
    // public itemUrlFromExtension: string;  
    // public otherParam: string;  
    public paramFromDailog:string; 
    public html:string;
    public item: ISPListItem;


    public render(): void {  
        // var html:string = ""; 
        // html +=  `<div>`;
        //   html +=  `<div class="` + styles.bbBulletinPopupHeader + `" style="color: ` + this.item.BBXCategoryStyle.BBXCatStyleColour + ` ; border-bottom: 5px solid ` + this.item.BBXCategoryStyle.BBXCatStyleColour + `">`;
          
        //     if (this.item.BBXCategoryStyle.BBXCatStyleImage != null) {
        //       console.log("Image found");
        //       html += `<img class="bbBulletinPopupImage" src="` + this.item.BBXCategoryStyle.BBXCatStyleImage + `"/>`;
        //       html += `<div class="bbBulletinPopupCategory">`;
        //     } else {
        //       console.log("Image not found");
        //       html += `<div class="bbBulletinPopupCategory--NoImage">`;
        //     }     

        //       html += this.item.BBXCategoryStyle.Title;
        //       html += `</div>`;
        //   html += `</div>`;

        //   html += `<div class="` + styles.bbBulletinPopupHeaderTitle + `">`;            
        //     html += `<div class="` + styles.bbBulletinPopupTitle + `">` + this.item.BBXCategoryStyle.Title + `</div>`;
        //     html += `<div class="` + styles.bbBulletinPopupPublishedDate + `">publishedDate</div>`;
        //     html += `<div class="bbBulletinPopupPublishedBy">By: ` + this.item.Editor.Title + `</div>`;
        //   html += `</div>`;

        //   html += `<div class="` + styles.bbBulletinPopupContent + `">` + this.item.Body + `</div>`;
        //   html += `<input type="button" class="bbBulletinPopupHeaderTitle"  value="Submit">`;
        // html += `</div>`; 

        console.log("html", this.html);
        this.domElement.innerHTML += this.html;  
        //SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showModalDialog", { title: 'Broadcast Announcements', html: html, allowMaximize: true, autoSize: true });

        this._setButtonEventHandlers();    
    }  
    
      // METHOD TO BIND EVENT HANDLER TO BUTTON CLICK  
    private _setButtonEventHandlers(): void {    
        const webPart: CustomDialog = this;    
        this.domElement.querySelector('.bbBulletinPopupHeaderTitle').addEventListener('click', () => {    
                    this.paramFromDailog =  "Clicked";   
                    this.close();  
        });   
    }
    public getConfig(): IDialogConfiguration {  
      return {  
        isBlocking: false  
      };  
    }  
      
    protected onAfterClose(): void {  
      super.onAfterClose();       
    }      
  } 