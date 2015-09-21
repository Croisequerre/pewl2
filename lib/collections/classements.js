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
        var t = Tireurs.findOne({_id:poules[i].entries[j].tireur});
	  		tab.push({
          tId: t._id,
	  			name: (t.nom+' '+t.prenom),
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

    // Une fois le tri effectué, on attribue la place à chacun
    for (var i=0; i<tab.length; i++) {
      tab[i].place = (i+1);
    }

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
  },  
  classementRecalculate: function(phaseId) {
    check(phaseId, String);

    // On passe en revue tous les tireurs de la phase (toutes poules confondues)
    var classement = Classements.findOne({phaseId: phaseId});
    if (!classement)
      throw new Meteor.Error('invalid-classement', "Ce classement n'existe pas");

    var poules = Poules.find({phaseId: phaseId}).fetch();
    if (poules.length == 0)
      throw new Meteor.Error('invalid-phase', 
        "Problème lors de la récupération des poules de la phase "+phaseId);

    var tab = new Array();
    for (var i=0; i<poules.length; i++) {
      for (var j=0; j<poules[i].entries.length; j++) {
        var t = Tireurs.findOne({_id:poules[i].entries[j].tireur});
        tab.push({
          tId: t._id,
          name: t.nom+" "+t.prenom,
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

    // Une fois le tri effectué, on attribue la place à chacun
    for (var i=0; i<tab.length; i++) {
      tab[i].place = (i+1);
    }
    
    properties = {
      tireurs: tab,
      modifiedAt: new Date()
    };

    Classements.update(classement._id, {$set: properties}, function(error) {
      if (error) {
        // Affiche l'erreur à l'utilisateur
        throwError(error.reason);
      } 
    })


  }
});