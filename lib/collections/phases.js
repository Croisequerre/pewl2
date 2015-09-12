Phases = new Mongo.Collection('phases');

Meteor.methods({
  phaseInsert: function(phaseAttributes) {
    check(this.userId, String);
    check(phaseAttributes, {
      name: String,
      eventId: String
    });

    var user = Meteor.user();
    var ev = Events.findOne(phaseAttributes.eventId);

    if (!ev)
      throw new Meteor.Error('invalid-phase', 'La phase doit appartenir à un événement');

    phase = _.extend(phaseAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    return Phases.insert(phase);
  }
});