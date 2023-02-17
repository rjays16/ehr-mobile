import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, IonBackButtonDelegate } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LoginService } from './../../services/login.service';
import { LoadingService } from './../../services/loading.service';
import { PatientService } from './../../services/patient.service';
import { PlanManagementApiService } from './../../services/plan-management-api.service';
import { PlanManagementDataService } from './../../services/plan-management-data.service';
import { ApiService } from './../../services/api.service';
import { StringUtilsService } from './../../services/string-utils.service';
import { Authentication } from './../../models/authentication';
import { PromptModalPage } from './../../pages/prompt-modal/prompt-modal.page';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { AlertServiceService } from 'src/app/app/services/alert-service.service';

@Component({
  selector: 'app-radiology-order',
  templateUrl: './radiology-order.page.html',
  styleUrls: ['./radiology-order.page.scss'],
})
export class RadiologyOrderPage implements OnInit {
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  pageCount = 1;
  selectedEncounterNo: string;
  authentication: Authentication;
  defaultOptions: any;
  services: any[];
  groupServices: any[];
  areaGroupServices: any[];
  filteredGroupServices: any[];
  transactionTypes: any[];
  filteredServices: any[];
  selectedServices: any[] = [];
  selectedServiceName: string;
  selectedAreaGroupService = 0;
  selectedAreaGroupService_all = 0;
  selectedServiceGroup = 0;
  selectedServiceGroup_all = 0;
  clinicalImpression: string;

  totalCash=0;
  totalCharge=0;
  totalPhicCharge = 0;
  totalOldPhicCharge = 0;
  totalPersonalCharge = 0;
  subTotal = 0;
  totalDiscount = 0;
  netTotal = 0;

  showedLimit = 20;
  showedIncomplete = false;
  diagnosticSearchFeild:string;
  serviceGroupActive: any[];

  isCash = true;
  isCharge = true;
  chargeType = '';
  chargeTypeDef = '';
  origChargeType = '';
  isRoutine = true;
  isStat = false;

  remarks: string;
  dateTime: any;
  date: any;
  time: any;
  dateChecked = false;
  dateToggle = false;

  disableToggleDate = false;
  disableSaveButton = false;
  disableDate = false;
  disableTime = false;

  private SAVE_DIAGNOSTICS_RADIOLOGY_ORDER = 1;

  // keyboard params
  y: any;
  h: any;
  offsetY: any;
  er = this.patientService.getSelectedPatientBriefInformation().current_dept_encounter.deptenc_code === 'ere';
  ipes = this.patientService.getSelectedPatientBriefInformation().current_dept_encounter.deptenc_code === 'ipe';
  isfinal =  !this.patientService.getSelectedPatientBriefInformation().is_final;
  otherData;
  orderList: any[] = [];
  origSelectedServices: any[] = [];
  origTransType:any = 'Cash';
  transType = this.ipes && this.isfinal || this.er && this.isfinal ? 'Charge' : 'Cash';
  transTypeDef = 'Cash';
  status_charge;
  prioType = 'Routine';

  allowTrigger = false;

  max_time;
  min_time;
  max_date;
  min_date;
  admissionDate;
  isDateBellowAdmission = false;
  isDateAboveCurrentDate = false;

  selectedFrequencyOptions = [];
  isForMonitor = false;
  selectedFrequency:any;

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    public patientService: PatientService,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private apiService: ApiService,
    private alertSrv: AlertServiceService,
    private stringUtilsService: StringUtilsService,
    private planManagementApiService: PlanManagementApiService,
    private planManagementDataService: PlanManagementDataService,
    private route: ActivatedRoute
    ) {
    this.selectedEncounterNo = this.patientService.getSelectedEncounterNo();
    this.authentication = this.loginService.getAuthentication();
    this.planManagementApiService.setUrl(this.apiService.getUrl());
    this.planManagementApiService.setToken(this.authentication.token);
    const configAndDefaults = this.loginService.getConfigAndDefaults();
    this.defaultOptions = configAndDefaults.radiology['m-patient-radiology']['default-options'];
    this.transactionTypes = this.defaultOptions.transaction_type;
    this.areaGroupServices = this.defaultOptions['rad-group-areas'];
    this.groupServices = this.defaultOptions['rad-group-services'];
    this.services = this.defaultOptions['rad-services'];
    this.selectedFrequencyOptions = this.defaultOptions['monitoring_option'].map((item)=>{
      return {
        id: item.frequency_code,
        value: item.frequency_desc,
      };
    });
    
    console.log('this.selectedFrequencyOptions',this.selectedFrequencyOptions);
    console.log('this.transactionTypes: ', this.transactionTypes);
    console.log('this.areaGroupServices: ', this.areaGroupServices);

    console.log('this.groupServices:', this.groupServices);

    this.selectedAreaGroupService = this.selectedAreaGroupService_all;
    this.selectedServiceGroup = this.selectedServiceGroup_all;
    
    this.filteredServices = [...this.services].map(i=>i);
    this.filteredGroupServices = [...this.groupServices].map(i=>i);

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.status_charge = this.ipes && this.isfinal || this.er && this.isfinal ? this.isCharge = true : this.isCharge = false
    this.initConfirDef();
    this.initOriginalOrders(this.planManagementDataService.getDiagnosticRadUnfinalized());
    window.addEventListener('native.keyboardshow', this.keyboardShowHandler);
    window.addEventListener('native.keyboardhide', this.keyboardHideHandler);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    window.removeEventListener('native.keyboardshow', this.keyboardShowHandler);
    window.removeEventListener('native.keyboardhide', this.keyboardHideHandler);
    this.removeIonAppStyles();
  }
  
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.backButton.onClick = () => {
      if(this.pageCount == 1)
        this.backToDiagnostic();
      else if(this.pageCount > 1)
        this.backToPreviousPage();
    };
  }

  initConfirDef(){
    this.showGroupServices();
    this.showServices();
  }

  ngOnInit() {

    const action = this.route.snapshot.paramMap.get('action');
    this.otherData = JSON.parse(this.route.snapshot.paramMap.get('otherData'));
    this.orderList = JSON.parse(this.route.snapshot.paramMap.get('orderList'));
    this.origSelectedServices = [];
    this.initConfirDef();
    this.initDateValues();

    console.log('action: ', action);
    if (action) {
      if (action == 'edit') {
        const orders = this.route.snapshot.paramMap.get('radiologyList');
        const index = this.route.snapshot.paramMap.get('index');
        if (orders) {
          const radiologyList: any = JSON.parse(orders);
          
          this.initOriginalOrders(radiologyList);
        }
      }
    }
    else{
    }

    this.dateTime = moment().format();
    this.date = this.dateTime;
    this.time = this.dateTime;
    
    this.calculateTotallabOrders();
    this.clinicalImpression = this.otherData.clinical;

    if(this.isCash)
      this.isCharge = false;
    else
      this.isCharge = true;

    this.allowTrigger = true;
  }

  initOriginalOrders(radiologyList: any[]){
    this.origSelectedServices = radiologyList;
    radiologyList.forEach(order => {
      const selected = this.filteredServices.find(service => {
        return service.id === order.item.id;
      });
      selected.selected = true;
      selected.oldorder = true;
      selected.charge_type = order.charge ? order.charge_type : null;
      selected.cash = order.cash;
      selected.charge = order.charge;
      this.transType = selected.cash? 'Cash' : 'Charge';
      this.chargeType = selected.charge_type ? selected.charge_type : '';
      this.origTransType = this.transType;
      this.transTypeDef = this.transType;
      this.chargeTypeDef = this.chargeType;
      this.origChargeType = this.chargeType;
      this.remarks = order.remarks;
      selected.order_date = order.order_date;
      selected.impression = order.impression;
      selected.monitor = order.frequency;
      if(order.frequency){
        const selectedFreq = this.selectedFrequencyOptions.find(item=>{
          return item.id == order.frequency;
        });
        selected.monitor_details = selectedFreq.value;
      }
      else{
        selected.monitor = false;
      }
      selected.remarks = order.remarks;
      selected.stat = order.stat;
      selected.requestDate = order.requestDate;
      selected.database_id = order.id;
      console.log ('origSelectedServices selected: ', selected);
    });
  }
  
  backToDiagnostic() {
    console.log('back');
    this.navCtrl.pop();
  }

  backToPlanManagement() {
    console.log('back');
    this.navCtrl.pop().then(()=>{
      this.navCtrl.pop();
    });
  }

  backToPreviousPage() {
    this.pageCount = this.pageCount - 1;
  }

  proceedToNextPage() {
    if (this.pageCount === 2) {
      this.selectedServices = this.services.filter(item => {
        return item.selected === true;
      });
      if (this.selectedServices.length === 0) {
        this.openAlertModal('fail', 'Failed', "No Services selected.", 'Ok');
        return;
      }
    } else if (this.pageCount === 3) {
      if (this.selectedServices.length === 0) {
        this.openAlertModal('fail', 'Failed', "No Services selected.", 'Ok');
        return;
      }
    }
    else if(this.pageCount == 1){
      if(this.isDateAboveCurrentDate || this.isDateBellowAdmission || !(this.date && this.time) || (this.isStat && !this.remarks) || !this.clinicalImpression){
        this.openAlertModal('fail', 'Failed', "Some field is invalid.", 'Ok');
        return false;
      }
    }

    this.pageCount = this.pageCount + 1;
  }

  checkRepeatedMonitoredService(){
      let listOfRepeated = [];
      this.orderList.forEach(item=>{
          console.log('item.radiologyOrders', item.radiologyOrders);
          console.log('this.selectedServices', this.selectedServices);
          item.radiologyOrders.forEach(order=>{
              // order.item.code
  
              const sele = this.selectedServices.find(unfinalizedItem=>{
                  return order.item.code == unfinalizedItem.code;
              });
              if(sele){
                  const exist = listOfRepeated.find(duplicate=>{
                      return sele.code == duplicate.code;
                  });
                  if(!exist){
                      listOfRepeated.push(order.item.name+":"+order.order_date.split(" ")[0]);
                  }
              }
          });
      });
      return listOfRepeated;
  }

  async showAlertForRepeatedService(list=[]){
          await this.alertSrv.openAlertModalValidation('warning','Request', "There are repetitive request. Whould you like to proceed?",list, 'Save',(result) => {
              if( result == 'Save'){
                  this.submitDiagnosticRadiologyOrdersFunction();
              }
          },'Cancel', ()=>{});
      }
      
  submitDiagnosticRadiologyOrders() {
      console.log('this.totalCharge ,this.otherData.phic_coverage',this.totalCharge ,this.otherData.phic_coverage)
      if(this.totalPhicCharge > this.otherData.phic_coverage &&  this.chargeType == 'phic'){
          this.openAlertModal('fail', 'Failed', "Total charge orders should not exceeds the coverage limit. "+this.otherData.phic_coverage, 'Ok');
      }
      else{
          if (this.date && this.time) {
              let result = this.checkRepeatedMonitoredService();
              if(result.length > 0){
                  this.showAlertForRepeatedService(result);
                  return false;
              }
              else
                  this.openPromptModal(this.SAVE_DIAGNOSTICS_RADIOLOGY_ORDER, {}, 'Radiology Orders', 'Would you like to save your changes?');
          }
      }
  }

  submitDiagnosticRadiologyOrdersFunction() {
    let dateTimeObject: any;
    if (this.dateChecked) {
      if (!this.dateTime) {
        this.dateTime = moment().format();
      }
      dateTimeObject = new Date(this.dateTime);
    } else {
      // If dateChecked is false, combine date and time rather than using dateTime object
      const dateObject = new Date(this.date);
      const tempDate = moment(dateObject).format('YYYY-MM-DD');
      console.log('dateObject: ', dateObject);
      console.log('tempDate: ', tempDate);

      let tempTime = this.time;
      try {
        const timestamp = Date.parse(tempTime);
        if (isNaN(timestamp) === false) {
          const d = new Date(timestamp);
          tempTime = moment(d).format('HH:mm');
        }
      } catch (err) {
        // do nothing
      }
      console.log('tempTime: ', tempTime);

      // combine date and time to form new dateTime object
      const tempDateTime = tempDate + ' ' + tempTime;
      dateTimeObject = new Date(tempDateTime);
    }

    console.log('dateTimeObject: ', dateTimeObject);
    const order_date = moment(dateTimeObject).unix();
    const order_time = moment(dateTimeObject).format('HH:mm');

    console.log('order_date formatted: ', moment.unix(order_date).format());
    console.log('order_time formatted: ', order_time);

    const encounter_no = this.selectedEncounterNo;
    const orders = {};
    this.selectedServices.forEach(element => {
      const value: any = {
        cash: this.isCash,
        charge: this.isCharge,
        charge_type: this.isCharge ? this.chargeType : '',
        check: this.dateChecked,
        stat: this.isStat,
        cash_price: element.cash_price,
        charge_price: element.charge_price,
        name: element.name,
        order_dt: order_date,
        requestDate: order_date,
        servicesID: element.id,
        sname: element.servicename,
        clinical: this.clinicalImpression,
        remarks: this.remarks
      };
      if (element.database_id) {
        value.id = element.database_id;
      }
      orders[element.id] = value;
    });
    console.log('orders', orders);

    this.loadingService.present();
    this.planManagementApiService.saveDiagnosticRadiology(encounter_no, orders).subscribe((result: any) => {
      console.log(result);
      this.loadingService.dismiss().then(_ => {
        if (result && 200 === result.code) {
          const batch = result.data.batch;
          this.planManagementDataService.setUnfinalizedBatch(batch);
          this.planManagementDataService.setDiagnosticRadUnfinalized(this.selectedServices);
          console.log('batch: ', batch);
          this.openAlertModal('success', 'Success', result.message, 'Done', true);
        } else {
          this.openAlertModal('fail', 'Failed', result.message, 'Ok');
        }
      });
    }, (err) => {
      console.log('err ', err);
      this.loadingService.dismiss().then(_ => {
        const message = this.stringUtilsService.parseErrorMessage(err);
        this.openAlertModal('fail', 'Failed', message, 'Ok');
      });
    });
  }

  selectService(index: number , prevInd:number = null) {
    const filteredItem = this.filteredServices[index];
    if(this.isForMonitor && !(this.selectedFrequency) && !filteredItem.selected){
      this.openAlertModal('fail', 'Failed', 'Select frequency first.', 'Ok');
      return false;
    }

    if (!(filteredItem.status == '' || filteredItem.status == null )) {
      this.openAlertModal('fail', 'Failed', 'Service '+filteredItem.status, 'Ok');
      return;
    }

    if(filteredItem.oldorder === true){
      this.openAlertModal('fail', 'Failed', "This service can not be delete from here.", 'Ok');
      return;
    }

    filteredItem.selected = !filteredItem.selected;
    filteredItem.monitor = this.isForMonitor;
    if(filteredItem.selected && this.isForMonitor){
      const selected = this.selectedFrequencyOptions.filter(item=>{
        return item.id == this.selectedFrequency;
      });

      filteredItem.monitor = this.selectedFrequency;
      filteredItem.monitor_details = selected[0].value;
    }
    else{
      filteredItem.monitor = false;
    }

    this.calculateTotallabOrders();
    if(this.totalCharge > this.otherData.phic_coverage && index != prevInd && this.chargeType == 'phic'){
      this.openAlertModal('fail', 'Failed', "Total charge orders should not exceed the coverage limit. "+this.otherData.phic_coverage, 'Ok');
      this.selectService(index, index);
    }
  }

  unselectService(index: number) {
    const selectedService = this.selectedServices[index];
    selectedService.selected = false;
    this.selectedServices.splice(index, 1);
    this.calculateTotallabOrders();
  }

  servicesNameInputChanges(event: any) {
    this.showedLimit = 20;
    this.showServices();
  }

  areaGroupChanges(event: any) {
    this.showedLimit = 20;
    this.showGroupServices();
    this.showServices();
  }

  servicesGroupChanges(event: any) {
    this.showedLimit = 20;
    this.showServices();
  }

  showMoreServices(){
    this.showedLimit = this.showedLimit + 20;
    this.showServices();
  }

  showGroupServices(){
    let active = [];
    this.filteredGroupServices.forEach((element, index) => {
      if(this.selectedAreaGroupService == this.selectedAreaGroupService_all)
        this.filteredGroupServices[index].show =   true;
      else{
        if(this.selectedAreaGroupService == element.area_id){
          this.filteredGroupServices[index].show = true;
          active.push(element.id);
        }else{
          this.filteredGroupServices[index].show = false;
        }
      }
      
    });

    this.serviceGroupActive = active;
    this.selectedServiceGroup = 0;
  }

  showServices(){
    let showed = 0;
    this.showedIncomplete = false;
    this.filteredServices.forEach((element, index) => {
        if(this.selectedServiceGroup == this.selectedServiceGroup_all && this.selectedAreaGroupService == this.selectedAreaGroupService_all)
          this.filteredServices[index].show =   element.name.toLocaleLowerCase().indexOf(this.diagnosticSearchFeild ? this.diagnosticSearchFeild.toLocaleLowerCase():'') !== -1;
        else if(this.selectedAreaGroupService != this.selectedAreaGroupService_all && this.selectedServiceGroup == this.selectedServiceGroup_all)
          this.filteredServices[index].show =  this.serviceGroupActive.includes(element.groupCode) && element.name.toLocaleLowerCase().indexOf(this.diagnosticSearchFeild ? this.diagnosticSearchFeild.toLocaleLowerCase():'') !== -1;
        else
          this.filteredServices[index].show =  this.selectedServiceGroup == element.groupCode && element.name.toLocaleLowerCase().indexOf(this.diagnosticSearchFeild ? this.diagnosticSearchFeild.toLocaleLowerCase():'') !== -1;

        
      if(showed < this.showedLimit && this.filteredServices[index].show){
        showed++;
      }
      else{
        if(this.filteredServices[index].show && showed >= this.showedLimit){
          this.showedIncomplete = true;
        }

        this.filteredServices[index].show = false;
      }
    });

    console.log('this.showedIncomplete', this.showedIncomplete);
  }

  unselectAllService(forceAll = false) {
    console.log('unselectAllService()');
    this.filteredServices.map(item=>{
      const selected = this.selectedServices.find(service => {
        return service.id === item.id;
      });

      if(!item.oldorder){
        if(selected){
          selected.selected = false;
        }
        item.selected = false;
      }
      if(forceAll){
        if(selected){
          selected.selected = false;
        }
        item.selected = false;
        item.oldorder = false;
      }
      console.log('this.selectedServices[key]', item);
      return item;
    });
    this.calculateTotallabOrders();
  }

  transactionTypeChange($event = null) {
    if(!this.allowTrigger)
      return ;

    console.log('transactionTypeChange() triggered');
    const selectedServices = this.services.filter(item => {
      return item.selected === true;
    });

    let warningMessage = "Performing this action will clear the order tray. Do you wish to continue?";
    if(this.origSelectedServices.length > 0 && this.origTransType && (this.transType != this.origTransType || (this.origTransType == "Charge" && this.chargeType != this.chargeTypeDef))){
      let chargeType = "";
      if(this.origTransType == "Charge" && this.chargeType != this.chargeTypeDef){
        const selected = this.transactionTypes.find(option => {
          return option.id == this.chargeTypeDef;
        });

        if(selected)
          chargeType = selected.charge_name;

        chargeType = ":"+chargeType;
      }
      warningMessage = "Performing this action will clear the unfinalized radiology order because previous transaction type is "+(this.origTransType+chargeType)+". Do you wish to continue?";
    }

    if((this.transType != this.transTypeDef || (this.transType == 'Charge' && this.chargeType != this.chargeTypeDef)) && selectedServices.length > 0){
      this.alertSrv.openPromptModal('Warning', warningMessage ,'YES',(result) => {
          this.allowTrigger = false;
          this.isCash = this.transType === 'Cash';
          this.isCharge = this.transType === 'Charge';   
          this.chargeTypeDef = this.chargeType;
          this.transTypeDef = this.transType;
          this.origTransType = '';
          this.unselectAllService(true);
          this.allowTrigger = true;
          this.calculateTotallabOrders();
      },'NO', ()=>{
        this.allowTrigger = false;
        this.chargeType = this.chargeTypeDef;
        this.transType = this.transTypeDef;
        this.isCash = this.transType === 'Cash';
        this.isCharge = this.transType === 'Charge'; 
        this.allowTrigger = true;
        this.calculateTotallabOrders();
      }, false);
    }
    else{
      this.isCash = this.transType === 'Cash';
      this.isCharge = this.transType === 'Charge';   
      this.chargeTypeDef = this.chargeType;
      this.transTypeDef = this.transType;
      this.allowTrigger = true;
      this.calculateTotallabOrders();
    }

    
    console.log('this.isCharge: ', this.isCharge, 'this.isCash: ', this.isCash);
  }

  calculateTotallabOrders(){
    this.totalCash = 0;
    this.totalCharge = 0;
    this.totalPhicCharge = 0;
    this.totalOldPhicCharge = 0;
    this.totalPersonalCharge = 0;
    this.totalDiscount = 0;
    let discountedPriceTotal = 0;

    const selectedList = this.filteredServices.filter(item=>{

      if(item.selected){
        console.log('item',item);
        if(item.oldorder && item.cash){
          this.totalCash += parseFloat(item.cash_price);
          discountedPriceTotal += parseFloat(item.net_price);
        }
        else if(item.oldorder && item.charge && item.charge_type == 'phic'){
          this.totalCharge += parseFloat(item.charge_price);  
          this.totalOldPhicCharge += parseFloat(item.charge_price);  
          this.totalPhicCharge += parseFloat(item.charge_price);
        }
        else if(item.oldorder && item.charge){
          this.totalCharge += parseFloat(item.charge_price);  
          this.totalPersonalCharge += parseFloat(item.charge_price);
        }
        else if(this.isCharge){
          this.totalPhicCharge += this.chargeType == 'phic' ? parseFloat(item.charge_price) :0 ;
          this.totalPersonalCharge += this.chargeType == 'phic' ? 0 : parseFloat(item.charge_price) ;
          
          this.totalCharge += parseFloat(item.charge_price);
        }
        else{
          this.totalCash += parseFloat(item.cash_price);
          discountedPriceTotal += parseFloat(item.net_price);
        }

      }

      return item.selected;
    });

    console.log('selectedList',selectedList);
    if(this.otherData.discounts.classification && this.totalCash > 0){
      this.totalDiscount = this.totalCash - discountedPriceTotal;
    }
    
    console.log('totalCash,totalCharge,totalPhicCharge,totalOldPhicCharge,totalPersonalCharge,totalDiscount',
      this.totalCash,
      this.totalCharge,
      this.totalPhicCharge,
      this.totalOldPhicCharge,
      this.totalPersonalCharge,
      this.totalDiscount,
    );
    this.subTotal = this.totalCash + this.totalCharge;
    this.netTotal = (this.totalCash >= this.totalDiscount ? this.totalCash - this.totalDiscount : 0) + this.totalCharge;
  }

  priorityChange() {
    this.isRoutine = this.prioType == 'Routine';
    this.isStat = this.prioType == 'Stat';
    console.log('this.isStat: ', this.isStat, 'this.isRoutine: ', this.isRoutine);
  }

  currentDateToggleClick() {
    this.dateChecked = !this.dateChecked;
    if (this.dateChecked) {
      this.dateTime = moment().format();
      this.date = this.dateTime;
      this.time = this.dateTime;
    }else{
      this.date = '';
      this.time = '';
    }
    this.disableDate = this.dateChecked;
    this.disableTime = this.dateChecked;
  }

  validateDate(){
    this.isDateAboveCurrentDate = this.isDateBellowAdmission = false;

    if(!(this.date) || !(this.time))
      return false;

    const startDate = moment(new Date(moment(new Date(this.date)).format('YYYY-MM-DD')+"T"+moment(new Date(this.time)).format('HH:mm')+":00+08:00"));
    const currentDate = moment();
    console.error( {
      date: this.date,
      time: this.time,
      startDate: startDate.format() , 
      currentDate: currentDate.format(), 
      startDateUnix: startDate.unix() , 
      currentDateUnix: currentDate.unix()
    })
    if(startDate.unix() > currentDate.unix())
      this.isDateAboveCurrentDate = true;
    
    if(startDate.unix() < this.admissionDate.unix())
      this.isDateBellowAdmission = true;

  }

  dateValueChange(event:any){
    const newDate = moment(new Date(event));
    const fDate = newDate.format("YYYY-MM-DD");
    this.max_time = moment().format("YYYY-MM-DD")+'T23:59:59+08:00';
    // update min time equivalent to encounter date
    if(fDate == this.admissionDate.format("YYYY-MM-DD") && fDate != moment().format("YYYY-MM-DD")){
      console.error('fDate == this.admissionDate.format("YYYY-MM-DD") && fDate != moment().format("YYYY-MM-DD")');
      this.min_time = this.admissionDate.format();
    }
    else if(fDate == this.admissionDate.format("YYYY-MM-DD") && fDate == moment().format("YYYY-MM-DD")){
      console.error('fDate == this.admissionDate.format("YYYY-MM-DD") && fDate == moment().format("YYYY-MM-DD")');
      this.min_time = this.admissionDate.format();
      this.max_time = moment().format();
    }
    else{
      this.min_time = moment().format("YYYY-MM-DD")+'T00:00:00+08:00';
      if(fDate == moment().format("YYYY-MM-DD")){
        this.max_time = moment().format();
      }
    }
    
    console.error('dateValueChange date', this.min_time, this.max_time, fDate, moment(new Date(this.min_date)).format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"));
  }

  initDateValues(){
    this.max_date = this.min_time = moment().format();
    console.error('this.max_date' ,this.max_date);

    this.admissionDate = moment.unix(this.patientService.getSelectedPatientBriefInformation().encounter_date);
    
    this.min_date = this.admissionDate.format();
    console.error('this.min_date' ,this.min_date);

    this.dateValueChange(this.max_date);
  }

  async openPromptModal(option: number, data: any, title: string, message: string,  ok: string = 'Save', cancel: string = 'Cancel') {
    return await this.alertSrv.openPromptModal(title, message,ok,(result) => {
      if (result !== null) {
        console.log('result.data: ', result.data);
        if (result.data && result.data.button === 'Save') {
          if (option === this.SAVE_DIAGNOSTICS_RADIOLOGY_ORDER) {
            this.submitDiagnosticRadiologyOrdersFunction();
          }
        }
      }
    },cancel);
  }

  async openAlertModal(alert: string, title: string, message: string, ok: string = 'Done', dismiss: boolean = false) {
    return await this.alertSrv.openAlertModal(alert, title, message,ok,(result) => {
      if (dismiss) {
        this.backToPlanManagement();
      }
    });
  }

  tapCoordinates(e) {
    this.y = e.touches[0].clientY;
    this.h = window.innerHeight;
    this.offsetY = (this.h - this.y);
    console.log('offset: ', this.offsetY);
  }

  keyboardShowHandler(e) {
    const kH = e.keyboardHeight;
    console.log('show: ', e.keyboardHeight);
    const bodyMove = document.querySelector('ion-app') as HTMLElement, bodyMoveStyle = bodyMove.style;

    // Adjust full keyboard height
    bodyMoveStyle.bottom = kH + 'px';
    /*
    if (this.offsetY < kH + 40) {
      bodyMoveStyle.bottom = (kH - this.offsetY + 40) + 'px';
      // bodyMoveStyle.top = 'initial';
    }
    */
    console.log(bodyMoveStyle.bottom);
  }

  keyboardHideHandler() {
    console.log('gone');
    const removeStyles = document.querySelector('ion-app') as HTMLElement;
    removeStyles.removeAttribute('style');
  }

  removeIonAppStyles() {
    const removeStyles = document.querySelector('ion-app') as HTMLElement;
    removeStyles.removeAttribute('style');
  }
}
