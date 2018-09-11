import {Component, TemplateRef, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs/Subject';
import {ProductService} from '../../Shared/services/product.service';
import * as moment from 'moment';

@Component({
  selector: 'pexport',
  templateUrl: 'pexport.template.html',
  providers: [ProductService, MerchantServices]
})
export class PexportComponent implements OnInit, AfterViewInit {
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  _dtTrigger: any = new Subject();
  public productObj: any;


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private _productService: ProductService) {
  }
  ngOnInit() {
this.getProductDetails();
    const eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'Export') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
    this.dtOptions = {
      // ajax: 'data/data.json',
      // dom: 'lfrtip',
      dom: 'l<"pull-right">frtip',
      processing: true,
      // Configure the buttonslfrtiplfrtip
    };

  }




  get dtTrigger(): any {
    return this._dtTrigger;
  }

  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }


  getProductDetails() {
    this._productService.getAllProductDetails()
      .subscribe(
        res => {
          this.productObj = res;

          // console.log(this.productObj);
          // console.log(res);
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
        });
    // console.log(this.tmpexampleData1);
  }

  download() {
    if (this.productObj.length > 0) {
      for (let i = 0; i < this.productObj.length; i++) {
        this.productObj[i].updatedAt = moment(this.productObj[i].updatedAt).utc(this.productObj[i].updatedAt).format('llll');
        this.productObj[i].updatedAt = moment(this.productObj[i].updatedAt).format('DD/MM/YYYY hh:mm:ss');
        this.productObj[i].createdAt = moment(this.productObj[i].createdAt).utc(this.productObj[i].createdAt).format('llll');
        this.productObj[i].createdAt = moment(this.productObj[i].createdAt).format('DD/MM/YYYY hh:mm:ss');


      }
    }
    const json2csv = require('json2csv');
    const fields = ['code', 'name', 'manufacturer', 'category.name',
      'attributes[0].core', 'attributes[0].variation', 'attributes[0].status', 'status', 'baseProductId', 'code', 'unit',
      'tags', 'country', 'price', 'hsnCode', 'ean', 'license', 'description',
      'features', 'warning_information', 'createdAt', 'createBy.firstName', 'updatedAt', 'updateBy.firstName', ];

    const fieldsName = ['Code', 'Product Name', 'Manufacturer Name', 'Category Name',
      'Core Attributes', 'Variation Attributes', 'Product Status', 'Base ProductStatus', 'Base ProductId', 'Product Code', 'Unit', 'Tags',
      'Country', 'Price', 'HSN Code', 'EAN', 'License', 'Description', 'Features',
      'Warningn Information', 'CreatedAt', 'Created_By', 'UpdatedAt', 'UpdateBy'];
    json2csv({data: this.productObj, fields: fields, fieldNames: fieldsName}, function (err, csv) {
      if (err) {

      }
      if (csv !== undefined) {
        const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        const csvURL = window.URL.createObjectURL(csvData);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'ProductDetails.csv');
        tempLink.click();
      }
    });
  }

}
