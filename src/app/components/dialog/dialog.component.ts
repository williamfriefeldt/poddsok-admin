import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DIALOGTTEXT } from '../../interfaces/dialog';
import { DialogOption } from '../../interfaces/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

/**
 * @description Creates a dialog modal.
 */

export class DialogComponent implements OnInit{

	dialogText: string;

  /**
   * @param { MatDialogRef } - Dialog from Material library. 
   */
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject( MAT_DIALOG_DATA ) private data: DialogOption
  ) {}

  /**
   * @description Set intial values depending on where the user clicked.
   */
  ngOnInit(): void {
  	const type = DIALOGTTEXT.find( obj => obj.type === this.data.type );
  	this.dialogText = type.text;
  }

  /**
  * @description Close the dialog and set value for what's next. 
  * @param { boolean } val - user accepted task or not.
  */
  close( val ): void {
    this.data['val'] = val;
    this.dialogRef.close( this.data );
  }

}
