Template.modalRenameTireur.events({
  'submit #form-name-tireur': function(e) {
    e.preventDefault();

    // Bidouille : on simule un clic sur le bouton
    // quand on intercepte un "submit"
    $("#save-name").click();
  },
  'click #save-name': function(e) {
    e.preventDefault();
    
    var name = $('#tireur-nom').val();

    var pouleId = $("#modalRenameTireur").data("poule-id");

    // RAZ des champs
    $('#tireur-nom').val("");

    var action = $("#modalRenameTireur").data("action");

    // Sélection de l'action par son nom : un peu bof
    // TODO : l'ajout du tireur ne devrait plus passer par là
    if (action === "addTireur") {
    	if (name.trim() !== "") {
			Meteor.call("addTireur", pouleId, name);
    	}
    } else if (action ==="renameTireur") {
	    var tireurId = $("#modalRenameTireur").data("tireur-id");
    	Meteor.call("renameTireur", pouleId, tireurId, name);
    }

    $('#modalRenameTireur').modal('hide');
  },
  'shown.bs.modal #modalRenameTireur': function(e){
    e.preventDefault();

  	// Modification du titre de la fenêtre en fonction de ce pour quoi elle
  	// va être utilisée (création d'un tireur, renommage d'un tireur...)
    var title = $("#modalRenameTireur").data("dialog-title");
    var oldName = $("#modalRenameTireur").data("old-name");

    $("#dialogTitle").text(title);
    $('#tireur-nom').val(oldName);

  	// On met le focus sur le champ "nom" de la fenêtre
    $('#tireur-nom').focus();
  }
});

Template.modalRenameTireur.helpers({
	pouet: function() {
		console.log("pouet");
	}
});
