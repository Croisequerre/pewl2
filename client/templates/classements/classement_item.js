Template.classementItem.helpers({
	results: function() {
		var c = Classements.findOne({phaseId: this._id}); 
		return c.tireurs;
	}
});

Template.classementItem.events({
    "click .classement-delete": function () {
    	// Attention : this._id est l'id de la phase (pas encore compris pourquoi)
      Meteor.call("classementDelete", this._id);
    },
    "click .classement-recalculate": function () {
    	// Attention : this._id est l'id de la phase (pas encore compris pourquoi)
      Meteor.call("classementRecalculate", this._id);
    }
});