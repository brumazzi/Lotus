var templateNames = ["lotus-text", "lotus-date", "lotus-number", "lotus-radio", "lotus-checkbox"];
var inputs = [
  {tag:"div",class:"form-group",node:[{tag:"label",node:[]},{tag:"input",type:"text",class:"form-control input"}]},
  {tag:"div",class:"form-group",node:[{tag:"label",node:[]},{tag:"input",type:"date",class:"form-control input"}]},
  {tag:"div",class:"form-group",node:[{tag:"label",node:[]},{tag:"input",type:"number",class:"form-control input"}]},
  {tag:"div",class:"form-group radio",node:[{tag:"input",type:"radio",class:"input d-none", events:[{type:"change", callback:"radioChange", args:["evt"]}]},{tag:"label",class:"mark"},{tag:"label",class:"text",node:[]}]},
  {tag:"div",class:"form-group checkbox",node:[{tag:"input",type:"checkbox",class:"input d-none", events:[{type:"change", callback:"checkboxChange", args:["evt"]}]},{tag:"label",class:"mark"},{tag:"label",class:"text",node:[]}]},
];

function checkboxChange(evt){
  var input = $(evt.currentTarget);
  var checkElement = input.parent();

  if(input.prop('checked')){
    checkElement.addClass('checked');
  }else{
    checkElement.removeClass('checked');
  }
}

function radioChange(evt){
  var input = $(evt.currentTarget);
  var checkElement = input.parent();

  $("[name="+input.attr('name')+"]").parent().removeClass('checked');
  checkElement.addClass('checked');
}

for(var index = 0; index < inputs.length; index++){
  Lotus.createTemplate(inputs[index], templateNames[index]);
}

Lotus.renderInput = (element)=>{
  var type = $(element).attr('type');
  var elementDOM = Lotus.generateDOMElement(null, Lotus.TEMPLATES[type]);

  $.each(element.prop("attributes"), (index, attr)=>{
    if(attr.name == "id"){
      elementDOM.find('.form-control').attr('id', attr.value);
      elementDOM.find('label').attr('for', attr.value);
    }else if(attr.name == 'name'){
      elementDOM.find('.input').attr('name', attr.value);
    }else if(attr.name == "label"){
      if(type == "lotus-radio" || type == "lotus-checkbox"){
        elementDOM.find('.text').html(attr.value);
      }else{
        elementDOM.find('label').html(attr.value);
      }
    }else if(attr.name == "mask"){
      elementDOM.find('.input').keypress((evt)=>{
        var exp_number = new RegExp(attr.value);
        if(evt.key.search(exp_number))
        evt.preventDefault();
      });
    }if(attr.name == 'class'){
      if(type == "lotus-radio" || type == "lotus-checkbox"){
        elementDOM.addClass(attr.value);
      }else{
        elementDOM.find('.input').addClass(attr.value);
      }
    }else if(attr.name != 'type'){
      elementDOM.find('.input').attr(attr.name, attr.value);
    }
  });

  element.replaceWith(elementDOM);
}

$(document).ready(()=>{
  $("input[type^=lotus-]").each((index, element)=>{
    var elem = $(element);
    Lotus.renderInput(elem);
  });
});
