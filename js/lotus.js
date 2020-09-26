var TEMPLATES = {
  form: "Template do formulário."
};

class Lotus{
  static createTemplate(templateJson){
    if(!templateJson) return null;

    var template;
    var templateName = templateJson["name"];

    template = this.generateDOMElement(null, templateJson["node"]);
    TEMPLATES[templateName] = template;

    return template;
  }

  static generateDOMElement(parent, node){
    console.log(node["tag"]);
    var currentElement = $('<'+node["tag"]+'>');
    console.log(node["tag"]);
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
};

$(document).ready(()=>{
  $("lotus").each((index, element)=>{
    var elem = $(element);
    elem.replaceWith(TEMPLATES[elem.attr("data-template")]);
  });
});
