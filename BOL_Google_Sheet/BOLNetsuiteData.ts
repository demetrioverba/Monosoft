import { getSqlResultAsMap } from './HelperFunctions';


export interface BOLNetsuiteData {
    recordId: number;
    recordNumber: string;
    recordDate: string
    entity: number;
    tranid: string;
    customerName: string;
    holcimSoldTo: number;
    city: string;
    country: string;
    custrecord_holcim_shipto_addres: string;
    incoterms: number;
    customerPo: string;
    vendorName: string;
    custentity_holcim_carrier_code: string;
    custbody_truck_id_number: string;
    item: number;
    valuationCode: string;
    silo: number;
    custbody_trailer_id_number: string;
    custbody_mhi_gross_weight: number;
    custbody_netweight: number;
    tare: number;
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
        tr.custbody_truck_id_number,
        tr.custbody_mhi_gross_weight,
        tr.custbody_netweight,
        tr.custbody_holcim_silo_no,
        tr.custbody_trailer_id_number,
        trl.item,
        tr_so.shipmethod,
        tr_so.otherrefnum,
        val_type.custrecord_valuation_type,
        ven.custentity_holcim_carrier_code,
        ven.companyname as vendor_name,
        ea.city,
        ea.country,
        ea.custrecord_holcim_shipto_addres,
        cust.custentity_holcim_sold_to

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

        LEFT JOIN vendor ven
        ON tr.custbody_mhi_freight_po_vendor = ven.id

        LEFT JOIN entityAddressbook a ON tr.entity = a.entity AND a.addressbookaddress = tr.shippingaddress
        LEFT JOIN EntityAddress ea ON a.addressbookaddress = ea.nkey

        LEFT JOIN customer cust
        ON tr.entity = cust.id

        WHERE
        tr.id = ${bolRecordId}
    `;
    // BOL: 69791
    // SO: 69790

    // BOL: 70464
    // SO: 70463

    // For testing purposes (Vendor)
    // BOL: 7904
    // SO: 7843
    const results = getSqlResultAsMap(sql);
    
    if (!results.length) return null;

    const result = results[0];
    const grossWeight = Number(result.custbody_mhi_gross_weight) || 0;
    const netWeight = Number(result.custbody_netweight) || 0;
    const tareWeight = grossWeight - netWeight;

    const data: BOLNetsuiteData = {
        recordId: result.id as number,
        recordNumber: result.tranid as string,
        recordDate: result.trandate as string,
        entity: Number(result.entity),
        tranid: result.tranid as string,
        customerName: result.customer_name as string,
        holcimSoldTo: Number(result.custentity_holcim_sold_to),
        city: result.city as string,
        country: result.country as string,
        custrecord_holcim_shipto_addres: result.custrecord_holcim_shipto_addres as string,
        incoterms: result.shipmethod as number,
        customerPo: result.otherrefnum as string,
        vendorName: result.vendor_name as string,
        custentity_holcim_carrier_code: result.custentity_holcim_carrier_code as string,
        custbody_truck_id_number: result.custbody_truck_id_number as string,
        item: result.item as number,
        valuationCode: result.custrecord_valuation_type as string,
        silo: result.custbody_holcim_silo_no as number,
        custbody_trailer_id_number: result.custbody_trailer_id_number as string,
        custbody_mhi_gross_weight: result.custbody_mhi_gross_weight as number,
        custbody_netweight: result.custbody_netweight as number,
        tare: tareWeight,
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
        holcimSoldTo: 333,
        city: `New York`,
        country: `US`,
        custrecord_holcim_shipto_addres: `111222`,
        incoterms: 1915,
        customerPo: `123456789`,
        vendorName: `CENTRAL CAROLINA SCALE`,
        custentity_holcim_carrier_code: `123456789`,
        custbody_truck_id_number: `22`,
        item: 106,
        valuationCode: `I046`,
        silo: 6015,
        custbody_trailer_id_number: `33`,
        custbody_mhi_gross_weight: 51555,
        custbody_netweight: 5105,
        tare: 46450,
    };
}