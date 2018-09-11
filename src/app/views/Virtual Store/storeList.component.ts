import {Component, TemplateRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {MerchantServices} from '../../Shared/services/merchant.services';
import {PapaParseService} from 'ngx-papaparse';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VirtualStoreService} from '../../Shared/services/virtualStore.service';
import {Subject} from 'rxjs/Subject';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'storeList',
  templateUrl: 'storeList.template.html',
  providers: [MerchantServices, VirtualStoreService]
})
export class StoreListComponent implements OnInit, AfterViewInit{
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  headers = new HttpHeaders();
  model: any = {};
  public modalAdd: BsModalRef;
  public csv: any;
  public data: any;
  public productObj: any;
  public empRights: any;
  public view = true;
  public add = true;
  public edit = true;
  public delete = true;
  public impData: any;
  public empId: any;
  public procmodal: BsModalRef;
  public proCatObj:Array<any> = [];
  public proCat: Array<any> = [];
  public tmpexampleData1:Array<any> = [];
  public baseProductId: any;
  public virtualStoreArray: Array<any> = [];
  public allStore: Array<any> = [];

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };
  public allProdByBAseId: any;


  constructor(private _merchantService: MerchantServices,
              private modalService: BsModalService,
              private _virtualStoreService : VirtualStoreService,
              private papa: PapaParseService,
              private http: HttpClient,
              private toastr: ToastrService,
              private _authenticationservice: AuthenticationService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('api-token', this._authenticationservice.apiToken());
  }
  ngOnInit(): void {
    this.getAllStore();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if (this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'VirtualStore') {
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

  getAllStore() {
    this._virtualStoreService.getAllStore()
      .subscribe(
        res => {
          this.allStore = res;
          for (let i = 0; i < this.allStore.length; i++) {
            this.allStore[i].plen = this.allStore[i].products.length;
          }
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
          // console.log(this.allStore);

        });
  }

  deleteStoreById(value){
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
          this._virtualStoreService.deleteStore(value).subscribe(
            result => {
              that.toastr.success(' Virtual Store Deleted successfully!', 'Success');
              that.rerender();
              that.getAllStore();
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }


}
