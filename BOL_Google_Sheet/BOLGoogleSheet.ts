import { BOLNetsuiteData } from "BOLNetsuiteData";

export interface BOLGoogleSheetLine {
    deliveryDate: string;
    plantNumber: string;
    referenceBOL: string;
    sapBOL: string;
    shipToName: string;
    shipToNumber: string;
    city: string;
    incoterms: string;
    customerPO: string;
    carrierCode: string;
    truckNumber: string;
    material: number;
    valuationCode: string;
    silo: number;
    tare: string;
    gross: number;
    net: number;
    mode: string;
    equipmentType: string;
}

export function mapGoogleSheetWithNetsuiteData(data: BOLNetsuiteData): BOLGoogleSheetLine {

    return {
        deliveryDate: data.recordDate,
        plantNumber: '5351', // hardcoded - OK
        referenceBOL: data.recordNumber,
        sapBOL: '', // blank - OK
        shipToName: data.customerName,
        shipToNumber: data.custrecord_holcim_shipto_addres,
        city: data.city,
        incoterms: data.incoterms === 1915 ? 'FOB' : 'FP', // Needed more safe way to get the value, or map from NEW RECORD
        customerPO: data.customerPo,
        carrierCode: data.custentity_holcim_carrier_code,
        truckNumber: data.custbody_truck_id_number,
        material: data.item,
        valuationCode: data.valuationCode,
        silo: data.silo,
        tare: data.custbody_trailer_id_number,
        gross: data.custbody_mhi_gross_weight,
        net: data.custbody_netweight,
        mode: 'Truck', // hardcoded - OK
        equipmentType: '5000056' // hardcoded - OK
    }
}

export function exampleBOLGoogleSheetLine(): BOLGoogleSheetLine {
    return {
        deliveryDate: '3/28/2025',
        plantNumber: '5351',
        referenceBOL: 'PEN-BOL2016',
        sapBOL: '842706809',
        shipToName: 'C02643 Jewell/Oldcastle (Holcim)',
        shipToNumber: '10530',
        city: 'Jewell/Oldcastle (Holcim)\nUnited States',
        incoterms: 'FOB',
        customerPO: '123456789',
        carrierCode: '',
        truckNumber: '22',
        material: 106,
        valuationCode: 'I046',
        silo: 6015,
        tare: '33',
        gross: 51555,
        net: 5105,
        mode: 'Truck',
        equipmentType: '5000056'
    }
}