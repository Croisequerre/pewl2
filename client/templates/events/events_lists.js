Template.eventsList.helpers({
	events: function() {
		return Events.find({}, {sort: {createdAt: -1}});
	}
});