import { Version } from '@microsoft/sp-core-library';
import {  IPropertyPaneConfiguration,  PropertyPaneTextField} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './BroadcastAnnouncementsWebPart.module.scss';
import * as strings from 'BroadcastAnnouncementsWebPartStrings';
import {  SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';  
import { SPComponentLoader } from '@microsoft/sp-loader';

import * as $ from 'jquery';
require('jQuery.vTicker');

import AnnouncementDetailsDialog from './announcementDetails';
import AnnouncementListDialog from './announcementList';

declare var jQuery:any;

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
  BroadcastPublishedDate: string;
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

  private _renderData(data: ISPListItem[]): void {
    let html: string = '';
    let renderItemsHtml = this._renderItems(data);

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
          <div id="bbBroadcastContentTicker"
             class="${styles.bbBroadcastContentTicker} ${styles.column}">
            <ul class="${styles.bbBroadcastContent}">` + renderItemsHtml + `</ul>
          </div>
        </div>
        `;
    }
    const root: Element = this.domElement.querySelector('#spListContainer');
    root.innerHTML = html;
    
    //On click dialog
    var self = this;
    $( "[class^='bbBroadcastSeverity'], [class^='bbBroadcastTitle']" ).each(function(index) {
      $(this).on("click", function(){
          var spItem = $(this).data('spitem');
          self._showAnnouncementDetails(spItem);        
      });
    }); 
    
    $( "[class^='bbBroadcastCount'], [class^='bbBroadcastCountLink']" ).on("click", () => {
          self._showAnnouncementList(renderItemsHtml);        
      });

    //Apply vTicker
    $( "[class^='bbBroadcastContentTicker']" ).on("load",jQuery('#bbBroadcastContentTicker').vTicker({ height: 45 }));
      
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
              
              >
            <div class="${styles.bbBroadcastSeverity}"
              data-spItem='${escape(JSON.stringify(item))}'>
              ${categoryTitle}
            </div>
            <div class="${styles.bbBroadcastTitle}"
              data-spItem='${escape(JSON.stringify(item))}'>
              ${item.Title}
            </div>
          </div>
        </li>
        `;        
    });
    return html;
  }
  private _renderListAsync(): void {

      this._getListData()
        .then((response) => {              
          this._renderData(response.value);
        });
  }

  private _showAnnouncementDetails(item): void { 
    const dialog: AnnouncementDetailsDialog = new AnnouncementDetailsDialog();  
    dialog.item = item;  
    dialog.render(); 
  }

  private _showAnnouncementList(renderItemsHtml): void { 

    const dialog: AnnouncementListDialog = new AnnouncementListDialog();  
    dialog.renderItemsHtml = renderItemsHtml;  
    
    dialog.show(); 
  }

  public render(): void { 
    //Loading Fabric JS - CSS
    SPComponentLoader.loadCss('https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.components.min.css');
    SPComponentLoader.loadCss('https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.min.css');
    
    this.domElement.innerHTML = `
      <div class="${ styles.broadcastAnnouncements }">
        <div class="${ styles.container }">
          <div id="spListContainer"></div>          
        </div>
        <div class="${ styles.container }">
          <div id="customDialog">
            <div class="ms-Dialog ms-Dialog--close ms-Dialog--blocking">
            </div>
          </div>          
        </div>
      </div>`;
      this._renderListAsync();    
  }
  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

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
