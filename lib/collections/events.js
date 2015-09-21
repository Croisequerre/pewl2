Events = new Mongo.Collection('events');

Meteor.methods({
	eventInsert: function(eventAttributes) {
		// On vérifie que les paramètres sont corrects
		// avec les méthodes de audit-argument-checks
		check(Meteor.userId(), String);
		check(eventAttributes, {
			name: String,
			url: String
		});

		// On teste du côté du serveur aussi si les données
		// fournies sont bien fournies
		var errors = validateEvent(eventAttributes);
		if (errors.name || errors.url) 
			throw new Meteor.Error('invalid-event', "Vous devez fournir un nom et une url à votre événement.");

		// On va vérifier qu'un événement avec le même nom
		// n'existe pas déjà
		var eventWithSameName = Events.findOne({name: eventAttributes.name});
		if (eventWithSameName) {
			return {
				eventExists: true,
				_id: eventWithSameName._id
			};
		}

		var user = Meteor.user();
		// Permet d'étendre un objet avec les propriétés
		// d'un autre (librairie Underscore)
		var ev = _.extend(eventAttributes, {
			tireurs: new Array(),
			userId: user._id,
			author: user.username,
			createdAt: new Date()
		});

		var eventId = Events.insert(ev);

		return {
			_id: eventId
		};
	},
	subscribeTireur: function(args) {
		// On vérifie que les paramètres sont corrects
		// avec les méthodes de audit-argument-checks
		check(Meteor.userId(), String);
		check(args, {
			eventId: String,
			tireurId: String
		});	

		// On va vérifier que l'événement et que le tireurs existent bien
		// n'existe pas déjà
		var ev = Events.findOne({_id: args.eventId});
		if (!ev)
			throw new Meteor.Error('invalid-event', "L'événement demandé n'existe pas");
		var t = Tireurs.findOne({_id: args.tireurId});
		if (!t)
			throw new Meteor.Error('invalid-tireur', "Le tireur spécifié n'existe pas");

		// Il faut également vérifier que le tireur n'est pas déjà inscrit !!
		var tInscrit = Events.findOne({ _id: args.eventId , tireurs: {_id : args.tireurId}});
		if (tInscrit)
			throw new Meteor.Error('invalid-tireur', "Le tireur est déjà dans la liste");

		//var user = Meteor.user();
		Events.update({_id: args.eventId}, {
			"$push": { tireurs: { _id : args.tireurId } }
		});

	},
	unsubscribeTireur: function(args) {
		// On vérifie que les paramètres sont corrects
		// avec les méthodes de audit-argument-checks
		check(Meteor.userId(), String);
		check(args, {
			eventId: String,
			tireurId: String
		});	

		// On va vérifier que l'événement et que le tireurs existent bien
		// n'existe pas déjà
		var ev = Events.findOne({_id: args.eventId});
		if (!ev)
			throw new Meteor.Error('invalid-event', "L'événement demandé n'existe pas");
		var t = Tireurs.findOne({_id: args.tireurId});
		if (!t)
			throw new Meteor.Error('invalid-tireur', "Le tireur spécifié n'existe pas");

		// Il faut également vérifier que le tireur est bien inscrit !!
		var tInscrit = Events.findOne({ _id: args.eventId , tireurs: {_id : args.tireurId}});
		if (!tInscrit)
			throw new Meteor.Error('invalid-tireur', "Ce tireur n'est oas dans la liste, il ne peut pas en être retiré");

		Events.update({_id: args.eventId}, {
			"$pull": { tireurs: { _id : args.tireurId } }
		});
	}
});

// Insert passe par une Méthode du serveur, donc n'a pas besoin
// de allow(). Par contre update et remove en ont besoin.
Events.allow({
	update: function(userId, ev) { return ownsDocument(userId, ev); },
	remove: function(userId, ev) { return ownsDocument(userId, ev); }
});

Events.deny({
	// NB : il faudrait aussi vérifier que 'name' n'existe pas déjà (comme)
	// pour l'insert, auquel cas il faudrait aussi une méthode pour update.
	update: function(userId, ev, fieldNames) {
		// L'utilisateur ne pourra modifier que les champs suivants: nom et url
		// without() va retirer les deux champs en question et ne laissera qu'un
		// tableau vide. En revanche, si l'utilisateur bidouille et
		// ajoute d'autres champs, la longueur sera plus grande que
		// 0 et la mise à jour renverra 'false', donc une erreur
		return (_.without(fieldNames, 'url', 'name').length > 0);
	}
});
Events.deny({
	update: function(userId, ev, fieldNames, modifier) {
		var errors = validateEvent(modifier.$set);
		return (errors.name || errors.url);
	}
});
// Cette méthode permet de regarder l'objet event et de 
// renvoyer un objet contenant toutes les erreurs pertinentes
validateEvent = function(ev) {
	var errors = {};

	if (!ev.name)
		errors.name = "Merci de donner un nom à votre événement";

	if (!ev.url)
		errors.url = "Merci de fournir une URL";

	return errors;
}