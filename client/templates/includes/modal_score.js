/* Pas besoin pour l'instant. Cf. plus tard avec les dropdown
Template.modalScore.helpers({
  tireursInPoule: function() {
    var pouleId = $("#modalScore").data("poule-id");

    var p = Poules.find({_id:pouleId}).fetch();
    var n = p[0].entries.length;
    var tab = new Array();
    for (var i=0; i<n; i++) {
      tab.push({
        id: p[0].entries[i].id,
        name: p[0].entries[i].tireur
      });
    }
    return tab;
  }
});
*/

Template.modalScore.events({
  'submit #form-score': function(e) {
    e.preventDefault();
    // On simule à la place du submit un clic sur le bouton
    $("#save-score").click();
  },
  'click #save-score': function(e) {
    e.preventDefault();
    
    var t1 = $('#tireur-jaune-id').val();
    var t2 = $('#tireur-bleu-id').val();
    var scoreT1 = $('#tireur-jaune-score').val();
    var scoreT2 = $('#tireur-bleu-score').val();

    var pouleId = $("#modalScore").data("poule-id");

    // RAZ des champs
    $('#tireur-jaune-id').val("");
    $('#tireur-bleu-id').val("");
    $('#tireur-jaune-score').val("");
    $('#tireur-bleu-score').val("");

    Meteor.call("setScore", pouleId, t1, t2, scoreT1, scoreT2);

    $('#modalScore').modal('hide');
  },
  'shown.bs.modal #modalScore': function(e){
    var jaune = $("#modalScore").data("tireur-jaune");
    var bleu = $("#modalScore").data("tireur-bleu");
    $('#tireur-jaune-id').val(jaune);
    $('#tireur-bleu-id').val(bleu);
    if (jaune.trim() !== "") {
      $('#tireur-jaune-score').focus();  
    } else {
      $('#tireur-jaune-id').focus();  
    }
  }
});