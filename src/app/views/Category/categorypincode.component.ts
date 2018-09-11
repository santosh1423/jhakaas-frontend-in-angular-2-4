import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CategoryServices} from '../../Shared/services/category.services';
import {Category} from '../../Shared/model/category';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'categorypincode',
  templateUrl: 'categorypincode.template.html',
  providers: [CategoryServices]
})
export class CategoryPincodeComponent implements OnInit {
  public categoryNameObj: any;

  constructor(private _categoryService: CategoryServices) {
  }
  ngOnInit() {
    this._categoryService.getCategoryName()
      .subscribe(
        categoryObj => {
          this.categoryNameObj = categoryObj;
        });

  }

}
