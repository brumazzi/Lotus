var inputs = [
  {name:"lotus-text",node:{tag:"div",class:"form-group",node:[{tag:"label",node:[]},{tag:"input",type:"text",class:"form-control input"}]}},
  {name:"lotus-date",node:{tag:"div",class:"form-group",node:[{tag:"label",node:[]},{tag:"input",type:"date",class:"form-control input"}]}},
  {name:"lotus-number",node:{tag:"div",class:"form-group",node:[{tag:"label",node:[]},{tag:"input",type:"number",class:"form-control input"}]}},
  {name:"lotus-radio",node:{tag:"div",class:"form-group radio",node:[{tag:"input",type:"radio",class:"input d-none", events:[{type:"change", callback:"radioChange", args:["evt"]}]},{tag:"label",class:"mark"},{tag:"label",class:"text",node:[]}]}},
  {name:"lotus-checkbox",node:{tag:"div",class:"form-group checkbox",node:[{tag:"input",type:"checkbox",class:"input d-none", events:[{type:"change", callback:"checkboxChange", args:["evt"]}]},{tag:"label",class:"mark"},{tag:"label",class:"text",node:[]}]}},
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
  var template = Lotus.createTemplate(inputs[index]);
}

Lotus.renderInput = (element)=>{
  var type = $(element).attr('type');
  var template = Lotus.TEMPLATES[type].clone(true, true);

  $.each(element.prop("attributes"), (index, attr)=>{
    if(attr.name == "id"){
      template.find('.form-control').attr('id', attr.value);
      template.find('label').attr('for', attr.value);
    }else if(attr.name == 'name'){
      template.find('.input').attr('name', attr.value);
    }else if(attr.name == "label"){
      if(type == "lotus-radio" || type == "lotus-checkbox"){
        template.find('.text').html(attr.value);
      }else{
        template.find('label').html(attr.value);
      }
    }else if(attr.name == "mask"){
      template.find('.input').keypress((evt)=>{
        var exp_number = new RegExp(attr.value);
        if(evt.key.search(exp_number))
        evt.preventDefault();
      });
    }if(attr.name == 'class'){
      if(type == "lotus-radio" || type == "lotus-checkbox"){
        template.addClass(attr.value);
      }else{
        template.find('.input').addClass(attr.value);
      }
    }else if(attr.name != 'type'){
      template.find('.input').attr(attr.name, attr.value);
    }
  });

  element.replaceWith(template);
}

$(document).ready(()=>{
  $("input[type^=lotus-]").each((index, element)=>{
    var elem = $(element);
    Lotus.renderInput(elem);
  });
});
