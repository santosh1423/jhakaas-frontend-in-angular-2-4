import { Component, TemplateRef, OnInit } from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {PapaParseService} from 'ngx-papaparse';
import {CategoryServices} from '../../Shared/services/category.services';
import { NgxSpinnerService } from 'ngx-spinner';

var _ = require('lodash');
var Hashids = require('hashids');

@Component({
  selector: 'cimportimport',
  templateUrl: 'cimport.template.html',
  providers: [MerchantServices, CategoryServices]
})
export class CimportComponent implements OnInit {
  public modalAdd: BsModalRef;
  public csv: any;
  public data: any;

  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public impData: any;
  public impSecData: any;
  public empId: any;
  public procmodal: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  public count = 0;
  public userID: any;
  public cat: any;
  public loadingtext: any;


  constructor(private _merchantService: MerchantServices,
              private _categoryService: CategoryServices,
              private spinner: NgxSpinnerService,
              private modalService: BsModalService,
              private papa: PapaParseService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'Import') {
                  this.view = this.empRights[i].view;
                  this.add = this.empRights[i].add;
                  this.edit = this.empRights[i].edit;
                  this.delete = this.empRights[i].delete;
                }
              }
            }

          }

        });
  }


  getUser() {
    return sessionStorage.getItem('_id');
  }

  addCatModel(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }

  changeListener(files: FileList) {
    var cat = [];
    var subcat = [];
    if (files && files.length > 0) {
      this.loadingtext = 'Please Wait.... Rearranging your Data!';
      this.spinner.show();
      const file: File = files.item(0);
      this.csv = files[0];
      this.papa.parse(this.csv, {
        header: true,
        skipEmptyLines: true,
        // worker: true,
        complete: (results, file2) => {
          this.impData = results.data;
          console.log(this.impData);
          for ( let i = 0; i < this.impData.length; i++) {
              if (this.impData[i].name !== undefined) {
                console.log('Name Found');
                  var hashids = new Hashids(this.impData[i].name, 3);
                  var a = hashids.encode(i).toUpperCase();
                  console.log('a:' + a);
                  cat.push({
                    name: this.impData[i].name,
                    code: a,
                    icon: 'category/merchant/icon/logo.png'
                  });
                  for (let j = 1; j <= 50; j++) {
                    var sub = this.impData[i]['SubCategory ' + j];
                    console.log(sub);
                    if (sub !== '') {
                      console.log('sub Category Found:' + sub);
                      var hashids2 = new Hashids(sub, 3);
                      var a2 = hashids2.encode(i).toUpperCase();
                      console.log('a2:' + a2);
                      subcat.push({
                        name: sub,
                        code: a2,
                        parentCategory: this.impData[i].name,
                        icon: 'category/merchant/icon/logo.png'
                      });
                    }
                  }

                  if ( i === this.impData.length - 1) {
                    this.cat = _.concat(cat, subcat);
                    console.log(this.cat);
                  }

              }
              if (i === this.impData.length - 1) {
                this.spinner.hide();
              }
          }
        }
      });
    }
  }

  // chunkArray(myArray, chunk_size) {
  //   var results = [];
  //
  //   while (myArray.length) {
  //     results.push(myArray.splice(0, chunk_size));
  //   }
  //
  //   return results;
  // }


  import(template: TemplateRef<any>) {
    if (this.csv !== undefined) {
      if (this.cat.length !== 0) {
        this.spinner.show();
        // this.procmodal = this.modalService.show(template, this.config);
        // for (let i = 0; i < this.impSecData.length; i++) {
        this._categoryService.importCategory(this.cat)
          .subscribe(
            res => {
              var data = res;
              // this.count = this.count + 1;
              // if (this.count === this.impSecData.length) {
              if (data.success === true) {
                // this.procmodal.hide();
                this.spinner.hide();
                this.toastr.success('Category Import successfully!', 'Success');
              } else {
                // this.procmodal.hide();
              }
              // console.log(data);

              // }
              // console.log(data);
              // if (data.success === true) {
              //   this.procmodal.hide();
              //   this.toastr.success('Merchant Import successfully!', 'Success');
              // }
              // if (data.error !== undefined) {
              //   console.log(data.error);
              // }
            }
          );
      } else {
        swal({
          type: 'warning',
          title: 'Error',
          text: 'The Data is Already exist!',
        });
      }

      // }

    } else {
      swal({
        type: 'warning',
        title: 'Error',
        text: 'Please select file to upload',
      });
    }
  }
}
