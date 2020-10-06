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
                <div class="${styles.broadcastAnnouncements}">`;
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
        html += `</div>`;

        const dialogDiv: Element = document.querySelector('.ms-Dialog');
        dialogDiv.innerHTML = html;

        //Create and open dialog
        var dialogComponent = new fabric['Dialog'](dialogDiv);
        dialogComponent.open();
    }
}