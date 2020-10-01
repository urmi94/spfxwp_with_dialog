import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './BroadcastAnnouncementsWebPart.module.scss';
import * as strings from 'BroadcastAnnouncementsWebPartStrings';
import {  SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';  
import * as $ from 'jquery';
import { Dialog } from '@microsoft/sp-dialog';
import CustomDialog from './announcementDetails';
//import vticker from 'vticker';

declare var window: any;

let currentItem: ISPListItem = null;

export interface IBroadcastAnnouncementsWebPartProps {
  description: string;
}

export interface ISPList {
  value: ISPListItem[];
}

export interface ISPListItem {
  Id: string;
  Title: string;
  Body: string;
  BBXCategoryStyle: {
    BBXCatStyleColour: string;
    Title: string;
    BBXCatStyleImage: string;
  };
  Editor: {
    Title: string;
  };
  BroadcastPublishedDate: any;
}

export default class BroadcastAnnouncementsWebPart extends BaseClientSideWebPart<IBroadcastAnnouncementsWebPartProps>  {
  
  private _getListData(): Promise<ISPList> {
    
    let currentWebUrl = this.context.pageContext.web.absoluteUrl; 
    let requestUrl = currentWebUrl.concat("/_api/web/Lists/GetByTitle('Broadcast Announcements')/items?$select=ID,Title,Body,Editor/Title,BroadcastPublishedDate,BBXCategoryStyle/Title,BBXCategoryStyle/BBXCatStyleImage,BBXCategoryStyle/BBXCatStyleColour&$expand=BBXCategoryStyle,Editor");
  
    return this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1) 
      .then((response: SPHttpClientResponse) => {
        
        return response.json();
      });
  }
  private _renderData(option:any, data: ISPListItem[]): void {
    let html: string = '';
    let renderItemsHtml = this._renderItems(data);

    (<any>window).test = {
      test1: function(item:any){
        alert('test')
        this._showDetails(item);
      }
    }



    //Render		
    if (data.length > 0) {
      html += `
        <div class="${styles.bbBroadcast} ${styles.row}">
          <div class="${styles.bbBroadcastCount} ${styles.column}">
            <a class="${styles.bbBroadcastCountLink}">
              <i class="fa fa-exclamation-triangle"></i>
              ${data.length}
            </a>
          </div>
          <div class="${styles.bbBroadcastContentTicker} ${styles.column}">
            <ul class="${styles.bbBroadcastContent}">` + renderItemsHtml + `</ul>
          </div>
        </div>
        `;
    }
    const root: Element = this.domElement.querySelector('#spListContainer');
    
    root.innerHTML = html;

    // $(document).on('click', '.bbBroadcastSeverity', function (e) {
    jQuery('[class^="bbBroadcastSeverity"]').each((indext,elment)=>{
      var spItem = jQuery(elment).data('spitem');
      console.log(spItem);
      // sthis._showDetails(spItem)
    })
    /*
    .addEventListener('click', () => {   
      alert("Btn Clicked!!!");
    });
    */
    
  }

  private _renderItems(data: ISPListItem[]): string {
      let html: string = '';
      data.forEach((item: ISPListItem) => {
        var categoryTitle: string = item.BBXCategoryStyle.Title;
        var categoryColour:string = item.BBXCategoryStyle.BBXCatStyleColour;
        var categoryImage:string = item.BBXCategoryStyle.BBXCatStyleImage;
        var dsCTTitle:string = "Broadcast Announcement";        

        html += `
        <li class="${styles.bbBroadcastItemContainer}">
          <div class="${styles.bbBroadcastItem}" 
              
              data-themeKey="${dsCTTitle}" 
              data-themeKeyColour="${categoryColour}" 
              data-themeKeyImage="${categoryImage}" 
              data-themeKeyTitle="${categoryTitle}" 
              data-rowtype="Broadcast" 
              data-id="${item.Id}" 
              data-title="${item.Title}" 
              style="border-left-color:${categoryColour}"
              onclick="window.test.test1()"
              >
            <div class="${styles.bbBroadcastSeverity}"
                data-spItem='${escape(JSON.stringify(item))}'
            >
              ${categoryTitle}
            </div>
            <div class="${styles.bbBroadcastTitle}">
              ${item.Title}
            </div>
          </div>
        </li>
        `;        

        // this._showDetails(item);
    });
    return html;
  }
  private _renderListAsync(): void {

    var option = {
      HtmlId: "bbBroadcast"
    };
      this._getListData()
        .then((response) => {              
          this._renderData(option, response.value);

          //Generate List Display Html
          // let html: string = '';
          // html += `
          // <div class="${styles.bbBroadcastContentDisplay}">
          // ${this._renderItems(response.value)}
          // </div>
          // `;
          //Attach OnClick to Counter
          var $root = jQuery(".bbBroadcastCountLink");
          //const root: Element = this.domElement.querySelector('.bbBroadcastCountLink');

          // $root.find('.bbBroadcastCountLink').on('click', function () { this._counterOnClick(html.join('')) });
          // bbw.Wait(100, function () { return Bluebox.Presentation }, function () {
          //     Bluebox.Presentation.Execute($root);
          // });
          //Apply vTicker
          // bbw.Wait(100, function () { return  }, function () {
               //$root.find('.bbBroadcastContentTicker').jQuery.fn.vTicker({ height: 45 });
          // })


          //this._renderList(response.value);
        });
  }

  // private _counterOnClick(html:any): void {
  //   var opt = {
  //       title: "Broadcast Announcements",
  //       width: 1200,
  //       allowMaximize: true,
  //       html: jQuery(html)[0],
  //       //html: jQuery('.bbBroadcastContent')[0]["innerHTML"],
  //       dialogReturnValueCallback: function (result, values) {
  //       }
  //   };

  //   SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showModalDialog", opt);

  //   //Apply Expand OnClick
  //   var $root = jQuery('.bbBroadcastContentDisplay');
  //   Bluebox.Presentation.Execute($root);
  // }


  private _showDetails(item: ISPListItem): void { 
    let html: string = '';
    html +=  `<div>`;
          html +=  `<div class="${styles.bbBroadcastItem}" style="color: ` + item.BBXCategoryStyle.BBXCatStyleColour + ` ; border-bottom: 5px solid ` + item.BBXCategoryStyle.BBXCatStyleColour + `">`;
          
            if (item.BBXCategoryStyle.BBXCatStyleImage != null) {
              console.log("Image found");
              html += `<img class="bbBulletinPopupImage" src="` + item.BBXCategoryStyle.BBXCatStyleImage + `"/>`;
              html += `<div class="bbBulletinPopupCategory">`;
            } else {
              console.log("Image not found");
              html += `<div class="bbBulletinPopupCategory--NoImage">`;
            }
        

              html += item.BBXCategoryStyle.Title;
              html += `</div>`;
          html += `</div>`;

          html += `<div class="${styles.bbBulletinPopupHeaderTitle}">`;            
            html += `<div class="${styles.bbBulletinPopupTitle}">` + item.BBXCategoryStyle.Title + `</div>`;
            html += `<div class="${styles.bbBulletinPopupPublishedDate}">publishedDate</div>`;
            html += `<div class="bbBulletinPopupPublishedBy">By: ` + item.Editor.Title + `</div>`;
          html += `</div>`;

          html += `<div class="${styles.bbBulletinPopupContent}">` + item.Body + `</div>`;
          html += `<input type="button" class="bbBulletinPopupHeaderTitle"  value="Submit">`;
        html += `</div>`;


    console.log("Inside", html);
    const dialog: CustomDialog = new CustomDialog();  
    dialog.item = item;  
    dialog.html = html;
      
    dialog.show().then(() => {  
      Dialog.alert(`Message from Custom Dailog-->` + dialog.paramFromDailog);  
    });  
}
  public render(): void { 
    this.domElement.innerHTML = `
      <div class="${ styles.broadcastAnnouncements }">
        <div class="${ styles.container }">
          <div id="spListContainer" />
        </div>
      </div>`;
      this._renderListAsync();
  }

  /*
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
*/
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
