import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MatButtonModule,MatIconModule,MatToolbarModule,MatDialogModule,MatTableModule, MatSortModule, MatPaginatorModule,MatInputModule,MatFormFieldModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular_CRUD';

  displayedColumns: string[] = ['productName', 'category','date','freshness' ,'price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(public dialog: MatDialog,private api:ApiService) {}

  openDialog() {
    this.dialog.open(DialogComponent,{
      width:'40%',height:'80%',
    }).afterClosed().subscribe((val)=>{
        if(val==='save')
        {
          this.getAllProduct();
        }
    })
  }

  ngOnInit()
  {
    this.getAllProduct();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllProduct()
  {
      this.api.getProduct().subscribe((res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },error=>{
        console.log(error);      
      })
  }

  editProduct(row:any)
  {
    this.dialog.open(DialogComponent,{
      data:row,width:'40%',height:'80%'
    }).afterClosed().subscribe((val)=>{
      if(val==='update')
      {
        this.getAllProduct();
      }
    });
  }

  deleteProduct(id:number)
  {
      this.api.deleteProduct(id).subscribe((res)=>{
        alert('Product Deleted Successfully')
        this.getAllProduct();
      },error=>{
        alert('Error Occured '+error);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
