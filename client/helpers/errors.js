// Collection locale (donc le nom à null) pour stocker
// les erreurs à afficher au client, et à lui 
// seulement.
Errors = new Meteor.Collection(null);

throwError = function(msg) {
	Errors.insert({message: msg});
};