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
	},
	phasesNames: function() {
		var phases = Phases.find({eventId: this._id}).fetch();
		var noms = new Array();
		for (var i=0; i<phases.length; i++) {
			noms.push({
				nom: phases[i].name
			});
		}
		return noms;
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
	},
	'click #inscrire-tireurs': function(e, template) {
		e.preventDefault();

		// Stockage de l'id de l'événement dans les data de la modale
		$('#modalSubscribeTireurs').data('event-id', template.data._id);
		// Ouverture de la fenêtre modale d'ajout de tireurs
		$('#modalSubscribeTireurs').modal('show');
	}
});

// Permet d'afficher par défaut le premier onglet des phases
// Ne marche pas tout le temps.
// TODO : trouver pourquoi et faire en sorte que ça fonctionne.
Template.eventDetail.rendered = function() {
	$("#phases-tab a:first").tab('show');
};