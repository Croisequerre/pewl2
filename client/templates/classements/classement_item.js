Template.classementItem.helpers({
	results: function() {
		var c = Classements.findOne({phaseId: this._id}); 
		return c.tireurs;
	}
});

Template.classementItem.events({
    "click .classement-delete": function () {
    	// Attention : this._id est l'id de la phase
      Meteor.call("classementDelete", this._id);
    }
});