/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @NDeploy ITEMFULFILLMENT
 * @NDescription This script is used to collect the data from the Bill of Lading record and send it to the Google Sheet
 * @NName ue_bill_of_lading.js
 */

import {log, search, https, runtime} from 'N';
import {EntryPoints} from "N/types";
import {getBOLNetsuiteData} from "./BOLNetsuiteData";
import {mapGoogleSheetWithNetsuiteData} from "./BOLGoogleSheet";

const sendToGoogleSheet = (lineData: any, accessTokens: any) => {

    // Get the Access Token from Script Parameter
    const {clientId, clientSecret, refreshToken, tokenUrl, sheetId, gsPageName} = accessTokens;

    const postBody = `grant_type=refresh_token`
        + `&refresh_token=` + encodeURIComponent(refreshToken)
        + `&client_id=` + encodeURIComponent(clientId)
        + `&client_secret=` + encodeURIComponent(clientSecret);

    const responseToken = https.post({
        url: tokenUrl,
        body: postBody,
        headers: { 'Content-Type': `application/x-www-form-urlencoded` }
    });

    if (responseToken.code !== 200) {
        log.debug(`UE Error`, `The following response was received while trying to get AccessToken: ${JSON.stringify(responseToken)}`);
        return null;
    }

    const accessToken = JSON.parse(responseToken.body).access_token;

    // Call the function to send the data to the Google Sheet
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/`;
    const range = `${gsPageName}!A:A`;
    const values = [Object.values(lineData)];
    const url = `${baseUrl}${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `application/json`,
    };

    const requestBody = { values };

    try {
        const response = https.post({
            url,
            headers,
            body: JSON.stringify(requestBody),
        });

        log.debug(`Google Sheets API Response`, response.body);
    } catch (error) {
        log.error(`Google Sheets API Error`, error);
    }
}



const isHolcimRelatedBOL = (customer: number) : boolean => {
    if (!customer) return false;
    return search.lookupFields({ type: search.Type.CUSTOMER, id: customer, columns: [`custentity_is_holcim_related`]}).custentity_is_holcim_related as boolean;
};

export const afterSubmit: EntryPoints.UserEvent.afterSubmit = (context: EntryPoints.UserEvent.afterSubmitContext) => {

    // TODO: Replace with CREATE event
    if (context.type !== context.UserEventType.EDIT) return;
    
    const newRecord = context.newRecord;
    const customer = Number(newRecord.getValue(`entity`));
    const soRecordId = Number(newRecord.getValue(`createdfrom`));
    const currentScript = runtime.getCurrentScript();
    const clientId = currentScript.getParameter({ name: `custscript_holcim_gs_token_client_id` });
    const clientSecret = currentScript.getParameter({ name: `custscript_holcim_gs_token_secret` });
    const refreshToken = currentScript.getParameter({ name: `custscript_holcim_gs_token_refresh` });
    const tokenUrl = currentScript.getParameter({ name: `custscript_holcim_gs_token_url` });
    const sheetId = currentScript.getParameter({ name: `custscript_holcim_gs_token_sheet_id` });
    const gsPageName = currentScript.getParameter({ name: `custscript_holcim_gs_page` });

    // Skip processing if any of the access tokens are missing
    if (!clientId || !clientSecret || !refreshToken || !tokenUrl || !sheetId || !gsPageName) return;

    // Skip processing if the customer is not Holcim related
    if (!isHolcimRelatedBOL(customer)) return;

    const bolData = getBOLNetsuiteData(newRecord.id, soRecordId);
    log.debug({ title: `BOL Data: `, details: bolData });

    // Skip processing if there is no data
    if (!bolData) return;

    const bolToSheet = mapGoogleSheetWithNetsuiteData(bolData);
    const accessTokens = { clientId, clientSecret, refreshToken, tokenUrl, sheetId, gsPageName };
    
    log.debug({ title: `Google Sheet Data: `, details: JSON.stringify(bolToSheet) });

    sendToGoogleSheet(bolToSheet, accessTokens);
};

