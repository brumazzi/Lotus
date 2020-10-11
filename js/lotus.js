class Lotus{
  static TEMPLATES = {};

  static createTemplate(templateJson){
    if(!templateJson) return null;

    var template;
    var templateName = templateJson["name"];

    template = this.generateDOMElement(null, templateJson["node"]);
    template.attr('origin', templateName);
    this.TEMPLATES[templateName] = template;

    return template;
  }

  static reloadElement(element){
    $(element).replaceWith(Lotus.TEMPLATES[$(element).attr('origin')]);
  }

  static replaceByElement(elementOrigin, elementDest){
    $(elementDest).replaceWith($(elementOrigin).clone(true, true));
  }

  static replaceByTemplate(element, template){
    $(element).replaceWith($(Lotus.TEMPLATES[template]).clone(true, true));
  }

  static toTemplameJSON(element, templateName){
    var templateJson = {
      "name": templateName
    };

    templateJson["node"] = this.generateJsonFromElement(element);
    return templateJson;
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
        elementJSON["node"].push(this.generateJsonFromElement($(childElement)));
      });
    }else if(element.html()){
      elementJSON["node"] = [];
      elementJSON["node"].push(element.html());
    }
    return elementJSON;
  }

  static generateDOMElement(parent, node){
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
          this.generateDOMElement(currentElement, node["node"][nodeI]);
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
    if(parent){
      parent.append(currentElement);
    }
    return currentElement;
  }

  static renderInput(element){
    var type = $(element).attr('type');
    var template = Lotus.TEMPLATES[type].clone(true, true);

    $.each(element.prop("attributes"), (index, attr)=>{
      if(attr.name == "id"){
        template.find('.form-control').attr('id', attr.value);
        template.find('label').attr('for', attr.value);
      }else if(attr.name == 'name'){
        template.find('.input').attr('name', attr.value);
      }else if(attr.name == "label"){
        template.find('label').html(attr.value);
      }else if(attr.name == "mask"){
        template.find('.input').keypress((evt)=>{
          var exp_number = new RegExp(attr.value);
          if(evt.key.search(exp_number))
          evt.preventDefault();
        });
      }else if(attr.name != 'type'){
        if(attr.name == 'class'){
          template.find('.input').addClass(attr.value);
        }else{
          template.find('.input').attr(attr.name, attr.value);
        }
      }
    });

    element.replaceWith(template);
  }

  static renderTemplate(element){
    element.replaceWith(Lotus.TEMPLATES[element.attr("data-template")].clone(true, true));
  }

  static renderContent(element){
    var templateJson = JSON.parse($(element).html());
    var template = this.generateDOMElement(null, templateJson);

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
  $("lotus[type^=input-]").each((index, element)=>{
    var elem = $(element);
    Lotus.renderInput(elem);
  });
});
