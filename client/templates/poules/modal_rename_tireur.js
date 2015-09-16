Template.modalRenameTireur.events({
  'click #save': function(e) {
    e.preventDefault();
    
    var name = $('#tireur-nom').val();

    var pouleId = $("#modalRenameTireur").data("poule-id");

    // RAZ des champs
    $('#tireur-nom').val("");

    Meteor.call("addTireur", pouleId, name);

    $('#modalRenameTireur').modal('hide');
  }
});