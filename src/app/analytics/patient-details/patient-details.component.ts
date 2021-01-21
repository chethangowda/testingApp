import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource, MatSelectChange, Sort } from '@angular/material';
import { GENDERS, Patient } from '../shared';
import { PatientViewService } from 'src/services/patientview_sevice';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/services/data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MdePopoverTrigger } from '@material-extended/mde';
import { saveAs } from 'file-saver';

const resourcecList = [
  // { name: 'Demographic', id: 'Demographic',
  //   displayColumns: [
  //     { cName: 'ixID', dcName: 'interopId' },
  //     { cName: 'DSID', dcName: 'datasourcecID' },
  //     { cName: 'First Name', dcName: 'firstName' },
  //     { cName: 'Last Name', dcName: 'lastName' },
  //     { cName: 'Gender', dcName: 'gender' },
  //     { cName: 'DOB', dcName: 'dob' },
  //     { cName: 'Details', dcName: 'details' },
  //   ]
  // },


  {
    name: 'AllergyIntolerance', id: 'AllergyIntolerance',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Clinical Status', dcName: 'disclinical' },
      { cName: 'Verification Status', dcName: 'disverification' },
      { cName: 'Type', dcName: 'distype' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Code System', dcName: 'discodesystem' },
      { cName: 'Code', dcName: 'disCode' },
      { cName: 'Onset Date', dcName: 'disstartDateTime', multiDataType: 'onsetDate' },
      // { cName: 'End Date', dcName: 'disendDateTime' },
      { cName: 'Recorded Date', dcName: 'disrecordDateTime' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Reaction', dcName: 'disReaction' },
      { cName: 'Severity', dcName: 'severity' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'Practitioner', dcName: 'disIndividual' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ]
  },
  {
    name: 'CarePlan', id: 'CarePlan',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Intent', dcName: 'intent' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'CarePlan Name', dcName: 'disname' },
      { cName: 'Description', dcName: 'disdescription' },
      { cName: 'Start Date', dcName: 'disstartDate' },
      { cName: 'End Date', dcName: 'disendDate' },
      { cName: 'Created Date', dcName: 'disCreated' },
      { cName: 'Activity Outcome', dcName: 'disoutcome' },
      { cName: 'Activity Progress', dcName: 'disprogress' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'CareTeam Id', dcName: 'discareteam' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'CareTeam', id: 'CareTeam',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'CareTeam Name', dcName: 'disname' },
      { cName: 'Telecom', dcName: 'distelecom' },
      { cName: 'Reason Code', dcName: 'disreason' },
      { cName: 'Start Date', dcName: 'disstartDate' },
      { cName: 'End Date', dcName: 'disendDate' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Practitioner Id', dcName: 'disIndividual' },
      { cName: 'Practitioner Role', dcName: 'dispracrole' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'Organization Id', dcName: 'disOrganization' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'Claim', id: 'Claim',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Type', dcName: 'claimcode' },
      { cName: 'Use', dcName: 'disUse' },
      { cName: 'Claim Date', dcName: 'disCreated' },
      { cName: 'Priority', dcName: 'disPriority' },
      { cName: 'Location', dcName: 'disLocation' },
      { cName: 'Practitioner', dcName: 'disPractitioner' },
      { cName: 'Procedure Code', dcName: 'disProcedure' },
      { cName: 'Diagnosis Code', dcName: 'disDiagnosis' },
      { cName: 'Insurance', dcName: 'discoverage' },
      { cName: 'ProductOrService Code', dcName: 'itemproductOrService' },
      { cName: 'Encounter', dcName: 'disEncounter' },
      { cName: 'Claim Total', dcName: 'disTotal' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  }, {
    name: 'ClaimResponse', id: 'ClaimResponse',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Type', dcName: 'claimcode' },
      { cName: 'Use', dcName: 'disUse' },
      { cName: 'Created Date', dcName: 'disCreated' },
      { cName: 'OutCome', dcName: 'disoutcome' },
      { cName: 'Disposition', dcName: 'disdisposition' },
      { cName: 'Payee Type', dcName: 'dispayee' },
      { cName: 'Submitted Amount', dcName: 'dissubmit' },
      { cName: 'CoPay Amount', dcName: 'discopay' },
      { cName: 'Benifit Amount', dcName: 'disbenifit' },
      { cName: 'Payment Type', dcName: 'dispaytype' },
      { cName: 'Payment Date', dcName: 'dispaydate' },
      { cName: 'Payment Amount', dcName: 'dispayamount' },
      { cName: 'Payment Identifier', dcName: 'dispayident' },
      { cName: 'Process Note', dcName: 'disNotes' },
      { cName: 'Insurer Id', dcName: 'disOrganization' },
      { cName: 'Requestor Id', dcName: 'disrequestor' },
      { cName: 'Claim Id', dcName: 'disclaim' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'Condition', id: 'Condition',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Code', dcName: 'disCode' },
      { cName: 'OnSet Date', dcName: 'disOnsetDate', multiDataType: 'onsetDate' },
      { cName: 'Resolution Date', dcName: 'disAbatementDateTime', multiDataType: 'abatement' },
      { cName: 'Clinical Status', dcName: 'disclinical' },
      { cName: 'Verification Status', dcName: 'disverification' },
      { cName: 'Encounter ID', dcName: 'disEncounter' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'Coverage', id: 'Coverage',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Policy Holder', dcName: 'dispolicy' },
      { cName: 'Subscriber', dcName: 'dissubscriber' },
      { cName: 'Subscriber Id', dcName: 'dissubscriberid' },
      { cName: 'Dependent Number', dcName: 'disdepnum' },
      { cName: 'Relationship', dcName: 'relcode' },
      { cName: 'Start Date', dcName: 'disStartDate' },
      { cName: 'End Date', dcName: 'disEndDate' },
      { cName: 'Payor', dcName: 'dispayor' },
      { cName: 'Class Type', dcName: 'discltype' },
      { cName: 'Class Value', dcName: 'disclvalue' },
      { cName: 'Class Name', dcName: 'disclname' },
      { cName: 'Insurance Type', dcName: 'disinstype' },
      { cName: 'CostToBeneficiary Type', dcName: 'discbtype' },
      { cName: 'CostToBeneficiary Value', dcName: 'discbvalue' },
      { cName: 'costToBeneficiary Unit', dcName: 'discbunit' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
      // { cName: 'Identifier', dcName: 'disIdentifier' },
      // { cName: 'Type', dcName: 'disType' },
    ],
  },
  {
    name: 'Device', id: 'Device',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Status Reason', dcName: 'disreason' },
      { cName: 'Distinct Identifier', dcName: 'disdidentifier' },
      { cName: 'Type', dcName: 'distype' },
      { cName: 'Manufacturer', dcName: 'dismanufact' },
      { cName: 'Manufacturer Date', dcName: 'dismanufactdate' },
      { cName: 'Expiration Date', dcName: 'disexpiredate' },
      { cName: 'Device Name', dcName: 'disdevicename' },
      { cName: 'Lot Number', dcName: 'dislot' },
      { cName: 'Serial Number', dcName: 'disserial' },
      { cName: 'Model Number', dcName: 'dismodel' },
      { cName: 'Telecom', dcName: 'distelecom' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Organization Id', dcName: 'disOrganization' },
      { cName: 'Location Id', dcName: 'disLocation' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'DiagnosticReport', id: 'DiagnosticReport',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Code', dcName: 'disCode' },
      { cName: 'Collection Date', dcName: 'effectiveDateAndtime', multiDataType: 'effectivetime' },
      { cName: 'Issued Date', dcName: 'issued' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'ServiceRequest Id', dcName: 'disservicereq' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'Practitioner Id', dcName: 'disIndividual' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'DocumentReference', id: 'DocumentReference',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      // { cName: 'Identifier', dcName: 'disIdentifier' },
      { cName: 'DocumentReference Status', dcName: 'docstatus' },
      { cName: 'Composition Status', dcName: 'compstatus' },
      { cName: 'Type', dcName: 'type' },
      { cName: 'Title', dcName: 'title' },
      { cName: 'Content', dcName: 'content' },
      { cName: 'Format', dcName: 'format' },
      { cName: 'Category', dcName: 'disCategory' },
      // { cName: 'Patient', dcName: 'patient' },
      { cName: 'CreationDate', dcName: 'date' },
      { cName: 'Start Date', dcName: 'startdate' },
      { cName: 'End Date', dcName: 'enddate' },
      // { cName: 'Author', dcName: 'author' },
      { cName: 'Practitioner Id', dcName: 'disIndividual' },
      { cName: 'Organization Id', dcName: 'disOrganization' },
      { cName: 'Encounter Id', dcName: 'disenclaim' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'Encounter', id: 'Encounter',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Start Time', dcName: 'starttime' },
      { cName: 'End Time', dcName: 'endtime' },
      { cName: 'Type', dcName: 'distype' },
      { cName: 'Class', dcName: 'disclass' },
      { cName: 'Reason', dcName: 'reason' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Location Id', dcName: 'disLocation' },
      { cName: 'Practitioner Id', dcName: 'disIndividual' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'ExplanationOfBenefit', id: 'ExplanationOfBenefit',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Type', dcName: 'disType' },
      { cName: 'Use', dcName: 'disUse' },
      { cName: 'Start Date', dcName: 'disstartDate' },
      { cName: 'End Date', dcName: 'disendDate' },
      { cName: 'Created Date', dcName: 'disCreated' },
      { cName: 'OutCome', dcName: 'disoutcome' },
      { cName: 'Supporting Category', dcName: 'dissupcategory' },
      { cName: 'Supporting Code', dcName: 'dissupcode' },
      { cName: 'Diagnosis Code', dcName: 'disdiacode' },
      { cName: 'Diagnosis Type', dcName: 'disdiatype' },
      { cName: 'Procedure Code', dcName: 'disprocode' },
      { cName: 'Procedure date', dcName: 'disprodate' },
      { cName: 'Procedure Type', dcName: 'disprotype' },
      { cName: 'Item Category', dcName: 'discategory' },
      { cName: 'ProductOrService', dcName: 'itemproductOrService' },
      { cName: 'Submitted Amount', dcName: 'dissubmit' },
      { cName: 'CoPay Amount', dcName: 'discopay' },
      { cName: 'Benifit Amount', dcName: 'disbenifit' },
      // { cName: 'Total Category', dcName: 'distotcategory' },
      // { cName: 'Total Amount', dcName: 'distotamount' },
      { cName: 'Payment Type', dcName: 'dispaytype' },
      { cName: 'Payment Date', dcName: 'dispaydate' },
      { cName: 'Payment Amount', dcName: 'dispayamount' },
      { cName: 'Payment Identifier', dcName: 'dispayident' },
      { cName: 'Adjustment Amount', dcName: 'disadjamount' },
      { cName: 'Process Note', dcName: 'disNotes' },
      { cName: 'Payee Id', dcName: 'disrequestor' },
      { cName: 'Organization Id', dcName: 'disOrganization' },
      { cName: 'Practitioner Id', dcName: 'disIndividual' },
      { cName: 'Location Id', dcName: 'disLocation' },
      { cName: 'Claim Id', dcName: 'disclaim' },
      { cName: 'ClaimResponse Id', dcName: 'disclaimres' },
      { cName: 'Coverage Id', dcName: 'discoverage' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'FamilyMemberHistory', id: 'FamilyMemberHistory',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Name', dcName: 'disname' },
      { cName: 'Gender', dcName: 'disgender' },
      { cName: 'BirthDate', dcName: 'disbirth', multiDataType: 'borndate' },
      { cName: 'Relationship', dcName: 'disrelation' },
      { cName: 'Reason Code', dcName: 'disCode' },
      { cName: 'Condition Code', dcName: 'disConcode' },
      { cName: 'Recorded Date', dcName: 'disdate' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'Goal', id: 'Goal',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'LifeCycleStatus', dcName: 'lifecyclestatus' },
      { cName: 'Description', dcName: 'disDescription' },
    ],
  },
  {
    name: 'Immunization', id: 'Immunization',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Status Reason', dcName: 'disstatusreason' },
      { cName: 'Code', dcName: 'disvacCode' },
      { cName: 'Primary Source', dcName: 'disprimary' },
      { cName: 'Administered Date', dcName: 'disoccurrence', multiDataType: 'occurence' },
      { cName: 'Recorded DateTime', dcName: 'disrecordDateTime' },
      { cName: 'Report origin', dcName: 'disorigin' },
      { cName: 'Expiration Date', dcName: 'disexpirationDate' },
      { cName: 'Lot Number', dcName: 'dislot' },
      { cName: 'Site', dcName: 'dissite' },
      { cName: 'Route', dcName: 'disroute' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Dose Quantity', dcName: 'disquantity' },
      { cName: 'Dose Unit', dcName: 'disUnit' },
      { cName: 'Performer Type', dcName: 'disperformer' },
      { cName: 'Performer', dcName: 'disrequestor' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' }
    ],
  },
  // { name: 'Location', id: 'Location',
  //   displayColumns: [
  //     { cName: 'Id', dcName: 'id' },
  //     { cName: 'Name', dcName: 'disName' },
  //     { cName: 'Description', dcName: 'disDescription' }
  //   ],
  // },
  {
    name: 'MedicationRequest', id: 'MedicationRequest',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Medication Code', dcName: 'code' },
      { cName: 'Authored On', dcName: 'disAuthoredOn' },
      { cName: 'Dose Quantity', dcName: 'disDoseQuantity' },
      { cName: 'Dose Duration', dcName: 'disDoseDuration' },
      { cName: 'Dose Time', dcName: 'disDoseTime' },
      { cName: 'Start Date', dcName: 'disStartDate' },
      { cName: 'End Date', dcName: 'disEndDate' },
      { cName: 'Encounter', dcName: 'disEncounter' },
      { cName: 'No of Refills', dcName: 'disRefills' },
      { cName: 'Practitioner', dcName: 'disPractitioner' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'MedicationStatement', id: 'MedicationStatement',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'status' },
      { cName: 'Status Reason', dcName: 'disreason' },
      { cName: 'Category', dcName: 'discategory' },
      { cName: 'Medication Code', dcName: 'medcode' },
      { cName: 'Effective Date', dcName: 'effectiveDateAndtime', multiDataType: 'effectivetime' },
      // { cName: 'End Date', dcName: 'disEndDate' },
      { cName: 'Reason Code', dcName: 'disreasoncode' },
      { cName: 'Asserted Date', dcName: 'disassertDate' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter', dcName: 'disEncounter' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },
  {
    name: 'VitalSigns', id: 'Observation',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Observation Code', dcName: 'disCode' },
      { cName: 'Status', dcName: 'disStatus' },
      { cName: 'Observation Value', dcName: 'disValue', multiDataType: 'valuedata' },
      // { cName: 'Observation Unit', dcName: 'disUnit' },
      { cName: 'Observation Date', dcName: 'disObservation', multiDataType: 'effectivetime' },
      { cName: 'Issued Date', dcName: 'disIssued' },
      { cName: 'Data Absent Reason', dcName: 'disReason' },
      { cName: 'Reference Range', dcName: 'disRange' },
      { cName: 'Interpretation', dcName: 'disInterpretation' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter', dcName: 'disEncounter' },
      { cName: 'Creation/Updation DateTime', dcName: 'disdatetime' },
    ],
  },
  {
    name: 'SocialHistory', id: 'Observation',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Observation Code', dcName: 'disCode' },
      { cName: 'Status', dcName: 'disStatus' },
      { cName: 'Observation Value', dcName: 'disValue', multiDataType: 'valuedata' },
      { cName: 'Observation Date', dcName: 'disObservation', multiDataType: 'effectivetime' },
      { cName: 'Issued Date', dcName: 'disIssued' },
      // { cName: 'Observation Unit', dcName: 'disUnit' },
      { cName: 'Data Absent Reason', dcName: 'disReason' },
      // { cName: 'Reference Range', dcName: 'disRange' },
      // { cName: 'Interpretation Code', dcName: 'disInterpretation' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter', dcName: 'disEncounter' },
      { cName: 'Creation/Updation DateTime', dcName: 'disdatetime' },
    ],
  },
  {
    name: 'LabResults', id: 'Observation',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Observation Code', dcName: 'disCode' },
      { cName: 'Status', dcName: 'disStatus' },
      { cName: 'Observation Value', dcName: 'disValue', multiDataType: 'valuedata' },
      // { cName: 'Observation Unit', dcName: 'disUnit' },
      { cName: 'Observation Date', dcName: 'disObservation', multiDataType: 'effectivetime' },
      { cName: 'Issued Date', dcName: 'disIssued' },
      { cName: 'Data Absent Reason', dcName: 'disReason' },
      { cName: 'Reference Range', dcName: 'disRange' },
      { cName: 'Interpretation', dcName: 'disInterpretation' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter', dcName: 'disEncounter' },
      { cName: 'Organization', dcName: 'disOrganization' },
      { cName: 'Practitioner', dcName: 'disIndividual' },
      { cName: 'ServiceRequest Id', dcName: 'disservicereq' },
      { cName: 'Creation/Updation DateTime', dcName: 'disdatetime' },
    ],
  },
  {
    name: 'Procedure', id: 'Procedure',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Category', dcName: 'disCategory' },
      { cName: 'Code', dcName: 'procode' },
      { cName: 'Date', dcName: 'disDateTime', multiDataType: 'performed' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'Practitioner Id', dcName: 'disIndividual' },
      { cName: 'Organization Id', dcName: 'disOrganization' },
      { cName: 'Location Id', dcName: 'disLocation' },
      { cName: 'ServiceRequest Id', dcName: 'disservicereq' },
      { cName: 'Diagnostic Report', dcName: 'disdiagnostic' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
      // { cName: 'Performed', dcName: 'performed' },
    ],
  },
  {
    name: 'Provenance', id: 'Provenance',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Recorded', dcName: 'disRecorder' },
      { cName: 'Reason', dcName: 'disReason' },
    ],
  },

  {
    name: 'RelatedPerson', id: 'RelatedPerson',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Relationship', dcName: 'disrelation' },
      { cName: 'Name', dcName: 'disname' },
      { cName: 'Telecom', dcName: 'distelecom' },
      // { cName: 'Email', dcName: 'disemail' },
      { cName: 'Gender', dcName: 'disgender' },
      { cName: 'BirthDate', dcName: 'disbirth' },
      { cName: 'Address', dcName: 'disaddress' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },

  {
    name: 'ServiceRequest', id: 'ServiceRequest',
    displayColumns: [
      { cName: 'Id', dcName: 'id' },
      { cName: 'Status', dcName: 'disstatus' },
      { cName: 'Intent', dcName: 'disintent' },
      { cName: 'Category', dcName: 'discategory' },
      { cName: 'Priority', dcName: 'dispriority' },
      { cName: 'Code', dcName: 'disCode' },
      { cName: 'Reason Code', dcName: 'reasoncode' },
      { cName: 'Body Site', dcName: 'dissite' },
      { cName: 'Patient Instruction', dcName: 'disinstruction' },
      { cName: 'Occurence Date', dcName: 'disdate', multiDataType: 'occurence' },
      { cName: 'Notes', dcName: 'disNotes' },
      { cName: 'Encounter Id', dcName: 'disEncounter' },
      { cName: 'Requester Id', dcName: 'disIndividual' },
      { cName: 'Performer Id', dcName: 'disrequestor' },
      { cName: 'Location Id', dcName: 'disLocation' },
      { cName: 'Creation/Updation DateTime', dcName: 'CreationTime' },
    ],
  },

  // removed because this two are not able to search by patient ID

  // { name: 'Organization', id: 'Organization',
  //   displayColumns: [
  //     { cName: 'id', dcName: 'id' },
  //     { cName: 'Name', dcName: 'disName' },
  //     { cName: 'Address', dcName: 'disAddress' },
  //     { cName: 'Identifier', dcName: 'disIdentifier' },
  //   ],
  // },
  // { name: 'Practitioner', id: 'Practitioner',
  //   displayColumns: [
  //     { cName: 'id', dcName: 'id' },
  //     { cName: 'Name', dcName: 'disName' },
  //     { cName: 'Telicom', dcName: 'disTelcom' },
  //   ],
  // },
  // { name: 'ProcedureRequest', id: 'ProcedureRequest' },

];

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PatientDetailsComponent implements OnInit {
  @ViewChild('target', { static: false, read: ElementRef }) target: MdePopoverTrigger;
  @ViewChild('widgetsContent', { static: true }) public widgetsContent: ElementRef<any>;
  @ViewChild('filterTextBox', { static: true }) filterTextBox: ElementRef;
  dDisplayedColumns: any = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Patient>;
  searchForm: FormGroup;
  genders = GENDERS;
  sections: any[] = resourcecList;
  activeSection = 'Demographic';
  selectedResourceItem: any;
  resourceTableData: any = null;
  totalRecords: any = 0;
  nextPageURL: any;
  previousPageURL: any;
  pageOffset: any;
  listcountinPage: any
  fromRecordCount: any = 0;
  toRecordCount: any = 0;
  tempcode = [];
  tempvalue = [];
  tempunit = [];
  tempreason = [];
  @Input() childMessage: any;
  selectedPatient: any;
  @ViewChild(MatSort, { static: true }) Sort: MatSort;
  sort: Sort = {
    active: 'id',
    direction: 'asc',
  };
  sectionname: any;
  previousdata: any;
  nextdata: any;
  category: any;

  constructor(private fb: FormBuilder,
    private patientViewService: PatientViewService,
    private dataPipe: DatePipe,
    private dataService: DataService) {
  }

  ngOnChanges() {
    this.selectedPatient = this.childMessage;
    this.selectSection(this.sections[0]);
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      familyName: [''],
      givenName: [''],
      gender: [''],
      birthDate: ['']
    });
  }

  onFilterText(event) {
    let filterText = event.target.value;
    this.dataSource.filter = filterText.trim();
  }

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  baseResourcecElement: any;
  isShowBaseResource(element) {
    return this.baseResourcecElement === element;
  }

  selectedOrg: any;
  selectedRefItem: any;
  toggleBaseResources(element, column, item) {
    this.selectedOrg = column;
    this.selectedRefItem = item;
    this.baseResourcecElement = this.baseResourcecElement == element ? null : element;
  }

  download(element, column, item) {
    var contentdata = atob(item[0].data)
    const blob = new Blob([contentdata], { type: 'text/plain' });
    var fileName = 'data.txt';
    saveAs(blob, fileName);
    this.selectedOrg = column;
    this.selectedRefItem = item;
    this.baseResourcecElement = this.baseResourcecElement == element ? null : element;
  }

  selectSection(selectedItem: any,) {
    this.filterTextBox.nativeElement.value = '';
    this.isNoData = false;
    this.dDisplayedColumns = [];
    this.displayedColumns = [];
    this.resourceTableData = null;
    this.selectedResourceItem = selectedItem;
    this.activeSection = selectedItem['id'];
    this.sectionname = selectedItem['name'];
    if (this.sectionname == 'VitalSigns') {
      this.category = 'vital-signs'
    }
    else if (this.sectionname == 'SocialHistory') {
      this.category = 'social-history'
    }
    else if (this.sectionname == 'LabResults') {
      this.category = 'laboratory'
    }
    else {
      this.category = undefined;
    }
    let ixID;
    if ('identifier' in this.selectedPatient.resource && this.selectedPatient.resource.identifier instanceof Array) {
      for (let identItem of this.selectedPatient.resource.identifier) {
        if ('value' in identItem && identItem.value && identItem.value.includes('IX-PATIENT')) {
          ixID = identItem.value;
        }
      }
    }


    if (selectedItem.id == 'Location') {
      let locationURL;
      if (this.selectedPatient && 'managingOrganization' in this.selectedPatient.resource) {
        if ('reference' in this.selectedPatient.resource.managingOrganization &&
          this.selectedPatient.resource.managingOrganization.reference) {
          let tempreference = this.selectedPatient.resource.managingOrganization.reference.split('/');
          if (tempreference && tempreference.length > 0) {
            locationURL = 'Location?' + tempreference[0].toLowerCase() + '=' + tempreference[1];

          }
        }
      }
      this.getLocationDetails(locationURL);
    } else {
      this.getResourceDetails(selectedItem, this.selectedPatient.resource.id, ixID, this.category);
    }



  }

  getLocationDetails(locationRef) {
    for (let item of this.selectedResourceItem['displayColumns']) {
      this.displayedColumns.push(item.cName);
      this.dDisplayedColumns.push(item);
    }
    if (locationRef != undefined) {
      this.patientViewService.getLocationResource(locationRef).subscribe(data => {

        if (data && 'entry' in data) {
          this.isNoData = false;
          this.fromRecordCount = 1;
          this.toRecordCount = data.entry.length;
        } else {
          this.isNoData = true;
        }
        this.formatResourceData(data, { id: 'Location' });

      }, error => {
        this.isNoData = true;
        this.resourceTableData;
        this.dataSource.data = this.resourceTableData;
      })
    } else {
      this.isNoData = true;
      this.resourceTableData;
      this.dataSource.data = this.resourceTableData;
    }
  }

  getpagedetails(data) {
    for (let item of data.link) {

      if (item.relation == 'next') {
        this.nextdata = item.url;
      }

      if (item.relation == 'self') {
        if (data.total == 0) {
          this.previousdata = null;
          this.nextdata = null;
          this.fromRecordCount = 0;
          this.toRecordCount = 0;
          return;
        }
        let searchoffSet: number = this.getparamParamValue(item.url, 'search-offset');
        this.fromRecordCount = +searchoffSet + 1;
        this.toRecordCount = +this.fromRecordCount + data.entry.length - 1;
      }

      if (item.relation == 'previous') {
        this.previousdata = item.url;
      }
    }
    this.isNoData = false;
    this.totalRecords = data.total;

  }


  isNoData: boolean = false;
  getResourceDetails(resource, patientID, ixID, category) {
    for (let item of resource['displayColumns']) {
      this.displayedColumns.push(item.cName);
      this.dDisplayedColumns.push(item);
    }
    let tempParam = {
      category: category,
      patient: patientID,
      ...(ixID && { ixid: ixID }),
      _format: 'json',
    }
    let param = {}
    if (category != undefined) {
      param['category'] = category;
    }
    param['patient'] = patientID;
    param['_format'] = 'json';
    param['search-offset'] = 0;
    param['_count'] = 10;
    this.patientViewService.patientResourcecData(resource.id, param).subscribe(data => {
      this.formatResourceData(data, resource);
      if (data && 'entry' in data) {
        this.isNoData = false;
        this.totalRecords = data.total;
        this.getpagedetails(data);
      } else {
        this.isNoData = true;
      }
    }, error => {
      this.fromRecordCount = 0;
      this.toRecordCount = 0;
      this.totalRecords = 0;
      this.isNoData = true;
      this.resourceTableData;
      this.dataSource.data = this.resourceTableData;
    })
  }

  getparamParamValue(URL, variable) {
    if (URL.indexOf("?") != -1) {
      let splitURL = URL.split("?");
      let splitParams = splitURL[1].split("&");
      for (let i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == variable) {
          return singleURLParam[1];
        }
      }
    } else {
      return null;
    }
  }

  formatResourceData(data, resource) {
    if (data && data.total > 0) {
      this.totalRecords = data.total;
      this.getPaginationURL(data);

      if (resource.id == 'AllergyIntolerance') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disclinical'] = 'clinicalStatus' in item.resource ? this.getresstatus(item.resource.clinicalStatus) : [];
          item['disverification'] = 'verificationStatus' in item.resource ? this.getresstatus(item.resource.verificationStatus) : [];
          item['distype'] = 'type' in item.resource ? item.resource.type : ' - ';

          if ('category' in item.resource && item.resource.category instanceof Array) {
            let tempcat = [];
            for (let catitem of item.resource.category) {
              tempcat.push(catitem);
            }
            item['disCategory'] = tempcat.join('<hr>');
          }

          if ('code' in item.resource && 'coding' in item.resource.code && item.resource.code.coding instanceof Array) {
            let tempsys = [];
            let tempcode = [];
            for (let codeitem of item.resource.code.coding) {
              tempsys.push(codeitem.system ? '<span>' + codeitem.system + '</span>' : ' - ');
              tempcode.push((codeitem.display ? '<span>' + codeitem.display + '</span>' + ' | ' : ' ') + '' + (codeitem.code ? '<span>' + codeitem.code + '</span>' : ' '));
            }
            item['discodesystem'] = tempsys.join('<hr>');
            item['disCode'] = tempcode.join('<hr>');
          }
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];

          item['disstartDateTime'] = item.resource;
          item['disendDateTime'] = item.resource;

          // if('onsetPeriod' in item.resource){
          //   item['disstartDateTime'] = 'start' in item.resource.onsetPeriod ? this.getdate(item.resource.onsetPeriod.start)  : "";
          //   item['disendDateTime'] = 'end' in item.resource.onsetPeriod ? this.getdate(item.resource.onsetPeriod.end)  : "";
          // }

          item['disrecordDateTime'] = 'recordedDate' in item.resource ? this.getdate(item.resource.recordedDate) : " - ";
          item['disIndividual'] = 'recorder' in item.resource ? this.getPractitioner(item.resource) : [];
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : '--';

          if ('reaction' in item.resource && item.resource.reaction instanceof Array) {
            let tempreaction = [];
            let tempSeverity = [];
            for (let rItem of item.resource.reaction) {
              if ('manifestation' in rItem && rItem.manifestation instanceof Array) {
                tempreaction.push(this.getarrayfield(rItem.manifestation));
              }
              tempSeverity.push('severity' in rItem ? rItem.severity : '');
            }
            item['disReaction'] = tempreaction.join('<hr>');
            item['severity'] = tempSeverity.join('<hr>');
          }
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == "CareTeam") {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['status'] = 'status' in item.resource ? item.resource.status : '';
          item['disCategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
          item['disname'] = 'name' in item.resource ? item.resource.name : '--';
          item['disreason'] = ('reasonCode' in item.resource && item.resource.reasonCode instanceof Array) ? this.getarrayfield(item.resource.reasonCode) : [];
          if ('period' in item.resource) {
            item['disstartDate'] = 'start' in item.resource.period ? this.getdate(item.resource.period.start) : "--";
            item['disendDate'] = 'end' in item.resource.period ? this.getdate(item.resource.period.end) : "--";
          }
          item['distelecom'] = ('telecom' in item.resource && item.resource.telecom instanceof Array) ? this.gettelecom(item.resource.telecom) : [];
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : '--';
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          item['disOrganization'] = 'managingOrganization' in item.resource ? item.resource.managingOrganization : [];
          if ('participant' in item.resource && item.resource.participant instanceof Array) {
            let tempprac = [];
            let temppracrole = [];
            for (let pitem of item.resource.participant) {
              if ('member' in pitem && 'reference' in pitem.member && (pitem.member.reference.toLowerCase().includes('practitioner')) && (!pitem.member.reference.toLowerCase().includes('practitionerrole'))) {
                tempprac.push(pitem.member)
              }
              if ('role' in pitem && pitem.role instanceof Array) {
                temppracrole.push(this.getarrayfield(pitem.role))
              }
            }
            item['disIndividual'] = tempprac;
            item['dispracrole'] = temppracrole.join('<hr>');
          }
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'CarePlan') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['status'] = 'status' in item.resource ? item.resource.status : '--';
          item['intent'] = 'intent' in item.resource ? item.resource.intent : '--';
          item['disCategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
          item['disname'] = 'title' in item.resource ? item.resource.title : '--';
          item['disdescription'] = 'description' in item.resource ? item.resource.description : '--';
          if ('period' in item.resource) {
            item['disstartDate'] = 'start' in item.resource.period ? this.getdate(item.resource.period.start) : "";
            item['disendDate'] = 'end' in item.resource.period ? this.getdate(item.resource.period.end) : "";
          }
          item['disCreated'] = 'created' in item.resource ? this.getdate(item.resource.created) : "";
          item['discareteam'] = 'careTeam' in item.resource ? this.getcareteam(item.resource) : [];
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : '--';
          if ('activity' in item.resource && item.resource.activity instanceof Array) {
            let outcome = [];
            let progress = [];
            for (let aitem of item.resource.activity) {
              if ('outcomeCodeableConcept' in aitem && aitem.outcomeCodeableConcept instanceof Array) {
                outcome.push(this.getarrayfield(aitem.outcomeCodeableConcept))
              }
              if ('progress' in aitem && aitem.progress instanceof Array) {
                for (let pitem of aitem.progress) {
                  progress.push((pitem.text ? '<span>' + pitem.text + '</span>' : ' ') + ((pitem.time && pitem.text) ? ' | ' : ' ') + (pitem.time ? '<span>' + pitem.time + '</span>' : ' '));
                }
              }
            }
            item['disoutcome'] = outcome.join('<hr>');
            item['disprogress'] = progress.join('<hr>');
          }
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'ClaimResponse') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : '--';
          item['claimcode'] = 'type' in item.resource ? this.getresstatus(item.resource.type) : [];
          item['disUse'] = 'use' in item.resource ? item.resource.use : '--';
          item['disoutcome'] = 'outcome' in item.resource ? item.resource.outcome : '--';
          item['disdisposition'] = 'disposition' in item.resource ? item.resource.disposition : '--';
          item['disCreated'] = 'created' in item.resource ? this.getdate(item.resource.created) : ''
          item['dispayee'] = 'payeeType' in item.resource ? this.getresstatus(item.resource.payeeType) : [];
          if ('payment' in item.resource) {
            item['dispaytype'] = 'type' in item.resource.payment ? this.getresstatus(item.resource.payment.type) : [];
            item['dispaydate'] = 'date' in item.resource.payment ? item.resource.payment.date : [];
            item['dispayamount'] = 'amount' in item.resource.payment ? this.getamount(item.resource.payment) : '--';
            item['dispayident'] = 'identifier' in item.resource.payment ? (item.resource.payment.identifier.system ? '<span>' + item.resource.payment.identifier.system + '</span>' + ' | ' : ' ') + '' + (item.resource.payment.identifier.value ? '<span>' + item.resource.payment.identifier.value + '</span>' : ' ') : '--';
          }
          if ('item' in item.resource && item.resource.item instanceof Array) {
            let tempsubmit = [];
            let tempcopay = [];
            let tempbenifit = [];
            for (let iitem of item.resource.item) {
              if ('adjudication' in iitem && iitem.adjudication instanceof Array) {
                for (let aitem of iitem.adjudication) {
                  if ('category' in aitem && 'coding' in aitem.category && aitem.category.coding instanceof Array) {
                    for (let citem of aitem.category.coding) {
                      if (('code' in citem && citem.code === 'submitted') || ('display' in citem && citem.display.toLowerCase().includes('submitted amount'))) {
                        tempsubmit.push(this.getamount(aitem));
                      }
                      else if (('code' in citem && citem.code === 'copay') || ('display' in citem && citem.display.toLowerCase().includes('copay'))) {
                        tempcopay.push(this.getamount(aitem));
                      }
                      else if (('code' in citem && citem.code === 'benefit') || ('display' in citem && citem.display.toLowerCase().includes('benefit amount'))) {
                        tempbenifit.push(this.getamount(aitem));
                      }
                    }
                  }
                }
              }
              item['dissubmit'] = tempsubmit.join('<hr>');
              item['discopay'] = tempcopay.join('<hr>');
              item['disbenifit'] = tempbenifit.join('<hr>');
            }
          }
          item['disOrganization'] = 'insurer' in item.resource ? this.getorganization(item.resource) : [];
          if ('requestor' in item.resource) {
            let tempholder = [];
            if ('reference' in item.resource.requestor) {
              let tempReference = item.resource.requestor.reference;
              if (tempReference.toLowerCase().includes('organization')) {
                tempholder.push(item.resource.requestor);
              }
              else if (tempReference.toLowerCase().includes('practitioner') && !(tempReference.toLowerCase().includes('practitionerrole'))) {
                tempholder.push(item.resource.requestor);
              }
              else if (tempReference.toLowerCase().includes('practitionerrole')) {
                tempholder.push(item.resource.requestor);
              }
            }
            item['disrequestor'] = tempholder;
          }
          if ('request' in item.resource) {
            let tempclaim = [];
            if ('reference' in item.resource.request && (item.resource.request.reference.toLowerCase().includes('claim'))) {
              tempclaim.push(item.resource.request)
            }
            item['disclaim'] = tempclaim;
          }
          item['disNotes'] = 'processNote' in item.resource ? this.getnotes(item.resource) : '--';
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'Device') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : '--';
          item['disreason'] = ('statusReason' in item.resource && item.resource.statusReason instanceof Array) ? this.getarrayfield(item.resource.statusReason) : [];
          item['disdidentifier'] = 'distinctIdentifier' in item.resource ? item.resource.distinctIdentifier : '--';
          item['dismanufact'] = 'manufacturer' in item.resource ? item.resource.manufacturer : '--';
          item['distype'] = 'type' in item.resource ? this.getresstatus(item.resource.type) : [];
          item['dislot'] = 'lotNumber' in item.resource ? item.resource.lotNumber : '--';
          item['disserial'] = 'serialNumber' in item.resource ? item.resource.serialNumber : '--';
          item['dismodel'] = 'modelNumber' in item.resource ? item.resource.modelNumber : '--';
          item['dismanufactdate'] = 'manufactureDate' in item.resource ? this.getdate(item.resource.manufactureDate) : '';
          item['disexpiredate'] = 'expirationDate' in item.resource ? this.getdate(item.resource.expirationDate) : '';
          if ('deviceName' in item.resource && item.resource.deviceName instanceof Array) {
            let tempname = [];
            for (let name of item.resource.deviceName) {
              tempname.push(('name' in name ? ('<span>' + name.name + '<span>') : ' '))
            }
            item['disdevicename'] = tempname.join('<hr>');
          }
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : '--';
          item['distelecom'] = ('contact' in item.resource && item.resource.contact instanceof Array) ? this.gettelecom(item.resource.contact) : [];
          item['disLocation'] = 'location' in item.resource ? this.getlocation(item.resource) : [];
          item['disOrganization'] = 'owner' in item.resource ? this.getorganization(item.resource) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'DocumentReference') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['docstatus'] = 'status' in item.resource ? item.resource.status : '';
          item['compstatus'] = 'docStatus' in item.resource ? item.resource.docStatus : '';
          item['date'] = 'date' in item.resource ? this.getdate(item.resource.date) : "";
          item['type'] = 'type' in item.resource ? this.getresstatus(item.resource.type) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          let tempContent = [];
          if ('content' in item.resource && item.resource.content instanceof Array) {
            let temptitle = [];
            let tempformat = [];
            for (let cont of item.resource.content) {
              if ('attachment' in cont) {
                temptitle.push(cont.attachment.title ? cont.attachment.title : '--');
                item['title'] = temptitle.join('<hr>');
                if ('data' in cont.attachment) {
                  var blob = atob(cont.attachment.data);
                  var fileName = 'download.xls';
                }
              }
              tempContent.push(cont.attachment);
              if ('format' in cont) {
                tempformat.push((cont.format.system ? '<span>' + cont.format.system + '</span>' + ' | ' : '') + '' + (cont.format.display ? '<span>' + cont.format.display + '</span>' + ' | ' : '') + '' + (cont.format.code ? '<span>' + cont.format.code + '</span>' : ''));
              }
            }
            item['format'] = tempformat.join('<hr>');
          }
          item['content'] = tempContent;
          if ('context' in item.resource) {
            if ('encounter' in item.resource.context && item.resource.context.encounter instanceof Array) {
              let tempenc = [];
              for (let eitem of item.resource.context.encounter) {
                if ('reference' in eitem && eitem.reference.toLowerCase().includes('encounter')) {
                  tempenc.push(eitem);
                }
              }
              item['disenclaim'] = tempenc;
            }
            if (!('encounter' in item.resource.context) && ('period') in item.resource.context) {
              let tempenc = [];
              tempenc.push(item.resource.context.period);
              item['disenclaim'] = tempenc;
            }
          }
          if ('context' in item.resource && 'period' in item.resource.context) {
            item['startdate'] = 'start' in item.resource.context.period ? this.getdate(item.resource.context.period.start) : "--";
            item['enddate'] = 'end' in item.resource.context.period ? this.getdate(item.resource.context.period.end) : "--";
          }
          item['disOrganization'] = 'custodian' in item.resource ? this.getorganization(item.resource) : [];
          item['disIndividual'] = 'author' in item.resource ? this.getPractitioner(item.resource) : [];
          item['disCategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
        }
      } else if (resource.id == 'Encounter') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          if ('period' in item.resource) {
            item['starttime'] = 'start' in item.resource.period ? this.getdate(item.resource.period.start) : "";
            item['endtime'] = 'end' in item.resource.period ? this.getdate(item.resource.period.end) : "";
          }
          if ('class' in item.resource) {
            let tempclass = [];
            tempclass.push((item.resource.class.system ? '<span>' + item.resource.class.system + '</span>' + ' | ' : ' ') + '' + (item.resource.class.display ? '<span>' + item.resource.class.display + '</span>' + ' | ' : ' ') + '' + (item.resource.class.code ? '<span>' + item.resource.class.code + '</span>' : ''))
            item['disclass'] = tempclass.join('<hr>');
          }
          item['distype'] = ('type' in item.resource && item.resource.type instanceof Array) ? this.getarrayfield(item.resource.type) : [];
          item['reason'] = ('reasonCode' in item.resource && item.resource.reasonCode instanceof Array) ? this.getarrayfield(item.resource.reasonCode) : [];
          item['status'] = 'status' in item.resource ? item.resource.status : "";
          item['disPeriod'] = 'period' in item.resource ? this.getobjectFieldFromArray(item.resource.period) : '';
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          item['disIndividual'] = 'participant' in item.resource ? this.getPractitioner(item.resource) : [];
          if ('location' in item.resource && item.resource.location instanceof Array) {
            let tempLocation = [];
            for (let locItem of item.resource.location) {
              if ('location' in locItem && 'reference' in locItem.location) {
                let tempReference = locItem.location.reference;
                if (tempReference.toLowerCase().includes('location')) {
                  tempLocation.push(locItem.location);

                }
              }
            }
            item['disLocation'] = tempLocation;
          }
        }
      } else if (resource.id == "FamilyMemberHistory") {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : '';
          item['disrelation'] = ('relationship' in item.resource) ? this.getresstatus(item.resource.relationship) : [];
          item['disname'] = 'name' in item.resource ? item.resource.name : '--';
          item['disgender'] = ('sex' in item.resource) ? this.getresstatus(item.resource.sex) : [];
          item['disbirth'] = item.resource;
          // item['disbirth'] = 'bornDate' in item.resource? item.resource.bornDate : '--';
          item['disCode'] = ('reasonCode' in item.resource && item.resource.reasonCode instanceof Array) ? this.getarrayfield(item.resource.reasonCode) : [];
          if ('condition' in item.resource && item.resource.condition instanceof Array) {
            let tempcode = [];
            for (let citem of item.resource.condition) {
              if ('code' in citem && 'coding' in citem.code && citem.code.coding instanceof Array) {
                tempcode.push(this.getresstatus(citem.code));
              }
            }
            item['disConcode'] = tempcode.join('<hr>');
          }
          item['disdate'] = 'date' in item.resource ? this.getdate(item.resource.date) : "";
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : "";
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == "Immunization") {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : " - ";
          item['disstatusreason'] = 'statusReason' in item.resource ? this.getresstatus(item.resource.statusReason) : [];
          item['disvacCode'] = 'vaccineCode' in item.resource ? this.getresstatus(item.resource.vaccineCode) : [];
          item['disoccurrence'] = item.resource;
          // item['disoccurrence'] = 'occurrenceDateTime' in item.resource ? this.getdate(item.resource.occurrenceDateTime)  : " - ";
          item['disrecordDateTime'] = 'recorded' in item.resource ? this.getdate(item.resource.recorded) : " - ";
          item['disorigin'] = 'reportOrigin' in item.resource ? this.getresstatus(item.resource.reportOrigin) : [];
          item['disexpirationDate'] = 'expirationDate' in item.resource ? this.getdate(item.resource.expirationDate) : " - ";
          item['dislot'] = 'lotNumber' in item.resource ? item.resource.lotNumber : " - ";
          item['dissite'] = 'site' in item.resource ? this.getresstatus(item.resource.site) : [];
          item['disroute'] = 'route' in item.resource ? this.getresstatus(item.resource.route) : [];
          item['disprimary'] = 'primarySource' in item.resource ? item.resource.primarySource : " - ";
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : "";
          if ('doseQuantity' in item.resource) {
            item['disquantity'] = 'value' in item.resource.doseQuantity ? item.resource.doseQuantity.value : " - ";
            item['disUnit'] = 'unit' in item.resource.doseQuantity ? item.resource.doseQuantity.unit : " - ";
            if ((!('unit' in item.resource.doseQuantity)) && 'code' in item.resource.doseQuantity) {
              item['disUnit'] = item.resource.doseQuantity.code
            }
          }

          item['disperformer'] = ('performer' in item.resource && item.resource.performer instanceof Array) ? this.getarrayfield(item.resource.performer) : [];
          item['disIndividual'] = 'performer' in item.resource ? this.getPractitioner(item.resource) : [];
          if ('performer' in item.resource && item.resource.performer instanceof Array) {
            let tempholder = [];
            for (let pitem of item.resource.performer) {
              if ('actor' in pitem && 'reference' in pitem.actor) {
                tempholder.push(pitem.actor);
              }
            }
            // if('reference' in item.resource.requestor) {
            //   let tempReference = item.resource.requestor.reference;
            //   if(tempReference.toLowerCase().includes('organization')) {
            //     tempholder.push(item.resource.requestor);
            //   }
            //   else if(tempReference.toLowerCase().includes('practitioner') && !(tempReference.toLowerCase().includes('practitionerrole'))) {
            //     tempholder.push(item.resource.requestor);
            //   }
            //   else if(tempReference.toLowerCase().includes('practitionerrole')) {
            //     tempholder.push(item.resource.requestor);
            //   }
            // }
            item['disrequestor'] = tempholder;
          }
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == "MedicationRequest") {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['status'] = 'status' in item.resource ? item.resource.status : "";
          item['disStartDate'] = this.getStartEndDate(item.resource, 'start') ? this.dataPipe.transform(this.getStartEndDate(item.resource, 'start')) : '--';
          item['disEndDate'] = this.getStartEndDate(item.resource, 'end') ? this.dataPipe.transform(this.getStartEndDate(item.resource, 'end')) : '--';
          item['disRefills'] = this.getRefills(item.resource);
          item['code'] = 'medicationCodeableConcept' in item.resource ? this.getresstatus(item.resource.medicationCodeableConcept) : [];
          item['disAuthoredOn'] = 'authoredOn' in item.resource ? this.getdate(item.resource.authoredOn) : '--';
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          item['disPractitioner'] = this.getPractitioner(item.resource);
          item['disEncounter'] = this.getEncounter(item.resource);
          item['disDoseQuantity'] = this.getDoseQuantity(item.resource);
          item['disDoseDuration'] = this.getDoseQuantity(item.resource)
          item['disDoseTime'] = this.getDoseQuantity(item.resource);
        }
      } else if (resource.id == "MedicationStatement") {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['status'] = 'status' in item.resource ? item.resource.status : "";
          item['disreason'] = ('statusReason' in item.resource && item.resource.statusReason instanceof Array) ? this.getarrayfield(item.resource.statusReason) : [];
          item['discategory'] = 'category' in item.resource ? this.getresstatus(item.resource.category) : [];
          item['effectiveDateAndtime'] = item.resource;
          item['disEndDate'] = item.resource;
          // if('effectivePeriod' in item.resource){
          //   item['disStartDate'] = 'start' in item.resource.effectivePeriod ? this.getdate(item.resource.effectivePeriod.start)  : "";
          //   item['disEndDate'] = 'end' in item.resource.effectivePeriod ? this.getdate(item.resource.effectivePeriod.end)  : "";
          // }
          item['disassertDate'] = 'dateAsserted' in item.resource ? this.getdate(item.resource.dateAsserted) : "";
          item['medcode'] = 'medicationCodeableConcept' in item.resource ? this.getresstatus(item.resource.medicationCodeableConcept) : [];
          item['disreasoncode'] = ('reasonCode' in item.resource && item.resource.reasonCode instanceof Array) ? this.getarrayfield(item.resource.reasonCode) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          item['disEncounter'] = 'context' in item.resource ? this.getEncounter(item.resource) : [];
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : "";
        }
      }
      else if (resource.id == "Procedure") {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : " -- ";
          item['disCategory'] = 'category' in item.resource ? this.getresstatus(item.resource.category) : [];
          item['procode'] = 'code' in item.resource ? this.getresstatus(item.resource.code) : [];
          item['disDateTime'] = item.resource;
          // item['disDateTime'] = 'performedDateTime' in item.resource ? this.getdate(item.resource.performedDateTime)  : "";
          item['disNotes'] = 'note' in item.resource ? this.getnotes(item.resource) : "";
          item['disIndividual'] = 'performer' in item.resource ? this.getPractitioner(item.resource) : [];
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          item['disOrganization'] = 'performer' in item.resource ? this.getorganization(item.resource) : [];
          item['disLocation'] = 'location' in item.resource ? this.getlocation(item.resource) : [];
          item['disdiagnostic'] = 'report' in item.resource ? this.getdiagnostic(item.resource) : [];
          if ('basedOn' in item.resource && item.resource.basedOn instanceof Array) {
            let tempser = [];
            for (let prac of item.resource.basedOn) {
              if (prac.reference.toLowerCase().includes('servicerequest')) {
                tempser.push(prac);
              }
            }
            item['disservicereq'] = tempser;
          }
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'Organization') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          if ('address' in item && item.resource.address instanceof Array && item.resource.address.length > 0) {
            let tempLine;
            if ('line' in item.resource) {
              tempLine = item.resource.line instanceof Array ? item.resource.line.join(' , ') : item.resource.line;
            }
            item['disAddress'] = tempLine + ' , ' +
              'city' in item.resource ? item.resource.city : '' + ' , ' + 'state' in item.resource ? item.resource.state : '' + ' , ' +
                'country' in item.resource ? item.resource.country : '' + ' , ' + 'postalCode' in item.resource ? item.resource.postalCode : '';
            item['disName'] = 'name' in item.resource ? item.resource.name : '';
            if ('identifier' in item.resource && item.resource.identifier instanceof Array) {
              let tempItentifier = [];
              for (let idenItem of item.resource.identifier) {
                tempItentifier.push('value' in idenItem ? idenItem.value : '');
              }
              item['disIdentifier'] = tempItentifier.join(' , ');
            }
          }

        }
      } else if (resource.id == 'Practitioner') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          let tempNameArr = [];
          let givenName;
          let prefixName;
          let familyName;
          if ('name' in item.resource && item.resource.name instanceof Array) {
            for (let nameArr of item.resource.name) {
              if ('given' in nameArr && nameArr.given instanceof Array) {
                givenName = nameArr.given.join(' , ');
              }
              if ('prefix' in nameArr && nameArr.prefix instanceof Array) {
                prefixName = nameArr.prefix.join(' , ');
              }
              if ('family' in nameArr) {
                familyName = nameArr.family;
              }
              tempNameArr.push(prefixName + ' ' + givenName + ' ' + familyName);
            }
            item['disName'] = tempNameArr.join(' , ');
          }
          if ('telecom' in item.resource && item.resource.telecom instanceof Array) {
            let tempTelArray = [];
            let tempTelData;
            for (let telItem of item.resource.telecom) {
              tempTelData = 'system' in telItem ? telItem.system : '' + '(' + 'use' in telItem ? telItem.use : '' + ')' +
                'value' in telItem.value ? telItem.value : '';
              tempTelArray.push(tempTelData);
            }
            item['disTelcom'] = tempTelArray.join(' , ');
          }
        }
      } else if (resource.id == 'DiagnosticReport') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : '--';
          item['disCategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
          item['disCode'] = 'code' in item.resource ? this.getresstatus(item.resource.code) : [];
          item['effectiveDateAndtime'] = item.resource;
          // item['effectiveDateAndtime'] = 'effectiveDateTime' in item.resource ? this.getdate(item.resource.effectiveDateTime) : '';
          item['issued'] = 'issued' in item.resource ? this.getdate(item.resource.issued) : ''
          item['disNotes'] = 'conclusion' in item.resource ? item.resource.conclusion : '--';
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          if ('performer' in item.resource && item.resource.performer instanceof Array) {
            let tempprac = [];
            for (let prac of item.resource.performer) {
              if (prac.reference.toLowerCase().includes('practitioner') && !(prac.reference.toLowerCase().includes('practitionerrole'))) {
                tempprac.push(prac);
              }
            }
            item['disIndividual'] = tempprac;
          }
          if ('basedOn' in item.resource && item.resource.basedOn instanceof Array) {
            let tempser = [];
            for (let prac of item.resource.basedOn) {
              if (prac.reference.toLowerCase().includes('servicerequest')) {
                tempser.push(prac);
              }
            }
            item['disservicereq'] = tempser;
          }
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'Goal') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['lifecyclestatus'] = 'lifecycleStatus' in item.resource ? item.resource.lifecycleStatus : '';
          item['disDescription'] = ('description' in item.resource && 'text' in item.resource.description) ? item.resource.description.text : '';
        }
      }
      else if (resource.id == 'Observation') {
        for (let item of data.entry) {
          this.tempvalue = [];
          this.tempreason = [];
          this.tempcode = [];
          this.tempunit = [];
          item['disCategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
          item['id'] = item.resource.id;
          item['disStatus'] = item.resource.status;
          if ('code' in item.resource) {
            this.tempcode.push(this.getresstatus(item.resource.code));
          }
          else if (!('code' in item.resource)) {
            this.tempcode.push('--');
          }
          item['disEncounter'] = this.getEncounter(item.resource);

          item['disObservation'] = item.resource;
          item['disIssued'] = 'issued' in item.resource ? this.getdate(item.resource.issued) : "";
          if ('dataAbsentReason' in item.resource) {
            this.tempreason.push(this.getresstatus(item.resource.dataAbsentReason));
          }
          else if (!('dataAbsentReason' in item.resource)) {
            this.tempreason.push('--');
          }
          item['disInterpretation'] = ('interpretation' in item.resource && item.resource.interpretation instanceof Array) ? this.getarrayfield(item.resource.interpretation) : [];
          item['disNotes'] = this.getnotes(item.resource);
          if ('referenceRange' in item.resource && item.resource.referenceRange instanceof Array) {
            let tempCode = [];
            for (let catItem of item.resource.referenceRange) {
              if ('low' in catItem && 'high' in catItem) {
                tempCode.push((catItem.low ? '<span>' + 'low' + '</span>' + ' - ' : ' ') + '' + (catItem.low.value ? '<span>' + catItem.low.value + '</span>' : ' ')
                  + '' + ((catItem.low && catItem.high) ? ' | ' : ' ') + '' + (catItem.high ? '<span>' + 'high' + '</span>' + ' - ' : ' ') + '' + (catItem.high.value ? '<span>' + catItem.high.value + '</span>' : ' '));
              }
              else if ('low' in catItem && !('high' in catItem)) {
                tempCode.push(catItem.low.value)
              }
              else if ('high' in catItem && !('low' in catItem)) {
                tempCode.push(catItem.high.value)
              }
            }

            item['disRange'] = tempCode.join('<hr>');
          }
          item['disdatetime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          if ('component' in item.resource && item.resource.component instanceof Array) {
            for (let vitem of item.resource.component) {
              if ('code' in vitem) {
                this.tempcode.push(this.getresstatus(vitem.code));
              }
              else if (!('code' in vitem)) {
                this.tempcode.push('--');
              }
              if ('dataAbsentReason' in vitem) {
                this.tempreason.push(this.getresstatus(vitem.dataAbsentReason));
              }
              else if (!('dataAbsentReason' in vitem)) {
                this.tempreason.push('--');
              }
              if ('valueQuantity' in vitem && 'value' in vitem.valueQuantity) {
                this.tempvalue.push(vitem.valueQuantity.value);
              }
              if ('valueQuantity' in vitem && 'code' in vitem.valueQuantity) {
                this.tempunit.push(vitem.valueQuantity.code)
              }
              else if ('valueQuantity' in vitem && (!('code' in vitem.valueQuantity)) && 'unit' in vitem.valueQuantity) {
                this.tempunit.push(vitem.valueQuantity.unit)
              }
            }
          }
          item['disReason'] = this.tempreason.join('<hr>');
          item['disCode'] = this.tempcode.join('<hr>');
          if ('valueQuantity' in item.resource) {
            this.tempvalue.push(item.resource.valueQuantity.value.toFixed(2));
            if ('code' in item.resource.valueQuantity) {
              this.tempunit.push(item.resource.valueQuantity.code)
            }
            else if ((!('code' in item.resource.valueQuantity)) && 'unit' in item.resource.valueQuantity) {
              this.tempunit.push(item.resource.valueQuantity.unit)
            }
          }

          item['disValue'] = item.resource;
          item['disUnit'] = item.resource;
          // item['disValue'] = this.tempvalue.join('<hr>');
          // item['disUnit'] = this.tempunit.join('<hr>');
          if ('performer' in item.resource && item.resource.performer && item.resource.performer instanceof Array) {
            let tempPartIndividual = [];
            let temporg = [];
            for (let practitioner of item.resource.performer) {
              if ('reference' in practitioner && practitioner.reference) {
                let tempReference = practitioner.reference;
                if (tempReference.toLowerCase().includes('practitioner')) {
                  tempPartIndividual.push(practitioner);

                }
                if (tempReference.toLowerCase().includes('organization')) {
                  temporg.push(practitioner);
                }
              }
            }
            item['disIndividual'] = tempPartIndividual;
            item['disOrganization'] = temporg;
          }
          if ('basedOn' in item.resource && item.resource.basedOn instanceof Array) {
            let tempser = [];
            for (let prac of item.resource.basedOn) {
              if (prac.reference.toLowerCase().includes('servicerequest')) {
                tempser.push(prac);
              }
            }
            item['disservicereq'] = tempser;
          }
        }
      } else if (resource.id == 'Coverage') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : '';
          item['dissubscriberid'] = 'subscriberId' in item.resource ? item.resource.subscriberId : ' -- ';
          item['disdepnum'] = 'dependent' in item.resource ? item.resource.dependent : ' -- ';

          if ('period' in item.resource) {
            item['disStartDate'] = 'start' in item.resource.period ? this.getdate(item.resource.period.start) : "";
            item['disEndDate'] = 'end' in item.resource.period ? this.getdate(item.resource.period.end) : "";
          }
          if ('class' in item.resource && item.resource.class instanceof Array) {
            let temptype = [];
            let tempname = [];
            let tempvalue = [];
            for (let catItem of item.resource.class) {
              if ('type' in catItem) {
                temptype.push(this.getresstatus(catItem.type))
              }
              if ('name' in catItem) {
                tempname.push(catItem.name)
              }
              if ('value' in catItem) {
                tempvalue.push(catItem.value)
              }
            }
            item['discltype'] = temptype.join('<hr>');
            item['disclname'] = tempname.join('<hr>');
            item['disclvalue'] = tempvalue.join('<hr>');
          }

          if ('costToBeneficiary' in item.resource && item.resource.costToBeneficiary instanceof Array) {
            let temptype = [];
            let tempunit = [];
            let tempvalue = [];
            for (let catItem of item.resource.costToBeneficiary) {
              if ('type' in catItem) {
                temptype.push(this.getresstatus(catItem.type))
              }
              if ('valueQuantity' in catItem) {
                if ('value' in catItem.valueQuantity) {
                  tempvalue.push(catItem.valueQuantity.value)
                }
                if ('code' in catItem.valueQuantity) {
                  tempunit.push(catItem.valueQuantity.code)
                }
                else if ((!('code' in catItem.valueQuantity)) && 'unit' in catItem.valueQuantity) {
                  tempunit.push(catItem.valueQuantity.unit)
                }
              }
            }
            item['discbtype'] = temptype.join('<hr>');
            item['discbunit'] = tempunit.join('<hr>');
            item['discbvalue'] = tempvalue.join('<hr>');
          }

          if ('policyHolder' in item.resource && 'reference' in item.resource.policyHolder) {
            let tempholder = [];
            let tempReference = item.resource.policyHolder.reference;
            if (tempReference.toLowerCase().includes('organization')) {
              tempholder.push(item.resource.policyHolder);
            }
            else if (tempReference.toLowerCase().includes('relatedperson')) {
              tempholder.push(item.resource.policyHolder);
            }
            else if (tempReference.toLowerCase().includes('patient')) {
              tempholder.push(item.resource.policyHolder);
            }

            item['dispolicy'] = tempholder;
          }

          if ('subscriber' in item.resource && 'reference' in item.resource.subscriber) {
            let tempholder = [];
            let tempReference = item.resource.subscriber.reference;
            if (tempReference.toLowerCase().includes('organization')) {
              tempholder.push(item.resource.subscriber);
            }
            else if (tempReference.toLowerCase().includes('relatedperson')) {
              tempholder.push(item.resource.subscriber);
            }
            else if (tempReference.toLowerCase().includes('patient')) {
              tempholder.push(item.resource.subscriber);
            }

            item['dissubscriber'] = tempholder;
          }
          if ('payor' in item.resource && item.resource.payor instanceof Array) {
            let tempholder = [];
            for (let locItem of item.resource.payor) {
              if ('reference' in locItem && locItem.reference) {
                let tempReference = locItem.reference;
                if (tempReference.toLowerCase().includes('organization')) {
                  tempholder.push(locItem);
                }
                else if (tempReference.toLowerCase().includes('relatedperson')) {
                  tempholder.push(locItem);
                }
                else if (tempReference.toLowerCase().includes('patient')) {
                  tempholder.push(locItem);
                }
              }
            }
            item['dispayor'] = tempholder;
          }

          item['relcode'] = 'relationship' in item.resource ? this.getresstatus(item.resource.relationship) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          if ('order' in item.resource) {
            if (item.resource.order === 1) {
              item['disinstype'] = 'Primary';
            } else if (item.resource.order === 2) {
              item['disinstype'] = 'Secondary';
            } else if (item.resource.order === 3) {
              item['disinstype'] = 'Tertiary';
            }
          }

        }
      } else if (resource.id == 'Provenance') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disRecorder'] = 'recorded' in item.resource ? item.resource.recorded : '';
          if ('reason' in item.resource && item.resource.reason instanceof Array) {
            let tempReason = [];
            for (let resItem of item.resource.reason) {
              if ('coding' in resItem && resItem.coding instanceof Array) {
                for (let codeItem of resItem.coding) {
                  tempReason.push('display' in codeItem ? codeItem.display : '');
                }
              }
            }
            item['disReason'] = tempReason.join(' , ');
          }
        }
      } else if (resource.id == 'Condition') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disCode'] = 'code' in item.resource ? this.getresstatus(item.resource.code) : [];
          item['disCategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
          item['disOnsetDate'] = item.resource;
          item['disAbatementDateTime'] = item.resource;
          // item['disOnsetDate'] = 'onsetDateTime' in item.resource ? this.getdate(item.resource.onsetDateTime) : '';
          // item['disAbatementDateTime'] = 'abatementDateTime' in item.resource ? this.getdate(item.resource.abatementDateTime) : '';
          item['disclinical'] = 'clinicalStatus' in item.resource ? this.getresstatus(item.resource.clinicalStatus) : [];
          item['disverification'] = 'verificationStatus' in item.resource ? this.getresstatus(item.resource.verificationStatus) : [];
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'Location') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disName'] = 'name' in item.resource ? item.resource.name : '';
          if ('address' in item.resource) {
            item['disAddress'] = ('line' in item.resource && item.resource.line instanceof Array ? item.resource.line.join(' , ') : '') + ' - ' +
              ('city' in item.resource ? item.resource.city : '') + ' - ' + ('postalCode' in item.resource.postalCode ? item.resource.postalCode : '') + ' - ' +
              ('country' in item.resource ? item.resource.country : '');
          }
          if ('telecom' in item.resource && item.resource.telecom instanceof Array) {
            let tempTelArray = [];
            let tempTelData;
            for (let telItem of item.resource.telecom) {
              tempTelData = 'system' in telItem ? telItem.system : '' + '(' + 'use' in telItem ? telItem.use : '' + ')' +
                'value' in telItem.value ? telItem.value : '';
              tempTelArray.push(tempTelData);
            }
            item['disTelecom'] = tempTelArray.join(' , ');
          }
          item['disDescription'] = 'description' in item.resource ? item.resource.description : '';
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      } else if (resource.id == 'Claim') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['status'] = 'status' in item.resource ? item.resource.status : '';
          item['disProvider'] = 'provider' in item.resource ? this.getobjectFieldFromArray(item.resource.provider) : '';
          if ('identifier' in item.resource) {
            item['disIdentifier'] = this.getobjectFieldFromArray(item.resource.identifier);
          }
          item['claimcode'] = 'type' in item.resource ? this.getresstatus(item.resource.type) : [];
          item['disPriority'] = 'priority' in item.resource ? this.getresstatus(item.resource.priority) : [];
          if ('subType' in item.resource && 'coding' in item.resource.subType) {
            item['disSubType'] = this.getobjectFieldFromArray(item.resource.subType.coding);
          }
          item['disLocation'] = 'facility' in item.resource ? this.getlocation(item.resource) : [];
          item['disPractitioner'] = 'provider' in item.resource ? this.getPractitioner(item.resource) : [];
          item['disUse'] = 'use' in item.resource ? item.resource.use : '--';
          item['disBillablePeriod'] = 'billablePeriod' in item.resource ? this.getobjectFieldFromArray(item.resource.billablePeriod) : '';
          item['disCreated'] = 'created' in item.resource ? this.getdate(item.resource.created) : '--';
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
          item['disPrescription'] = 'prescription' in item.resource ? this.getobjectFieldFromArray(item.resource.prescription) : '';
          if ('payee' in item.resource && 'type' in item.resource.payee && 'coding' in item.resource.payee.type && item.resource.payee.type.coding in Array) {
            item['disPayee'] = this.getobjectFieldFromArray(item.resource.payee.type.coding);
          }
          item['disInsurer'] = 'insurer' in item.resource ? this.getobjectFieldFromArray(item.resource.insurer) : '';
          item['disFacility'] = 'facility' in item.resource ? this.getobjectFieldFromArray(item.resource.facility) : '';
          if ('diagnosis' in item.resource && item.resource.diagnosis instanceof Array) {

            item['disDiagnosis'] = item.resource.diagnosis;
          }
          if ('procedure' in item.resource && item.resource.procedure instanceof Array) {
            item['disProcedure'] = item.resource.procedure;
          }
          item['discoverage'] = 'insurance' in item.resource ? this.getcoverage(item.resource) : [];
          if ('item' in item.resource && item.resource.item instanceof Array) {
            let tempprodcode = [];
            for (let itItem of item.resource.item) {
              if ('productOrService' in itItem && 'coding' in itItem.productOrService) {
                tempprodcode.push(this.getresstatus(itItem.productOrService));
              }
              if ('encounter' in itItem && itItem.encounter instanceof Array) {
                let tempen = [];
                for (let enItem of itItem.encounter) {
                  if ('reference' in enItem) {
                    let tempReference = enItem.reference;
                    if (tempReference.toLowerCase().includes('encounter')) {
                      tempen.push(enItem);
                      item['disEncounter'] = tempen;
                    }
                  }
                }
              }
              if ('net' in itItem) {
                item['itemNet'] = this.getamount(itItem);
              }
              if ('unitPrice' in itItem) {
                item['itemUnitPrice'] = this.getobjectFieldFromArray(itItem.unitPrice);
              }
            }
            item['itemproductOrService'] = tempprodcode.join('<hr>')
          }
          item['disTotal'] = 'total' in item.resource ? (item.resource.total.value ? '<span>' + item.resource.total.value + '</span>' + '  ' : '') + '' + (item.resource.total.currency ? '<span>' + item.resource.total.currency + '</span>' : '') : '';
        }
      } else if (resource.id == 'ExplanationOfBenefit') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['status'] = 'status' in item.resource ? item.resource.status : '';
          item['disType'] = 'type' in item.resource ? this.getresstatus(item.resource.type) : [];
          item['disUse'] = 'use' in item.resource ? item.resource.use : '';
          if ('billablePeriod' in item.resource) {
            item['disstartDate'] = 'start' in item.resource.billablePeriod ? this.getdate(item.resource.billablePeriod.start) : "";
            item['disendDate'] = 'end' in item.resource.billablePeriod ? this.getdate(item.resource.billablePeriod.end) : "";
          }
          item['disCreated'] = 'created' in item.resource ? this.getdate(item.resource.created) : "";
          item['dispayee'] = ('payee' in item.resource && 'type' in item.resource.payee) ? this.getresstatus(item.resource.payee.type) : [];
          item['disoutcome'] = 'outcome' in item.resource ? item.resource.outcome : '--';
          if ('diagnosis' in item.resource && item.resource.diagnosis instanceof Array) {
            let tempcode = [];
            let temptype = [];
            for (let ditem of item.resource.diagnosis) {
              if ('diagnosisCodeableConcept' in ditem) {
                tempcode.push(this.getresstatus(ditem.diagnosisCodeableConcept))
              }
              if ('type' in ditem) {
                temptype.push(this.getarrayfield(ditem.type))
              }
            }
            item['disdiacode'] = tempcode.join('<hr>');
            item['disdiatype'] = temptype.join('<hr>');
          }
          if ('supportingInfo' in item.resource && item.resource.supportingInfo instanceof Array) {
            let tempcode = [];
            let tempcat = [];
            for (let ditem of item.resource.supportingInfo) {
              if ('category' in ditem) {
                tempcat.push(this.getresstatus(ditem.category))
              }
              if ('code' in ditem) {
                tempcode.push(this.getresstatus(ditem.code))
              }
            }
            item['dissupcode'] = tempcode.join('<hr>');
            item['dissupcategory'] = tempcat.join('<hr>');
          }
          if ('procedure' in item.resource && item.resource.procedure instanceof Array) {
            let tempcode = [];
            let temptype = [];
            let tempdate = [];
            for (let ditem of item.resource.procedure) {
              if ('procedureCodeableConcept' in ditem) {
                tempcode.push(this.getresstatus(ditem.procedureCodeableConcept))
              }
              if ('type' in ditem) {
                temptype.push(this.getarrayfield(ditem.type))
              }
              if ('date' in ditem) {
                tempdate.push(this.getdate(ditem.date));
              }
            }
            item['disprocode'] = tempcode.join('<hr>');
            item['disprotype'] = temptype.join('<hr>');
            item['disprodate'] = tempdate.join('<hr>');
          }
          if ('item' in item.resource && item.resource.item instanceof Array) {
            let tempsubmit = [];
            let tempcopay = [];
            let tempbenifit = [];
            let tempcat = [];
            let tempcode = [];
            for (let iitem of item.resource.item) {
              if ('category' in iitem) {
                tempcat.push(this.getresstatus(iitem.category));
              }
              if ('productOrService' in iitem) {
                tempcode.push(this.getresstatus(iitem.productOrService));
              }
              if ('adjudication' in iitem && iitem.adjudication instanceof Array) {
                for (let aitem of iitem.adjudication) {
                  if ('category' in aitem && 'coding' in aitem.category && aitem.category.coding instanceof Array) {
                    for (let citem of aitem.category.coding) {
                      if (('code' in citem && citem.code === 'submitted') || ('display' in citem && citem.display.toLowerCase().includes('submitted amount'))) {
                        tempsubmit.push(this.getamount(aitem));
                      }
                      else if (('code' in citem && citem.code === 'copay') || ('display' in citem && citem.display.toLowerCase().includes('copay'))) {
                        tempcopay.push(this.getamount(aitem));
                      }
                      else if (('code' in citem && citem.code === 'benefit') || ('display' in citem && citem.display.toLowerCase().includes('benefit amount'))) {
                        tempbenifit.push(this.getamount(aitem));
                      }
                    }
                  }
                }
              }
              item['dissubmit'] = tempsubmit.join('<hr>');
              item['discopay'] = tempcopay.join('<hr>');
              item['disbenifit'] = tempbenifit.join('<hr>');
              item['discategory'] = tempcat.join('<hr>');
              item['itemproductOrService'] = tempcode.join('<hr>');
            }
          }
          if ('payee' in item.resource && 'party' in item.resource.payee) {
            let temppayee = [];
            if ('reference' in item.resource.payee.party) {
              temppayee.push(item.resource.payee.party);
            }
            item['disrequestor'] = temppayee;
          }
          if ('total' in item.resource && item.resource.total instanceof Array) {
            let tempcat = [];
            let tempamount = [];
            for (let titem of item.resource.total) {
              if ('category' in titem) {
                tempcat.push(this.getresstatus(titem.category));
              }
              if ('amount' in titem) {
                tempamount.push(this.getamount(titem));
              }
            }
            item['distotamount'] = tempamount.join('<hr>');
            item['distotcategory'] = tempcat.join('<hr>');

          }
          if ('payment' in item.resource) {
            item['dispaytype'] = 'type' in item.resource.payment ? this.getresstatus(item.resource.payment.type) : [];
            item['dispaydate'] = 'date' in item.resource.payment ? item.resource.payment.date : [];
            item['dispayamount'] = 'amount' in item.resource.payment ? this.getamount(item.resource.payment) : '--';
            item['disadjamount'] = 'adjustment' in item.resource.payment ? ('<span>' + item.resource.payment.adjustment.value + '</span>') + ' ' + ('<span>' + item.resource.payment.adjustment.currency + '</span>') : '--';
            item['dispayident'] = 'identifier' in item.resource.payment ? (item.resource.payment.identifier.system ? '<span>' + item.resource.payment.identifier.system + '</span>' + ' | ' : ' ') + '' + (item.resource.payment.identifier.value ? '<span>' + item.resource.payment.identifier.value + '</span>' : ' ') : '--';
          }
          item['disNotes'] = 'processNote' in item.resource ? this.getnotes(item.resource) : '--';
          if ('insurer' in item.resource) {
            let temporg = [];
            if ('reference' in item.resource.insurer && (item.resource.insurer.reference.toLowerCase().includes('organization'))) {
              temporg.push(item.resource.insurer)
            }
            item['disOrganization'] = temporg;
          }
          item['disIndividual'] = this.getPractitioner(item.resource);
          item['disLocation'] = this.getlocation(item.resource);
          if ('claim' in item.resource) {
            let tempclaim = [];
            if ('reference' in item.resource.claim && (item.resource.claim.reference.toLowerCase().includes('claim'))) {
              tempclaim.push(item.resource.claim)
            }
            item['disclaim'] = tempclaim;
          }
          if ('claimResponse' in item.resource) {
            let tempclaimres = [];
            if ('reference' in item.resource.claimResponse && (item.resource.claimResponse.reference.toLowerCase().includes('claimresponse'))) {
              tempclaimres.push(item.resource.claimResponse)
            }
            item['disclaimres'] = tempclaimres;
          }
          if ('insurance' in item.resource && item.resource.insurance instanceof Array) {
            let tempcov = [];
            for (let citem of item.resource.insurance) {
              if ('coverage' in citem && 'reference' in citem.coverage && (citem.coverage.reference.toLowerCase().includes('coverage'))) {
                tempcov.push(citem.coverage)
              }
            }
            item['discoverage'] = tempcov;
          }
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';

        }
      } else if (resource.id == 'RelatedPerson') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'active' in item.resource ? item.resource.active : ' -- ';
          item['disbirth'] = 'birthDate' in item.resource ? item.resource.birthDate : '--';
          item['disaddress'] = this.getAddress(item.resource);
          item['disname'] = this.getName(item.resource);
          item['disgender'] = 'gender' in item.resource ? item.resource.gender : '--';
          item['disrelation'] = ('relationship' in item.resource && item.resource.relationship instanceof Array) ? this.getarrayfield(item.resource.relationship) : [];
          item['distelecom'] = ('telecom' in item.resource && item.resource.telecom instanceof Array) ? this.gettelecom(item.resource.telecom) : [];
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      }
      else if (resource.id == 'ServiceRequest') {
        for (let item of data.entry) {
          item['id'] = item.resource.id;
          item['disstatus'] = 'status' in item.resource ? item.resource.status : ' -- ';
          item['disintent'] = 'intent' in item.resource ? item.resource.intent : '--';
          item['dispriority'] = 'priority' in item.resource ? item.resource.priority : '--';
          item['disCode'] = 'code' in item.resource ? this.getresstatus(item.resource.code) : [];
          item['disdate'] = item.resource;
          // item['disdate'] = 'occurrenceDateTime' in item.resource ? this.getdate(item.resource.occurrenceDateTime) : '';
          item['discategory'] = ('category' in item.resource && item.resource.category instanceof Array) ? this.getarrayfield(item.resource.category) : [];
          item['reasoncode'] = ('reasonCode' in item.resource && item.resource.reasonCode instanceof Array) ? this.getarrayfield(item.resource.reasonCode) : [];
          item['disNotes'] = this.getnotes(item.resource);
          item['dissite'] = ('bodySite' in item.resource && item.resource.bodySite instanceof Array) ? this.getarrayfield(item.resource.bodySite) : [];
          item['disinstruction'] = 'patientInstruction' in item.resource ? item.resource.patientInstruction : '--';
          item['disEncounter'] = 'encounter' in item.resource ? this.getEncounter(item.resource) : [];
          // item['disPractitioner'] = this.getPractitioner(item.resource);
          if ('requester' in item.resource && item.resource.requester.reference.toLowerCase().includes('practitioner') && !(item.resource.requester.reference.toLowerCase().includes('practitionerrole'))) {
            let tempind = [];
            tempind.push(item.resource.requester);
            item['disIndividual'] = tempind;
          }
          if ('performer' in item.resource && item.resource.performer instanceof Array) {
            let tempprac = [];
            for (let prac of item.resource.performer) {
              if ('reference' in prac) {
                tempprac.push(prac);
              }
            }
            item['disrequestor'] = tempprac;
          }
          item['disLocation'] = this.getlocation(item.resource);
          // item['disIndividual'] = this.getPractitioner(item.resource);
          item['CreationTime'] = ('meta' in item.resource && 'lastUpdated' in item.resource.meta) ? this.getdate(item.resource.meta.lastUpdated) : '--';
        }
      }
    } else {
      this.previous = null;
      this.next = null;
      this.present = null;
      this.fromRecordCount = 0;
      this.toRecordCount = 0;
      this.totalRecords = 0;
    }
    this.resourceTableData = data.entry;
    this.dataSource = new MatTableDataSource<Patient>();
    this.dataSource.data = this.resourceTableData;
    this.dataSource.sort = this.Sort;
  }

  gettelecom(item: any) {
    let temptele = [];
    for (let codItem of item) {
      temptele.push((codItem.system ? '<span>' + codItem.system + '</span>' + ' | ' : '') + '' + (codItem.value ? '<span>' + codItem.value + '</span>' + ' | ' : '') + '' + (codItem.use ? '<span>' + codItem.use + '</span>' : ''));
    }
    return temptele.join('<hr>');
  }


  getDoseQuantity(resource: any) {
    let resData = [];
    if ('dosageInstruction' in resource && resource.dosageInstruction instanceof Array) {
      resData = resource.dosageInstruction;
    }
    return resData;
  }

  getName(name: any) {
    let resGivenName = [];
    if ('name' in name) {
      if (name.name instanceof Array) {
        let tempname = []
        for (let item of name.name) {
          if ('prefix' in item && item.prefix) {
            item.prefix.forEach(it => {
              tempname.push(it)
            })
          }
          if ('family' in item) { tempname.push(item.family) };
          if ('given' in item && item.given) {
            item.given.forEach(it => {
              tempname.push(it)
            })
          }
          if ('suffix' in item && item.suffix) {
            item.suffix.forEach(it => {
              tempname.push(it)
            })
          }
          if ('use' in item) tempname.push(' | ' + item.use);
          resGivenName.push(tempname.join('  '))
        }
      }
    }
    return resGivenName.length > 0 ? resGivenName.join('<hr>') : '--';
  }

  getAddress(address: any) {
    let resAddress = [];
    if ('address' in address && address.address instanceof Array) {
      for (let item of address.address) {
        let tempAddress = [];
        if ('line' in item && item.line) {
          item.line.forEach(it => {
            tempAddress.push(it + ' , ')
          })
        }
        if ('city' in item) tempAddress.push(item.city + ' , ');
        if ('district' in item) tempAddress.push(item.district + ' , ');
        if ('state' in item) tempAddress.push(item.state + ' , ');
        if ('country' in item) tempAddress.push(item.country + ' , ');
        if ('postalCode' in item) tempAddress.push(item.postalCode);
        if ('type' in item) tempAddress.push(' | ' + item.type);
        if ('use' in item) tempAddress.push(' | ' + item.use);
        resAddress.push(tempAddress.join('  '));
      }
    }
    return resAddress.length > 0 ? resAddress.join('<hr>') : '--';
  }

  getEncounter(resource: any) {
    let resDate = [];
    if ('encounter' in resource && resource.encounter instanceof Object) {
      resDate.push(resource.encounter);
    }
    if ('context' in resource && resource.context instanceof Object) {
      resDate.push(resource.context);
    }
    if ('encounter' in resource && resource.encounter instanceof Array) {
      for (let item of resource.encounter) {
        if ('reference' in item) {
          resDate.push(item);
        }
      }
    }
    return resDate;
  }

  getcareteam(resource: any) {
    let resDate = [];
    if ('careTeam' in resource && resource.careTeam instanceof Array) {
      for (let item of resource.careTeam) {
        if ('reference' in item) {
          resDate.push(item);
        }
      }
    }
    return resDate;
  }

  getPractitioner(practitioner: any) {
    let tempPractitionerRef = [];
    if ('requester' in practitioner && 'reference' in practitioner.requester && practitioner.requester.reference.toLowerCase().includes('practitioner') && !(practitioner.requester.reference.toLowerCase().includes('practitionerrole'))) {
      tempPractitionerRef.push(practitioner.requester);
    }
    if ('provider' in practitioner && 'reference' in practitioner.provider && practitioner.provider.reference.toLowerCase().includes('practitioner') && !(practitioner.provider.reference.toLowerCase().includes('practitionerrole'))) {
      tempPractitionerRef.push(practitioner.provider);
    }
    if ('recorder' in practitioner && 'reference' in practitioner.recorder && practitioner.recorder.reference.toLowerCase().includes('practitioner') && !(practitioner.recorder.reference.toLowerCase().includes('practitionerrole'))) {
      tempPractitionerRef.push(practitioner.recorder);
    }
    if ('performer' in practitioner && practitioner.performer instanceof Array) {
      for (let pitem of practitioner.performer) {
        if ('actor' in pitem && 'reference' in pitem.actor) {
          let tempReference = pitem.actor.reference;
          if (tempReference.toLowerCase().includes('practitioner') && !(tempReference.toLowerCase().includes('practitionerrole'))) {
            tempPractitionerRef.push(pitem.actor);
          }
        }
      }
    }
    if ('author' in practitioner && practitioner.author instanceof Array) {
      for (let prac of practitioner.author) {
        if ('reference' in prac && prac.reference) {
          let tempReference = prac.reference;
          if (tempReference.toLowerCase().includes('practitioner') && !(tempReference.toLowerCase().includes('practitionerrole'))) {
            tempPractitionerRef.push(prac);

          }
        }
      }
    }

    if ('participant' in practitioner && practitioner.participant instanceof Array) {
      let tempPartIndividual = [];
      for (let prac of practitioner.participant) {
        if ('reference' in prac.individual && prac.individual.reference) {
          let tempReference = prac.individual.reference;
          if (tempReference.toLowerCase().includes('practitioner') && !(tempReference.toLowerCase().includes('practitionerrole'))) {
            tempPractitionerRef.push(prac.individual);

          }
        }
      }
    }
    return tempPractitionerRef;
  }

  getorganization(organization: any) {
    let temporganization = [];
    if ('owner' in organization && organization.owner instanceof Object) {
      temporganization.push(organization.owner);
    }
    if ('insurer' in organization && organization.insurer instanceof Object) {
      temporganization.push(organization.insurer);
    }
    if ('custodian' in organization && organization.custodian instanceof Object) {
      temporganization.push(organization.custodian);
    }
    if ('performer' in organization && organization.performer instanceof Array) {
      for (let pitem of organization.performer) {
        if ('actor' in pitem && 'reference' in pitem.actor) {
          let tempReference = pitem.actor.reference;
          if (tempReference.toLowerCase().includes('organization')) {
            temporganization.push(pitem.actor);
          }
        }
        if ('onBehalfOf' in pitem && 'reference' in pitem.onBehalfOf) {
          let tempReference = pitem.onBehalfOf.reference;
          if (tempReference.toLowerCase().includes('organization')) {
            temporganization.push(pitem.onBehalfOf);
          }
        }
      }
    }
    return temporganization;
  }

  getdiagnostic(diagnostic: any) {
    let tempdiagnostic = [];
    if ('report' in diagnostic && diagnostic.report instanceof Array) {
      for (let pitem of diagnostic.report) {
        if ('reference' in pitem) {
          let tempReference = pitem.reference;
          if (tempReference.toLowerCase().includes('diagnosticreport')) {
            tempdiagnostic.push(pitem);
          }
        }
      }
    }
    return tempdiagnostic;
  }

  getcoverage(coverage: any) {
    let tempdiagnostic = [];
    if ('insurance' in coverage && coverage.insurance instanceof Array) {
      for (let pitem of coverage.insurance) {
        if ('coverage' in pitem && 'reference' in pitem.coverage) {
          let tempReference = pitem.coverage.reference;
          if (tempReference.toLowerCase().includes('coverage')) {
            tempdiagnostic.push(pitem.coverage);
          }
        }
      }
    }
    return tempdiagnostic;
  }

  getlocation(location: any) {
    let templocation = [];
    if ('location' in location) {
      templocation.push(location.location);
    }
    if ('facility' in location) {
      templocation.push(location.facility);
    }
    if ('locationReference' in location && location.locationReference instanceof Array) {
      for (let pitem of location.locationReference) {
        if ('reference' in pitem) {
          templocation.push(pitem);
        }
      }
    }
    return templocation;
  }

  getnotes(notes: any) {
    let temptext = [];
    if ('note' in notes && notes.note instanceof Array) {
      for (let textitem of notes.note) {
        temptext.push(textitem.text);
      }
    }
    if ('processNote' in notes && notes.processNote instanceof Array) {
      for (let textitem of notes.processNote) {
        temptext.push(textitem.text);
      }
    }
    return temptext;
  }

  getarrayfield(item: any) {
    let temparr = [];
    for (let pitem of item) {
      if ('function' in pitem) {
        if ('coding' in pitem.function && pitem.function.coding instanceof Array) {
          for (let fitem of pitem.function.coding) {
            temparr.push((fitem.system ? '<span>' + fitem.system + '</span>' + ' | ' : ' ') + '' + (fitem.display ? '<span>' + fitem.display + '</span>' + ' | ' : ' ') + '' + (fitem.code ? '<span>' + fitem.code + '</span>' : ' '));
          }
        } else if ((!('coding' in pitem.function)) && 'text' in pitem.function) {
          temparr.push(pitem.function.text)
        }
      }

      else if ('coding' in pitem && pitem.coding instanceof Array) {
        for (let fitem of pitem.coding) {
          temparr.push((fitem.system ? '<span>' + fitem.system + '</span>' + ' | ' : ' ') + '' + (fitem.display ? '<span>' + fitem.display + '</span>' + ' | ' : ' ') + '' + (fitem.code ? '<span>' + fitem.code + '</span>' : ' '));
        }
      }
      else if ((!('coding' in pitem)) && 'text' in pitem) {
        temparr.push(pitem.text)
      }

    }
    return temparr.join('<hr>');
  }

  getresstatus(catItem: any) {
    let tempstatus = [];
    if ('coding' in catItem && catItem.coding instanceof Array) {
      for (let codItem of catItem.coding) {
        tempstatus.push((codItem.system ? '<span>' + codItem.system + '</span>' + ' | ' : '') + '' + (codItem.display ? '<span>' + codItem.display + '</span>' + ' | ' : '') + '' + (codItem.code ? '<span>' + codItem.code + '</span>' : ''));
      }
    } else if ((!('coding' in catItem)) && 'text' in catItem) {
      tempstatus.push(catItem.text)
    }
    else {
      tempstatus.push('--')
    }
    return tempstatus.join('<hr>');
  }

  getamount(aitem: any) {
    let tempamount = [];
    if (('amount' in aitem)) {
      tempamount.push(('<span>' + aitem.amount.value + '</span>') + ' ' + ('<span>' + aitem.amount.currency + '</span>'))
    }
    if (('net' in aitem)) {
      tempamount.push(('<span>' + aitem.net.value + '</span>') + ' ' + ('<span>' + aitem.net.currency + '</span>'))
    }
    return tempamount.join('<hr>');
  }

  getRefills(resource: any) {
    let resData;
    if ('dispenseRequest' in resource && 'numberOfRepeatsAllowed' in resource.dispenseRequest) {
      resData = resource.dispenseRequest.numberOfRepeatsAllowed;
    }
    return resData ? resData : '--';
  }

  getdate(date: any) {
    let resdate = '';
    if (date.toLowerCase().includes('t')) {
      resdate = this.dataPipe.transform(date, 'yyyy-MM-dd h:mm:ss a')
    }
    else {
      resdate = date;
    }
    return resdate ? resdate : '--';
  }

  getStartEndDate(resource: any, selectType: any) {
    let resData;
    if ('dispenseRequest' in resource && 'validityPeriod' in resource.dispenseRequest) {
      if (selectType in resource.dispenseRequest.validityPeriod) {
        resData = resource.dispenseRequest.validityPeriod[selectType];
      }
    }
    return resData;
  }

  previous: any;
  previousOffSet: any = {};
  nextOffSet: any = {};
  selfOffSet: any = {};

  next: any;
  present: any;
  getPaginationURL(resourcecData) {
    // this.resourcecData = data;


    let paginationdata = this.dataService.paginationDataprepare(resourcecData)
    this.next = paginationdata.next;
    this.previous = paginationdata.previous;
    this.present = paginationdata.present;
    this.totalRecords = paginationdata.totalCount;
    this.fromRecordCount = paginationdata.fromCount;
    this.toRecordCount = paginationdata.toCount;

  }

  temp = { one: 'dasdas', two: 'dasds', three: ['dsd', 'dasdas'] };

  getobjectFieldFromArray(arrayList) {
    if (arrayList instanceof Array) {
      let tempCoding = [];
      for (let codeItem of arrayList) {
        let tempObjects = [];
        for (let objItem of Object.keys(codeItem)) {
          if (typeof codeItem[objItem] == "object") {
            for (let innerObj of Object.keys(codeItem[objItem])) {
              tempObjects.push('<p><strong>' + innerObj + '</strong>' + ': ' + codeItem[objItem][innerObj] + '</p>');
            }
          } else {
            tempObjects.push('<p><strong>' + objItem + '</strong>' + ': ' + codeItem[objItem] + '</p>');
          }

        }

        tempCoding.push(tempObjects.join(''));
      }
      return tempCoding.join('<hr>');
    }

    if (arrayList instanceof Object) {
      let tempObjects = [];
      for (let objItem of Object.keys(arrayList)) {
        tempObjects.push('<p><strong>' + objItem + '</strong>' + ': ' + arrayList[objItem] + '</p>');
      }
      return tempObjects.join('');
    }

  }

  getcodeFieldFromArray(arrayList) {
    if (arrayList instanceof Array) {
      let tempCoding = [];
      for (let codeItem of arrayList) {
        let tempObjects = [];
        for (let objItem of Object.keys(codeItem)) {
          if (typeof codeItem[objItem] == "object") {
            for (let innerObj of Object.keys(codeItem[objItem])) {
              tempObjects.push((codeItem[objItem][innerObj][0].system ? '<span>' + codeItem[objItem][innerObj][0].system + '</span>' + ' | ' : ' ') + '' + (codeItem[objItem][innerObj][0].display ? '<span>' + codeItem[objItem][innerObj][0].display + '</span>' + ' | ' : ' ') + '' + (codeItem[objItem][innerObj][0].code ? '<span>' + codeItem[objItem][innerObj][0].code + '</span>' : ' '))
            }
          } else if (objItem != 'date') {
            tempObjects.push('<p><strong>' + objItem + '</strong>' + ': ' + codeItem[objItem] + '</p>');
          }

        }
        tempCoding.push(tempObjects.join(''));
      }
      return tempCoding.join('<hr>');
    }

    if (arrayList instanceof Object) {
      let tempObjects = [];
      for (let objItem of Object.keys(arrayList)) {
        tempObjects.push((arrayList[objItem][0].system ? '<span>' + arrayList[objItem][0].system + '</span>' + ' | ' : ' ') + '' + (arrayList[objItem][0].display ? '<span>' + arrayList[objItem][0].display + '</span>' + ' | ' : ' ') + '' + (arrayList[objItem][0].code ? '<span>' + arrayList[objItem][0].code + '</span>' : ' '))
      }
      return tempObjects.join('');
    }

  }

  isObjectPresent(objectdata, key) {
    if (key in objectdata && objectdata[key]) {
      return true;
    } else {
      return false;
    }
  }

  getParamValue(URL, variable) {
    if (URL.indexOf("?") != -1) {
      let splitURL = URL.split("?");
      let splitParams = splitURL[1].split("&");
      for (let i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == variable) {
          return singleURLParam[1];
        }
      }
    } else {
      return null;
    }

  }

  gotoPreviousPage() {
    if (this.previousdata) {
      this.patientViewService.paginationPatientResourcecData(this.previousdata).subscribe(data => {
        this.formatResourceData(data, this.selectedResourceItem);
        this.getpagedetails(data);
      })
    }
  }

  gotoNextPage() {
    if (this.nextdata) {
      this.patientViewService.paginationPatientResourcecData(this.nextdata).subscribe(data => {
        this.formatResourceData(data, this.selectedResourceItem);
        this.getpagedetails(data);
      })
    }
  }

  isArray(value: any) {
    return value instanceof Array;
  }

  canSwitchToNextSection(): boolean {
    return this.sections.findIndex(s => s.id === this.activeSection) < this.sections.length - 1;
  }

  nextSection() {
    const currentIndex = this.sections.findIndex(s => s.id === this.activeSection);
    if (currentIndex < this.sections.length - 1) {
      this.activeSection = this.sections[currentIndex + 1].id;
    }
  }

  canSwitchToPreviousSection(): boolean {
    return this.sections.findIndex(s => s.id === this.activeSection) > 0;
  }

  previousSection() {
    const currentIndex = this.sections.findIndex(s => s.id === this.activeSection);
    if (currentIndex > 0) {
      this.activeSection = this.sections[currentIndex - 1].id;
    }
  }

  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }
  }


  setDirection({ value }: MatSelectChange): void {
    this.Sort.sort({
      id: this.sort.active,
      start: value,
      disableClear: true,
    });
  }
}
