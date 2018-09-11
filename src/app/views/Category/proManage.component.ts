import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CategoryServices} from '../../Shared/services/category.services';
import {Category} from '../../Shared/model/category';
import {ToastrService} from 'ngx-toastr';
import {BsModalService} from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import swal from 'sweetalert2';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import { MerchantServices} from '../../Shared/services/merchant.services';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'proManage',
  templateUrl: 'proManage.template.html',
  styleUrls: ['category.component.css'],
  providers: [CategoryServices, MerchantServices]
})

export class ProManageComponent implements OnInit, AfterViewInit  {
  public add = true;
  public edit = true;
  public delete = true;
  public empRights: any;
  public dd = false;
  public rp = false;
  public empId: any;
  public view = true;
  public dtOptions: any;
  public attDropdown: Array<string> = [];
  public _id: String;
  public sub: any;
  public title: any;
  public modalUpdate: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChild('attributeAdd')
  myForm: any;
  public categoryObj: any;
  public attributeObj: any;
  public allAttributeObj = [];
  public attId: any;
  public NoImage = true;
  get dtTrigger(): any {
    return this._dtTrigger;
  }

  set dtTrigger(value: any) {
    this._dtTrigger = value;
  }

  value: any;
  _dtTrigger: any = new Subject();

  constructor(private _categoryService: CategoryServices, private route: ActivatedRoute,
              private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private toastr: ToastrService) {

  }

  ngOnInit() {
    const eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'Category') {
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
      dom: 'l<"pull-right"B>frtip',
      processing: true,
      // Configure the buttonslfrtiplfrtip
      buttons: [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ]
    };
    this.getSubCategory();
    this.getAllAttribute();
  }

  selectedType(value){
    if ( value === 'Core') {
      this.NoImage = false;
    }
    else{
      this.NoImage = true;
    }
  }
  selected(value) {
    if ( value === 'Dropdown') {
      this.dd = true;
      this.rp = false;
    }else{
      this.dd = false;
    }
    // if ( value === 'Range') {
    //   this.rp = true;
    //   this.dd = false;
    // }
    // console.log(value);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getSubCategory() {
    this.sub = this.route.params.subscribe(params => {
      this._id = params['id'];
      this._categoryService.getCategoryByID(this._id)
        .then(
          (categoryData => {
            if (categoryData !== null) {
              this.categoryObj = categoryData;
              this.title = this.categoryObj.name;
            }
          })
        )
        .catch(error => console.log(error));
    });
  }
  add_Attribute(value) {
    if (value.mandatory === '') {
      value.mandatory = false;
    }
    if (value.rmin !== undefined && value.rmax !== undefined) {
      var r = [];
      r.push({
        min: value.rmin,
        max: value.rmax,
      });
      value.attRange = r[0];
    }
    this._categoryService.addAttr(value, this._id)
      .subscribe(
        (AttributeData => {
          // console.log(AttributeData);
          this.allAttributeObj = AttributeData;
          // if (AttributeData !== null) {
            // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

              // this.myForm.setValue({'attName': '', 'attType': '', 'mandatory': ''});
              // this.myForm.reset();

              // Destroy the table first
              // dtInstance.destroy();
              // Call the dtTrigger to rerender again
              // this._dtTrigger.next();
            // });
            this.rerender();
            // this.getAllAttribute();
            this.toastr.success('Attribute added successfully!', 'Success');
            // this.getAllAttribute();
            this.myForm.reset();
          // }
        })
      );

  }
  get_AttributeById(params: String, Updatetemplate: TemplateRef<any>) {
    this.modalUpdate = this.modalService.show(Updatetemplate);
    this._categoryService.getAttributeById(this._id, params)
      .subscribe(
        res => {
          this.attributeObj = res;
          // console.log(this.attributeObj);
          this.attId = this.attributeObj._id;
        });
  }
  getAllAttribute(){
    this._categoryService.getAllAttributeById(this._id)
      .subscribe(
        res => {
          this.allAttributeObj = res;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
        });
  }
  delete_AttributeById(rowId, index){
    this._categoryService.deleteAttributeById(this._id, rowId)
      .subscribe(
        res => {
          // this.allAttributeObj.splice(index, 1);
          this.rerender();
          this.getAllAttribute();
          this.toastr.success('Attribute Deleted successfully!', 'Success');

        });

  }


  updateAttribute(value) {
    // console.log(value);
    value.attDropdown = value.attDropdown;
    const putdata = JSON.stringify(value);
    this._categoryService.updateAttribute(this._id, this.attId, putdata)
      .subscribe(
        data => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this._dtTrigger.next();
          });
          this.getAllAttribute();
          this.toastr.success('Attribute Updated successfully!', 'Success');
        }
      );
    this.modalUpdate.hide();
  }
}
