export default {
	userSession:"userSession",
	permissions:{VIEW:"INVV",EDIT:"INVE",SHOW_INVOICE_EXECUTE:"INEX"},
	forceKick:false,
	forceLogin:false,
	errorAlert:"",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	dateFormat:"D MMM YYYY",
	pageName:"",
	INVOICE_ID:"INVOICE_ID",
	COMPANY_ID:"COMPANY_ID",
	COMPANY_CONTACT_ID:"COMPANY_CONTACT_ID",
	BILLING_INFORMATION_ID:"BILLING_INFORMATION_ID",
	bttnAPPROVE_disableStatus:["Draft Invoice","Approved","Waiting for Payment","Over Due","Canceled","Payment Completed","Rejected"]
	/*moment(DATE_FROM.formattedDate,Configs.dateFormat).format("YYYY-MM-DD")+" 00:00"*/
}