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
	ShowOptionalDetail:appsmith.store[Configs.PageType] === PageTypes.Meter
}