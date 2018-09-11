import { Component, TemplateRef, OnInit } from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {HsnmasterService} from '../../Shared/services/hsnmaster.service';
import {PapaParseService} from 'ngx-papaparse';
var _ = require('lodash');

@Component({
  selector: 'importHSN',
  templateUrl: 'importHSN.template.html',
  providers: [MerchantServices, HsnmasterService]
})
export class ImportHSNComponent implements OnInit {
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
  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
              private _hsnMaster: HsnmasterService,
              private papa: PapaParseService,
              private modalService: BsModalService) {}

  ngOnInit() {
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === '') {
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

  changeListener(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      this.csv = files[0];
      this.papa.parse(this.csv, {
        header: true,
        skipEmptyLines: true,
        // worker: true,
        complete: (results, file2) => {
          this.impData = results.data;
          console.log(this.impData);
        }
      });
    }
  }


  import(template: TemplateRef<any>) {

    if (this.csv !== undefined) {
      this.procmodal = this.modalService.show(template, this.config);
      // for (let i = 0; i < this.impSecData.length; i++) {
      this._hsnMaster.importHSN(this.impData)
        .subscribe(
          res => {
            var data = res;
            // this.count = this.count + 1;
            // if (this.count === this.impSecData.length) {
            if (data.success === true) {
              this.procmodal.hide();
              this.toastr.success('Merchant Import successfully!', 'Success');
            } else {
              this.procmodal.hide();
            }
            console.log(data);

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
