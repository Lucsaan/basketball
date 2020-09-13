import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  users: User[] = [];

  constructor(
      public alertController: AlertController,
      public http: HttpClient
  ) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.performGraphql(userQuery).subscribe(response => {
      this.users = response.data.users;
      console.log(this.users);
    });
  }


  private async addUser() {

    const alert = await this.alertController.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Enter Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.createUser(data.name);
            console.log(data);
          }
        }
      ]
    });

    await alert.present();
  }

  createNewGame() {
    const param = `mutation{
                  createGame(userIds:[users]){
                    id
                    players{
                      id
                        name
                    }
       }
  }`;
    this.performGraphql(param).subscribe(response => {
      this.users = response.data.createUser;
      console.log(response.data.user);
    });
    console.log(this.users);
  }

  private performGraphql(params) {
    const headers = {Content: 'application/json'};
    const body = {query: params};
    return this.http.post<any>('http://basketball.randomcode.eu:3000/graphql/', body, {headers});
  }

  createUser(name) {
    const param = `mutation{
                  createUser(name: "${name}" ){
                  name, id
                    }
                  }`;
    this.performGraphql(param).subscribe(response => {
      this.users = response.data.createUser;
      console.log(response.data.user);
    });
  }
}
export interface User {
  id: number;
  name: string;
  isChecked: boolean;
}

const userQuery = `
query{
  users{
    name
    id
  }
 }
`;

