export default {
	editContacePerson:"editContacePerson", // COMPANY_CONTACT_ID | null
	editCompany:"editCompany", // COMPANY_ID | null
	fromCompany:"fromCompany",  // COMPANY_ID | null | TEMP
	DEFAULT_COMPANY:"DEFAULT_COMPANY",
	dateFormat:"D MMM YYYY",
	startBody:"LOADING",
	userSession:"userSession",
	permissions:{VIEW:"COCOE",EDIT:"COCOE"},
	forceKick:false,
	forceLogin:false,
	errorAlert:"",
	pageName:"Manage Company Contact",
	newCompanyTempFlag:"newCompanyTempFlag",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	pageState:{ManageContact:0,AddContactTo:1,EditContactOf:2,NewContactAndBack:3,CurrentState:0},
	test:()=>this.pageState
}