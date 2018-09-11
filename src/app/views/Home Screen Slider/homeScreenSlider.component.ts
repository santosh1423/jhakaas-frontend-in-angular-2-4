import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import { MerchantServices } from '../../Shared/services/merchant.services';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import {Subject} from 'rxjs/Subject';
import swal from 'sweetalert2';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../Shared/services/authentication.service';
import {VideotutorialsService} from '../../Shared/services/videotutorials.service';
import {identifierModuleUrl} from '@angular/compiler';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {CategoryServices} from '../../Shared/services/category.services';
import {HomeScreenSliderService} from '../../Shared/services/homeScreenSlider.service';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'homeScreenSlider',
  templateUrl: 'homeScreenSlider.template.html',
  styleUrls: ['homeScreenSlider.component.css'],
  providers: [MerchantServices, HttpClient, AuthenticationService, CategoryServices, HomeScreenSliderService]
})
export class HomeScreenSliderComponent implements OnInit, AfterViewInit {
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
  public  showInternal = false;
  public showUrl = false;
  public showMobile = false;
  public proCat: Array<any> = [];
  public showCategory= false;
  public proCatObj: Array<any> = [];
  public tmpexampleData1: Array<any> = [];
  public pincode = [];
  public files: any;
  public file: any;
  public sliderImg: string;
  public url: string;
  public type: any;
  public imageObj: any;
  public int2 = [];
  public imageIdObj: any;
  public mobileNo: any;
  public modalUpdate: BsModalRef;
  public modalView: BsModalRef;
  public _id: String;
  public st: any;
  public ist: any;
  public cat = [];
  public pincodeShow = false;
  public tmpexampleData = [];
  public selectedCat: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };

  constructor(private _merchantService: MerchantServices,
              private _SliderService: HomeScreenSliderService,
              private toastr: ToastrService,
              private modalService: BsModalService,
              private http: HttpClient,
              private _authenticationservice: AuthenticationService) {}

  ngOnInit() {
    this.getCategory();
    var eid = this.getUser();
    this._merchantService.getEmpAdminId(JSON.parse(eid))
      .subscribe(
        res => {
          this.empId = res[0]._id;
          if (res[0].profile !== undefined) {
            this.empRights = res[0].profile.profile.screen;
            if(this.empRights !== undefined) {
              for (let i = 0; i < this.empRights.length; i++) {
                if (this.empRights[i].name === 'HomeScreenSlider') {
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
      dom: 'lfrtip',
      // processing: true,
      // Configure the buttonslfrtiplfrtip

    };
    this.getImages();

  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getImages() {
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    this._SliderService.getAllImages()
      .subscribe(
        imageObj => {
          this.imageObj = imageObj;
          for (let i = 0; i < this.imageObj.length ; i++) {
            if (this.imageObj[i].image.key !== null) {
              const urlParams = {
                Bucket: 'jhakaas-docs',
                Key: this.imageObj[i].image.key
              };
              new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', urlParams, (err2, url) => {
                  this.imageObj[i].url = url;
                });
              });
            }
          }
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        });
  }

  getUser() {
    return sessionStorage.getItem('_id');
  }

  getImageById(params: String, Updatetemplate: TemplateRef<any>) {
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    this.modalUpdate = this.modalService.show(Updatetemplate, this.config);
    this._id = params;

    this._SliderService.getImageByID(this._id)
      .then(
        (categoryData => {
          if (categoryData !== null) {
            this.imageIdObj = categoryData;
            // console.log(this.imageIdObj);
            // console.log(this.imageIdObj);
            if (this.imageIdObj.inGenral === false) {
              // console.log(this.imageIdObj.inGenral);
              this.pincodeShow = true;
            }
            this.pincode = this.imageIdObj.pincode;
            this.st = this.imageIdObj.stype;

            if (this.imageIdObj.stype !== undefined) {
              if (this.st === 'External') {
                this.showInternal = false;
                this.showUrl = true;
                this.showMobile = false;
                this.showCategory = false;
              } else {
                this.showInternal = true;
                this.showUrl = false;
              }
            }

            if (this.imageIdObj.hasOwnProperty('internal')) {
              if (this.imageIdObj.internal.hasOwnProperty('merchant')) {
                // console.log('b');
                this.showInternal = true;
                this.showMobile = true;
                this.showCategory = false;
                this.mobileNo = this.imageIdObj.internal.merchant.mobileNumber;
                this.ist = 'Vendor';
              } else {
                this.showInternal = true;
                this.showMobile = false;
                this.showCategory = true;
                if (this.imageIdObj.internal.hasOwnProperty('category')) {
                  this.tmpexampleData = [];
                    this.tmpexampleData.push({'id': this.imageIdObj.internal.category._id, 'text':  this.imageIdObj.internal.category.name});
                  this.cat = this.tmpexampleData[0];
                  }
                // console.log(this.cat);
                this.ist = 'Category';
              }
            } else {
              this.cat = [];
            }
            const urlParams = {
              Bucket: 'jhakaas-docs',
              Key: this.imageIdObj.image.key
            };
            new Promise((resolve, reject) => {
              s3.getSignedUrl('getObject', urlParams, (err2, url) => {
                this.url = url;
                if (this.url !== undefined) {
                  this.imageIdObj.url = this.url;
                }
              });
            });
          }
        })
      )
      .catch(error => console.log(error));
  }
  onChange(value) {
    // console.log(value);
    if (value === true) {
      this.pincodeShow = false;
    }
    if (value === false) {
      this.pincodeShow = true;
    }
  }

  selectedCategory(value) {
    // console.log(value);
    this.selectedCat = value.id;
    // console.log(this.selectedCat);
  }

  mobileNO(mobNo) {
    // console.log(mobNo);
    this._merchantService.getNumbers(mobNo).subscribe(
      res => {
        // console.log(res);
        if (res.length > 0) {
          // console.log(res);
          this.int2.push({
            merchant: res[0]._id
          });
        } else {
          this.modalUpdate.hide();
          this.mobileNo = null;
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Invalid Mobile Number!',
          });
        }
      });
  }

  addSliderModal(template: TemplateRef<any>) {
    this.pincodeShow = false;
    this.showCategory = false;
    this.showInternal = false;
    this.showUrl = false;
    this.showMobile = false;
    this.modalAdd = this.modalService.show(template, this.config);
  }
  AddSlider(value) {
    // console.log(value);
    this.modalAdd.hide();
   if (this.sliderImg !== undefined) {
     var image = [];
     image.push({
       key: this.sliderImg
       // key: 'category/No-image-available.jpg'
     });

     value.image = image[0];
     value.createBy = this.empId;
     value.updateBy = this.empId;
     value.stype = this.type;
     if (value.category !== undefined) {
       var int = [];
       int.push({
         category: value.category[0].id
       });
       value.internal = int[0];
     }
     if (this.int2.length !== 0) {
           value.internal = this.int2[0];
     }
     if (value.url !== undefined) {
       var a = [];
       a.push({
         link: value.url
       })
       value.external = a[0];
     }

     // console.log(value);
     this._SliderService.postSlider(value)
       .subscribe(
         result => {
           this.getImages();
           // console.log(result);
           // if (result ) {
             this.toastr.success('Home Slider added Successfully!', 'Good job!');
           // }
         }
       );
     // console.log(value);
   }else {
     swal({
       type: 'error',
       title: 'Oops...',
       text: 'Home Screen Slider Image Is Required! ',
     });
   }


  }

  CheckMobile(value){
    // console.log('hfghfghfghfgh');
  }
  EditSlider(value) {
    // console.log(value);
    this.modalUpdate.hide();
    // console.log(this.pincodeShow);
  if(value.inGenral === false ) {
    this.pincodeShow = true;
    // value.pincode = [];
    // this.pincode = [];
    }

   if(value.inGenral === true ) {
    this.pincodeShow = false;
    value.pincode = [];
    // this.pincode = [];
    }

    if (value.stype === 'Internal') {
     value.external = null;
    }else if (value.stype === 'External') {
      value.internal = null;
    }

    if (value.stype === 'Internal') {
      value.external = null;
      if (value.internaltype === 'Vendor') {
       this._merchantService.getNumbers(value.mobileNumber).subscribe(
          res => {
            var a = [];
            a.push({
              merchant: res[0]._id
            });
            value.internal = a[0];
            // console.log(a);
            this._SliderService.updateSlider(this._id, JSON.stringify(value))
              .subscribe(
                data => {
                  if (data.length !== 0) {
                    this.getImages();
                    this.toastr.success(name + ' Update successfully!', 'Success');
                  }
                }
              );
          });

      }
      if (value.internaltype === 'Category') {
        var b = [];
        b.push({
          category: this.selectedCat
        });
        value.internal  = b[0];
        this._SliderService.updateSlider(this._id, JSON.stringify(value))
          .subscribe(
            data => {
              if (data.length !== 0) {
                this.getImages();
                this.toastr.success(name + ' Update successfully!', 'Success');
              }
            }
          );
      }
    }else if (value.stype === 'External'){
      var c = [];
      c.push({
        link: value.link
      });
      value.external = c[0];
      this._SliderService.updateSlider(this._id, JSON.stringify(value))
        .subscribe(
          data => {
            if (data.length !== 0) {
              this.getImages();
              this.toastr.success(name + ' Update successfully!', 'Success');
            }
          }
        );
    }
    // console.log(value);


    // if (this.sliderImg !== undefined) {
    //   var image = [];
    //   image.push({
    //     key: this.sliderImg
    //     // key: 'category/No-image-available.jpg'
    //   });
    //   value.image = image[0];
    //   console.log(this.empId);
    //   value.createBy = this.empId;
    //   value.updateBy = this.empId;
    //   value.stype = this.type;
    //   if (value.category !== undefined) {
    //     var int = [];
    //     int.push({
    //       category: value.category[0].id
    //     });
    //     value.internal = int[0];
    //   }
    //   if (this.int2.length !== 0) {
    //     value.internal = this.int2[0];
    //   }
    //   if (value.url !== undefined) {
    //     var a = [];
    //     a.push({
    //       link: value.url
    //     })
    //     value.external = a[0];
    //   }
    //   this._SliderService.postSlider(value)
    //     .subscribe(
    //       result => {
    //         console.log(result);
    //         // if (result ) {
    //         //   this.toastr.success('Home Slider added Successfully!', 'Good job!');
    //         // }
    //       }
    //     );
    //   // console.log(value);
    // }else {
    //   swal({
    //     type: 'error',
    //     title: 'Oops...',
    //     text: 'Home Screen Slider Image Is Required! ',
    //   });
    // }


  }

  deleteimageById(value){
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
          this._SliderService.deleteSlider(value).subscribe(
            result => {
              this.getImages();
              that.toastr.success(' Video Tutorial Deleted successfully!', 'Success');
            }
          );

        } else {
          swal('Your record is safe!');
        }
      });

  }

  linkTypeClick(value) {
    this.type = value;
    if (value === 'Internal') {
      this.showInternal = true;
      this.showUrl = false;
    }else if (value === 'External') {
      this.showInternal = false;
      this.showUrl = true;
      this.showMobile = false;
      this.showCategory = false;
    }
  }

  internalTypeClick(value) {
    if (value === 'Vendor') {
      this.showInternal = true;
      this.showMobile = true;
      this.showCategory = false;
    }else if (value === 'Category') {
      this.showInternal = true;
      this.showMobile = false;
      this.showCategory = true;
    }
 }


  getCategory() {
    this._SliderService.getAllCategory()
      .subscribe(
        res => {
          this.proCatObj = res;
          for (let i = 0; i < this.proCatObj.length; i++) {
            this.tmpexampleData1.push({'id': this.proCatObj[i]._id, 'text': this.proCatObj[i].name});
          }
          this.proCat = this.tmpexampleData1;
        });
  }


  fileSelect(evt) {
    this.files = evt.target.files;
    this.file = this.files[0];
    var _URL = window.URL;
    var s = this;
    var file, img;
    if ((file = this.file)) {
      img = new Image();
      img.onload = function () {
        if (this.height < 600 && this.width <= 1600) {
          s.modalAdd.hide();
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Image resolution must be (1600px X 600px)',
          });
          $('#tt').val('');

        } else {
          // s.imgvalid = true;
          s.uploadfile(file);
        }

      };
      img.src = _URL.createObjectURL(file);
    }
  }

  uploadfile(value) {
    var awsConfig = new AWS.Config({
      accessKeyId: environment.awsAccessKey,
      secretAccessKey: environment.awsSecretKey,
      region: environment.awsRegion,
    });
    const s3 = new AWS.S3(awsConfig);
    s3.upload({Bucket: 'jhakaas-docs', Key: 'homeSlider/' + value.name, Body: value}, (err, data) => {
      this.sliderImg = data.Key;
      if (this.sliderImg !== undefined) {
        const urlParams = {
          Bucket: 'jhakaas-docs',
          Key: this.sliderImg
        };
        new Promise((resolve, reject) => {
          s3.getSignedUrl('getObject', urlParams, (err2, url) => {
            this.url = url;
          });
        });
      }
    });
  }


}
