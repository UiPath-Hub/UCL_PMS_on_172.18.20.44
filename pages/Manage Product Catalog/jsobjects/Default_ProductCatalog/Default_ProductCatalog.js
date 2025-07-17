export default {
	PRODUCT_ID:{data:"",regex:"",required:false,color:""},
	OWNER_ID:{data:"",regex:"",required:false,color:""},
	PRODUCT_NAME_EN:{data:"",regex:"",required:false,color:""},
	PRODUCT_NAME_TH:{data:"",regex:"",required:false,color:""},
	PRODUCT_TYPE_EN:{data:"",regex:"",required:false,color:""},
	PRODUCT_TYPE_TH:{data:"",regex:"",required:false,color:""},
	FLOOR_NO:{data:"",regex:"",required:false,color:""},
	UNIT_EN:{data:"",regex:"",required:false,color:""},
	UNIT_TH:{data:"",regex:"",required:false,color:""},
	TOTAL_UNIT:{data:"",regex:"",required:false,color:""},
	AVAILABLE_UNIT:{data:"",regex:"",required:false,color:""},
	STATUS:{data:"Active",regex:"",required:false,color:""},
	PRODUCT_DETAIL:{data:"",regex:"",required:false,color:""},
	DELETE:{data:"",regex:"",required:false,color:""},
	CREATE_DATE:{data:"",regex:"",required:false,color:""},
	ACCOUNT_CODE:{data:"",regex:"",required:false,color:""},
	CATALOG_PICTURE:{data:"",regex:"",required:false,color:""},
	VAT_TYPE:{data:"",regex:"",required:false,color:""},
	INVOICE_TYPE:{data:"",regex:"",required:false,color:""},

	//View
	IMAGE:{data:""},
	PRODUCT_TYPE:{//data:`${this.PRODUCT_TYPE_TH.data}/${this.PRODUCT_TYPE_EN.data}`,
		regex:`${this.PRODUCT_TYPE_TH.regex}|${this.PRODUCT_TYPE_EN.regex}`,
		required:this.PRODUCT_TYPE_EN.required||this.PRODUCT_TYPE_TH.required,
		color:""},
	UNIT:{//data:`${this.UNIT_TH.data}/${this.UNIT_EN.data}`,
		regex:`${this.UNIT_EN.regex}|${this.UNIT_TH.regex}`,
		required:this.UNIT_EN.required||this.UNIT_TH.required,
		color:""},


}