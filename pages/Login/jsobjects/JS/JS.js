export default {
	on_confirmClick:async ()=>{
		await SP_HANDLE_TOKEN.run();
		if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
			let SESSION = {TOKEN:"",PERMISSIONS:[],EMAIL:appsmith.user.email};
			if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
				showAlert("Create session error.");
			}else{
				SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
				SESSION.START_PAGE = SP_HANDLE_TOKEN.data[0].START_PAGE;
				SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				storeValue(Configs.userSession,SESSION);
				navigateTo(SESSION.START_PAGE, {}, 'SAME_WINDOW');
			}
				
		}else{
			if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
				showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
			}else{
				showAlert("No any permissions assigned. Please, contact admin.","error");
			}
		}
	},

}