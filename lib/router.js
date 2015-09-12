// Description du layout par défaut
Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { 
		return [
			Meteor.subscribe('events'),
			Meteor.subscribe('phases'),
			Meteor.subscribe('poules'),
			Meteor.subscribe('classements')
		];
	}
});

// Nouvelle route assignée à la racine
Router.route('/', {name: 'eventsList'});

// La gestion des pages des événements
Router.route('/events/:_id', {
	name: 'eventPage',
	data: function() { return Events.findOne(this.params._id); }
});

// La gestion des pages de modification des événements
Router.route('/events/:_id/edit', {
	name: 'eventEdit',
	data: function() { return Events.findOne(this.params._id); }
});

// On envoie vers eventSubmit quand on reçoit '/submit'
Router.route('/submit', {name: 'eventSubmit'});

// La fonction qui va vérifier si un utilisateur est bien enregistré
var requireLogin = function() {
	if (!Meteor.user()) {
		// Si l'utilisateur est en train de se connecter,
		// on n'affiche pas tout de suite le gros message d'erreur
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render('accessDenied');
		}
	} else {
		this.next();
	}
}

// Iron Router affiche une page "non trouvée" 
// en cas de route valide ('/events/98YHDU86T') mais sans donnée
Router.onBeforeAction('dataNotFound', {only: 'eventPage'});
// Ne pourront créer des événements que les utilisateurs enregistrés
Router.onBeforeAction(requireLogin, {only: 'eventSubmit'});