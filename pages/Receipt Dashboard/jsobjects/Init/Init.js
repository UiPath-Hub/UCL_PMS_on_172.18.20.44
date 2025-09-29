export default {
	dataDisplayStartTime:moment("2021-01-01","YYYY-MM-DD"), //moment.tz("Asia/Bangkok").format("yyyy-mm-dd"),
	PageLoad:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		await showModal(LOAD_MODAL.name);
		await closeModal(LOAD_MODAL.name);
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;

		await resetWidget(CONTAINER_ALL.widgetName);
		JS.prepareTable();

	},
}