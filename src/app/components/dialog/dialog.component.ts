import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DIALOGTTEXT } from '../../interfaces/dialog';
import { DialogOption } from '../../interfaces/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit{

	dialogText: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject( MAT_DIALOG_DATA ) private data: DialogOption
  ) {}

  ngOnInit(): void {
  	const type = DIALOGTTEXT.find( obj => obj.type === this.data.type );
  	this.dialogText = type.text;
  }

  close( val ): void {
    this.data['val'] = val;
    this.dialogRef.close( this.data );
  }

}
