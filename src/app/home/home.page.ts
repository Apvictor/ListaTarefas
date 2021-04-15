import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];

  constructor(private actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    let tasksJson = localStorage.getItem('tasksDB');
    if (tasksJson != null) {
      this.tasks = JSON.parse(tasksJson);
    }
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Tarefa concluída?",
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark',
        handler: () => {
          task.done = !task.done;
          this.updateLocalStorage();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  updateLocalStorage() {
    localStorage.setItem('tasksDB', JSON.stringify(this.tasks));
  }

  delete(task: any) {
    this.tasks = this.tasks.filter(taskArray => task != taskArray);

    this.updateLocalStorage();
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [{
        name: 'taskToDo',
        type: 'text',
        placeholder: 'Adicione uma tarefa'
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Adicionar',
        handler: (form) => {
          this.add(form.taskToDo);
        }
      }]
    });
    await alert.present();
  }

  async add(taskToDo: string) {
    if (taskToDo.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
      return;
    }

    let task = { name: taskToDo, done: false };

    this.tasks.push(task);

    this.updateLocalStorage();

  }

}
