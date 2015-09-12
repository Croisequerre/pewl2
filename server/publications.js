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
