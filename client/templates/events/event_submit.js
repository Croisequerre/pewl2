Template.eventSubmit.onCreated(function() {
	Session.set('eventSubmitErrors', {});
});

Template.eventSubmit.helpers({
	errorMessage: function(field) {
		return Session.get('eventSubmitErrors')[field];
	},
	errorClass: function(field) {
		return !!Session.get('eventSubmitErrors')[field] ? 'has-error':'';
	}
});

Template.eventSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		// Création de l'événement avec les données saisies par l'utilisateur
		var ev = {
			name: $(e.target).find('[name=name]').val(),
			url:  $(e.target).find('[name=url]').val()
		};

		// On passe par la moulinette de validation
		// Si on y trouve des erreurs, on envoie tous dans
		// la variable de session qui permettra de mettre
		// à jour les champs de saisie.
		var errors = validateEvent(ev);
		if (errors.name || errors.url)
			// return sert plus à interrompre l'exécution
			// qu'à renvoyer une erreur
			return Session.set('eventSubmitErrors', errors);

		Meteor.call('eventInsert', ev, function(error, result) {
			// Affiche l'errreur à l'utilisateur et s'interrompt
			if (error)
				return throwError(error.reason);

			if (result.eventExists)
				throwError('Un événement avec le même nom existe déjà.');

			// Et le routeur enverra ensuite sur l'id du nouvel
			// événement ou de l'événement qui existe déjà.
			Router.go('eventPage', {_id: result._id});
		});
	}
});