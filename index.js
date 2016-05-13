var path = require('path');

module.exports = {
  name: 'ember-data-factory-guy',

  included: function(app) {
    this._super.included(app);
    this.app = app;
  },

  treeFor: function(name) {
    if(this.app.tests) {
      return this._super.treeFor.apply(this, arguments);
    }
  }
};
