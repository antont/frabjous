//= require ember-data
//= require jquery
//= require ./message
//= require ./presence
//= require ./iq

Frabjous.Error = Frabjous.Permanent.extend({
  by:                DS.attr('string'),
  type:              DS.attr('string'),
  text:              DS.attr('string'),
  condition:         DS.attr('string'),
  condition_payload: DS.attr('string')
});

Frabjous.Error.instance_properties = {
  has_error: function(){
    return !Ember.none(this.get('error'));
  }.property('error'),
  is_success: function(){
    return !this.get('has_error');
  }.property('has_error')
};

Frabjous.Temporary.reopen( Frabjous.Error.instance_properties );
Frabjous.Permanent.reopen( Frabjous.Error.instance_properties );
Frabjous.Permanent.reopen({
  error: DS.hasOne(Frabjous.Error,{ embedded: true })
});

Frabjous.Parser.register("Error", function(stanza){
  
  var $error_stanza = $(stanza.root().find('error[type]'));
  
  if( $error_stanza.length > 0 ){
    var parsed           = {};
    var error            = {};
    var namespace        = "urn:ietf:params:xml:ns:xmpp-stanzas";
    var text_stanza      = $error_stanza.find("text[xmlns='"+namespace+"']");
    var condition_stanza = $error_stanza.find("[xmlns='"+namespace+"']").map(function(i,e){ if(e.nodeName != "text"){ return e; } });
    var text, payload;
    
    if(text_stanza.length > 0){
      text = $.trim(text_stanza.text());
    } else {
      text = null;
    }
    
    payload = $.trim(condition_stanza.text());
    if(payload.length === 0){ payload = null; }
    
    error.id                = stanza.id();
    error.by                = $error_stanza.attr("by") || null;
    error.type              = $error_stanza.attr("type");
    error.text              = text;
    error.condition         = condition_stanza[0].nodeName;
    error.condition_payload = payload;
    
    parsed.id = stanza.id();
    parsed.error = error;
    
    return parsed;
  }
  
});