/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @NDeploy SalesOrder
 * @NName ue_so_record.js
 * @NDescription User Event Script for Sales Order record
 */

import {EntryPoints} from 'N/types';
import * as serverWidget from 'N/ui/serverWidget';
import {search} from 'N';

export const beforeLoad: EntryPoints.UserEvent.beforeLoad = (context: EntryPoints.UserEvent.beforeLoadContext) => {
    if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
        const form = context.form;
        const valuationTypeField = form.getField({id: `custbody_valuation_type`});
        const customer = context.newRecord.getValue({fieldId: `entity`});
        const isHolcim = search.lookupFields({type: search.Type.CUSTOMER, id: customer, columns: [`custentity_is_holcim_related`]}).custentity_is_holcim_related as boolean;
        if (!isHolcim) {
            valuationTypeField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
        }
    }
};
