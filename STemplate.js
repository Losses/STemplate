/* DTEMPLATE.JS BY LOSSES DON UNDER CC BY-SA 3.0 */

/*
 * Template 模块主体
 * @param string elementId 模板Id
 * @returns {Template}
 */

function Template(elementContent, isBlockId) {
    isBlockId = isBlockId || false;

    this.templateContent = !isBlockId ? $('script[type="text/template"][id="' + elementContent + '"]').html() : elementContent;
    this.templateName = elementContent;
}

/*
 * toString 方法
 * @returns {jQuery}
 */

Template.prototype.toString = function() {
    return this.templateContent;
};

/*
 * toLocalString 方法
 * @returns {jQuery}
 */

Template.prototype.toLocalString = function() {
    return this.toString();
};

/*
 * valueOf 方法
 * @returns {Boolean}
 */

Template.prototype.valueOf = function() {
    return true;
};

/*
 * toJSON 方法
 * @returns {string}
 */

Template.prototype.toJSON = function() {
    return this.templateName;
};

/*
 * 输出正则表达式匹配结果的私有方法
 * @param {String} string 待匹配的文本
 * @param {RegExp} regExp 目标正则表达式
 * @returns {Array} 匹配结果的数组
 */

Template.prototype._regFetch = function(string, regExp) {
    if (!string instanceof String)
        throw("the first argument must be string!");
    if (!regExp instanceof RegExp)
        throw("the second argument must be regex expression");

    var result = [] /*nxt line*/
            , tempResult /*nxt line*/
            , c = 0;
    while ((tempResult = regExp.exec(string)) !== null) {
        result.push(tempResult[1]);
    }
    return result;
};

/*
 * 内容填充代码
 * @param {string} target 被填充目标对象的selector
 * @param {object} data 待填充的数据 
 * @returns {Template}
 */

Template.prototype.fill = function(target, data) {
    //if (!(data instanceof Object))
    //    throw "DATA MUST BE AN OBJECT!";
    var originTemplate = "" + this.templateContent /*nxt line*/
            , loopBlock = this._regFetch(originTemplate, /(\(\([\s\S]*?\)\))/gmi) /*nxt line*/
            , conditionBlock = this._regFetch(originTemplate, /(\[\[[\s\S]*?\]\])/gmi);

    if (loopBlock && loopBlock.length !== 0) {
        var loopCondition = [] /*nxt line*/
                , loopContent = [] /*nxt line*/
                , loopResult = [] /*nxt line*/
                , switchResult = [] /*nxt line*/
                , w, x, y;
        for (x in loopBlock) {
            loopCondition[x] = this._regFetch(loopBlock[x], /\(\(\{\{([\s\S]*?)\}\}/gi)[0];
            loopContent[x] = this._regFetch(loopBlock[x], /\}\}([\s\S]*?)\)\)/gmi)[0];
        }
    }

    if (conditionBlock && conditionBlock.length !== 0) {
        var conditionCondition = [] /*nxt line*/
                , conditionContent = [] /*nxt line*/
                , targetContent = "" /*nxt line*/
                , z;

        for (x in conditionBlock) {
            conditionCondition[x] = this._regFetch(conditionBlock[x], /\[\[\{\{([\s\S]*?)\}\}/gi)[0];
            conditionContent[x] = this._regFetch(conditionBlock[x], /\}\}([\s\S]*?)\]\]/gmi)[0];
        }

    }

    var name;
    for (var i in data) {
        var content = originTemplate;

        for (name in data[i]) {
            if (loopBlock && loopBlock.length !== 0) {
                for (y in loopCondition) {
                    loopResult[y] = [];
                    for (w in data[i][loopCondition[y]]) {
                        if (data[i][loopCondition[y]][w] !== undefined /*nxt line*/
                                /*&& data[loopCondition[y]] instanceof Object*/) {
                            var tempTmp = new Template(loopContent[y], true);
                            loopResult[y][w] = tempTmp.fill(null, [data[i][loopCondition[y]][w]]);
                        }
                    }
                    switchResult[y] = loopResult[y].join("  ");
                    content = content.replace(loopBlock[y], switchResult[y]);
                }
            }

            if (conditionBlock && conditionBlock.length !== 0) {
                for (z in conditionCondition) {
                    if (data[i][conditionCondition[z]]
                            && (data[i][conditionCondition[z]] !== ("0" || "null" || "undefined"))) {
                        targetContent = conditionContent[z];
                    } else {
                        targetContent = "";
                    }

                    content = content.replace(conditionBlock[z], targetContent);
                }

            }

            var aim = new RegExp("{{" + name + "}}", "g");
            content = content.replace(aim, data[i][name]);
        }

        content = "<!--STemplateUnit-->" + content + "<!--STemplateUnitEnd-->";

        if (target)
            $(target).append(content);
    }

    if (!target)
        return content;
    else
        return this;
};

/*
 * 内容清空方法
 * @param {type} target 被晴空目标对象的selector
 * @returns {Template}
 */

Template.prototype.clear = function(target) {
    var cleanAim = new RegExp("<!--STemplateUnit-->[\\s\\S]*<!--STemplateUnitEnd-->", "gmi");
    var targetHTML = $(target).html();

    $(target).html(targetHTML.replace(cleanAim, ""));

    return this;
}

/*
 * 代码重新填充方法
 * @param {string} target 被填充目标对象的selector
 * @param {object} data 待填充的数据 
 * @returns {Template}
 */

Template.prototype.refill = function(target, data) {
    this.clear(target);
    this.fill(target, data);

    return this;
};

/* DTEMPLATE.JS END */