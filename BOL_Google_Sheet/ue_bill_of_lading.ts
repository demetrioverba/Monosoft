/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @NDeploy ITEMFULFILLMENT
 * @NDescription This script is used to collect the data from the Bill of Lading record and send it to the Google Sheet
 * @NName ue_bill_of_lading.js
 */

import {log, search} from 'N';
import {EntryPoints} from "N/types";
import {getBOLNetsuiteData} from "./BOLNetsuiteData";
import {mapGoogleSheetWithNetsuiteData} from "./BOLGoogleSheet";

// 1 - Create a new function to send the data to the Google Sheet when the record is created

// const sendToGoogleSheet = (data: any) => {
//     // 6 - Create the URL of the Google Sheet
//     const url = 'https://script.google.com/macros/s/AKfycbz6u1Q9zXz8s3k4QY2b2QbGyM9y2A/exec';

//     // 7 - Create the options object
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };

//     // 8 - Call the NetSuite API to send the data to the Google Sheet
//     const response = fetch(url, options);
// }



const isHolcimRelatedBOL = (customer: number) : boolean => {
    if (!customer) return false;
    return search.lookupFields({ type: search.Type.CUSTOMER, id: customer, columns: [`custentity_is_holcim_related`]}).custentity_is_holcim_related as boolean;
};

export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (context) => {

    if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) return;

    const newRecord = context.newRecord;
    const customer = Number(newRecord.getValue(`entity`));

    // Skip processing if the customer is not Holcim related
    if (!isHolcimRelatedBOL(customer)) return;

    const bolData = getBOLNetsuiteData(newRecord.id);
    log.debug({ title: `BOL Data: `, details: bolData });

    // Skip processing if there is no data
    if (!bolData) return;

    const bolToSheet = mapGoogleSheetWithNetsuiteData(bolData);
    log.debug({ title: `Google Sheet Data: `, details: JSON.stringify(bolToSheet) });



    // 5 - Call the function to send the data to the Google Sheet
    // sendToGoogleSheet(data);
};

