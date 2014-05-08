if(Meteor.Collection2)
{
    coll= new Meteor.Collection("test_collection",{schema:{
    random:{
        type:Number
    },
    count:{
        type:Number
    }

}
})}
else
{
    coll= new Meteor.Collection("test_collection")
}

coll.before.update(function(userId, doc, fieldNames, modifier, options){
    console.log("before",doc.count)
})

coll.after.update(function(userId, doc, fieldNames, modifier, options){
    console.log("after",doc.count)
})

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to test_hooks.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
  
  Template.hello.helpers({
    randomlist:function()
    {
        return coll.find({},{sort:{count:1}}).fetch()
    },
    
  })
  Template.random.events({
        
        'click button':function(evt,tpl)
        {
            Meteor.call("increment",this.random)
        }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  
    if(coll.find({},{fields:{_id:1}}).count()==0)
    {
        for(var i=0;i<100;i++)
        {
            coll.insert({random:i%10,count:i})
        }
    }
  });
  
  Meteor.methods({
    increment:function(i)
    {
        coll.update({random:i},{$inc:{random:1}},{multi:true})
    }
  })
}
