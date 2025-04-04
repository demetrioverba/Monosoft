import { getSqlResultAsMap } from './HelperFunctions';

export interface BOLNetsuiteData {
    recordId: number;
    recordNumber: string;
    recordDate: string
    entity: number;
    tranid: string;
    customerName: string;
    shipAddress: string;
    city: string;
    incoterms: number;
    customerPo: string;
    custbody_mhi_freight_po_vendor: string;
    custbody_truck_id_number: string;
    item: number;
    valuationCode: string;
    silo: number;
    custbody_trailer_id_number: string;
    custbody_mhi_gross_weight: number;
    custbody_netweight: number;
}

export function getBOLNetsuiteData(bolRecordId: number, soRecordId: number): BOLNetsuiteData | null {
    const sql = `
        SELECT
        tr.id,
        tr.entity,
        tr.tranid,
        tr.trandate,
        tr.BUILTIN.DF(tr.entity) as customer_name,
        tr.BUILTIN.DF(tr.shippingaddress) as address_text,
        tr.custbody_mhi_freight_po_vendor,
        tr.custbody_truck_id_number,
        tr.custbody_mhi_gross_weight,
        tr.custbody_netweight,
        tr.custbody_holcim_silo_no,
        tr.custbody_trailer_id_number,
        trl.item,
        tr_so.shipmethod,
        tr_so.otherrefnum,
        val_type.custrecord_valuation_type,

        FROM
        transaction tr

        LEFT JOIN
        transactionline trl
        ON trl.transaction = tr.id AND trl.mainline = 'T'

        LEFT JOIN
        transaction tr_so
        ON tr_so.id = ${soRecordId}

        LEFT JOIN customrecord_valuation_num val_type
        ON tr_so.custbody_valuation_type = val_type.id

        WHERE
        tr.id = ${bolRecordId}
    `;
    // BOL: 69791
    // SO: 69790
    const results = getSqlResultAsMap(sql);
    
    if (!results.length) return null;

    const result = results[0];
    const data: BOLNetsuiteData = {
        recordId: result.id as number,
        recordNumber: result.tranid as string,
        recordDate: result.trandate as string,
        entity: result.entity as number,
        tranid: result.tranid as string,
        customerName: result.customer_name as string,
        shipAddress: result.address_text as string,
        city: result.address_text as string,
        incoterms: result.shipmethod as number,
        customerPo: result.otherrefnum as string,
        custbody_mhi_freight_po_vendor: result.custbody_mhi_freight_po_vendor as string,
        custbody_truck_id_number: result.custbody_truck_id_number as string,
        item: result.item as number,
        valuationCode: result.custrecord_valuation_type as string,
        silo: result.custbody_holcim_silo_no as number,
        custbody_trailer_id_number: result.custbody_trailer_id_number as string,
        custbody_mhi_gross_weight: result.custbody_mhi_gross_weight as number,
        custbody_netweight: result.custbody_netweight as number,
    };

    return data;
}

export function exampleBOLNetsuiteData(): BOLNetsuiteData {
    return {
        recordId: 69791,
        recordNumber: `PEN-BOL2016`,
        recordDate: `3/28/2025`,
        entity: 10530,
        tranid: `PEN-BOL2016`,
        customerName: `C02643 Jewell/Oldcastle (Holcim)`,
        shipAddress: `Jewell/Oldcastle (Holcim)\nUnited States`,
        city: `Jewell/Oldcastle (Holcim)\nUnited States`,
        incoterms: 1915,
        customerPo: `123456789`,
        custbody_mhi_freight_po_vendor: ``,
        custbody_truck_id_number: `22`,
        item: 106,
        valuationCode: `I046`,
        silo: 6015,
        custbody_trailer_id_number: `33`,
        custbody_mhi_gross_weight: 51555,
        custbody_netweight: 5105,
    };
}