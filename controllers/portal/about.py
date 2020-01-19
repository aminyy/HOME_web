# coding=utf-8

from flask import render_template, request
from controllers.portal import portal_page
from models import Page
from models.page import AboutArticle, AboutAwards, AboutPatent, AboutWork


@portal_page.route('/about/<path:name>', methods=['GET'])
def about(name):
    page = Page.query.filter_by(name=name).first()
    return render_template('portal/about/index.html', page=page)

@portal_page.route('/about/works', methods=['GET'])
def about_works():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    offset = (current_page - 1) * page_size
    total = AboutWork.query.count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    works = AboutWork.query.offset(offset).limit(page_size).all()

    return render_template('portal/about/works.html', works=works, current_page=current_page, total_page=total_page, total=total)

@portal_page.route('/about/patents', methods=['GET'])
def about_patents():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    offset = (current_page - 1) * page_size
    total = AboutPatent.query.count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    patents = AboutPatent.query.offset(offset).limit(page_size).all()

    return render_template('portal/about/patents.html', patents=patents, current_page=current_page, total_page=total_page, total=total)


@portal_page.route('/about/articles', methods=['GET'])
def about_articles():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    offset = (current_page - 1) * page_size
    total = AboutArticle.query.count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    articles = AboutArticle.query.offset(offset).limit(page_size).all()

    return render_template('portal/about/articles.html', articles=articles, current_page=current_page, total_page=total_page, total=total)


@portal_page.route('/about/awards', methods=['GET'])
def about_awards():
    current_page = request.args.get('current_page', 1)
    current_page = int(str(current_page))
    page_size = 20
    offset = (current_page - 1) * page_size
    total = AboutAwards.query.count()
    if (total % page_size) == 0:
        total_page = total / page_size
    else:
        total_page = (total / page_size) + 1
    awards = AboutAwards.query.offset(offset).limit(page_size).all()

    return render_template('portal/about/awards.html', awards=awards, current_page=current_page, total_page=total_page, total=total)

@portal_page.route('/server')
def server():
    name = request.args.get("name")
    if name:
        page = Page.query.filter_by(name=name).first()
        return render_template('portal/about/index.html', page=page)
    else:
        return render_template('portal/about/server.html')


@portal_page.route('/about/standard')
def standard():
    name = request.args.get("name")
    if name:
        if name=="rule":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/zhangchen.html', item=item)
        elif name=="regulation":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/guanlibanfa.html', item=item)
        elif name=="assess":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/pinggutiaoli.html', item=item)
        elif name=="share":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/gongxiangtiaoli.html', item=item)
        elif name=="dispark":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/kaifantiaoli.html', item=item)
        elif name=="detailed":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/pingguxize.html', item=item)
        elif name=="method":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/pinggubanfa.html', item=item)
        elif name=="weather":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/qixiangguanchaguifan.html', item=item)
        elif name=="airtest":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/daqiguanchaguifan(shixin).html', item=item)
        elif name=="airoption":
            item = request.args.get('item')
            return render_template('portal/pages/biaozhunguifan/daqiguanchaguifan(yijian).html', item=item)
        elif name=="rules":
            return render_template('portal/about/rules.html')
        elif name=="qingzang":
            return render_template('portal/pages/biaozhunguifan/guizhanzhidu/qingzanzhidu.html')
        elif name=="sanxia":
            return render_template('portal/pages/biaozhunguifan/guizhanzhidu/changjiangzhidu.html')
        elif name=="dongchuan":
            return render_template('portal/pages/biaozhunguifan/guizhanzhidu/yunnanzhidu.html')
        elif name=="operation":
            return render_template('portal/about/operation.html')
        elif name=="airosol":
            return render_template('portal/pages/biaozhunguifan/yewuguifan/qirongjiaozhinan.html')
        elif name=="background":
            return render_template('portal/pages/biaozhunguifan/yewuguifan/daqiguifan.html')
    else:
        return render_template('portal/about/standard.html')
