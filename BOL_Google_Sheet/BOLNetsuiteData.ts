import { getSqlResultAsMap } from './HelperFunctions';

export interface BOLNetsuiteData {
    recordId: number;
    recordNumber: string;
    recordDate: Date;
    entity: number;
    // plantNumber: number;
    tranid: string;
    // sapbol: number;
    customerName: string;
    shipAddress: string;
    // city: string;
    // incoterms: string;
    // customerPo: string;
    custbody_mhi_freight_po_vendor: string;
    custbody_truck_id_number: string;
    item: number;
    // valuationCode: string;
    custbody_trailer_id_number: string;
    custbody_mhi_gross_weight: number;
    custbody_netweight: number;
    // mode: string;
}

export function getBOLNetsuiteData(recordId: number): BOLNetsuiteData | null {
    const sql = `
        SELECT
        tr.id,
        tr.entity,
        tr.tranid,
        tr.BUILTIN.DF(tr.entity) as customerName,
        tr.BUILTIN.DF(tr.shippingaddress) as address_text,
        tr.custbody_mhi_freight_po_vendor,
        tr.custbody_truck_id_number,
        tr.custbody_trailer_id_number,
        tr.custbody_mhi_gross_weight,
        tr.custbody_netweight,
        trl.item,

        FROM
        transaction tr

        LEFT JOIN
        transactionline trl
        ON trl.transaction = tr.id AND trl.mainline = 'T'

        WHERE
        tr.id = ${recordId}
    `;
    const results = getSqlResultAsMap(sql);
    
    if (!results.length) return null;

    const result = results[0];
    const data: BOLNetsuiteData = {
        recordId: result.id as number,
        recordNumber: result.tranid as string,
        recordDate: new Date(),
        entity: result.entity as number,
        tranid: result.tranid as string,
        customerName: result.customerName as string,
        shipAddress: result.address_text as string,
        custbody_mhi_freight_po_vendor: result.custbody_mhi_freight_po_vendor as string,
        custbody_truck_id_number: result.custbody_truck_id_number as string,
        item: result.item as number,
        custbody_trailer_id_number: result.custbody_trailer_id_number as string,
        custbody_mhi_gross_weight: result.custbody_mhi_gross_weight as number,
        custbody_netweight: result.custbody_netweight as number
    };

    return data;
}

export function exampleBOLNetsuiteData(): BOLNetsuiteData[] {
    return [
        {
            recordId: 1,
            recordNumber: `BOL-0001`,
            recordDate: new Date(),
            entity: 1,
            tranid: `BOL-0001`,
            customerName: `Holcim`,
            shipAddress: `123 Main St`,
            custbody_mhi_freight_po_vendor: `123456`,
            custbody_truck_id_number: `123456`,
            item: 1,
            custbody_trailer_id_number: `123456`,
            custbody_mhi_gross_weight: 1000,
            custbody_netweight: 900
        }
    ];
}