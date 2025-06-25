export default {
	initDefault:async ()=>{
		if(appsmith.store[Configs.newCompanyTempFlag] != undefined && appsmith.URL.queryParams[ Configs.editCompanyFlag]==undefined){
			//temp and load editing before manage contacts
			let InitializationEntityList = [{ENTITY:Default_COMPANY_BILLING,DATA:appsmith.store[Configs.newCompanyTempFlag]}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);
		}else	if(appsmith.URL.queryParams[ Configs.editCompanyFlag] !== undefined){
			//LM
			await SELECT_BILLING.run()
			console.log("SELECT_BILLING")
			let data = SELECT_BILLING.data[0];
			let InitializationEntityList = [{ENTITY:Default_COMPANY_BILLING,DATA: data?data:{}}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);

		}else{
			//New
			let InitializationEntityList = [{ENTITY:Default_COMPANY_BILLING,DATA:{}}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);
			//await SELECT_DISTRICTs_BILLING.run();
			//await SELECT_SUBDISTRICTs_BILLING.run();
			//await SELECT_PROVINCEs.run();
		}
	}
}