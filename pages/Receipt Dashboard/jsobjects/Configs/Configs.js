export default {
	userSession:"userSession",
	permissions:{VIEW:"A01",EDIT:"A02"},
	forceKick:false,
	forceLogin:false,
	errorAlert:"",
	PMS_RECEIPT_LM:[],
	dateFormat:"D MMM YYYY",
	IDParameterName:"RECEIPT_ID",
	requiredColorPass:"",
	requiredColorAlert:"",
	SQLDateFormat:"YYYY-MM-DD HH:mm",
	test:()=>{
		PMS_RECEIPT_LM.pageSize
	},
}