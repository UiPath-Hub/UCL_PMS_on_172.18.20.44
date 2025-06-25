export default {
	PRODUCT_NAME:()=>{
		if(appsmith.store["EditInventory"] !== undefined){
			return `${appsmith.store["defaultProductCatalog"].PRODUCT_NAME_TH}/${appsmith.store["defaultProductCatalog"].PRODUCT_NAME_EN}`;
		}else if(SP_SELECTPRODUCTCATALOG.data !== undefined&& SP_SELECTPRODUCTCATALOG.data.length > 0){
			return `${SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_NAME_TH}/${SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_NAME_EN}`;
		}else{
			return "";
		}
	},
	PRODUCT_ID:()=>{
		if(appsmith.store["EditInventory"] !== undefined){
			return appsmith.store["defaultProductCatalog"].PRODUCT_ID;
		}else if(SP_SELECTPRODUCTCATALOG.data !== undefined&& SP_SELECTPRODUCTCATALOG.data.length > 0){
			return SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_ID;
		}else{
			return "";	
		}
	}
	,PRODUCT_TYPE:()=>{
		if(appsmith.store["EditInventory"] !== undefined){
			return `${appsmith.store["defaultProductCatalog"].PRODUCT_TYPE_TH}/${appsmith.store["defaultProductCatalog"].PRODUCT_TYPE_EN}`
		}else if(SP_SELECTPRODUCTCATALOG.data !== undefined&& SP_SELECTPRODUCTCATALOG.data.length > 0){
			return `${SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_TYPE_TH}/${SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_TYPE_EN}`
		}else{
			return "";
		}
	}
	,AVAILABLE_UNIT:()=>{
		if(appsmith.store["EditInventory"] !== undefined){
			return appsmith.store["defaultProductCatalog"].FREE_UNIT
		}else if(SP_SELECTPRODUCTCATALOG.data !== undefined&& SP_SELECTPRODUCTCATALOG.data.length > 0){
			return SP_SELECTPRODUCTCATALOG.data[0].FREE_UNIT=== null?
				SP_SELECTPRODUCTCATALOG.data[0].AVAILABLE_UNIT:SP_SELECTPRODUCTCATALOG.data[0].FREE_UNIT
		}else{
			return 0;
		}
	}
	,FLOOR_NO:()=>{
		if(appsmith.store["EditInventory"] !== undefined){
			return appsmith.store["defaultProductCatalog"].FLOOR_NO
		}else if(SP_SELECTPRODUCTCATALOG.data !== undefined && SP_SELECTPRODUCTCATALOG.data.length > 0){
			return SP_SELECTPRODUCTCATALOG.data[0].FLOOR_NO === null?"":SP_SELECTPRODUCTCATALOG.data[0].FLOOR_NO;
		}else{
			return "";
		}
	},
	test:()=>{
		return appsmith.store["EditInventory"]  
	}
}