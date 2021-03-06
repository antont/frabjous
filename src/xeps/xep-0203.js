//= require jquery
//= require ember
//= require ember-data
//= require ./message
//= require ./presence
//= require ./xep-0082
//= require ./xep-0201

Frabjous.Delay = Frabjous.Permanent.extend({
  stamp:  DS.attr('Xep0082dateString'),
  from:   DS.attr('jidString'),
  reason: DS.attr('string')
});

Frabjous.Delay.instance_properties = {
  delay: DS.hasOne(Frabjous.Delay, { embedded: true }),
  created_at: DS.attr('Xep0082dateString'),
  received_at: function(){
    var delay = this.get('delay');
    if(delay){
      return delay.get('stamp');
    }else{
      return this.get('created_at');
    }
  }.property('delay','created_at')
};

Frabjous.Delay.sort = function(a,b){
  return a.get("received_at") - b.get("received_at");
};

Frabjous.Message.reopen( Frabjous.Delay.instance_properties );
Frabjous.Presence.reopen( Frabjous.Delay.instance_properties );

Frabjous.Contact.reopen({
  presence_history: function(){
    return this.get('_presence_history').slice().sort(Frabjous.Delay.sort);
  }.property('_presence_history.@each')
});

Frabjous.Contact.reopen({
  messages_from: function(){
    return this.get('_messages_from').slice().sort(Frabjous.Delay.sort);
  }.property('_messages_from.@each'),
  messages_to: function(){
    return this.get('_messages_to').slice().sort(Frabjous.Delay.sort);
  }.property('_messages_to.@each')
});

Frabjous.Thread.reopen({
  messages: function(){
    return this.get('_messages').slice().sort(Frabjous.Delay.sort);
  }.property('_messages.@each')
});

Frabjous.Parser.register("XEP-0203", function(stanza){
  if( stanza.is_message() || stanza.is_presence() ){
    // At least have a message or presence, so add a created_at
    parsed = {
      id: stanza.id(),
      created_at: Frabjous.Xep0082.toString(new Date())
    };
    
    var delay_stanza = stanza.root().find("delay[xmlns='urn:xmpp:delay']");
    if(delay_stanza.length > 0){
      var $delay_stanza = $(delay_stanza);
      var delay = {
        id:     stanza.id(),
        stamp:  $delay_stanza.attr('stamp'),
        from:   $delay_stanza.attr('from'),
        reason: $.trim($delay_stanza.text())
      };
      parsed.delay = delay;
    }
    return parsed;
  }
});