// Collection locale (donc le nom à null) pour stocker
// les erreurs à afficher au client, et à lui 
// seulement.
Errors = new Meteor.Collection(null);

throwError = function(msg) {
	Errors.insert({message: msg});
};

// Permet d'afficher plusieurs erreurs d'un seul coup.
// Les erreurs doivent être envoyées sous forme d'objet.
throwErrors = function(obj) {
	for (o in obj) {
		Errors.insert({message: obj[o]});
	}
};
