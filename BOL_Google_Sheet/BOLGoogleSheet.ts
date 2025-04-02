import { BOLNetsuiteData } from "BOLNetsuiteData";
import {formatDate} from "./HelperFunctions";   

export interface BOLGoogleSheetLine {
    deliveryDate: string;
    plantNumber: string;
    referenceBOL: string;
    sapBOL: string;
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
    tare: string;
    gross: number;
    net: number;
    mode: string;
    equipmentType: string;
}

export function mapGoogleSheetWithNetsuiteData(data: BOLNetsuiteData): BOLGoogleSheetLine {

    return {
        deliveryDate: formatDate(new Date()),
        plantNumber: '5351', // ???
        referenceBOL: data.recordNumber,
        sapBOL: '842706809', // ???
        shipToName: data.customerName,
        shipToNumber: data.entity,
        city: data.shipAddress,
        incoterms: data.incoterms === 1915 ? 'FOB' : 'FB', // Needed more safe way to get the value, or map from NEW RECORD
        customerPO: data.customerPo,
        carrierCode: data.custbody_mhi_freight_po_vendor || '',
        truckNumber: data.custbody_truck_id_number,
        material: data.item,
        valuationCode: data.valuationCode,
        silo: data.silo,
        tare: data.custbody_trailer_id_number,
        gross: data.custbody_mhi_gross_weight,
        net: data.custbody_netweight,
        mode: data.mode,
        equipmentType: '5000056' // ???
    }
}

export function exampleBOLGoogleSheetLine(): BOLGoogleSheetLine {
    return {
        deliveryDate: '1/13/2025',
        plantNumber: '5351',
        referenceBOL: 'PEN-BOL2016',
        sapBOL: '842706809',
        shipToName: 'C02643 Jewell/Oldcastle (Holcim)',
        shipToNumber: 10530,
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