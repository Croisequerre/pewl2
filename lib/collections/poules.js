Poules = new Mongo.Collection('poules');



Meteor.methods({
  pouleInsert: function(pouleAttributes) {
    check(this.userId, String);
    check(pouleAttributes, {
      name: String,
      phaseId: String
    });

    var user = Meteor.user();
    var phase = Phases.findOne(pouleAttributes.phaseId);

    if (!phase)
      throw new Meteor.Error('invalid-poule', 'La poule doit appartenir à une phase');

    poule = _.extend(pouleAttributes, {
      userId: user._id,
      author: user.username,
      createdAt: new Date(),
      editable: true,
      points: {
        victoire: 3,
        nul: 2,
        defaite: 1,
        forfait: 0
      },
      entries: new Array() // Les lignes seront stockées dedans
    });

    return Poules.insert(poule);
  },
  deletePoule: function(pouleId) {
    check(pouleId, String);

    Poules.remove(pouleId);
  },
  setPouleEditable: function(pouleId, setEditable) {
    check(pouleId, String);
    check(setEditable, Boolean);

      Poules.update(pouleId, {
        $set: {editable: setEditable}
      });
  },
  addTireur: function(pouleId, nom) {
    check(pouleId, String);
    check(nom, String);

    var poule = Poules.find({_id: pouleId}).fetch();
    // Le nombre de tireurs (qui vaudra aussi le nombre de colonnes)
    var n = poule[0].entries.length;

    // On commence par ajouter une case supplémentaire à chaque tireur
    for (var i=0; i<n; i++) {
      var tid = poule[0].entries[i].id;
      Poules.update({_id:pouleId, "entries.id": tid}, {
        "$push": { "entries.$.results" : { cellId: n, state: "-", val: 0 } }
      });
    }

    // Puis on crée l'entrée supplémentaire
    var res = new Array();
    var id = "";
    for (var i=0; i<n; i++) {
      id = i;
      res.push({
        cellId: id,
        state: "-",
        val: 0
      });
    }
    res.push({
      cellId: n,
      state: "-",
      val: "#"
    });

    var entry = {
      id: Math.floor((Math.random() * 100000000000) + 1),
      tireur: nom,
      results: res,
      ratio: 1,
      pv: 0,
      td: 0,
      tr: 0,
      ga: 0,
      place: 0
    };
    
    // On ajoute la ligne du nouveau tireur
    Poules.update({ _id: pouleId }, {
      "$push": { entries: entry }
    });

    Meteor.call("calculeScore", pouleId);

  },
  renameTireur: function(pouleId, tid, newName) {
    check(pouleId, String);
    check(pouleId, int);
    check(newName, String);

    Poules.update({_id: pouleId, "entries.id": tid}, {
      "$set": { "entries.$.tireur" : newName }
    });
  },
  setScore: function(pouleId, t1, t2, scoret1, scoret2) {
    check(pouleId, String);
    check(t1, String);
    check(t2, String);
    check(scoret1, String);
    check(scoret2, String);

    var poule = Poules.find({_id: pouleId}).fetch();
    // Attention, MEGABIDOUILLE
    // cf. http://christian.fei.ninja/updating-dynamic-fields-and-nested-arrays-in-mongodb/
    var setObject = {};
    setObject["entries."+(parseInt(t1)-1)+".results."+(parseInt(t2)-1)+".val"] = parseInt(scoret1);
    var state = Meteor.call("getState", scoret1, scoret2);
    setObject["entries."+(parseInt(t1)-1)+".results."+(parseInt(t2)-1)+".state"] = state;
    setObject["entries."+(parseInt(t2)-1)+".results."+(parseInt(t1)-1)+".val"] = parseInt(scoret2);
    state = Meteor.call("getState", scoret2, scoret1);
    setObject["entries."+(parseInt(t2)-1)+".results."+(parseInt(t1)-1)+".state"] = state;
    Poules.update({ "_id": pouleId }, {
      "$set": setObject
    }, function(err, doc) {
      console.log(err,doc);
    });

    Meteor.call("calculeScore", pouleId);
  },
  getState: function(s1, s2) {
    check(s1, String);
    check(s2, String);

    if (parseInt(s1) > parseInt(s2)) return "v";
    else if (parseInt(s1) < parseInt(s2)) return "d";
    else return "n";
  },
  calculeScore: function(pouleId) {
  	check(pouleId, String);

    var poule = Poules.find({_id: pouleId}).fetch();

    // Le nombre de tireurs (qui vaudra aussi le nombre de colonnes)
    var n = poule[0].entries.length;

    // On commence par ajouter une case supplémentaire à chaque tireur
    var pv, td, tr;
    for (var i=0; i<n; i++) {
      var tid = poule[0].entries[i].id;
      
      td = 0;
      pv = 0;
      for (var j=0; j<n; j++) {
        // Quand i==j, on a un "#" dans le tableau
        if (i != j) {
          td += poule[0].entries[i].results[j].val;

          // Calcul des points de victoire
          // Seulement si le match a eu lieu (pas de calcul si l'état dit "-")
          if (poule[0].entries[i].results[j].state !== "-") {
            if (poule[0].entries[i].results[j].val > poule[0].entries[j].results[i].val)
              pv += poule[0].points.victoire;
            else if (poule[0].entries[i].results[j].val == poule[0].entries[j].results[i].val)
              pv += poule[0].points.nul;
            else if (poule[0].entries[i].results[j].val < poule[0].entries[j].results[i].val)
              pv += poule[0].points.defaite;
          }
        }
      }
      tr = 0;
      for (var j=0; j<n; j++) {
        // Quand i==j, on a un "#" dans le tableau
        if (i != j)
          tr += poule[0].entries[j].results[i].val;
      }
      //console.log("Pour le tireur "+tid+log+" = "+td+" | "+logTr+" = "+tr);
      Poules.update({_id:pouleId, "entries.id": tid}, {
        "$set": { 
          "entries.$.td" : td,
          "entries.$.tr" : tr,
          "entries.$.ga" : (td-tr),
          "entries.$.pv" : pv,
        }
      });
    }

    Meteor.call("calculePlace", pouleId); 

  },
  calculePlace: function(pouleId) {
    check(pouleId, String);

    // La poule dans laquelle va être calculé le classement
    var poule = Poules.find({_id: pouleId}).fetch();

    // Le nombre de tireurs
    var n = poule[0].entries.length;

    var t = new Array();
    for (var i=0; i<n; i++) {
      t.push({
        id: poule[0].entries[i].id,
        pv: poule[0].entries[i].pv,
        ga: poule[0].entries[i].ga
      });
    }
    // Le classement se fait par PV puis par GA
    // Attention, en cas de GA égaux, aucun classement
    // supplémentaire n'est réalisé
    t.sort(function(a, b) {
      if (a.pv != b.pv) return b.pv-a.pv;
      // sinon
      return b.ga-a.ga;
    });

    for (var i=0; i<n; i++) {
      Poules.update({_id:pouleId, "entries.id": t[i].id}, {
        "$set": { 
          "entries.$.place" : (i+1)
        }
      });
    }
  }
});