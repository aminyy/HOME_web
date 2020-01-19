var global_cao_applicaton_data={}


function cao_history_respSubmit(jsonObj,status){
	var status_code=jsonObj.status_code;
	var tbody=$("#queueInfoTB");
	//tbody.html("");
	$("#mDialogBody").html('')
	if(status_code==0){
		jobUjid=jsonObj.gidujid.ujid;
		jobGid=jsonObj.gidujid.gid;
		$("#myModalLabel").html("<h5 class='text-success'>作业提交成功</h5>");
		var tips=$("<p class='text-info'>作业号:"+jobUjid+"</p>");
		var jumps=$("<p  class='text-info'>在<span id='remainJobTimeSpan'>9</span>秒后跳转到<a href='/jobfarm/history'>“历史作业”</a></p>")
		$("#mDialogBody").append(tips);
		$("#mDialogBody").append(jumps);
		setInterval(jump2History,1000)
	}else{
		$("#myModalLabel").html("<h5 class='text-error'>作业提交失败</h5>")
		var tips=$("<p class='text-warning'>"+jsonObj.status_msg+"</p>");
		var jumps=$("<p  class='text-info'>在<span id='remainAppTimeSpan'>9</span>秒后跳转到<a href='/jobfarm/application'>“应用中心”</a></p>")
		$("#mDialogBody").append(tips);
		$("#mDialogBody").append(jumps);
		setInterval(jump2AppList,1000)
	}
	startModal();
}

function jump2History(){
	if($("#remainJobTimeSpan").length > 0){
		var timeStr=$("#remainJobTimeSpan").text();
		var timeInt=parseInt(timeStr)
		if(timeInt<=0){
			window.location.href = "/jobfarm/history"
		}else{
			timeInt=timeInt-1;
			$("#remainJobTimeSpan").html(timeInt)
			setInterval(jump2History,1000)
		}
	}
}

function jump2AppList(){
	if($("#remainAppTimeSpan").length > 0){
		var timeStr=$("#remainAppTimeSpan").text();
		var timeInt=parseInt(timeStr)
		if(timeInt<=0){
			window.location.href = "/jobfarm/application"
		}else{
			timeInt=timeInt-1;
			$("#remainAppTimeSpan").html(timeInt)
			setInterval(jump2History,1000)
		}
	}
}

function bind_form_submit(){
	var options = {
	  	         target:'#jobSubmitForm',    // target element(s) to be updated with server response
	  	         dataType:'json',
	  	         beforeSubmit:cao_history_checkSubmit,   // pre-submit callback 表单提交前被调用的回调函数
	  	         success:cao_history_respSubmit   // post-submit callback   表单提交成功后被调用的回调函数
	   	}
	  	$('#jobSubmitForm').submit(function() {
	          $(this).ajaxSubmit(options);       
	          return false;
	     }); 
}


function initFileNum(){
	//$("#upFilesNumID").val(''+global_cao_applicaton_data_infiles_num);
	$("#downFilesNumID").val(''+global_cao_applicaton_data_outfiles_num);
	$("#queuesDIV").hide();
}

function addUpFiles(){
	var newDiv=$(
	"<div class=\"form-group  has-feedback\" id=\"inputFile"
			+global_cao_applicaton_data_infiles_num+"\">"+
	"<label for=\"inputFile"
			+global_cao_applicaton_data_infiles_num+"\""+
	"class=\"col-sm-4 col-md-3 col-lg-2 control-label\">输入文件</label>"+
	"<div class=\"col-sm-4 col-md-6 col-lg-8\">"+
	"<input type=\"file\" class=\"input-medium form-control\""+
	"id=\"inputFile"
	+global_cao_applicaton_data_infiles_num+"ID\" name=\"inputFile"
	+global_cao_applicaton_data_infiles_num+"\" value=\"stderr\">" +
	"<span class=\"glyphicon glyphicon-remove form-control-feedback\" onClick=\"javascript:deleteFileInput("+
	+global_cao_applicaton_data_infiles_num+")\"></span>"+
	"</div>"+
	"</div>"
	)
	global_cao_applicaton_data_infiles_num++;
	$("#upFilesNumID").val(''+global_cao_applicaton_data_infiles_num);
	$("#moreInFileDiv").append(newDiv);
}

function deleteFileInput(inFileNum){
	var idstr="#inputFile"+inFileNum
	if($(idstr).length>0){
		$(idstr).remove();
	}
}

function addOutputFiles(){
	var newDiv=$(
	"<div class=\"form-group has-feedback\" id=\"outputFile"
			+global_cao_applicaton_data_outfiles_num+"\">"+
			"<label for=\"inputOutFile"
			+global_cao_applicaton_data_outfiles_num+"\""+
	"	class=\"col-sm-4 col-md-3 col-lg-2 control-label\">输出文件</label>"+
	"<div class=\"col-sm-4 col-md-6 col-lg-8\">"+
	"<input type=\"text\" class=\"input-medium form-control\""+
	"id=\"inputOutFile"
			+global_cao_applicaton_data_outfiles_num+"ID\" name=\"inputOutFile"
			+global_cao_applicaton_data_outfiles_num+"\" value=\"stderr\">"+
			"<span class=\"glyphicon glyphicon-remove form-control-feedback\" onClick=\"javascript:deleteFileOutput("+
			+global_cao_applicaton_data_outfiles_num+")\"></span>"+
	"</div>"+
	"</div>"
);
	global_cao_applicaton_data_outfiles_num++;
	$("#downFilesNumID").val(''+global_cao_applicaton_data_outfiles_num);
	$("#moreOutFileDiv").append(newDiv);
}

function deleteFileOutput(outFileNum){
	var idstr="#outputFile"+outFileNum
	if($(idstr).length>0){
		$(idstr).remove();
	}
}

function findQueues(){
	var cpuNumStr=$("#inputCPUCountID").val();
	var dayStr=$("#inputWallTimeID").val();
	var hourStr=$("#inputHourTimeID").val();
	var minStr=$("#inputMinTimeID").val();
	var walltime=(parseInt(dayStr)*24+parseInt(hourStr))*60+parseInt(minStr);
	var cpuNum=parseInt(cpuNumStr)
	var appname=$("#appexecID").val();
	var mytime=new Date()
	var mystr='time='+mytime.getTime()
	+'&appname=' +appname+'&walltime='+ walltime +'&cpucount='+cpuNum
	var fileURL="/portal/jobfarm/app/queue?ajax=true&"+mystr
	var tbody=$("#queueInfoTB");
	tbody.html("");
	$.get(fileURL, application_retQueues,"json");	
}

function getStatusColor(status){
	var colorName="success";	
	if(status==1){
		colorName="warning";
	}
	return 	colorName;
}

function application_retQueues(jsonObj,status){
	var status_code=jsonObj.status_code;
	var tbody=$("#queueInfoTB");
	//tbody.html("");
	if(status_code==0){
		var list=jsonObj.apps_list;
		if(list.length>0){
			var trEle=$("<tr class=\"success\">"+
					"<th><input type=\"radio\" value=\"any:any\" checked=\"true\" name=\"resradio\"></th>"
					+"<th>cloud</th>"
					+"<th>cloud</th>"
					+"<th>0</th>"
					+"<th>0</th>"
					+"<th>0</th>"
					+"<th>0</th>"
					+"</tr>");
			tbody.append(trEle);
			lenNum=list.length;			
			for (var i=0;i<lenNum;i++){
				queue=list[i]
				var disableFlag=""
				if(queue.canused==1){
					disableFlag=" disabled='true' ";
				}
				var trEle=$("<tr class="+getStatusColor(queue.canused)+">"+
						"<th><input type=\"radio\" value=\""+queue.hpcname+":"+queue.queuename+"\" name=\"resradio\""+disableFlag+"></th>"
						+"<th>"+queue.hpcname+"</th>"
						+"<th>"+queue.queuename+"</th>"
						+"<th>"+queue.walltimelimit+"</th>"
						+"<th>"+queue.njobs+"</th>"
						+"<th>"+queue.pendjobs+"</th>"
						+"<th>"+queue.runjobs+"</th>"
						+"</tr>");
				tbody.append(trEle);
		}
		}else{
			cao_history_data_curr_jobid=0;
		}
	}else{
		cao_history_data_curr_jobid=0;
	}
	$("#queuesDIV").show();
	
}
function startModal(){
modalHeight=$("#mDialog").outerHeight(true);
modalWidth=($("#mDialog").outerWidth(true))+'px'
heightAll=$(window).height(); 
widthAll=$(window).width();//浏览器当前窗口文档对象宽度
mWidth=parseInt(widthAll/2)+"px";
leftInt=parseInt((parseInt(widthAll)-modalWidth)/2)+"px";
heightInt=parseInt((heightAll-modalHeight)/2)+"px";

$('#myModal').modal().css({
    width: 'auto',
    left:leftInt,
    top:heightInt,	
}); 

}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function cao_history_checkSubmit(){
	//prepareArgument();
	var upfiles = document.getElementById('upFilesNumID');
	upfiles.value=String(global_cao_application_data_infiles_num);
	if($("#inputJobNameID").val()&&$("#argumentID").val()){
		$("#submitJobBtn").attr("disabled", true);
		return true;
	}
	else if(!$("#inputJobNameID").val()){
		alert("请输入作业名称");
		$("#inputJobNameID").focus();
		return false;
	}
	else{
		alert("请从用户文件中选择输入数据");
		return false;
	}
	
}