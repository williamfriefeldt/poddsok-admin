import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})

/**
 * @description Show all external / internal resources.
 */
export class ResourcesComponent implements OnInit {

  resources = [
    { name : 'Poddsök.nu'      , description: 'Officiella hemsidan'                                         , link: 'https://poddsok.nu' }                                                                                                     ,
    { name : 'Webhost - panel' , description: 'Hantera webdomänet'                                          , link: 'https://cpanel.poddsok.nu/' }                                                                                             ,
    { name : 'Webhost - konto' , description: 'Hantera kontot för webdomänet'                               , link: 'https://billing.misshosting.com/clientarea.php?language=swedish' }                                                        ,
    { name : 'Email'           , description: 'Allmäna emailen för Poddsök.nu'                              , link: 'https://webmail.poddsok.nu/cpsess9692103422/horde/imp/dynamic.php?page=mailbox#mbox:SU5CT1g' }                            ,
    { name : 'Firebase'        , description: 'Databasen för alla podcasts och inlägg'                      , link: 'https://console.firebase.google.com/project/poddsok/overview' }                                                           ,
    { name : 'Analytics'       , description: 'Google Analytics - data om användarnas beteende på hemsidan' , link: 'https://analytics.google.com/analytics/web/?hl=en_US#/p199320111/reports/home?params=_u..nav%3Dga1-experimental' }        ,
    { name : 'App iOS'         , description: 'Hantera appen för iOS (Apple)'                               , link: 'https://appstoreconnect.apple.com/apps' }                                                                                 ,
    { name : 'Google Drive'    , description: 'Dokument och information'                                    , link: 'https://drive.google.com/drive/folders/1nAo2ItCBQw49XvO9mrXJzoL-f22nFXu4?usp=sharing' }                                   ,
    { name : 'Trello'          , description: 'Planeringsverktyg'                                           , link: 'https://trello.com/b/Ogq6wA8g/podds%C3%B6k' }
  ];

  git_items = [
    { name: 'Officiella hemsidan'                 , link: 'https://github.com/williamfriefeldt/poddsok' }       ,
    { name: 'Admin '                              , link: 'https://github.com/williamfriefeldt/poddsok-admin' } ,
    { name: 'Plyssningen (AI för transkribering)' , link: 'https://github.com/williamfriefeldt/poddsok-ai' }    ,
    { name: 'App iOS'                             , link:'https://github.com/williamfriefeldt/poddsok-app' }
  ];

  constructor() { }

  ngOnInit(): void { }
  
}


