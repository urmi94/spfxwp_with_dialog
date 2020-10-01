import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import styles from './BroadcastAnnouncementsWebPart.module.scss';

export default class AnnouncementListDialog extends BaseDialog {  
    public renderItemsHtml: string;

    public render(): void {  
      let html: string = '';
      html +=  `<div class="${styles.broadcastAnnouncements}">
                    <div class=${styles.bbBroadcastContentContainer}>
                        <div class="${styles.bbBroadcastContentDisplay} ${styles.column}">
                            <ul class="${styles.bbBroadcastContent}">` + this.renderItemsHtml + `</ul>
                        </div>
                    </div>
                </div>
                `;
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