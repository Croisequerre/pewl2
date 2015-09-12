Classements = new Mongo.Collection('classements');

Meteor.methods({
  classementCreate: function(phaseId) {
    check(this.userId, String);
    check(phaseId, String);

    var user = Meteor.user();
    var phase = Phases.findOne({_id:phaseId});

    if (!phase)
      throw new Meteor.Error('invalid-classement', 'Le classement doit appartenir à une phase');

  	// Si la phase possède déjà un classement, on refuse aussi : un seul
  	// classement par phase
  	if (Classements.findOne(phaseId))
		throw new Meteor.Error('invalid-classement', 'Cette phase possède déjà un classement');

  	// Enfin on crée le classement
  	// On passe en revue tous les tireurs de la phase (toutes poules confondues)
  	var poules = Poules.find({phaseId: phaseId}).fetch();
  	var tab = new Array();
  	for (var i=0; i<poules.length; i++) {
  		for (var j=0; j<poules[i].entries.length; j++) {
	  		tab.push({
	  			name: poules[i].entries[j].tireur,
	  			pv: poules[i].entries[j].pv,
	  			ga: poules[i].entries[j].ga
	  		});
  		}
  	}

  	// Une fois qu'on a tous les tireurs, on les trie
    tab.sort(function(a, b) {
      if (a.pv != b.pv) return b.pv-a.pv;
      // sinon
      return b.ga-a.ga;
    });

  	classement = {
  		phaseId: phaseId,
	    creatorId: user._id,
	    tireurs: tab,
  		createdAt: new Date()
  	};

    return Classements.insert(classement);
  },
  classementDelete: function(id) {
  	check(id, String);

  	Classements.remove({phaseId:id});
  }
});