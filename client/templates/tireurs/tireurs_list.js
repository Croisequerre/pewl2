Template.tireursList.helpers({
	tireurs: function() {
		// Renvoie tous les tireurs par ordre alphabétique de NOM
		return Tireurs.find({}, {sort: {nom: 1}});
	}
});

Template.tireursList.events({
	'click #tireur-add': function(e) {
		e.preventDefault();

		$('#modalAddTireur').modal('show');
	},
	// TEMP
	'click #random-tireur-add': function(e) {
		e.preventDefault();
		// Permet d'ajouter un tireur aléatoire dans la liste
		Meteor.call("createRandomTireur");

	}
});