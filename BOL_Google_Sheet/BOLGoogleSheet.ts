import { BOLNetsuiteData } from "BOLNetsuiteData";

export interface BOLGoogleSheetLine {
    deliveryDate: Date;
    plantNumber: number;
    referenceBOL: string;
    sapBOL: number;
    shipToName: string;
    shipToNumber: number;
    city: string;
    incoterms: string;
    customerPO: string;
    carrierCode: string;
    truckNumber: string;
    material: number;
    valuationCode: string;
    silo: number;
    tare: number;
    gross: number;
    net: number;
    mode: string;
    equipmentType: number;
}

export function mapGoogleSheetWithNetsuiteData(data: BOLNetsuiteData): BOLGoogleSheetLine {
    // 111, 222, 333, 444, 555 are placeholders
    // Replace them with the actual values from the data object
    return {
        deliveryDate: data.recordDate,
        plantNumber: 111,
        referenceBOL: data.recordNumber,
        sapBOL: 222,
        shipToName: data.customerName,
        shipToNumber: data.entity,
        city: data.shipAddress,
        incoterms: `Incoterms 111`,
        customerPO: `Customer PO 222`,
        carrierCode: data.custbody_mhi_freight_po_vendor,
        truckNumber: data.custbody_truck_id_number,
        material: data.item,
        valuationCode: `Valuation Code 333`,
        silo: 333,
        tare: 444,
        gross: data.custbody_mhi_gross_weight,
        net: data.custbody_netweight,
        mode: `Mode 444`,
        equipmentType: 555
    } as BOLGoogleSheetLine;
}