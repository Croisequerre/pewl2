Template.poule.events({
  "click .toggle-editable": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setPouleEditable", this._id, !this.editable);
  },
  "click .poule-delete": function () {
    Meteor.call("deletePoule", this._id);
  },
  "click .btn-ajout-tireur": function(e) {
    $('#modalRenameTireur').data("poule-id",this._id);
    $('#modalRenameTireur').data("dialog-title","Créer le tireur");
    $('#modalRenameTireur').data("action","addTireur");
    $('#modalRenameTireur').data("old-name","");
    $('#modalRenameTireur').modal('show');

    // Le traitement de la saisie a lieu dans modal_rename_tireur.js
  },
  "click .btn-score": function() {
    //var score = prompt("Entrez un score : ", "j1,j2,score1,score2");
    $('#modalScore').data("poule-id",this._id);
    $('#modalScore').data("tireur-jaune","");
    $('#modalScore').data("tireur-bleu","");
    $('#modalScore').modal('show');

    // Le traitement de la saisie a lieu dans modal_score.js
  },
  "click .cell-click-score": function(e, template) {
    var t = e.target.id.split("-");
    $('#modalScore').data("poule-id",template.data._id);
    $('#modalScore').data("tireur-jaune",t[1]);
    $('#modalScore').data("tireur-bleu",t[2]);
    $('#modalScore').modal('show');
  },
  'mouseover .cell-click-score': function (e, template) {
    var t = e.target.id.split("-");
    $('#'+t[0]+'-'+t[1]+'-'+t[2]).removeClass('case-blanche').addClass('case-bleue');
    $('#'+t[0]+'-'+t[2]+'-'+t[1]).removeClass('case-blanche').addClass('case-bleue');    
  },
  'mouseout .cell-click-score': function (e, template) {
    var t = e.target.id.split("-");
    $('#'+t[0]+'-'+t[1]+'-'+t[2]).removeClass('case-bleue').addClass('case-blanche');
    $('#'+t[0]+'-'+t[2]+'-'+t[1]).removeClass('case-bleue').addClass('case-blanche');    
  }
});

Template.poule.helpers({
  formatedEntries: function() {
    var p = Poules.findOne({_id:this._id});
    var tab = new Array();

    // Pour les entêtes, on crée une ligne spéciale
    var cols = new Array();
    var n = p.entries.length;

    for (var i=0; i<n; i++) {
      cols.push({
        val: ""+(i+1),
        lig: "0",
        col: ""+(i+1),
        state: ""
      });
    }
    tab.push({
      index: "",
      id: "id",
      tireur: "Nom",
      results: cols,
      ratio: "Co.",
      pv: "PV",
      td: "TD",
      tr: "TR",
      ga: "GA",
      place: "Pl."
    });

    // Ensuite, on remplit le tableau avec les données
    // On "étend" les results du tableau en leur ajoutant une ligne et une colonne
    for (var i=0; i<n; i++) {
      for (var j=0; j<p.entries[i].results.length; j++) {
        p.entries[i].results[j] = _.extend(p.entries[i].results[j], {
          pouleId: p._id,
          lig: ""+(i+1),
          col: ""+(j+1)
        });
      }
      var t = Tireurs.findOne({_id:p.entries[i].tireur});
      tab.push({
        index: ""+(i+1),
        id: p.entries[i].id,
        tireurId: p.entries[i].tireur,
        tireur: t,
        results: p.entries[i].results,
        ratio: p.entries[i].ratio,
        pv: p.entries[i].pv,
        td: p.entries[i].td,
        tr: p.entries[i].tr,
        ga: p.entries[i].ga,
        place: p.entries[i].place
      });
    }
    return tab;
  },
  isDiese: function(val) {
    return (val === "#");
  },
  isDone: function(state) {
    return (val !== "-");
  },
  isFirstLine: function(lineNumber) {
    return (lineNumber === "");
  },
  isNotFirstLineInResults: function(lineNumber) {
    return (lineNumber !== "0");
  },
  isFirstColInResults: function(colNumber) {
    return (colNumber === "1");
  }
});