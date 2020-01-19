global_cao_application_data_infiles_num=0;
global_cao_applicaton_data_outfiles_num=1;


/*function prepareArgument(){
	var filePath=$('#inputFile0ID').val();
	var arr=filePath.split('\\');//注split可以用字符或字符串分割
	var fname=arr[arr.length-1];//这就是要取得的文件名称
	$("#argumentID").val(fname);
}*/
function prepareArgument(){	
	var files=$(".filename");
	var arg=$("#argumentID").val();
	for(var i=0;i<files.length;i++){
		var index=files[i].value.split(".").length-1
		var extendname=files[i].value.split(".")[index]
		if(extendname==="hom"){
			var arg=files[i].value;
			$("#argumentID").val(arg);
			return(1)
		}
	}
	return(0)
}


