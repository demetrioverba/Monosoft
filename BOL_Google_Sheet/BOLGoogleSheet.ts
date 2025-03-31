import { BOLNetsuiteData } from "BOLNetsuiteData";

export interface BOLGoogleSheetLine {
    deliveryDate: Date;
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
        deliveryDate: data.recordDate,
        plantNumber: '5351', // ???
        referenceBOL: data.recordNumber,
        sapBOL: '842706809', // ???
        shipToName: data.customerName,
        shipToNumber: data.entity,
        city: data.shipAddress,
        incoterms: data.incoterms === '1915' ? 'FOB' : 'FB', // Needed more safe way to get the value
        customerPO: data.customerPo,
        carrierCode: data.custbody_mhi_freight_po_vendor,
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