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
    $('#modalScore').modal('show');

    // Le traitement de la saisie a lieu dans modal_score.js
  }
});

Template.tableentry.events({
  "click .edit-name": function(e, template) {
    var oldName = e.target.innerHTML.trim();

    // On récupère la poule dans laquelle se trouve le tireur que 
    // l'on souhaite renommer
    // Afin de récupérer son n° de poule
    // BOF : est-ce vraiment utile de le faire ici ???
    var p = Poules.find({"entries.id":this.id}).fetch();
    $('#modalRenameTireur').data("poule-id",p[0]._id);
    $('#modalRenameTireur').data("tireur-id",this.id);
    $('#modalRenameTireur').data("old-name",oldName);
    $('#modalRenameTireur').data("dialog-title","Renommer le tireur");
    $('#modalRenameTireur').data("action","renameTireur");
    $('#modalRenameTireur').modal('show');

    // Le traitement de la saisie a lieu dans modal_rename_tireur.js
  }
});

Template.tabletitles.helpers({
  scoreTitles: function() {
    var p = Poules.find({_id:this._id}).fetch();
    var n = p[0].entries.length;
    var tab = new Array();
    for (var i=0; i<n; i++) {
      tab.push(""+(i+1));
    }
    return tab;
  }
});

Template.tableentry.helpers({
  isDiese: function(val) {
    return (val === "#");
  },
  isDone: function(state) {
    return (val !== "-");
  }
});