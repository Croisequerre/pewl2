Template.eventEdit.onCreated(function() {
	Session.set('eventEditErrors', {});
});

Template.eventEdit.helpers({
	errorMessage: function(field) {
		return Session.get('eventEditErrors')[field];
	},
	errorClass: function(field) {
		return !!Session.get('eventEditErrors')[field] ? 'has-error':'';
	}
});

Template.eventEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentEventId = this._id;

		var eventProperties = {
			name: $(e.target).find('[name=name]').val(), 
			url: $(e.target).find('[name=url]').val()
		}

		// On vérifie que les champs sont bien remplis
		var errors = validateEvent(eventProperties);
		if(errors.name || errors.url)
			return Session.set('eventEditErrors', errors);

		Events.update(currentEventId, {$set: eventProperties}, function(error) {
			if (error) {
				// Affiche l'erreur à l'utilisateur
				throwError(error.reason);
			} else {
				Router.go('eventPage', {_id: currentEventId});
			}
		})
	},

	'click .delete': function(e) {
		e.preventDefault();
		if (confirm("Supprimer cet événement ?")) {
			var currentEventId = this._id;
			Events.remove(currentEventId);
			Router.go('eventsList');
		}
	}
});