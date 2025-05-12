import { BOLNetsuiteData } from "BOLNetsuiteData";

export interface BOLGoogleSheetLine {
    deliveryDate: string;
    plantNumber: string;
    referenceBOL: string;
    sapBOL: string;
    shipToName: string;
    soldTo: number;
    shipToNumber: string;
    city: string;
    incoterms: string;
    customerPO: string;
    carrierName: string;
    carrierCode: string;
    truckNumber: string;
    material: number;
    materialName: string;
    valuationCode: string;
    valuationDescription: string;
    silo: number;
    tare: string;
    gross: number;
    net: number;
    mode: string;
    equipmentType: string;
    status: string;
}

export interface AccessToken {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    tokenUrl: string;
    sheetId: string;
    gsPageName: string;
}

export function mapGoogleSheetWithNetsuiteData(data: BOLNetsuiteData): BOLGoogleSheetLine {

    return {
        deliveryDate: data.recordDate,
        plantNumber: `5351`, // hardcoded - OK
        referenceBOL: data.recordNumber,
        sapBOL: ``, // blank - OK
        shipToName: data.customerName,
        soldTo: data.holcimSoldTo,
        shipToNumber: data.custrecord_holcim_shipto_addres,
        incoterms: data.incoterms === 1915 ? `FOB` : `FP`, // Needed more safe way to get the value, or map from NEW RECORD
        city: data.city,
        customerPO: data.customerPo,
        carrierName: data.vendorName,
        carrierCode: data.custentity_holcim_carrier_code,
        equipmentType: `5000056`, // hardcoded - OK
        truckNumber: data.custbody_truck_id_number,
        material: data.item,
        materialName: ``, // blank - OK
        valuationCode: data.valuationCode,
        valuationDescription: ``, // blank - OK
        silo: data.silo,
        tare: data.custbody_trailer_id_number,
        gross: data.custbody_mhi_gross_weight,
        net: data.custbody_netweight,
        mode: `Truck`, // hardcoded - OK
        status: `New` // blank - OK
    };
}

export function exampleBOLGoogleSheetLine(): BOLGoogleSheetLine {
    return {
        deliveryDate: `3/28/2025`,
        plantNumber: `5351`,
        referenceBOL: `PEN-BOL2016`,
        sapBOL: `842706809`,
        shipToName: `C02643 Jewell/Oldcastle (Holcim)`,
        soldTo: 333,
        shipToNumber: `10530`,
        city: `Jewell/Oldcastle (Holcim)\nUnited States`,
        incoterms: `FOB`,
        customerPO: `123456789`,
        carrierName: `CENTRAL CAROLINA SCALE`,
        carrierCode: ``,
        truckNumber: `22`,
        material: 106,
        materialName: `Cement`,
        valuationCode: `I046`,
        valuationDescription: `Cement`,
        equipmentType: `5000056`,
        silo: 6015,
        tare: `33`,
        gross: 51555,
        net: 5105,
        mode: `Truck`,
        status: ``,
    };
}