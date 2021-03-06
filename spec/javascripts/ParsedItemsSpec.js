describe("ParsedItems", function(){
  var items;
  
  beforeEach(function(){
    items = new Frabjous.ParsedItems();
  });
  
  describe("add", function(){
    it("should add a new item to the list and return item", function(){
      var returned = items.add({id: "23", foo: "bar"});
      expect(returned).toEqual({id: "23", foo: "bar"});
      expect(items.all()).toEqual([{id: "23", foo: "bar"}]);
    });
    it("should not add an item if it is null", function(){
      var returned = items.add(null);
      expect(returned).toEqual(undefined);
      expect(items.all()).toEqual([]);
    });
    it("should not add an item if it is undefined", function(){
      var returned = items.add(undefined);
      expect(returned).toEqual(undefined);
      expect(items.all()).toEqual([]);
    });
    it("should not add an item if it does not have an id", function(){
      var returned = items.add({foo: "bar"});
      expect(returned).toEqual(undefined);
      expect(items.all()).toEqual([]);
    });
    it("should update an item in the list if already there and return merged item", function(){
      items.add({id: "23", foo: "1", bar: "2" });
      
      var returned = items.add({id: "23", foo: "one", baz: "three"});
      expect(returned).toEqual({id: "23", foo: "one", bar: "2", baz: "three"});
      expect(items.all()).toEqual([{id: "23", foo: "one", bar: "2", baz: "three"}]);
    });
    it("should keep store set to true if has been set, regardless of order", function(){
      items.add({id: "23", foo: "1", bar: "2", store: true });
      var returned = items.add({id: "23", store: false });
      
      expect(returned).toEqual({id: "23", foo: "1", bar: "2", store: true});
      
      items.add({id: "23", foo: "1", bar: "2", store: false });
      returned = items.add({id: "23", store: true });
      
      expect(returned).toEqual({id: "23", foo: "1", bar: "2", store: true});
    });
    it("should deep merge objects", function(){
      items.add({id: "23", nested: {foo: "bar"}});
      
      var returned = items.add({id: "23", nested: {baz: "b"}});
      expect(returned).toEqual({id: "23", nested: {foo: "bar", baz: "b"}});
      expect(items.all()).toEqual([{id: "23", nested: {foo: "bar", baz: "b"}}]);
    });
    it("should add multiple items to the list and return item", function(){
      var returned = items.add([{id: "23", foo: "bar"},{id:"24", a: "a"}]);
      expect(returned).toEqual([{id: "23", foo: "bar"},{id:"24", a: "a"}]);
      expect(items.all()).toEqual([{id: "23", foo: "bar"},{id:"24", a: "a"}]);
    });
  });
  
  describe("all", function(){
    it("should return array of unique items", function(){
      items.add({id: "a", foo: "a"});
      items.add({id: "b", foo: "b"});
      
      expect(items.all()).toEqual([{id: "a", foo: "a"}, {id: "b", foo: "b"}]);
    });
  });
});