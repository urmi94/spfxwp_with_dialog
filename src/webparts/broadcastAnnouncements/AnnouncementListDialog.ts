import styles from './BroadcastAnnouncementsWebPart.module.scss';
import BroadcastAnnouncementsWebPart from './BroadcastAnnouncementsWebPart';
require("fabric");
declare var fabric:any;

export default class AnnouncementListDialog{  
    public renderItemsHtml: any;
    public data: any;
    
    public render(): void {   
      let html: Array<string> = [];
      html.push(`
                <button class="ms-Dialog-button ms-Dialog-buttonClose">
                    <i class="ms-Icon ms-Icon--Cancel"></i>
                </button>
                
                <div class="ms-Dialog-title">Broadcast Announcements</div>
                <div class="ms-Dialog-content">
                      <div class="bbBroadcastContentContainer">
                          <div class="bbBroadcastContentDisplay ${styles.column}" style="min-width: 500px !important">
                              <ul class="bbBroadcastContent">`);
      html.push(this.renderItemsHtml.join(''));
      html.push(`</ul>
                          </div>
                      </div>
                </div>
                `);
        const dialogDiv: Element = document.querySelector('#bbAnnouncementList');
        dialogDiv.innerHTML = html.join('');

        var self = this;
        const baWp: BroadcastAnnouncementsWebPart = new BroadcastAnnouncementsWebPart(); 
        $( "#bbAnnouncementList [class^='bbBroadcastSeverity'], #bbAnnouncementList [class^='bbBroadcastTitle']" ).each(function(index) {
          $(this).on("click", function(){
              var spItem = self.data[index]; //$(this).data('spitem');
              baWp.showAnnouncementDetails(spItem);        
          });
        }); 
        //Create and open dialog
        var dialogComponent = new fabric['Dialog'](dialogDiv);
        dialogComponent.open();
    }
}