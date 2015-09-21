Template.tireurItem.helpers({
	ownTireur: function() {
		return this.userId === Meteor.userId();
	}
});