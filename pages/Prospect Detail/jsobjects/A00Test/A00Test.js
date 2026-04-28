export default {
	returnn:()=>{
		console.log("time");
		return ADDRESSING.DISTRICT_STORE
	},
	checkMissingLabel:()=>{
		return Object.keys(Widgets_Ref.PMS_PROSPECTS_LM).filter((key)=>!Widgets_Ref.PMS_PROSPECTS_LM[key].widget.label);
	}
}