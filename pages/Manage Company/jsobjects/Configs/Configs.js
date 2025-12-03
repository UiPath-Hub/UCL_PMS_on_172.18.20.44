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
	isTempPage:()=>Boolean(appsmith.store[Configs.newCompanyTempFlag] != undefined && appsmith.URL.queryParams[ Configs.editCompanyFlag]=="TEMP"),
	defaultTap:"Company Contact",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	startBody:"LOADING",
	showCompanyContact:[],
	dateFormat:"D MMMM YYYY",
	contactPageState:{ManageContact:0,AddContactTo:1,EditContactOf:2,NewContactAndBack:3,CurrentState:0},
	companyPageState:{THIRD_PARTY:1,COMPANY:0},
	syncdErrorMessage:"",
	syncedErrorEscape:{pageName:appsmith.currentPageName,nextModal:"",params:{}},
	IS_THIRD_PARTY: Boolean(_0_SELECT_FOR_COMPANY_BY_ID.data?_0_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY===null?true:_0_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY: appsmith.store.IS_THIRD_PARTY==0?false:true),
	PRIORITY_CONTACT_ID:"",
	MaxHTTPResquestOfCheckingStatus:3,
	PollingDelayInMilliseconds:800,
	showStore:()=>{

		return {editCompanyFlag:appsmith.store[this.editCompanyFlag],
						editCompanyContactFlag:appsmith.store[this.editCompanyContactFlag],
						fromCompany:appsmith.store[this.fromCompany],
						newCompanyTempFlag:appsmith.store[this.newCompanyTempFlag],
						dd:appsmith.store.IS_THIRD_PARTY
					 }
	},
	loadingProgress:{default:0,current:0,full:7}
	,test:()=>{
		return appsmith.URL.queryParams
	},
}