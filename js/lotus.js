class Lotus{
  static TEMPLATES = {};

  static createTemplate(templateJson, templateName){
    if(!templateJson) return null;
    Lotus.TEMPLATES[templateName] = templateJson;
  }

  static reloadElement(element){
    var template = Lotus.TEMPLATES[$(element).attr('origin')];
    $(element).replaceWith(Lotus.generateDOMElement(null, template, $(element).attr('origin')));
  }

  static replaceByElement(elementOrigin, elementDest){
    $(elementDest).replaceWith($(elementOrigin).clone(true, true));
  }

  static replaceByTemplate(element, templateName){
    var template = Lotus.TEMPLATES[templateName];
    var newElement = Lotus.generateDOMElement(null, template, templateName);
    $(element).replaceWith(newElement);
  }

  static toTemplameJSON(element){
    return Lotus.generateJsonFromElement(element);
  }

  static generateJsonFromElement(element){
    if(typeof(element) != "object"){
      return element;
    }
    var elementJSON = {"tag": element.prop("tagName").toLowerCase()};

    $.each(element.prop("attributes"), (index, attr)=>{
      elementJSON[attr.name] = attr.value;
    });
    if(element.children().length){
      elementJSON["node"] = [];
      element.children().each((index, childElement)=>{
        elementJSON["node"].push(Lotus.generateJsonFromElement($(childElement)));
      });
    }else if(element.html()){
      elementJSON["node"] = [];
      elementJSON["node"].push(element.html());
    }
    return elementJSON;
  }

  static generateDOMElement(parent, node, templateName=null){
    if(typeof(node) != "object"){
      var data = $(document.createElement('span'));
      data.html(node);
      parent.append(data);
      return data;
    }
    var currentElement =  $(document.createElement(node["tag"]));
    var keys = Object.keys(node);
    for(var index=0; index < keys.length; index+=1){
      if(keys[index] == "node"){
        for(var nodeI=0; nodeI < node["node"].length; nodeI+=1){
          Lotus.generateDOMElement(currentElement, node["node"][nodeI]);
        }
      }else if(keys[index] == "tag"){
        continue;
      }else if(keys[index] == "events"){
        for(var eventI=0; eventI < node["events"].length; eventI+=1){
          var event = node["events"][eventI];
          eval("currentElement."+event["type"]+"((evt)=>{"+event["callback"]+"("+event["args"].join()+");})");
        }
      }else{
        currentElement.attr(keys[index], node[keys[index]]);
      }
    }
    if(templateName) currentElement.attr('origin', templateName);
    if(parent){
      parent.append(currentElement);
    }
    return currentElement;
  }

  static getTemplate(templateName){
    return Lotus.TEMPLATES[templateName];
  }

  static getTemplateDOMElement(templateName){
    var template = Lotus.TEMPLATES[templateName];
    return Lotus.generateDOMElement(null, template, templateName);
  }

  static renderTemplate(element){
    var template = Lotus.TEMPLATES[element.attr("data-template")];
    element.replaceWith(Lotus.generateDOMElement(null, template, element.attr("data-template")));
  }

  static renderContent(element){
    var templateJson = JSON.parse($(element).html());
    var template = Lotus.generateDOMElement(null, templateJson);

    element.replaceWith(template);
    return template;
  }
}

$(document).ready(()=>{
  $("lotus[type=template]").each((index, element)=>{
    var elem = $(element);
    Lotus.renderTemplate(elem);
  });
  $("lotus[type=render]").each((index, element)=>{
    var elem = $(element);
    Lotus.renderContent(elem);
  });
});
