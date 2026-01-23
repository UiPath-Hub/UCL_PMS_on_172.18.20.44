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
	isTempPage:()=>Boolean(appsmith.store[Configs.newCompanyTempFlag] != undefined && appsmith.URL.queryParams[ Configs.editCompanyFlag]==="TEMP"),
	isNewCompany:()=>Boolean(appsmith.URL.queryParams[Configs.editCompanyFlag]===undefined||appsmith.URL.queryParams[Configs.editCompanyFlag]==="TEMP"),
	BILLING_REMARK_TYPE:{invoice:"invoice",receipt:"receipt"},
	INVOICE_REMARK_TYPE:{GROUP:"Group ID",PRODUCT:"Product Type"},
	defaultTap:"Company Contact",
	requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	startBody:"LOADING",
	showCompanyContact:[],
	disableProfileQuantityInput:Default_InvenForProfile.PRODUCT_TYPE_TH.data=="พื้นที่เช่า",
	RemarksOfInvoices:{data:[],
										 column:[{display:"BILLING_REMARK_ID",system:"BILLING_REMARK_ID"},{display:"Invoice Remark Type",system:"INVOICE_REMARK_TYPE"},{display:"Product Type Name",system:"BILLING_REMARK_PRODUCT_TYPE_NAME"},{display:"Group ID",system:"BILLING_REMARK_GROUP_ID"},{display:"Remark Detail",system:"BILLING_REMARK_DETAIL"}],
										 filterData:(currentData,column)=>{
											 return currentData.map(row=>{
												 let filteredRow = {};
												 column.forEach(col=>{
													 if(row[col.system])
														 filteredRow[col.display] = row[col.system];
													 else filteredRow[col.display] = "";
												 })
												 return filteredRow;
											 })
										 },
										 setDefault:(column)=>{
											 const obj = {};
											 column.forEach(item => {
												 obj[item.display] = "";
											 });
											 return [obj];
										 }
										},
	dateFormat:"D MMMM YYYY",
	contactPageState:{ManageContact:0,AddContactTo:1,EditContactOf:2,NewContactAndBack:3,CurrentState:0},
	companyPageState:{THIRD_PARTY:1,COMPANY:0},
	syncdErrorMessage:"",
	syncedErrorEscape:{pageName:appsmith.currentPageName,nextModal:"",params:{}},
	IS_THIRD_PARTY: Boolean(_00_SELECT_FOR_COMPANY_BY_ID.data?_00_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY===null?true:_00_SELECT_FOR_COMPANY_BY_ID.data[0].IS_THIRD_PARTY: appsmith.store.IS_THIRD_PARTY==0?false:true),
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