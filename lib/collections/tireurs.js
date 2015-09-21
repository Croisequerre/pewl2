Tireurs = new Mongo.Collection('tireurs');

Meteor.methods({
	insertTireur: function(attributes) {
		// On vérifie que les paramètres sont corrects
		// avec les méthodes de audit-argument-checks
		check(Meteor.userId(), String);
		check(attributes, {
			nom: String,
			prenom: String,
			naissance: String,
			licence: Number,
			sexe: String
		});

		// On teste du côté du serveur aussi si les données
		// fournies sont bien fournies
		var errors = validateTireur(attributes);
    	if (errors.nom || errors.prenom || errors.licence || errors.naissance || errors.sexe)
			throw new Meteor.Error('invalid-tireur', "Les informations de création du tireur sont incorrectes.");

		// On va vérifier qu'un tireur avec le même couple avec le même 
		// couple nom/prénom n'existe pas déjà
		var tireurExistant = Tireurs.findOne({nom: attributes.nom, prenom: attributes.prenom});
		if (tireurExistant) {
			return {
				tireurExists: true,
				_id: tireurExistant._id
			};
		}

		var user = Meteor.user();
		// Permet d'étendre un objet avec les propriétés
		// d'un autre (librairie Underscore)
		var tireur = _.extend(attributes, {
			authorId: user._id,
			createdAt: new Date()
		});

		var tireurId = Tireurs.insert(tireur);

		return {
			_id: tireurId
		};
	}
});

// Cette méthode permet de regarder l'objet event et de 
// renvoyer un objet contenant toutes les erreurs pertinentes
validateTireur = function(tireur) {
	var errors = {};

	if (!tireur.nom)
		errors.nom = "Le tireur ne possède pas de nom";

	if (!tireur.prenom)
		errors.prenom = "Le tireur ne possède pas de prénom";

	if (!tireur.licence)
		errors.licence = "Veuillez entrer le n° de licence";

	if (!tireur.naissance)
		errors.naissance = "La date de naissance est incorrecte";

	if (!tireur.sexe)
		errors.sexe = "Le tireur a besoin d'un sexe !";

	return errors;
}