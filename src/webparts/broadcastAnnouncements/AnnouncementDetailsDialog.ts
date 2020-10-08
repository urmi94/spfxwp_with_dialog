import styles from './BroadcastAnnouncementsWebPart.module.scss';
require("fabric");
declare var fabric:any;

export default class AnnouncementDetailsDialog{  
    public item: any;

    public render(): void { 
      
      let pubDate: Date = new Date(this.item.BroadcastPublishedDate);
      var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }; 
        let html: string = '';
        html +=  `
          <button class="ms-Dialog-button ms-Dialog-buttonClose">
            <i class="ms-Icon ms-Icon--Cancel"></i>
          </button>
        
        <div class="ms-Dialog-title">Broadcast Announcement</div>
        <div class="ms-Dialog-content">
                <div class="broadcastAnnouncements">`;
            html +=  `<div class="bbBulletinPopupHeader" style="color: ` + this.item.BBXCategoryStyle.BBXCatStyleColour + ` ; border-bottom: 5px solid ` + this.item.BBXCategoryStyle.BBXCatStyleColour + `">`;
            
              if (this.item.BBXCategoryStyle.BBXCatStyleImage != null) {
                console.log("Image found");
                html += `<img class="bbBulletinPopupImage" src="` + this.item.BBXCategoryStyle.BBXCatStyleImage + `"/>`;
              } else {
                console.log("Image not found");
              }
                html += `<div class="bbBulletinPopupCategory">`;
                html += this.item.BBXCategoryStyle.Title;
                html += `</div>`;
            html += `</div>`;
  
            html += `<div class="bbBulletinPopupHeaderTitle">`;            
              html += `<div class="bbBulletinPopupTitle">` + this.item.Title + `</div>`;
              html += `<div class="bbBulletinPopupPublishedDate">${pubDate.toLocaleDateString("en-AU", options)}</div>`;
              html += `<div class="bbBulletinPopupPublishedBy">By: ` + this.item.Editor.Title + `</div>`;
            html += `</div>`;
  
            html += `<div class="bbBulletinPopupContent">` + this.item.Body + `</div>`;
          html += `</div>`; 
        html += `</div>`;

        const dialogDiv: Element = document.querySelector('#bbAnnouncementDetail');
        dialogDiv.innerHTML = html;

        //Create and open dialog
        var dialogComponent = new fabric['Dialog'](dialogDiv);
        dialogComponent.open();
    }
}