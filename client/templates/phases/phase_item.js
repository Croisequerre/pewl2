Template.phaseItem.helpers({
	ownPhase: function() {
		return this.userId === Meteor.userId();
	},
	hasPoules: function() {
		return Poules.find({phaseId: this._id}).count() > 0;
	},
	poules: function() {
		return Poules.find({phaseId: this._id});
	},
	hasClassement: function() {
		return Classements.find({phaseId: this._id}).count() > 0;
	},
	classement: function() {
		return Classements.findOne({phaseId: this._id});
	}
});

Template.phaseItem.events({
	'click .poule-creer': function(e, template) {
		e.preventDefault();
		var pouleName = prompt("Entrez le nom de la poule", "Poule");

		// Ajouter des vérifications sur le nom, notamment
		// sur l'existence d'autres phases portant le même
		// nom dans l'événement
		if (pouleName) {
			var poule = {
				name: pouleName,
				phaseId: template.data._id
			};

		    Meteor.call('pouleInsert', poule, function(error, pouleId) {
		      	if (error){
		        	throwError(error.reason);
		      	}
		    });
		}
	},
	'click .classement-creer': function(e, template) {
		e.preventDefault();

	    Meteor.call('classementCreate', template.data._id, function(error, pouleId) {
	      	if (error){
	        	throwError(error.reason);
	      	}
	    });
	}
});