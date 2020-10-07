import styles from './BroadcastAnnouncementsWebPart.module.scss';
import BroadcastAnnouncementsWebPart from './BroadcastAnnouncementsWebPart';
require("fabric");
declare var fabric:any;

export default class AnnouncementListDialog{  
    public renderItemsHtml: any;

    public render(): void {   
      let html: string = '';
      html +=  `<button class="ms-Dialog-button ms-Dialog-buttonClose">
                  <i class="ms-Icon ms-Icon--Cancel"></i>
                </button>
                
                <div class="ms-Dialog-title">Broadcast Announcements</div>
                <div class="ms-Dialog-content">
                      <div class="bbBroadcastContentContainer">
                          <div class="${styles.bbBroadcastContentDisplay} ${styles.column}">
                              <ul class="${styles.bbBroadcastContent}">` + this.renderItemsHtml + `</ul>
                          </div>
                      </div>
                </div>
                `;
        const dialogDiv: Element = document.querySelector('#bbAnnouncementList');
        dialogDiv.innerHTML = html;

        const baWp: BroadcastAnnouncementsWebPart = new BroadcastAnnouncementsWebPart(); 
        $( "#bbAnnouncementList [class^='bbBroadcastSeverity'], #bbAnnouncementList [class^='bbBroadcastTitle']" ).each(function(index) {
          $(this).on("click", function(){
              var spItem = $(this).data('spitem');
               console.log("Clicked");
              baWp.showAnnouncementDetails(spItem);        
          });
        }); 
        //Create and open dialog
        var dialogComponent = new fabric['Dialog'](dialogDiv);
        dialogComponent.open();
    }
}