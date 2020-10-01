import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { ISPListItem } from './BroadcastAnnouncementsWebPart';
import styles from './BroadcastAnnouncementsWebPart.module.scss';

export default class CustomDialog extends BaseDialog {  
    public item: any;

    public render(): void {  
      let pubDate: Date = new Date(this.item.BroadcastPublishedDate);
      var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  
      let html: string = '';
      html +=  `<div class="${styles.broadcastAnnouncements}">`;
            html +=  `<div class="${styles.bbBulletinPopupHeader}" style="color: ` + this.item.BBXCategoryStyle.BBXCatStyleColour + ` ; border-bottom: 5px solid ` + this.item.BBXCategoryStyle.BBXCatStyleColour + `">`;
            
              if (this.item.BBXCategoryStyle.BBXCatStyleImage != null) {
                console.log("Image found");
                html += `<img class="${styles.bbBulletinPopupImage}" src="` + this.item.BBXCategoryStyle.BBXCatStyleImage + `"/>`;
                html += `<div class="${styles.bbBulletinPopupCategory}">`;
              } else {
                console.log("Image not found");
                html += `<div class="${styles["bbBulletinPopupCategory--NoImage"]}">`;
              }
          
  
                html += this.item.BBXCategoryStyle.Title;
                html += `</div>`;
            html += `</div>`;
  
            html += `<div class="${styles.bbBulletinPopupHeaderTitle}">`;            
              html += `<div class="${styles.bbBulletinPopupTitle}">` + this.item.BBXCategoryStyle.Title + `</div>`;
              html += `<div class="${styles.bbBulletinPopupPublishedDate}">${pubDate.toLocaleDateString("en-AU", options)}</div>`;
              html += `<div class="bbBulletinPopupPublishedBy">By: ` + this.item.Editor.Title + `</div>`;
            html += `</div>`;
  
            html += `<div class="${styles.bbBulletinPopupContent}">` + this.item.Body + `</div>`;
          html += `</div>`;  

        this.domElement.innerHTML += html; 
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