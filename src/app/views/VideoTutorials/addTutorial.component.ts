import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VideotutorialsService} from "../../Shared/services/videotutorials.service";
import {VideoTutorialModule} from "./videoTutorial.module";
import {identifierModuleUrl} from "@angular/compiler";
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'addTutorial',
  templateUrl: 'addTutorial.template.html',
  styleUrls: ['videoTutorials.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, VideotutorialsService]
})
export class AddTutorialComponent implements OnInit, AfterViewInit  {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public modalAdd: BsModalRef;
  public modalEdit: BsModalRef;
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public empId: any;
  public videoObj: Array<any> = [];
  public videoById: Array<any> = [];
  public videoID: any;
  constructor(private _merchantService: MerchantServices,
              private toastr: ToastrService,
              private _videotutorials: VideotutorialsService,
              private modalService: BsModalService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {}

  ngOnInit() {
    this.getVideo();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'VideoTutorials') {
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
      // dom: 'l<"pull-right"B>frtip',
      dom: 'lfrtip',
      // processing: true,
      // Configure the buttonslfrtiplfrtip

    };

  }

  getUser() {
    return sessionStorage.getItem('_id');
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  addVideoModal(template: TemplateRef<any>) {
    this.modalAdd = this.modalService.show(template);
  }
  editVideoModal(id, template: TemplateRef<any>) {
  this.videoID = id;
    this.modalEdit = this.modalService.show(template);
    this._videotutorials.getVideosByID(this.videoID)
      .subscribe(
        result => {
        // console.log(result);
        this.videoById = result;
        }
      );
  }
  AddVideo(value){
    value.createBy = this.empId;
    value.updateBy = this.empId;
    this._videotutorials.postVideoTutorial(value)
      .subscribe(
        result => {
            this.modalAdd.hide();
          if (result.length !== 0) {
            this.toastr.success(' Video Tutorial Added successfully!', 'Success');
            this.rerender();
            this.getVideo();
          }
        }
      );
  }

  getVideo() {
    this._videotutorials.getAllVideo()
      .subscribe(
        videoObj => {
          this.videoObj = videoObj;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });
  }

  EditVideo(value) {
    this.modalEdit.hide();
    // console.log(value);

    value.updateBy = this.empId;
    this._videotutorials.updateVideo(this.videoID, JSON.stringify(value))
      .subscribe(
        result => {
          if (result.length !== 0) {
            this.rerender();
            this.getVideo();
            this.toastr.success(' Video Tutorial Updated successfully!', 'Success');

          }
        }
      );
  }
  deleteVideoById(value) {
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this record!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    })
      .then((Delete) => {
        if (Delete) {
          swal(
            'Deleted!',
            'Your Record has been Deleted.',
            'success'
          );
          this._videotutorials.deleteVideo(value).subscribe(
            result => {
              // that.toastr.success(' Video Tutorial Deleted successfully!', 'Success');
              that.rerender();
              that.getVideo();
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }

  statuschange(param: any, param2: any) {
    const that = this;
    swal({
      title: 'Are you sure?',
      text: 'To change the status!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!'
    }).then(function () {
        that._videotutorials.updatestatus(param, param2).subscribe(
          data => {
            if (data !== undefined) {
              that.rerender();
              that.getVideo();
            }
          }
        );
        swal(
          'Updated!',
          'Your status has been updated.',
          'success'
        );
      }
    );
  }

}
