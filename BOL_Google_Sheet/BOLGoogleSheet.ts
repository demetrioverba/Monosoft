import { BOLNetsuiteData } from "BOLNetsuiteData";

export interface BOLGoogleSheetLine {
    entryDate: string;
    deliveryDate: string;
    plantNumber: string;
    referenceBOL: string;
    sapBOL: string;
    // shipToName: string;
    // soldTo: number;
    shipToNumber: string;
    // city: string;
    incoterms: string;
    customerPO: string;
    // carrierName: string;
    carrierCode: string;
    truckNumber: string;
    material: number;
    // materialName: string;
    valuationCode: string;
    // valuationDescription: string;
    silo: number;
    tare: number;
    gross: number;
    net: number;
    // mode: string;
    equipmentType: string;
    status: string;
    botCommeent: string;
    processingDate: string;
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
        entryDate: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
        deliveryDate: data.recordDate,
        plantNumber: `5351`, // hardcoded - OK
        referenceBOL: data.recordNumber,
        sapBOL: ``, // blank - OK
        shipToNumber: data.custrecord_holcim_shipto_addres,
        incoterms: data.incoterms === 1915 ? `FOB` : `FP`,
        customerPO: data.customerPo,
        carrierCode: data.custentity_holcim_carrier_code,
        equipmentType: `5000056`, // hardcoded - OK
        truckNumber: data.custbody_truck_id_number,
        material: data.item,
        valuationCode: data.valuationCode,
        silo: data.silo,
        tare: data.tare,
        gross: data.custbody_mhi_gross_weight,
        net: data.custbody_netweight,
        status: `New`, // hardcoded - OK
        botCommeent: ``, // blank - OK
        processingDate: ``// blank - OK
    };
}

export function exampleBOLGoogleSheetLine(): BOLGoogleSheetLine {
    return {
        entryDate: `3/28/2025`,
        deliveryDate: `3/28/2025`,
        plantNumber: `5351`,
        referenceBOL: `PEN-BOL2016`,
        sapBOL: `842706809`,
        shipToNumber: `10530`,
        incoterms: `FOB`,
        customerPO: `123456789`,
        carrierCode: ``,
        truckNumber: `22`,
        material: 106,
        valuationCode: `I046`,
        equipmentType: `5000056`,
        silo: 6015,
        tare: 46450,
        gross: 51555,
        net: 5105,
        status: ``,
        botCommeent: ``,
        processingDate: ``
    };
}