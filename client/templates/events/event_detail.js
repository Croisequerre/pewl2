Template.eventDetail.helpers({
	ownPost: function() {
		return this.userId === Meteor.userId();
	},
	domain: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},
	hasPhases: function() {
		return Phases.find({eventId: this._id}).count() > 0;
	},
	phases: function() {
		return Phases.find({eventId: this._id});
	}
});

Template.eventDetail.events({
	'click .phase-creer': function(e, template) {
		e.preventDefault();
		var phaseName = prompt("Entrez le nom de la nouvelle phase", "Phase");

		// Ajouter des vérifications sur le nom, notamment
		// sur l'existence d'autres phases portant le même
		// nom dans l'événement
		if (phaseName) {
			var phase = {
				name: phaseName,
				eventId: template.data._id
			};

		    Meteor.call('phaseInsert', phase, function(error, phaseId) {
		      	if (error){
		        	throwError(error.reason);
		      	}
		    });
		}
	}
});