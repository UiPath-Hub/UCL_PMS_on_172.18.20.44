export default {
	userSession:"userSession",
	permissions:{VIEW:"PCATV",EDIT:"PCATE"},
	forceKick:false,
	forceLogin:false,
	errorAlert:"",
	editProductCatalog:"editProductCatalog",
	pageName:"Manage Product Catalog",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	startBody:"LOADING",
	echo:()=>{
		return Default_ProductCatalog.PRODUCT_TYPE
	}
}