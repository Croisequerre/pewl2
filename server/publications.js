// Sécurité : ne pas oublier d'autoriser la publication
// des différentes collections

Meteor.publish('events', function() {
	return Events.find();
});

Meteor.publish('phases', function() {
	return Phases.find();
});

Meteor.publish('poules', function() {
	return Poules.find();
});

Meteor.publish('classements', function() {
	return Classements.find();
});

Meteor.publish('tireurs', function() {
	return Tireurs.find();
});
