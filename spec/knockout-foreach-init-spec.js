mocha.setup('bdd')
var expect = chai.expect;

// Make the frame animation synchronous; simplifies testing.
function setupSynchronousFrameAnimation () {
  var originalAnimateFrame = ko.bindingHandlers.foreachInit.InitializedForeach.animateFrame;
  beforeEach(function () {
    originalAnimateFrame = ko.bindingHandlers.foreachInit.InitializedForeach.animateFrame;
    ko.bindingHandlers.foreachInit.InitializedForeach.animateFrame = function(frame) { frame() };
  })
  afterEach(function () {
    ko.bindingHandlers.foreachInit.InitializedForeach.animateFrame = originalAnimateFrame;
  })
}

describe("foreachInit binding", function () {
  setupSynchronousFrameAnimation();

  it("works with a static list", function () {
    var target = $("<ul data-bind='foreachInit: $data'>" +
                      "<li data-bind='text: $data' data-template></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                    "</ul>");
    var list = [1, 2, 3];
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data" data-init="">1</li>' + 
                                   '<li data-bind="text: $data" data-init="">2</li>' +
                                   '<li data-bind="text: $data" data-init="">3</li>');
  });

  it("works with an observable array", function () {
    var target = $("<ul data-bind='foreachInit: $data'>" +
                      "<li data-bind='text: $data' data-template></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                    "</ul>");
    var list = [6, 7, 8];
    ko.applyBindings(ko.observableArray(list), target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data" data-init="">6</li>' + 
                                   '<li data-bind="text: $data" data-init="">7</li>' +
                                   '<li data-bind="text: $data" data-init="">8</li>');
  });

  it("works with a plain observable with an array", function () {
    var target = $("<ul data-bind='foreachInit: $data'>" +
                      "<li data-bind='text: $data' data-template></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                    "</ul>");
    var list = [14, 15, 16];
    ko.applyBindings(ko.observable(list), target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data" data-init="">14</li>' + 
                                   '<li data-bind="text: $data" data-init="">15</li>' +
                                   '<li data-bind="text: $data" data-init="">16</li>');
  });

  it("works with a computed observable", function () {
    var target = $("<ul data-bind='foreachInit: $data'>" +
                      "<li data-bind='text: $data' data-template></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                    "</ul>");
    var list = [22, 23, 24];
    ko.applyBindings(ko.computed({read: function () { return list }}), target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data" data-init="">22</li>' + 
                                   '<li data-bind="text: $data" data-init="">23</li>' +
                                   '<li data-bind="text: $data" data-init="">24</li>');
  });

  it("applies bindings to the immediate child", function () {
    var target = $("<ul data-bind='foreachInit: $data'>" +
                      "<li data-bind='text: $data' data-template></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                    "</ul>");
    var list = ['a', 'b', 'c'];
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data" data-init="">a</li>' + 
                                   '<li data-bind="text: $data" data-init="">b</li>' +
                                   '<li data-bind="text: $data" data-init="">c</li>');
  });

  it("applies to inner children", function () {
    var target = $("<ul data-bind='foreachInit: $data'>" +
                      "<li data-template><em data-bind='text: $data'></em></li>" +
                      "<li data-init><em data-bind='text: $data'></em></li>" +
                      "<li data-init><em data-bind='text: $data'></em></li>" +
                      "<li data-init><em data-bind='text: $data'></em></li>" +
                    "</ul>");
    var list = ['a', 'b', 'c'];
    ko.applyBindings(list, target[0]);
    expect($(target).html()).to.equal('<li data-init=""><em data-bind="text: $data">a</em></li>' +
                                      '<li data-init=""><em data-bind="text: $data">b</em></li>' +
                                      '<li data-init=""><em data-bind="text: $data">c</em></li>')
  });

  it("works with virtual elements", function () {
    var target = $("<div><!-- ko foreachInit: $data -->" + 
                     "<em data-template data-bind='text: $data'></em>" +
                     "<em data-init data-bind='text: $data'></em>" +
                     "<em data-init data-bind='text: $data'></em>" +
                   "<!-- /ko --></div>")
    var list = ['A', 'B'];
    ko.applyBindings(list, target[0]);
    expect($(target).html()).to.equal('<!-- ko foreachInit: $data -->' +
                                      '<em data-init="" data-bind="text: $data">A</em>' +
                                      '<em data-init="" data-bind="text: $data">B</em>' +
                                      '<!-- /ko -->')
  });

  it("uses the name/id of a <template>", function () {
    var target = $("<ul data-bind='foreachInit: { name: \"tID\", data: $data }'>" +
                      "<li data-bind='text: $data'></li>" +
                      "<li data-bind='text: $data'></li>" +
                    "</ul>");
    var list = ['F1', 'F2'];
    var $template = $("<template id='tID'><li data-bind='text: $data'></li><!--/ko--></template>")
      .appendTo(document.body)
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data">F1</li>' + 
                                   '<li data-bind="text: $data">F2</li>');
  });

  it("uses the name/id of a <script>", function () {
    var target = $("<ul data-bind='foreachInit: { name: \"tID\", data: $data }'>" +
                      "<li data-bind='text: $data' data-init></li>" +
                      "<li data-bind='text: $data' data-init></li>" +
                    "</ul>");
    var list = ['G1', 'G2'];
    var $template = $("<script type='text/ko-template' id='tID'><li data-bind='text: $data'></li></script>")
      .appendTo(document.body)
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data" data-init="">G1</li>' + 
                                   '<li data-bind="text: $data" data-init="">G2</li>');
  });

  it("uses the name/id of a <div>", function () {
    var target = $("<ul data-bind='foreachInit: { name: \"tID2\", data: $data }'>" +
                      "<li data-bind='text: $data'></li>" +
                      "<li data-bind='text: $data'></li>" +
                    "</ul>");
    var list = ['H1', 'H2'];
    var $template = $("<div id='tID2'><li data-bind='text: $data'><!--/ko--></div>")
      .appendTo(document.body)
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data">H1</li>' + 
                                   '<li data-bind="text: $data">H2</li>');
  });

  it("does not require data-template attribute if named template is used", function () {
    var target = $("<ul data-bind='foreachInit: { name: \"tID\", data: $data }'>" +
                      "<li data-bind='text: $data'></li>" +
                      "<li data-bind='text: $data'></li>" +
                    "</ul>");
    var list = ['F1', 'F2'];
    var $template = $("<template id='tID'><li data-bind='text: $data'></li><!--/ko--></template>")
      .appendTo(document.body)
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data">F1</li>' + 
                                   '<li data-bind="text: $data">F2</li>');
  });

  it("does not require data-init attribute if named template is used", function () {
    var target = $("<ul data-bind='foreachInit: { name: \"tID\", data: $data }'>" +
                      "<li data-bind='text: $data'></li>" +
                      "<li data-bind='text: $data'></li>" +
                    "</ul>");
    var list = ['F1', 'F2'];
    var $template = $("<template id='tID'><li data-bind='text: $data'></li><!--/ko--></template>")
      .appendTo(document.body)
    ko.applyBindings(list, target[0]);
    expect(target.html()).to.equal('<li data-bind="text: $data">F1</li>' + 
                                   '<li data-bind="text: $data">F2</li>');
  });

  it("can create array elements using callback", function () {
    var target = $("<ul data-bind='foreachInit: { data: cities, createElement: createCity }'>" +
                        "<li data-bind='text: name' data-template></li>" +
                        "<li data-bind='init: name, text: name' data-init>London</li>" +
                        "<li data-bind='init: name, text: name' data-init>Paris</li>" +
                        "<li data-bind='init: name, text: name' data-init>Amsterdam</li>" +
                      "</ul>");
      var model = new ViewModel();
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<li data-bind="init: name, text: name" data-init="">London</li>' + 
                                     '<li data-bind="init: name, text: name" data-init="">Paris</li>' +
                                     '<li data-bind="init: name, text: name" data-init="">Amsterdam</li>');
      expect(model.cities()[0].name()).to.equal('London');
      expect(model.cities()[1].name()).to.equal('Paris');
      expect(model.cities()[2].name()).to.equal('Amsterdam');
  });

  describe("observable array changes", function () {
    setupSynchronousFrameAnimation();
    var div, obs, view;

    beforeEach(function () {
      div = $("<div data-bind='foreachInit: obs'>" + 
                "<i data-template data-bind='text: $data'></i>" + 
                "<i data-init data-bind='text: $data'></i>" +
              "</div>");
      obs = ko.observableArray();
      view = {obs: obs};
    });

    it("adds an item to an empty list", function () {
      ko.applyBindings(view, div[0]);
      obs(['a']);
      expect(div.text()).to.equal('a');
    });

    it("adds an item to the end of a pre-existing list", function () {
      obs(['a'])
      ko.applyBindings(view, div[0]);
      obs.push('b');
      expect(div.text()).to.equal('ab');
    });

    it("adds an item to the beginning of a pre-existing list", function () {
      obs(['a'])
      ko.applyBindings(view, div[0]);
      obs.unshift('b');
      expect(div.text()).to.equal('ba');
    });

    it("adds an item to the middle of a pre-existing list", function () {
      div = $("<div data-bind='foreachInit: obs'>" + 
                "<i data-template data-bind='text: $data'></i>" + 
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
              "</div>");
      obs(['a', 'b'])
      ko.applyBindings(view, div[0]);
      obs.splice(1, 0, 'c');
      expect(div.text()).to.equal('acb');
    });

    it("deletes the last item", function () {
      obs(['a'])
      ko.applyBindings(view, div[0]);
      obs([]);
      expect(div.text()).to.equal('');
    });

    it("deletes from the beginning", function () {
      div = $("<div data-bind='foreachInit: obs'>" + 
                "<i data-template data-bind='text: $data'></i>" + 
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
              "</div>");
      obs(['a', 'b', 'c'])
      ko.applyBindings(view, div[0]);
      obs.shift();
      expect(div.text()).to.equal('bc');
    });

    it("deletes from the beginning", function () {
      div = $("<div data-bind='foreachInit: obs'>" + 
                "<i data-template data-bind='text: $data'></i>" + 
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
              "</div>");
      obs(['a', 'b', 'c'])
      ko.applyBindings(view, div[0]);
      obs.pop();
      expect(div.text()).to.equal('ab');
    });

    it("combines multiple adds and deletes", function () {
      div = $("<div data-bind='foreachInit: obs'>" + 
                "<i data-template data-bind='text: $data'></i>" + 
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
                "<i data-init data-bind='text: $data'></i>" +
              "</div>");
      obs(['A', 'B', 'C', 'D', 'E', 'F']);
      ko.applyBindings(view, div[0]);
      obs(['x', 'B', 'C', 'D', 'z', 'F']);
      expect(div.text()).to.equal('xBCDzF');
    });

    it("processes multiple deletes", function () {
      // Per issue #6
      ko.applyBindings(view, div[0]);
      obs([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(div.text()).to.equal('0123456789');
      obs([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(div.text()).to.equal('12345678');
      obs([2, 3, 4, 5, 6, 7, 8, 9]);
      expect(div.text()).to.equal('23456789');
      obs([3, 4, 5, 6, 7, 8, 9]);
      expect(div.text()).to.equal('3456789');
      obs([2, 3, 4, 5, 6, 7, 8, 9]);
      expect(div.text()).to.equal('23456789');
      obs([6, 7, 8, 9]);
      expect(div.text()).to.equal('6789');
      obs([1, 2, 3, 6, 7, 8]);
      expect(div.text()).to.equal('123678');
      obs([0, 1, 2, 3, 4]);
      expect(div.text()).to.equal('01234');
      obs([1, 2, 3, 4]);
      expect(div.text()).to.equal('1234');
      obs([3, 4]);
      expect(div.text()).to.equal('34');
      obs([3]);
      expect(div.text()).to.equal('3');
      obs([]);
      expect(div.text()).to.equal('');
    });

    it("processes numerous changes", function () {
      ko.applyBindings(view, div[0]);
      obs([5, 6, 7, 8, 9]);
      expect(div.text()).to.equal('56789');
      obs([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(div.text()).to.equal('0123456789');
      obs(['a', 'b', 'c']);
      expect(div.text()).to.equal('abc');
    });

    it("accepts changes via a computed observable", function() {
      var target = $("<div data-bind='foreachInit: $data'>" + 
                        "<i data-template data-bind='text: $data'></i>" + 
                        "<i data-init data-bind='text: $data'></i>" +
                        "<i data-init data-bind='text: $data'></i>" +
                        "<i data-init data-bind='text: $data'></i>" +
                      "</div>");
      var toggle = ko.observable(true);
      var list1 = [1, 2, 3];
      var list2 = [1, 2, 3, 4, 5, 6];
      ko.applyBindings(ko.computed({
        read: function() { return toggle() ? list1 : list2; }
      }), target[0]);
      expect(target.text()).to.equal("123");
      toggle(false);
      expect(target.text()).to.equal("123456");
    });
  });

  describe("combined with nested initializers", function () {
    setupSynchronousFrameAnimation();
    var model;

    beforeEach(function () {
      model = new ko.observableArray();
      model.push(new CityViewModel());
      model.push(new CityViewModel());
      model.push(new CityViewModel());
    }); 

    it("works with init", function () {
      var target = $("<div data-bind='foreachInit: $data'>" +
                        "<input data-bind='value: name' data-template>" +
                        "<input data-bind='init: name' data-init type='text' value='London' />" +
                        "<input data-bind='init: name' data-init type='text' value='Paris' />" +
                        "<input data-bind='init: name' data-init type='text' value='Amsterdam' />" +
                      "</div>");
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<input data-bind="init: name" data-init="" type="text" value="London">' +
                                     '<input data-bind="init: name" data-init="" type="text" value="Paris">' +
                                     '<input data-bind="init: name" data-init="" type="text" value="Amsterdam">');
      expect(model()[0].name()).to.equal('London');
      expect(model()[1].name()).to.equal('Paris');
      expect(model()[2].name()).to.equal('Amsterdam');
    }); 

    it("works with nested init", function () {
      var target = $("<ul data-bind='foreachInit: $data'>" +
                        "<li data-template><input data-bind='value: name'></li>" +
                        "<li data-init><input data-bind='init: name' type='text' value='London' /></li>" +
                        "<li data-init><input data-bind='init: name' type='text' value='Paris' /></li>" +
                        "<li data-init><input data-bind='init: name' type='text' value='Amsterdam' /></li>" +
                      "</ul>");
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<li data-init=""><input data-bind="init: name" type="text" value="London"></li>' +
                                     '<li data-init=""><input data-bind="init: name" type="text" value="Paris"></li>' +
                                     '<li data-init=""><input data-bind="init: name" type="text" value="Amsterdam"></li>');
      expect(model()[0].name()).to.equal('London');
      expect(model()[1].name()).to.equal('Paris');
      expect(model()[2].name()).to.equal('Amsterdam');
    }); 

    it("works with init and text", function () {
      var target = $("<ul data-bind='foreachInit: $data'>" +
                        "<li data-bind='text: name' data-template></li>" +
                        "<li data-bind='init: name, text: name' data-init>London</li>" +
                        "<li data-bind='init: name, text: name' data-init>Paris</li>" +
                        "<li data-bind='init: name, text: name' data-init>Amsterdam</li>" +
                      "</ul>");
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<li data-bind="init: name, text: name" data-init="">London</li>' + 
                                     '<li data-bind="init: name, text: name" data-init="">Paris</li>' +
                                     '<li data-bind="init: name, text: name" data-init="">Amsterdam</li>');
      expect(model()[0].name()).to.equal('London');
      expect(model()[1].name()).to.equal('Paris');
      expect(model()[2].name()).to.equal('Amsterdam');
    }); 

    it("works with init and value", function () {
      var target = $("<div data-bind='foreachInit: $data'>" +
                        "<input data-bind='value: name' data-template />" +
                        "<input data-bind='init: name, value: name' data-init type='text' value='London' />" +
                        "<input data-bind='init: name, value: name' data-init type='text' value='Paris' />" +
                        "<input data-bind='init: name, value: name' data-init type='text' value='Amsterdam' />" +
                      "</div>");
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<input data-bind="init: name, value: name" data-init="" type="text" value="London">' +
                                     '<input data-bind="init: name, value: name" data-init="" type="text" value="Paris">' +
                                     '<input data-bind="init: name, value: name" data-init="" type="text" value="Amsterdam">');
      expect(model()[0].name()).to.equal('London');
      expect(model()[1].name()).to.equal('Paris');
      expect(model()[2].name()).to.equal('Amsterdam');
    }); 

    it("works with init and nested virtual element", function () {
      var target = $("<ul data-bind='foreachInit: $data'>" +
                        "<li data-template></li>" +
                        "<li data-init><!-- ko init: { field: name } -->London<!--/ko--></li>" +
                        "<li data-init><!-- ko init: { field: name } -->Paris<!--/ko--></li>" +
                        "<li data-init><!-- ko init: { field: name } -->Amsterdam<!--/ko--></li>" +
                      "</ul>");
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<li data-init=""><!-- ko init: { field: name } -->London<!--/ko--></li>' +
                                     '<li data-init=""><!-- ko init: { field: name } -->Paris<!--/ko--></li>' +
                                     '<li data-init=""><!-- ko init: { field: name } -->Amsterdam<!--/ko--></li>');
      expect(model()[0].name()).to.equal('London');
      expect(model()[1].name()).to.equal('Paris');
      expect(model()[2].name()).to.equal('Amsterdam');
    }); 

    it("works with init and template", function () {
      var target = $("<div data-bind='foreachInit: { name: \"tID2\", data: $data }'>" +
                        "<input data-bind='init: name, value: name' data-init type='text' value='London' />" +
                        "<input data-bind='init: name, value: name' data-init type='text' value='Paris' />" +
                        "<input data-bind='init: name, value: name' data-init type='text' value='Amsterdam' />" +
                      "</div>");
      var $template = $("<input data-bind='value: name' data-template />")
        .appendTo(document.body)
      ko.applyBindings(model, target[0]);
      expect(target.html()).to.equal('<input data-bind="init: name, value: name" data-init="" type="text" value="London">' +
                                     '<input data-bind="init: name, value: name" data-init="" type="text" value="Paris">' +
                                     '<input data-bind="init: name, value: name" data-init="" type="text" value="Amsterdam">');
      expect(model()[0].name()).to.equal('London');
      expect(model()[1].name()).to.equal('Paris');
      expect(model()[2].name()).to.equal('Amsterdam');
    });
  });
});