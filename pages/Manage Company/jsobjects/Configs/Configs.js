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
	syncAlert:"",
	syncErrorEscape:appsmith.currentPageName,
	syncStatusIconMap:{"Pending Add":{status:"Pending Add",icon:"time",color:"#eab308"},"Pending Edit":{status:"Pending Edit",icon:"time",color:"#eab308"},"Pending Delete":{status:"Pending Delete",icon:"time",color:"#eab308"},"Not Synced":{status:"Not Synced",icon:"outdated",color:"#ef4444"},"Synced":{status:"Synced",icon:"tick",color:"green"}},
	IS_THIRD_PARTY: Boolean(_0_SELECT_FOR_COMPANY_BY_ID.data?_0_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY===null?true:_0_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY: appsmith.store.IS_THIRD_PARTY==0?false:true),
	PRIORITY_CONTACT_ID:"",
	showStore:()=>{
		
		return {editCompanyFlag:appsmith.store[this.editCompanyFlag],
						editCompanyContactFlag:appsmith.store[this.editCompanyContactFlag],
						fromCompany:appsmith.store[this.fromCompany],
						newCompanyTempFlag:appsmith.store[this.newCompanyTempFlag],
						dd:appsmith.store.IS_THIRD_PARTY
					 }
	},
	loadingProgress:{default:0,current:0,full:8}
	,test:()=>{
		return this.syncStatusIconMap
	}
}