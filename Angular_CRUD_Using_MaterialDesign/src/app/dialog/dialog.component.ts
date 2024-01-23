import { Component, Inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCalendarCellClassFunction, MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatDatepickerModule,MatNativeDateModule,MatRadioModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {

  freshList = ['Brand New','Second Hand','Refurbished'];

  actionButton:any = 'Save';

  productForm !: FormGroup;

  constructor(private dialog:MatDialogRef<DialogComponent>,private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public editData:any,private api:ApiService,private toast:NgToastService)
  {}

  ngOnInit()
  {
    this.productForm = this.formBuilder.group({
      productName:['',Validators.required], 
      category:['',Validators.required],
      freshness:['',Validators.required],
      price:['',Validators.required],
      comment:['',Validators.required],
      date:['',Validators.required],
    });
    
     if(this.editData)
     {
      this.actionButton = 'Update';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
     }
  }

  closeDialog()
  {
    this.dialog.close();
  }

  addProduct()
  {
    if(!this.editData)
    {
      if(this.productForm.valid)
     {
       this.api.postProduct(this.productForm.value).subscribe((res)=>{
         this.toast.success({detail:'Success',summary:'Product Added Successfully',duration:5000});
         this.productForm.reset();
         this.dialog.close('save');
       },error=>{
        this.toast.error({detail:'Error',summary:'Failed to add product',duration:5000});
       });
     }
    }
    else
    {
        this.updateProduct()
    }
  }

  updateProduct()
  {
    this.api.putProduct(this.productForm.value,this.editData.id).subscribe((res)=>{
      this.toast.success({detail:'Updated',summary:'Product Updated Successfully',duration:5000})
      this.productForm.reset();
      this.dialog.close('update');
    },(error)=>{
      this.toast.error({detail:'Error',summary:'Failed to update product',duration:5000});
    });
  }
}
