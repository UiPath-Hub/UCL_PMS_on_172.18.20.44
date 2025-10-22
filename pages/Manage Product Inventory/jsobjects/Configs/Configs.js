export default {
	userSession:"userSession",
	permissions:{VIEW:"PINVV",EDIT:"PINVE"},
	forceKick:false,
	forceLogin:false,
	errorAlert:"",
	pageName:"Manage Product Inventory",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	startBody:"LOADING",
	EditInventory:"EditInventory",
	PageType:"PageType",
	dateFormat:"D MMMM YYYY",
	isFreeSpace:false,
	startQuantity:0,
	ShowOptionalDetail:appsmith.store[Configs.PageType] === PageTypes.Meter,
	FLOOR_ENABLE_disable:SP_SELECTPRODUCTCATALOG.data?["Leased Space"].includes(SP_SELECTPRODUCTCATALOG.data[0]?.PRODUCT_TYPE_EN):true 
}