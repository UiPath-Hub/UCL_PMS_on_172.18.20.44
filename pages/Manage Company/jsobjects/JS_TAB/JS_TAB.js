export default {
	Profile:{LeadData:[],ServiceData:[]},
	onTapChange:async()=>{
		if(ALL_TAB.selectedTab == "Profile"){
			//await	Container_LeaseSpace.setVisibility(false);
			//await Container_Service.setVisibility(false);
			 SELECT_FORMULAR.run()
			JS_Profile.updateLeadProfileTable();
			JS_Profile.updateServiceProfileTable();
			
			//Container_LeaseSpace.setVisibility(true)
			//Container_Service.setVisibility(true)
		}
	}
}