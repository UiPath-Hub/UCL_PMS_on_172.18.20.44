export default {
	/*REPEAT_EVERY_setValue:(widget)=>{
		if(!widget.text)return;
		if(widget.widgetName === "REPEAT_EVERY"){
			REPEAT_EVERY_1.setValue(widget.text);
			REPEAT_EVERY2.setValue(widget.text);
		}else if(widget.widgetName === "REPEAT_EVERY_1"){
			REPEAT_EVERY.setValue(widget.text);
			REPEAT_EVERY2.setValue(widget.text);
		}else if(widget.widgetName === "REPEAT_EVERY2"){
			REPEAT_EVERY.setValue(widget.text);
			REPEAT_EVERY_1.setValue(widget.text);
		}
		
	},
	FREQUENCY_DATE_setValue:(widget)=>{
		if(!widget.selectedDate)return;
		if(widget.widgetName === "FREQUENCY_DATE"){
			FREQUENCY_DATE1.setValue(widget.selectedDate);
			FREQUENCY_DATE2.setValue(widget.selectedDate);
		}else if(widget.widgetName === "FREQUENCY_DATE1"){
			FREQUENCY_DATE.setValue(widget.selectedDate);
			FREQUENCY_DATE2.setValue(widget.selectedDate);
		}else if(widget.widgetName === "FREQUENCY_DATE2"){
			FREQUENCY_DATE.setValue(widget.selectedDate);
			FREQUENCY_DATE1.setValue(widget.selectedDate);
		}
		
	},*/
	ableToDeleteProfile:false,
	LeadTotalAmount:parseFloat(PMS_COMPANY_PROFILE_LM.processedTableData.reduce((accumulator, currentValue) => {  
		if(!accumulator.id.includes(currentValue.INVENTORY_ID)){   
			accumulator.id.push(currentValue.INVENTORY_ID)
			accumulator.sum+=parseFloat( currentValue.QUANTITY)
		}
		return accumulator; 
	}, {id:[],sum:0}).sum).toFixed(2).toString()
	,
	SetDefault:async ()=>{
		Object.keys(Default_Profile).forEach((i)=>{
			Current_Profile[i] = {...Default_Profile[i]};
		});
	},
	AddCompanyPipeline:"T1",
	//GrantROFRTable:[],
	onModalManageProfileClose:async()=>{
		await Promise.all([SP_SELECT_ALL_PROFILE_Service.run(),SP_SELECT_ALL_PROFILE_Space.run()]) ;
		/*JS_TAB.Profile = {LeadData:SP_SELECT_ALL_PROFILE_Space.data.filter((ele)=> ele.TOTAL_RECORDS != 0),
										ServiceData:SP_SELECT_ALL_PROFILE_Service.data.filter((ele)=> ele.TOTAL_RECORDS != 0)}
		*/
		await removeValue(Configs.editCompanyProfileFlag);
		Configs.defaultTap = "Profile"

	},
	updateLeadProfileTable:async ()=>{
		await resetWidget(PMS_COMPANY_PROFILE_LM.widgetName);
		await SP_SELECT_ALL_PROFILE_Space.run()
		JS_TAB.Profile = {...JS_TAB.Profile,
											LeadData:SP_SELECT_ALL_PROFILE_Space.data.filter((ele)=> ele.TOTAL_RECORDS != 0)}
	},
	updateServiceProfileTable:async ()=>{
		await resetWidget(PMS_COMPANY_PROFILE_LM_2.widgetName);
		await SP_SELECT_ALL_PROFILE_Service.run()
		JS_TAB.Profile = {...JS_TAB.Profile,
											ServiceData:SP_SELECT_ALL_PROFILE_Service.data.filter((ele)=> ele.TOTAL_RECORDS != 0)}
	},
	InitModal:async ()=>{
		this.AddCompanyPipeline = "T1";
		//let timeout1 = setTimeout(()=>NEW_BUTTON_1.setDisabled(false),3000);
		//let timeout2 = setTimeout(()=>NEW_BUTTON_2.setDisabled(false),3000);
		this.ableToDeleteProfile = false;
		await Promise.all([NEW_BUTTON_1.setDisabled(true),NEW_BUTTON_2.setDisabled(true)]);
		this.SetDefault();
		await showModal(MODAL_ADD_COMPANY_PROFILE.name);
		PRICE_PER_UNIT.setDisabled(false);
		COMPANY_PROFILE_FLOOR_NO.setDisabled(false);
		await SP_SER_FOR_INVENTORY.run();
		NEW_BUTTON_1.setDisabled(false);
		NEW_BUTTON_2.setDisabled(false);
		resetWidget(Container_Additional.widgetName,true);
		resetWidget(Schedule_Trigger.widgetName,true);
		//while(NEW_BUTTON_1.isDisabled)

	},
	BTTNLinkOnClick:async (LinkTableColumn)=>{
		let reference = [{LinkTableColumn:"PRICE_PER_UNIT",ProfileProp:"PROFILE_PP_UNIT_MODIFIER", Widget: PRICE_PER_UNIT},
										 {LinkTableColumn:"FLOOR_NO",ProfileProp:"PROFILE_FLOOR_MODIFIER", Widget:COMPANY_PROFILE_FLOOR_NO}
										];
		reference = await reference.filter((Ref)=>Ref.LinkTableColumn===LinkTableColumn);
		await Promise.all( reference.map(async (Ref)=>{
			if(Ref.Widget.isDisabled === true){
				Current_Profile[Ref.ProfileProp].data = "";
				Ref.Widget.setDisabled(false);
			}else{
				if( Default_InvenForProfile[Ref.LinkTableColumn] != undefined && _.trim(Default_InvenForProfile[Ref.LinkTableColumn].data) != ""){
					Current_Profile[Ref.ProfileProp].data = Default_InvenForProfile[Ref.LinkTableColumn].data;
					//await resetWidget(Ref.Widget.widgetName);
				}else{
					await showAlert("this inventory does not have default value.","error");
					return;
				}
				Ref.Widget.setDisabled(true);
			}
			//await Ref.Widget.setDisabled(!Ref.Widget.isDisabled)
		}))
	},
	onInventorySelected:async ()=>{

		PRICE_PER_UNIT.setDisabled(false);
		PRICE_PER_UNIT.setValue("");
		COMPANY_PROFILE_FLOOR_NO.setDisabled(false);
		COMPANY_PROFILE_FLOOR_NO.setValue("");
		await Promise.all(Object.keys(Current_Profile).map((key)=>{
			let strKey = key.toString();
			if(Current_Profile[strKey].data !== undefined) {
				Current_Profile[strKey].data="";
				Current_Profile[strKey].color="";
			}
		}));
		//await resetWidget(FORMULA.widgetName);
		await resetWidget(Container_Additional.widgetName,true);
		//return Current_Profile
	},
	onDeleteProfile: async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		let Params = {
			COMPANY_PROFILE_ID:Current_Profile.COMPANY_PROFILE_ID.data
		}

		//return console.log(Params);
		await _09_P_DELETE_PROFILE_LM.run(Params)
		let Result = _09_P_DELETE_PROFILE_LM.data;
		if(Result != undefined && Result.length === 1){
			if(Result[0]["RESULT_CODE"] === "DONE"){
				//await showAlert( "Add success","success");
				//await SP_SELECT_ALL_PROFILE_Space.run();
				//await SP_SELECT_ALL_PROFILE_Service.run();
				closeModal(MODAL_ADD_COMPANY_PROFILE.name);
			}else{
				showAlert( "Delete failed. "+Result[0]["RESULT_MESSAGES"],"error");
			}
		}

	},
	onAddProfileClick: async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		let Params = {
			AGREEMENT_ID: AGREEMENT_ID.selectedOptionValue==undefined ||_.trim(AGREEMENT_ID.selectedOptionValue)===""? null : AGREEMENT_ID.selectedOptionValue,
			FORMULA: FORMULA.selectedOptionValue==undefined ||_.trim(FORMULA.selectedOptionValue)===""? null : FORMULA.selectedOptionValue,
			INVENTORY_ID: TABLE_PMS_PRODUCT_INVERTORY_LM.selectedRow.INVENTORY_ID,
			COMPANY_PROFILE_FLOOR_NO: COMPANY_PROFILE_FLOOR_NO.isDisabled?null: COMPANY_PROFILE_FLOOR_NO.text,
			PRICE_PER_UNIT: PRICE_PER_UNIT.isDisabled?null:PRICE_PER_UNIT.value,
			COMPANY_PROFILE_PERIOD_START:COMPANY_PROFILE_PERIOD_START.formattedDate?moment(COMPANY_PROFILE_PERIOD_START.formattedDate,Configs.dateFormat).format("YYYY-MM-DD"):undefined,
			COMPANY_PROFILE_PERIOD_END:COMPANY_PROFILE_PERIOD_END.formattedDate?moment(COMPANY_PROFILE_PERIOD_END.formattedDate,Configs.dateFormat).format("YYYY-MM-DD"):undefined,
			QUANTITY: QUANTITY.text
		}

		//return console.log(Params);
		await _07_P_INSERT_PROFILE_LM.run(Params)
		let Result = _07_P_INSERT_PROFILE_LM.data;
		if(Result != undefined && Result.length === 1){
			if(Result[0]["RESULT_CODE"] === "DONE"){
				await showAlert( "Add success","success");
				//await SP_SELECT_ALL_PROFILE_Space.run();
				//await SP_SELECT_ALL_PROFILE_Service.run();
				closeModal(MODAL_ADD_COMPANY_PROFILE.name);
			}else{
				showAlert( "Add failed. "+Result[0]["RESULT_MESSAGES"],"error");
			}
		}

	},
	onUpdateProfileClick:async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		let Params = {
			COMPANY_PROFILE_ID:Current_Profile.COMPANY_PROFILE_ID.data,
			AGREEMENT_ID: AGREEMENT_ID.selectedOptionValue==undefined ||_.trim(AGREEMENT_ID.selectedOptionValue)===""? null : AGREEMENT_ID.selectedOptionValue,
			FORMULA: FORMULA.selectedOptionValue==undefined ||_.trim(FORMULA.selectedOptionValue)===""? null : FORMULA.selectedOptionValue,
			INVENTORY_ID: Default_InvenForProfile.INVENTORY_ID.data,
			COMPANY_PROFILE_FLOOR_NO: COMPANY_PROFILE_FLOOR_NO.isDisabled?null: COMPANY_PROFILE_FLOOR_NO.text,
			PRICE_PER_UNIT: PRICE_PER_UNIT.isDisabled?null:PRICE_PER_UNIT.value,
			COMPANY_PROFILE_PERIOD_START:COMPANY_PROFILE_PERIOD_START.formattedDate?moment(COMPANY_PROFILE_PERIOD_START.formattedDate,Configs.dateFormat).format("YYYY-MM-DD"):undefined,
			COMPANY_PROFILE_PERIOD_END:COMPANY_PROFILE_PERIOD_END.formattedDate?moment(COMPANY_PROFILE_PERIOD_END.formattedDate,Configs.dateFormat).format("YYYY-MM-DD"):undefined,
			QUANTITY: QUANTITY.text
		}
		//return console.log(Params);
		_08_P_UPDATE_PROFILE_LM.run(Params).then(async ()=>{
			let Result = _08_P_UPDATE_PROFILE_LM.data;
			if(Result != undefined && Result.length === 1){
				if(Result[0]["RESULT_CODE"] === "DONE"){
					await showAlert( "Save success","success");
					//await SP_SELECT_ALL_PROFILE_Space.run();
					//await SP_SELECT_ALL_PROFILE_Service.run();
					closeModal(MODAL_ADD_COMPANY_PROFILE.name);
				}else{
					showAlert( "Save failed. "+Result[0]["RESULT_MESSAGES"],"error");
				}
			}
		})
	},
	/*Bttn_GrantRight:()=>{
		if(Table_GrantROFR.tableData != undefined){
			if(Table_GrantROFR.tableData.filter((data)=>(data.INVENTORY_ID === Select_InventForROFR.selectedOptionValue && data.DIRECTION === SELECT_ROFRDirection.selectedOptionValue)).length > 0){
				showAlert(`The inventory ${Select_InventForROFR.selectedOptionLabel} - ${SELECT_ROFRDirection.selectedOptionValue} already exist in the list.`,"warning");
				return;
			}
		} //เช็คว่าในตารางไม่มี invent ซ้ำกับที่เลือก
		SP_GET_ROFR_PRIORITY.run({INVENTORY_ID:Select_InventForROFR.selectedOptionValue, COMPANY_ID:COMPANY_ID.text}).then(()=>{
			let data = SP_GET_ROFR_PRIORITY.data;
			if(data != undefined && data.length != 0){
				if(data[0].RESULT_MESSAGES != undefined && data[0].RESULT_MESSAGES !== "" && data[0].RESULT_CODE !== "ERROR"){
					let priority =parseInt(data[0].RESULT_MESSAGES);
					this.GrantROFRTable.push({
						"INVENTORY_ID":Select_InventForROFR.selectedOptionValue,
						"INVENTORY_NAME":Select_InventForROFR.selectedOptionLabel,
						"DIRECTION":SELECT_ROFRDirection.selectedOptionValue,
						"RIGHT_PRIORITY":priority})
					resetWidget("SELECT_ROFRDirection");
					resetWidget("Select_InventForROFR");
				}
			}
		})
	},*/
	onBttn_EditProfile:async(selectdRow)=>{
		this.ableToDeleteProfile = true;
		BTTN_EditProfile.setDisabled(true);
		BTTN_EditProfileService.setDisabled(true);
		

		await Promise.all([SP_SELECT_FOR_PROFILE.run({COMPANY_PROFILE_ID:selectdRow.COMPANY_PROFILE_ID}),this.getInvenForProfile(selectdRow.INVENTORY_ID),this.SetDefault()])
		if(SP_SELECT_FOR_PROFILE.data != undefined && SP_SELECT_FOR_PROFILE.data.length != 0){
			const inventory = {...SP_SELECT_FOR_PROFILE.data[0]}
			
			if(inventory["PROFILE_FLOOR_MODIFIER"] === undefined || inventory["PROFILE_FLOOR_MODIFIER"] === null){
				inventory["PROFILE_FLOOR_MODIFIER"] = inventory["FLOOR_NO"];
				if(!COMPANY_PROFILE_FLOOR_NO.isDisabled)
					COMPANY_PROFILE_FLOOR_NO.setDisabled(true);
			}else{
				if(COMPANY_PROFILE_FLOOR_NO.isDisabled)
					COMPANY_PROFILE_FLOOR_NO.setDisabled(false);
			}
			if(inventory["PROFILE_PP_UNIT_MODIFIER"] === undefined || inventory["PROFILE_PP_UNIT_MODIFIER"] === null){
				inventory["PROFILE_PP_UNIT_MODIFIER"] = inventory["PRICE_PER_UNIT"];
				if(!PRICE_PER_UNIT.isDisabled)
					PRICE_PER_UNIT.setDisabled(true);
			}else{
				if(PRICE_PER_UNIT.isDisabled)
					PRICE_PER_UNIT.setDisabled(false);
			}
			if(inventory["QUANTITY"] === undefined || inventory["QUANTITY"] === null){
				inventory["QUANTITY"] = inventory["INVENTORY_QUANTITY"];
			}
			Object.keys(Current_Profile).forEach(i=>{
				if(Current_Profile[i].data!== undefined && (inventory[i] !== undefined && inventory[i] !== null)){ 
					Current_Profile[i].data = inventory[i];
				}
			});
			/*let InitializationEntityList = [{ENTITY:Current_Profile,DATA: inventory}];
			await Promise.all([
				GlobalFunctions.initDefaultV2(InitializationEntityList),
			])*/
		}

		JS_Profile.AddCompanyPipeline = "T3";	

		await storeValue(Configs.editCompanyProfileFlag,SP_SELECT_FOR_PROFILE.data[0]);
		await showModal(MODAL_ADD_COMPANY_PROFILE.name);
		resetWidget(Container_Additional.widgetName,true);
		resetWidget(Schedule_Trigger.widgetName,true);
		BTTN_EditProfile.setDisabled(false);
		BTTN_EditProfileService.setDisabled(false);
		//Tab_AddCompanyPipeline.setVisibility(true);
	},
	getInvenForProfile:async (INVENTORY_ID)=>{
		await SP_SELECT_FOR_INVENTORY.run({INVENTORY_ID:INVENTORY_ID})

		if(SP_SELECT_FOR_INVENTORY.data != undefined && SP_SELECT_FOR_INVENTORY.data.length != 0){
			let inventory = SP_SELECT_FOR_INVENTORY.data[0]
			await Promise.all( Object.keys(Default_InvenForProfile).map((fieldKey)=>{
				if( inventory[fieldKey.toString()] !== undefined && Default_InvenForProfile[fieldKey.toString()].data !== undefined){
					Default_InvenForProfile[fieldKey.toString()].data = inventory[fieldKey.toString()]
				}
			}))
		}
	},
	onBttn_DeleteProfile_T4:async()=>{
		JS_Profile.AddCompanyPipeline = "T5";	

	},
	onBttn_selectProfile_T1:async()=>{
		//await SP_SER_FOR_INVENTORY_DDown.run({FLOOR_NO: TABLE_PMS_PRODUCT_INVERTORY_LM.selectedRow.FLOOR_NO,PRODUCT_TYPE_TH: TABLE_PMS_PRODUCT_INVERTORY_LM.selectedRow.PRODUCT_TYPE_TH});
		//Configs.ROFRInventoryItem = [];
		/*SP_SER_FOR_INVENTORY_DDown.data.map((ele)=>{if(TABLE_PMS_PRODUCT_INVERTORY_LM.selectedRow.INVENTORY_ID != ele.INVENTORY_ID) Configs.ROFRInventoryItem.push(ele)}); 
		resetWidget("Container_Additional",true).then(()=>{
			this.onInventorySelected();
		});*/
		await Promise.all([this.getInvenForProfile(),this.onInventorySelected()]);
		JS_Profile.AddCompanyPipeline = "T3";	

	},
	onBttn_NextPipeline_T3_Click:async()=>{
		const page = _.pickBy(Profile_Widgets, function(value, key) {if(value.page === "T3") return value;})
		let alertWidget = await GlobalFunctions.manualValidateV2(Current_Profile,page);
		const unique_Array = Array.from(new Set(alertWidget.map(i=>(i.label ||  _.toLower( i.widgetName).replaceAll("_"," ")))));
		if(alertWidget.length > 0){
			let text = `Information is required or invalid. :: ${unique_Array.join(',')}`;
			if(Configs.IS_THIRD_PARTY){
				text = text.replaceAll('company','third party');
			}
			showAlert(text)
		}
		if(alertWidget.length == 0)
			JS_Profile.AddCompanyPipeline = "T6";
	},
	onBttn_NextPipeline_T6_Click:async()=>{
		const page = _.pickBy(Profile_Widgets, function(value, key) {if(value.page === "T6") return value;})
		let alertWidget = await GlobalFunctions.manualValidateV2(Current_Profile,page);
		const unique_Array = Array.from(new Set(alertWidget.map(i=>(i.label ||  _.toLower( i.widgetName).replaceAll("_"," ")))));
		if(alertWidget.length > 0){
			let text = `Information is required or invalid. :: ${unique_Array.join(',')}`;
			if(Configs.IS_THIRD_PARTY){
				text = text.replaceAll('company','third party');
			}
			showAlert(text)
		}
		if(alertWidget.length == 0)
			JS_Profile.AddCompanyPipeline = "T4";
	},
	onBttn_NextPipeline_T3_Disable:()=>{
		const condition1 = TABLE_PMS_PRODUCT_INVERTORY_LM.selectedRow == undefined || TABLE_PMS_PRODUCT_INVERTORY_LM.selectedRow.INVENTORY_ID.trim() === "";
		return condition1
	},
	Container_Confirm_Meter_Visible: Default_InvenForProfile.METER_ID.data != ""
}