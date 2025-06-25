export default {
	PRODUCT_NAME_EN:{data:"",regex:"",required:false,color:""}
	,PRODUCT_NAME_TH:{data:"",regex:"",required:false,color:""}
	,PRODUCT_ID:{data:"",regex:"",required:false,color:""}
	,PRODUCT_TYPE_EN:{data:"",regex:"",required:false,color:""}
	,PRODUCT_TYPE_TH:{data:"",regex:"",required:false,color:""}
	,AVAILABLE_UNIT:{data:"",regex:"",required:false,color:""}
	,FLOOR_NO:{data:DefaultInventory.FLOOR_NO.data,regex:"",required:false,color:""}
	,FREE_UNIT:{data:"",regex:"",required:false,color:""}
	
	//View
	,FLOOR_NO_VIEW:{data:this.FLOOR_NO.data||DefaultInventory.FLOOR_NO.data,regex:this.FLOOR_NO.regex,required:this.FLOOR_NO.required,color:this.FLOOR_NO.color}
	,PRODUCT_NAME:{data:`${this.PRODUCT_NAME_TH.data}/${this.PRODUCT_NAME_EN.data}`,
								 regex:`${this.PRODUCT_NAME_EN.regex}|${this.PRODUCT_NAME_TH.regex}`,
								 required:this.PRODUCT_NAME_EN.required||this.PRODUCT_NAME_EN.required,
								 color:""}
	,PRODUCT_TYPE:{data:`${this.PRODUCT_TYPE_TH.data}/${this.PRODUCT_TYPE_EN.data}`,
								 regex:`${this.PRODUCT_TYPE_EN.regex}|${this.PRODUCT_TYPE_TH.regex}`,
								 required:this.PRODUCT_TYPE_EN.required||this.PRODUCT_TYPE_EN.required,
								 color:""}
}