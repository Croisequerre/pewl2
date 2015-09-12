Template.errors.helpers({
	errors: function() {
		return Errors.find();
	}
});

// Supprime les erreurs de la base au bout de 3 secondes
// onRendered est déclenché une fois le template interprété
// par le navigateur ; this.data permet d'accéder aux données
// de l'objet en cours d'interprétation (l'erreur dans ce cas).
Template.error.onRendered(function() {
	var error = this.data;
	Meteor.setTimeout(function() {
		Errors.remove(error._id);
	}, 3000);
});