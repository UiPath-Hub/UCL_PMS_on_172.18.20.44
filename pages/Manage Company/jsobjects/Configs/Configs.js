export default {
	editCompanyFlag:"editCompany",
	editCompanyContactFlag:"editContacePerson",
	fromCompany:"fromCompany",
	newCompanyTempFlag:"newCompanyTempFlag",
	editCompanyProfileFlag:"editCompanyProfileFlag",
	userSession:"userSession",
	permissions:{VIEW:"COPAV",EDIT:"COPAE"},
	forceKick:false,
	forceLogin:false,
	errorAlert:"",
	pageName:"Manage Company",
	ROFRInventoryItem:[],
	defaultTap:"Company Contact",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	startBody:"LOADING",
	showCompanyContact:[],
	dateFormat:"D MMMM YYYY",
	contactPageState:{ManageContact:0,AddContactTo:1,EditContactOf:2,NewContactAndBack:3,CurrentState:0},
	companyPageState:{THIRD_PARTY:1,COMPANY:0},
	IS_THIRD_PARTY: Boolean(_0_SELECT_FOR_COMPANY_BY_ID.data?_0_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY: appsmith.store.IS_THIRD_PARTY==0?false:true || false),
	showStore:()=>{
		
		return {editCompanyFlag:appsmith.store[this.editCompanyFlag],
						editCompanyContactFlag:appsmith.store[this.editCompanyContactFlag],
						fromCompany:appsmith.store[this.fromCompany],
						newCompanyTempFlag:appsmith.store[this.newCompanyTempFlag],
						dd:appsmith.store.IS_THIRD_PARTY
					 }
	}
	,test:()=>COMPANY_ID.label
}