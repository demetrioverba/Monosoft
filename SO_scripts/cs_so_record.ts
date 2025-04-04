/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @NDeploy SalesOrder
 * @NName cs_so_record.js
 * @NDescription Client script for Sales Order record
 */

import {EntryPoints} from 'N/types';
import {search} from 'N';

export const fieldChanged: EntryPoints.Client.fieldChanged = (context) => {
    const newRecord = context.currentRecord;
    const fieldId = context.fieldId;
    if (fieldId === `entity`) {
        const customer = newRecord.getValue(`entity`);
        if (customer) {
            const isHolcim = search.lookupFields({type: search.Type.CUSTOMER, id: customer, columns: [`custentity_is_holcim_related`]}).custentity_is_holcim_related as boolean;
            const valuationTypeField = newRecord.getField({fieldId: `custbody_valuation_type`});
            if (valuationTypeField) {
                valuationTypeField.isDisplay = isHolcim;
            }
        }
    }
};
