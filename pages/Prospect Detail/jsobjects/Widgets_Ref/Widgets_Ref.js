export default {
	PMS_PROSPECTS_LM:{
		PROSPECTS_ID:{widget:{...PROSPECTS_ID},widgetData:PROSPECTS_ID.text},
		COMPANY_NAME_TH:{widget:{...COMPANY_NAME_TH},widgetData:COMPANY_NAME_TH.text},
		SHOP_NAME:{widget:{...SHOP_NAME},widgetData:SHOP_NAME.text},
		NATIONALITY:{widget:{...NATIONALITY},widgetData:NATIONALITY.selectedOptionValue},
		BUSINESS_TYPE:{widget:{...BUSINESS_TYPE},widgetData:BUSINESS_TYPE.selectedOptionValue},
		TITLE_NAME:{widget:{...TITLE_NAME},widgetData:TITLE_NAME.selectedOptionValue},
		NAME_OF_AUTHORIZED:{widget:{...NAME_OF_AUTHORIZED},widgetData:NAME_OF_AUTHORIZED.text},
		NUMBER_OF_EMPLOYEES:{widget:{...NUMBER_OF_EMPLOYEES},widgetData:NUMBER_OF_EMPLOYEES.text},
		WEBSITE:{widget:{...WEBSITE},widgetData:WEBSITE.text},
		TELEPHONE:{widget:{...TELEPHONE},widgetData:TELEPHONE.text},
		EMAIL:{widget:{...EMAIL},widgetData:EMAIL.text},
		BUILDING_NAME:{widget:{...BUILDING_NAME},widgetData:BUILDING_NAME.text},
		FLOOR:{widget:{...FLOOR},widgetData:FLOOR.text},
		HOUSE_BUILDING_NO:{widget:{...HOUSE_BUILDING_NO},widgetData:HOUSE_BUILDING_NO.text},
		SOI_TH:{widget:{...SOI_TH},widgetData:SOI_TH.text},
		MOO:{widget:{...MOO},widgetData:MOO.text},
		ROAD_TH:{widget:{...ROAD_TH},widgetData:ROAD_TH.text},

		SUB_DISTRICT_EN:{widget:{...SUB_DISTRICT_TH},widgetData:ADDRESSING.subdistrict_ConvertToEN(SUB_DISTRICT_TH.selectedOptionValue)},
		SUB_DISTRICT_TH:{widget:{...SUB_DISTRICT_TH},widgetData:ADDRESSING.subdistrict_ConvertToTH(SUB_DISTRICT_TH.selectedOptionValue)},
		DISTRICT_EN:{widget:{...DISTRICT_TH},widgetData:ADDRESSING.district_ConvertToEN(DISTRICT_TH.selectedOptionValue)},
		DISTRICT_TH:{widget:{...DISTRICT_TH},widgetData:ADDRESSING.district_ConvertToTH(DISTRICT_TH.selectedOptionValue)},
		PROVINCE_EN:{widget:{...PROVINCE_TH},widgetData:ADDRESSING.province_ConvertToEN(PROVINCE_TH.selectedOptionValue)},
		PROVINCE_TH:{widget:{...PROVINCE_TH},widgetData:ADDRESSING.province_ConvertToTH(PROVINCE_TH.selectedOptionValue)},

		POSTAL_CODE:{widget:{...POSTAL_CODE},widgetData:POSTAL_CODE.text},

		CURRENT_SPACE_USAGE:{widget:{...CURRENT_SPACE_USAGE},widgetData:CURRENT_SPACE_USAGE.text},
		REASON_FOR_MOVING:{widget:{...REASON_FOR_MOVING},widgetData:REASON_FOR_MOVING.text},
		NUMBER_OF_MONTH_REMAIN:{widget:{...NUMBER_OF_MONTH_REMAIN},widgetData:NUMBER_OF_MONTH_REMAIN.selectedOptionValue},
		REQUIREMENT_TYPE:{widget:{...REQUIREMENT_TYPE},widgetData:REQUIREMENT_TYPE.selectedOptionValue},
		PERIOD_OF_LEASE:{widget:{...PERIOD_OF_LEASE},widgetData:PERIOD_OF_LEASE.selectedOptionValue},
		FLOOR_REQUIRED:{widget:{...FLOOR_REQUIRED},widgetData:FLOOR_REQUIRED.selectedOptionValue},
		AREA_REQUIRED:{widget:{...AREA_REQUIRED},widgetData:AREA_REQUIRED.selectedOptionValue},

		SPECIFIC_SQM:{widget:{...SPECIFIC_SQM},widgetData:SPECIFIC_SQM.text},
		PARKING_SPACES:{widget:{...PARKING_SPACES},widgetData:PARKING_SPACES.text},
		MOTORCYCLE_SPACES:{widget:{...MOTORCYCLE_SPACES},widgetData:MOTORCYCLE_SPACES.text},
		MAIN_ELECTRICAL_PHASE:{widget:{...MAIN_ELECTRICAL_PHASE},widgetData:MAIN_ELECTRICAL_PHASE.text},
		MAIN_ELECTRICAL_AMP:{widget:{...MAIN_ELECTRICAL_AMP},widgetData:MAIN_ELECTRICAL_AMP.text},

		BTU:{widget:{...BTU},widgetData:BTU.text},
		INTERNET_LINES:{widget:{...INTERNET_LINES},widgetData:INTERNET_LINES.text},
		TELEPHONE_LINES:{widget:{...TELEPHONE_LINES},widgetData:TELEPHONE_LINES.text},
		FIBER_OPTIC_LINES:{widget:{...FIBER_OPTIC_LINES},widgetData:FIBER_OPTIC_LINES.text},
		OTHER_REQUIREMENTS:{widget:{...OTHER_REQUIREMENTS},widgetData:OTHER_REQUIREMENTS.text},

		PROSPECTS_STATUS:{widget:{},widgetData:""},

		REASON:{widget:{...REASON},widgetData:REASON.text},
		REASON_REJECT:{widget:{...REASON_REJECT },widgetData:REASON_REJECT.selectedOptionLabel},
		REASON_OTHER_DETAIL:{widget:{...REASON_OTHER_DETAIL},widgetData:REASON_OTHER_DETAIL.text},
		EXPECTING_DATE_TO_MOVE_IN:{
			widget:{...EXPECTING_DATE_TO_MOVE_IN},
			widgetData:EXPECTING_DATE_TO_MOVE_IN.formattedDate?moment(EXPECTING_DATE_TO_MOVE_IN.formattedDate,Configs.dateFormat)
			.format(Configs.sqlDataFormat):""
		},
		WATER_SUPPLY:{widget:{...CHECKBOX_OTHER_UTILITY_NEED},widgetData:CHECKBOX_OTHER_UTILITY_NEED.selectedValues.includes("WATER_SUPPLY")},
		COOKING_GAS:{widget:{...CHECKBOX_OTHER_UTILITY_NEED},widgetData:CHECKBOX_OTHER_UTILITY_NEED.selectedValues.includes("COOKING_GAS")},
		AIR_CONDITIONS:{widget:{...CHECKBOX_OTHER_UTILITY_NEED},widgetData:CHECKBOX_OTHER_UTILITY_NEED.selectedValues.includes("AIR_CONDITIONS")},
		CREATE_DATE:{widget:{...CREATE_DATE},widgetData:CREATE_DATE.formattedDate?moment(CREATE_DATE.formattedDate,Configs.dateFormat)
			.format(Configs.sqlDataFormat):""},
		
	}
}