# coding=utf-8
import os
import json
from functools import wraps
from xml.dom import minidom
import geojson
from flask import render_template, request, session, current_app, send_file, send_from_directory, make_response, \
    redirect, jsonify
from flask_login import current_user, login_required
from controllers.portal import portal_page
from sqlalchemy import asc, and_
from models import Application, OAuthData
from services.sceclient import ApiClient
from io import StringIO
from flask_login import current_user
import mimetypes
import os
import urllib
import datetime
import time
from controllers.auth.passport import passport_required


def jobfarm_oauth_required(f):
    __job_scopes = 'jobNormal'

    @wraps(f)
    def decorated_function(*args, **kwargs):
        url_path = request.path
        if not url_path.startswith('/portal/jobfarm'):
            return
        if url_path.startswith('/portal/jobfarm/m/'):
            return

        print('需要登录:%s' % (url_path))

        # 检查访问链接
        oauth_url = "/portal/oauth/request"
        auth_url = '/portal/jobfarm/auth/'
        if url_path.startswith(oauth_url) == True or \
                url_path.startswith(auth_url) == True:
            return

        # 获取查看是否通过验证
        authFlag = session.get('auth_flag', False)
        if authFlag == True:
            token_scopes = session.get('token_scope', None)
            if token_scopes != None and token_scopes.find(__job_scopes) >= 0:
                return
            else:
                return redirect('/portal/jobfarm/auth/error')  # 请求授权

        # 查看是已经有授权
        session['username'] = session.get("username", "访客")
        username = session['username']
        client_id = 'gaohan'
        session['req_scope'] = 'jobNormal'
        session['client_id'] = client_id
        session['client_key'] = '29re4wo9r1ewqXXW'
        session['block_url'] = request.full_path
        # 检查数据库是否已经存在授权
        authInfoList = OAuthData.query.filter(and_(OAuthData.user_name==username, OAuthData.client_id==client_id)).all()
        if authInfoList is None or len(authInfoList) < 1:
            return redirect('/portal/jobfarm/auth/request')  # 请求授权
        else:
            authInfo = authInfoList[0]
            nowtime = datetime.datetime.utcnow()
            # nowtime = int(time.time())
            # tokenTime = int(authInfo.token_end_time.timestamp())
            # print(tokenTime - nowtime)
            if (authInfo.token_end_time - nowtime).seconds < 60 * 60 * 24 * 3:  # 有效期小于3天
                # 调用刷新函数
                refreshTime = authInfo.refresh_end_time
                if (refreshTime > nowtime):  # 还在更新有效期
                    authInfo_dict = authInfo.__dict__
                    request.session['authInfo'] = authInfo_dict
                    return redirect('/portal/jobfarm/auth/refresh')  # 更新有效
                else:  # 已经超出了有效期
                    return redirect('/portal/jobfarm/auth/request')  # 请求授权
            else:  # token的有效期还比较长，直接返回到被拦的URL
                request.session['openid'] = authInfo.open_id
                request.session['auth_token'] = authInfo.token_code
                request.session['auth_flag'] = True
                request.session['token_scope'] = authInfo.token_scopes
                return

        return f(*args, **kwargs)
    return decorated_function

@portal_page.route('/jobfarm/auth/request', methods=['GET', 'POST'])
def auth_request():
    if request.method=='GET':
        auth_error_page='/portal/jobfarm/auth/error.html'
        username = session.get('username','anonymous')
        timeint=int(time.time())
        context = {
                   'username': username,
                   'authURL':'auth/request?time='+str(timeint),
                   'timeint':timeint,
                   'authMsg':'您需要先授权然后访问超算计算资源',
                   'btnInfo':'开始授权',
                   }
        return render_template(auth_error_page, context=context)

    if request.method=='POST':
        session['oauth_try_num']=0
        timestr=str(int(time.time()))
        return redirect('/portal/jobfarm/oauth/request?time='+timestr)

    return make_response('错误的参数')


@portal_page.route('/jobfarm/auth_request')
def auth_refresh():
    if request.method=='GET':
        auth_error_page='jobfarm/auth/error.html'
        username=request.session.get('username','anonymous')
        timeint=int(time.time())
        context = {
                   'username': username,
                   'authURL':'auth/refresh?time='+str(timeint),
                   'timeint':timeint,
                   'authMsg':'您的授权已到期！',
                   'btnInfo':'延期授权',
                   }
        return render_template(auth_error_page, context)
    if request.method=='POST':
        request.session['oauth_try_num']=0
        timestr=str(int(time.time()))
        return redirect('/oauth/refresh?time='+timestr)
    return make_response('错误的参数')


@portal_page.route('/jobfarm')
def jobfarm():
    return render_template('portal/jobfarm/index.html')


@portal_page.route('/jobfarm/mymodels')
# @jobfarm_oauth_required
def jobfarm_mymodels():
    print('jobfarm_mymodels start.')
    if current_user.is_authenticated:
        username = current_user.username
    else:
        return render_template('portal/jobfarm/needlogin.html')

    # username = '164022321@qq.com'
    print 'cwd:', os.getcwd()
    info = os.path.join(os.getcwd(), 'static/jobfarm/user_models/'  )
    print 'info:', info
    listfile = os.listdir(info)
    fileinfo = {}
    moduleinfo = {}
    for line in listfile:  # 把目录下的文件都赋值给line这个参数
        print 'line-username:', line, '-', username
        if line == username:
            location = info + line + '/models'
            fileinfo = []
            if os.path.isdir(location):
                for filename in os.listdir(location):
                    fileinfo.append(filename)
                context = {"models": fileinfo}
                moduleinfo = modulesmenu()
                context["moduleinfo"] = moduleinfo
                break

    print '##fileinfo:', fileinfo
    return render_template("portal/jobfarm/mymodels.html", models=fileinfo, moduleinfo=moduleinfo)


# @jobfarm_oauth_required
@portal_page.route('/jobfarm/history')
def jobfarm_history():
    if current_user.is_authenticated:
        username = current_user.username
    else:
        return render_template('portal/jobfarm/needlogin.html')

    return render_template('portal/jobfarm/history.html')


# @jobfarm_oauth_required
@portal_page.route('/jobfarm/apps')
def jobfarm_apps():
    latest_applicaton_list = Application.query.order_by(asc(Application.id)).limit(7).all()
    print 'latest_applicaton_list', latest_applicaton_list
    return render_template('portal/jobfarm/apps.html', latest_applicaton_list=latest_applicaton_list)

# @jobfarm_oauth_required
@portal_page.route('/jobfarm/app')
def jobfarm_app():
    appname = request.args.get('appname')
    if not current_user.is_authenticated:
        return render_template('portal/jobfarm/needlogin.html')

    return render_template('portal/jobfarm/app/app_' + appname + ".html")


# @jobfarm_oauth_required
@portal_page.route('/jobfarm/app/submit', methods=['GET', 'POST'])
def appSubmit():
    retDict = {}
    print 'appSubmit'
    if request.method == 'GET':
        app_name = request.args.get('name', 'none')
        app_version = request.args.get('version', 'none')
        app_exec = request.args.get('exec', 'none')
        print 'name-version-exec:', app_name, app_version, app_exec
        if app_name == 'none' or app_version == 'none' or app_exec == 'none':
            return jobfarm_apps()  # 返回提交列表
        else:
            html_path = "%s/%s/%s_%s.html" % ("portal/jobfarm/submit", app_name, app_name, app_version)
            return render_template(html_path, app_name=app_name, app_version=app_version, app_exec=app_exec)
    if request.method == 'POST':
        params = request.form.to_dict()
        # 处理输入文件
        upfilenums = int(params["upFilesNum"])
        upFiles = {}
        if upfilenums > 0:
            for i in range(1, upfilenums + 1):
                upfilename = "upfileNum" + str(i) + "_name"
                upfilepath = "upfileNum" + str(i) + "_path"
                if os.path.exists(params[upfilepath]):  # 判断目标是否存在
                    upFiles[params[upfilename]] = params[upfilepath]
        input_files_list = None
        if len(upFiles) > 0:
            input_files_list = []
            for fname in upFiles:
                input_files_list.append(fname)
        # 处理输出文件
        downFilesNum = int(params['downFilesNum'])
        output_files_list = None
        if downFilesNum > 0:
            output_files_list = []
            for num in range(0, downFilesNum):
                outPutKey = 'inputOutFile' + str(num)
                if outPutKey in params:
                    output_files_list.append(params[outPutKey])
        params['input_files_list'] = input_files_list
        params['output_files_list'] = output_files_list
        if 'resradio' in params:
            hostQueue = params['resradio']
        else:
            hostQueue = "any:any"
        hqArr = hostQueue.split(':')
        params['hpcName'] = hqArr[0]
        params['queueName'] = hqArr[1]
        params['walltimeMinute'] = str((int(params['inputWallTime']) * 24 \
                                        + int(params['inputHourTime'])) * 60 + int(params['inputMinTime']))
        jsdlTEMP = "%s/%s/%s_%s_jsdl.xml" % (
        "portal/jobfarm/submit", params['appName'], params['appName'], params['appVersion'])
        print 'jsdlTemplate:', jsdlTEMP
        jsdlXML = render_template(jsdlTEMP, params=params)
        httpclient = sceclientInit()
        root = StringIO(jsdlXML)
        oneline = StringIO()
        for line in root.readlines():
            oneline.write(line.strip())
        root.close()
        xmlLine = oneline.getvalue()
        oneline.close()
        retstr = httpclient.submit(xmlLine)
        retDict = json.loads(retstr, encoding='utf8')
        if retDict['status_code'] == 0:
            gidstr = retDict['gidujid']['gid']
            #                 ujidInt=retDict['gidujid']['ujid']
            upFileFlag = True
            if len(upFiles) > 0:
                retstr = httpclient.putfiles(gidstr, upFiles)
                retFileDict = json.loads(retstr, encoding='utf8')
                if retFileDict['status_code'] != 0:
                    upFileFlag = False
            if upFileFlag == True:
                retstr = httpclient.run(gidstr);
                retRunDict = json.loads(retstr, encoding='utf8')
                if retRunDict['status_code'] == 0:
                    return json.dumps(retDict, ensure_ascii=False)
        retDict["status_code"] = "3003"
        retDict["status_msg"] = "can't sumbimt job."
        return json.dumps(retDict, ensure_ascii=False)


@portal_page.route('/jobfarm/module_intro', methods=['GET', 'POST'])
def moduleIntro():
    print '#mi00'

    param = request.form
    print '#mi01', request.args.get("filename", "")
    filename = request.args.get("filename", "")
    filepath = current_app.root_path + "/static/jobfarm/HOMEfiles" + "/" + filename + ".xml"
    metainfo = {}
    var = []
    attrs = {}
    print '#mi01'
    if os.path.exists(filepath):
        doc = minidom.parse(filepath)
        metainfos = doc.documentElement
        metainfo["name"] = metainfos.getAttribute("name")
        metainfo["author"] = metainfos.getAttribute("author")
        metainfo["keyword"] = metainfos.getAttribute("keyword")
        metainfo["description"] = metainfos.getAttribute("description")
        attributes = ["spaRefSys", "spaceScale", "timeScale"]
        for i in range(0, 3):
            attrnodes = doc.getElementsByTagName(attributes[i])
            for attrnode in attrnodes:
                if attrnode.nodeType == 1:
                    attrs[attributes[i]] = attrnode.firstChild.nodeValue
        var_nodes = doc.getElementsByTagName("var")
        for var_node in var_nodes:
            if var_node.nodeType == 1:
                tempvar = {}
                for attribute in var_node.attributes._attrs:
                    tempvar[attribute] = var_node.getAttribute(attribute)
                var.append(tempvar)
        data = {"fname": filename, "vars": var, "attrs": attrs, "metainfos": metainfo}
        data_json = json.dumps(data, ensure_ascii=False)
    else:
        data = {"fname": filename, "fcontent": "此文件不存在"}
        data_json = json.dumps(data, ensure_ascii=False)

    return data_json


@portal_page.route('/jobfarm/modelopera', methods=['GET', 'POST'])
def jobfarm_modelopera():
    paras = request.form
    # username = request.session["username_1"]
    # zmc change.
    username = current_user.username
    print('username:', username)
    base_dir = os.getcwd()
    if paras.get("opera") == "create":
        modelname = paras.get("modelname")
        doc = minidom.Document()
        root = doc.createElement("model")
        root.setAttribute("name", modelname)
        root.setAttribute("class", "net.casnw.home.model.Model")
        doc.appendChild(root)
        newmodelpath = base_dir + "/static/jobfarm/" + username + "/" + "/models/" + modelname.lower() + ".hom"
        f = open(newmodelpath, "w")
        doc.writexml(f)
        f.close()
        return "创建成功！"
    jsonstr = paras.get("modeltree")

    if jsonstr.strip() != "null":
        jsondata = json.loads(jsonstr)
        modelname = jsondata["attributes"]["name"]
        dirpath = base_dir + "/static/jobfarm/user_models/" + username + "/" + "/models" + "/" + modelname.lower() + "_temp.hom"
        dirpath_old = base_dir + "/static/jobfarm/user_models/" + username + "/" + "/models" + "/" + modelname.lower() + ".hom"
    if paras.get("opera") == "modify":
        selectednode = paras.get("SelectedNode")
        var = []
        newpara = {}
        for i in paras:
            if i.startswith("atr_"):
                newpara[i] = paras[i]
        newpara = sorted(newpara.items(), key=lambda p: p[0], reverse=False)
        atrnum = 0
        if paras.get("nodetype") == "context":
            for i in newpara:
                substr = i[0].split("_")
                if not atrnum % 4:
                    temp = {}
                    var.append(temp)
                var[int(atrnum / 4)][substr[2]] = i[1]
                atrnum += 1
        else:
            for i in newpara:
                substr = i[0].split("_")
                if not atrnum % 3:
                    temp = {}
                    temp["name"] = substr[1]
                    var.append(temp)
                var[int(atrnum / 3)][substr[2]] = i[1]
                atrnum += 1
        varstr = '"var":' + json.dumps(var, ensure_ascii=False)
        selectednode_json = json.loads(selectednode)
        selectednode_json["attributes"]["var"] = var
        new_selectednode = json.dumps(selectednode_json, ensure_ascii=False)
        new_modeltree = jsonstr.replace(selectednode, new_selectednode)
        jsondata = json.loads(new_modeltree)
        modelsave(jsondata, dirpath, dirpath_old)
        return "修改成功！"
    # return HttpResponse("修改成功！")
    if paras.get("opera") == "remove":
        if jsonstr.strip() != "null":
            modelsave(jsondata, dirpath, dirpath_old)
            return "删除成功！"
        else:
            dirpath = base_dir + "/" + username + "/" + "/models" + "/" + para["modelname"] + ".hom"
            if os.path.exists("dirpath"):
                os.remove(dirpath)
            else:
                dirpath = base_dir + "/" + username + "/" + "/models" + "/" + para["modelname"].lower() + ".hom"
                os.remove(dirpath)
            return make_response("file")

    if paras.get("opera") == "append":
        selectednode = paras.get("SelectedNode")
        category = paras.get("category")
        moduleclass = paras.get("module")
        varxml = base_dir + "/" + "HOMEfiles/" + moduleclass + ".xml"
        addnode = {}
        addnode["text"] = moduleclass.split('.')[-1]
        addnode["iconCls"] = "icon-ok"
        addnode["children"] = []
        addnode["attributes"] = {}
        addnode["attributes"]["name"] = moduleclass.split('.')[-1]
        addnode["attributes"]["class"] = moduleclass
        if category == "容器":
            addnode["attributes"]["nodetype"] = "context"
        else:
            addnode["attributes"]["nodetype"] = "module"
        addnode["attributes"]["var"] = []
        if os.path.exists(varxml):
            doc = minidom.parse(varxml)
            var_nodes = doc.getElementsByTagName("var")
            for var_node in var_nodes:
                if var_node.nodeType == 1:
                    temp = {}
                    temp["name"] = var_node.getAttribute("name")
                    temp["attribute"] = var_node.getAttribute("attribute")
                    temp["value"] = var_node.getAttribute("value") if var_node.getAttribute("value") else " "
                    temp["type"] = var_node.getAttribute("type") if var_node.getAttribute("type") else " "
                    addnode["attributes"]["var"].append(temp)
        selectednode_json = json.loads(selectednode)
        if "children" not in selectednode_json.keys():
            selectednode_json["children"] = []
        selectednode_json["children"].append(addnode)
        selectednode_new = json.dumps(selectednode_json, ensure_ascii=False)
        new_modeltree = jsonstr.replace(selectednode, selectednode_new)
        jsondata = json.loads(new_modeltree)
        modelsave(jsondata, dirpath, dirpath_old)
        return make_response("添加成功！")

    if paras.get("opera") == "savesequence":
        modelsave(jsondata, dirpath, dirpath_old)
        return make_response("修改顺序成功！")

    return make_response("修改顺序成功！")


def modulesmenu():
    base_dir = os.getcwd()
    dirpath = base_dir + "/static/jobfarm/HOMEfiles/modules.xml"
    doc = minidom.parse(dirpath)
    moduleinfo = []
    category_nodes = doc.getElementsByTagName("category")
    for category in category_nodes:
        if category.nodeType == 1:
            temp = {}
            temp["name"] = category.getAttribute("name")
            temp["value"] = []
            module_nodes = category.childNodes
            for module in module_nodes:
                if module.nodeType == 1:
                    temp1 = {}
                    temp1["name"] = module.getAttribute("name")
                    temp1["class"] = module.getAttribute("class")
                    temp1["image"] = module.getAttribute("image")
                    temp["value"].append(temp1)
        moduleinfo.append(temp)
    return moduleinfo


def sceclientInit():
    cookies = session.get('cookies', None)
    if cookies == None:
        httpclient = ApiClient("api.cngrid.org", "/v2", "gaohan");
        # httpclient=ApiClient("rest.cngrid.net","/v2", "test");
        # httpclient = ApiClient("localhost","/restapi3", "test",
        #                   plainPort=8080,sslPort=8443)

        openID = session['openid']
        token = session['auth_token']
        httpclient.loginOpenID(openID, token)
        # httpclient.login('liuqian', '111111')
        # httpclient.login("lusha", "123456")
        cookies = httpclient.getCookies()
        md5secret = httpclient.getMd5Secret()
        session['cookies'] = cookies
        session['md5secret'] = md5secret
        # request.session['username']='caorq'
    else:
        httpclient = ApiClient("api.cngrid.org", "/v2", "gaohan");
        # httpclient=ApiClient("rest.cngrid.net","/v2", "test");
        # httpclient = ApiClient("localhost","/restapi3", "test",
        #                   plainPort=8080,sslPort=8443)
        md5secret = session.get('md5secret', None)
        httpclient.active(cookies, md5secret)
    return httpclient


@portal_page.route('/jobfarm/upload', methods=['POST'])
def upload():
    failed_info = {"status": "failed"}
    failed_json = json.dumps(failed_info, ensure_ascii=False)
    if request.method == 'POST' and current_user.is_authenticated:
        file=request.files["file"]
        print 'file to upload:', file, type(file)
        base_dir=os.getcwd()
        timenano=datetime.datetime.now().strftime("%Y-%m-%d")
        # timenano=str(int(time.time()*1000))
        username=current_user.username
        fpath="%s/static/jobfarm/user_models/%s" %(base_dir, username)
        updir="%s/%s" %(fpath,timenano)
        filePath=updir+"/"+file.filename
        if os.path.exists(fpath)==False:
            os.mkdir(fpath)
        if os.path.exists(updir)==False:
            os.mkdir(updir)
        file.save(filePath)
        print u'上传到:', filePath, 'filename:', file.filename
        # destination = open(filePath, 'wb')
        # for chunk in file.chunks():
        #     destination.write(chunk)
        # destination.close()

        success_info={"status":"ok","filename":file.name,"filepath":filePath}
        success_json=json.dumps(success_info, ensure_ascii=False)
        return success_json

    return failed_json


@portal_page.route('/jobfarm/filelist', methods=['GET', 'POST'])
def filelist():
    if not current_user.is_authenticated:
        return json.dumps({ 'msg': u'用户未登录', 'code': -1 }, ensure_ascii=False)

    username = current_user.username
    info = os.getcwd()
    info = info + "/static/jobfarm/user_models/"
    listfile = os.listdir(info)
    fileinfo_json = json.dumps({ 'msg': u'未找到文件夹', 'code': -1 }, ensure_ascii=False)
    for line in listfile:  # 把目录下的文件都赋值给line这个参数
        if line == username:
            location = info + line
            fileinfo = []
            fileinfo.append(filelist2easyui(location, 1, 1))
            fileinfo_json = json.dumps(fileinfo, ensure_ascii=False)
            break
    return fileinfo_json


def filelist2easyui(location,level=1,num=1):
    fileinfo={}
    if os.path.isdir(location):
        dirname=location.split("/")[len(location.split("/"))-1]
        fileinfo["id"]=int(str(level)+str(num))
        fileinfo["text"]=dirname
        fileinfo["state"]="closed"
        fileinfo["attributes"]={"type":"dir"}
        childrens=[]
        if os.listdir(location):
            for line in os.listdir(location):
                newlocation=location +"/"+line
                l=level+1
                temp={}
                temp=filelist2easyui(newlocation,l,num)
                childrens.append(temp)
                num=num+1
                fileinfo["children"]=childrens
        else:
            temp={}
            temp["id"]=21
            temp["text"]="您还未上传文件"
            temp["attributes"]={"type":"empty"}
            childrens.append(temp)
        fileinfo["children"]=childrens
        return fileinfo
    else:
        filename=location.split("/")[len(location.split("/"))-1]
        fileinfo["id"]=int(str(level)+str(num))
        fileinfo["text"]=filename
        fileinfo["attributes"]={"type":"file","path":location}
        num=num+1
        return fileinfo


# @jobfarm_oauth_required
@portal_page.route('/jobfarm/fileedit', methods=['GET', 'POST'])
def fileedit():
    print 'filedit args:', request.form
    if request.method == 'POST':
        filepath=request.form.get("filepath")
        filename=filepath.split("/")[len(filepath.split("/"))-1]
        des= open(filepath,'r')
        buf=des.read()
        des.close()
        data={"fname":filename,"fcontent":buf}
        data_json=json.dumps(data,ensure_ascii=False)
        return data_json
    return "不正确的访问"

@portal_page.route('/jobfarm/fileview', methods=['GET', 'POST'])
def fileview():
    if request.method == 'POST':
        filename=request.form.get("filename")
        app=request.form.get("appname")
        base_dir=os.getcwd()
        filepath=base_dir+"/static/jobfarm/app_io_files"+"/"+app+"/"+filename
        des= open(filepath,'r')
        buf=des.read()
        des.close()
        data={"fname":filename, "fcontent":buf}
        data_json=json.dumps(data, ensure_ascii=False)
        return data_json
    return "不正确的访问"

@portal_page.route('/jobfarm/filedown', methods=['GET'])
def filedown():
    filename=request.args.get("filename")
    app=request.args.get("appname")
    base_dir=os.getcwd()
    filepath=base_dir+"/static/jobfarm/app_src"+"/"+app+"/"+filename
    directory = base_dir+"/app_src"+"/"+app+"/"
    def readFile(filePath, buf_size=1024 * 200):
        f = open(filePath, "rb")
        while True:
            c = f.read(buf_size)
            if c:
                yield c
            else:
                break
        f.close()
    content_type = mimetypes.guess_type(filepath)
    response = make_response(send_file(filepath, as_attachment=True))
    response.headers["Content-Disposition"] = "attachment; filename={}".format(filename.encode().decode('latin-1'))
    return response

@portal_page.route('/jobfarm/editsave', methods=['POST'])
def editsave():
    if request.method=="POST":
        filepath=urllib.unquote(request.form.get("filepath"))
        print('/jobfarm/editsave:', filepath)
        filecontent=request.form.get('filecontent')
        des=open(filepath,'w')
        des.write(filecontent)
        des.close()
        return make_response("保存成功!")
    return make_response("不正确的访问")


@portal_page.route('/jobfarm/app/queque', methods=['GET', 'POST'])
def getQueues(request):
    retDict={}
    if request.method == 'GET':
        app_name=request.GET.get('appname','')
        walltiem=request.GET.get('walltime','')
        cpucount=request.GET.get('cpucount','')
        if len(app_name)==0 or len(walltiem)==0 or len(cpucount)==0:
            retDict["status_code"]="3004"
            retDict["status_msg"]="can't find jobid"
        else:
            httpclient=sceclientInit()
            retstr=httpclient.getQueues(app_name, walltiem, cpucount)
            retDict=json.loads(retstr,encoding='utf8')
    return json.dumps(retDict,ensure_ascii=False)


def modelsave(jsondata, dirpath, dirpath_old):
    doc = minidom.Document()
    doc.encoding = "UTF-8"
    doc.standalone = "no"
    doc = json2xml(jsondata, doc, doc)
    f = open(dirpath, "w")
    f.write((doc.toprettyxml(indent="\t", newl="\n", encoding="utf-8")).decode('ascii'))
    # doc.writexml(f)
    f.close()
    os.remove(dirpath_old)
    os.rename(dirpath, dirpath_old)
    return


# 将json字符串转换成xml文件
def json2xml(jsondata, topnode, doc):
    pnode = doc.createElement(jsondata["attributes"]["nodetype"])
    pnode.setAttribute("name", jsondata["attributes"]["name"])
    pnode.setAttribute("class", jsondata["attributes"]["class"])
    print(jsondata["attributes"].keys())
    if 'var' in jsondata["attributes"].keys():
        if len(jsondata["attributes"]["var"]) != 0:
            # if jsondata["attributes"]["var"].keys():
            for var in jsondata["attributes"]["var"]:
                varnode = doc.createElement("var")
                varnode.setAttribute("attribute", var["attribute"])
                varnode.setAttribute("name", var["name"])
                # if var["value"]:
                varnode.setAttribute("value", var["value"] if var["value"] else "")
                # if var["type"]:
                if 'type' in var.keys():
                    varnode.setAttribute("type", var["type"] if var["type"] else "")
                if 'context' in var.keys():
                    varnode.setAttribute("context", var["context"] if var["context"] else "")
                pnode.appendChild(varnode)
    if "children" in jsondata.keys():
        if jsondata['children']:
            for child in jsondata["children"]:
                json2xml(child, pnode, doc)
    topnode.appendChild(pnode)
    return doc

# 获取模型数据
@portal_page.route('/jobfarm/modeldata', methods=['GET'])
def modeldata():
    model_data = []
    base_dir = os.getcwd()
    username = current_user.username
    dirpath = base_dir + "/static/jobfarm/user_models/" + username + "/models" + "/" + request.args.get('name')
    doc = minidom.parse(dirpath)
    model_nodes = doc.getElementsByTagName("model")
    for model_node in model_nodes:
        if model_node.nodeType == 1:
            model_data.append(convert2easyui(model_node, 1))

    data_json = json.dumps(model_data, ensure_ascii=False)
    return data_json


def convert2easyui(model_node, num=1):
    if model_node.hasChildNodes():
        model_data = {}
        model_data["id"] = num
        model_data["text"] = model_node.getAttribute("name")
        model_data["iconCls"] = "icon-ok"
        model_data["children"] = []
        model_data["attributes"] = {}
        model_data["attributes"]["name"] = model_node.getAttribute("name")
        model_data["attributes"]["class"] = model_node.getAttribute("class")
        model_data["attributes"]["nodetype"] = model_node.localName
        model_data["attributes"]["var"] = []

        child_nodes = model_node.childNodes
        for child_node in child_nodes:
            if child_node.nodeType == 1:
                if child_node.localName == "var":
                    temp = {}
                    temp["name"] = child_node.getAttribute("name")
                    temp["attribute"] = child_node.getAttribute("attribute") if child_node.getAttribute(
                        "attribute") else child_node.getAttribute("name")
                    temp["value"] = child_node.getAttribute("value") if child_node.getAttribute("value") else " "
                    temp["type"] = child_node.getAttribute("type") if child_node.getAttribute("type") else " "
                    model_data["attributes"]["var"].append(temp)
                else:
                    num = num + 1
                    model_data["children"].append(convert2easyui(child_node, num))

    elif model_node.localName != "var":
        model_data = {}
        model_data["id"] = num
        model_data["text"] = model_node.getAttribute("name")
        model_data["iconCls"] = "icon-ok"
        model_data["attributes"] = {}
        model_data["attributes"]["name"] = model_node.getAttribute("name")
        model_data["attributes"]["class"] = model_node.getAttribute("class")
        model_data["attributes"]["nodetype"] = model_node.localName
    return model_data


#授权失败的处理
@portal_page.route('/jobfarm/auth/error', methods=['GET'])
def authError(request):
    if request.method=='GET':
        auth_error_page='portal/jobfarm/auth/error.html'
        username=session.get('username', 'anonymous')
        timeint=int(time.time())
        reason=session.get('used_user', '')
        return render_template(auth_error_page,
                               username=username,
                               authURL='auth/error?time='+str(timeint),
                               timeint=timeint,
                               authMsg='授权失败，您目前不能使用超算资源！'+reason,
                               btnInfo='再次授权'
                               )
    if request.method=='POST':
        session['oauth_try_num']=0
        timestr=str(int(time.time()))
        return redirect('/portal/jobfarm/oauth/request?time='+timestr)



@portal_page.route('/jobfarm/auth/refresh', methods=['GET'])
def authRefresh():
    if request.method=='GET':
        auth_error_page='portal/jobfarm/auth/error.html'
        username=session.get('username','anonymous')
        timeint=int(time.time())
        return render_template(auth_error_page,
                               username=username,
                               authURL='auth/request?time=' + str(timeint),
                               timeint=timeint,
                               authMsg='您的授权已到期',
                               btnInfo='延期授权'
                               )
    if request.method=='POST':
        session['oauth_try_num']=0
        timestr=str(int(time.time()))
        return redirect('/portal/jobfarm/oauth/refresh?time='+timestr)


#测试账号授权
@portal_page.route('/jobfarm/auth/testaccount', methods=['GET'])
def jobfarm_auth_test_account():
    urlstr='/portal/jobfarm/apps'
    session['username']='gaohan@lzb.ac.cn'
    return redirect(urlstr)

@portal_page.route('/modelbox/xmldoc', methods=['GET'])
def jobfarm_modelbox_xmldoc():
    # param = request.GET
    base_dir = os.getcwd()
    # username = request.session["username_1"]
    username = current_user.username
    dirpath = base_dir + "/static/jobfarm/user_models/" + username + "/models" + "/" + request.args.get("name")
    des = open(dirpath, 'r')
    buf = des.read()
    des.close()
    data = buf.replace("<", "&lt;").replace(">", "&gt;")
    f = {"filecontent": data, "filepath": dirpath}
    # f_json = json.dumps(f, ensure_ascii=False)
    return jsonify(f)