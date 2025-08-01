export default {
	PRODUCT_ID: {...PRODUCT_ID, data: PRODUCT_ID.text},
	PRODUCT_NAME_EN: {...PRODUCT_NAME_EN, data: PRODUCT_NAME_EN.text},
	PRODUCT_NAME_TH: {...PRODUCT_NAME_TH, data: PRODUCT_NAME_TH.text},
	PRODUCT_TYPE_EN: {...PRODUCT_TYPE, data: PRODUCT_TYPE.selectedOptionValue.split("/")[1]||""},
	PRODUCT_TYPE_TH: {...PRODUCT_TYPE, data: PRODUCT_TYPE.selectedOptionValue.split("/")[0]||""},
	FLOOR_NO: {...FLOOR_NO, data: FLOOR_NO.selectedOptionValue},
	UNIT_EN: {...UNIT, data: UNIT.selectedOptionValue.split("/")[1]||""},
	UNIT_TH: {...UNIT, data: UNIT.selectedOptionValue.split("/")[0]||""},
	TOTAL_UNIT: {...TOTAL_UNIT, data: TOTAL_UNIT.text},
	AVAILABLE_UNIT: {...AVAILABLE_UNIT, data: AVAILABLE_UNIT.text},
	STATUS: {...STATUS, data: STATUS.selectedOptionValue},
	PRODUCT_DETAIL: {...PRODUCT_DETAIL, data: PRODUCT_DETAIL.text},
	ACCOUNT_CODE: {...ACCOUNT_CODE, data: ACCOUNT_CODE.text},
	VAT_TYPE:{...VAT_TYPE, data: VAT_TYPE.selectedOptionValue},
	INVOICE_TYPE:{...INVOICE_TYPE,data: INVOICE_TYPE.selectedOptionValue},
}