export default {
	returnn:()=>{
		console.log("time");
		return Widgets_Value.PMS_PROSPECTS_LM?.["EDIT_ABLE"]?.data
	},
	checkMissingLabel:()=>{
		return Object.keys(Widgets_Ref.PMS_PROSPECTS_LM).filter((key)=>!Widgets_Ref.PMS_PROSPECTS_LM[key].widget.label);
	}
}