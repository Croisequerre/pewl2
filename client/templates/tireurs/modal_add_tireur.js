Template.modalAddTireur.events({
  'submit #form-name-tireur': function(e) {
    e.preventDefault();

    // Bidouille : on simule un clic sur le bouton
    // quand on intercepte un "submit"
    $("#save-name").click();
  },
  'click #save-tireur': function(e) {
    e.preventDefault();
    
    // Création du tireur avec les données saisies par l'utilisateur
    var tireur = {
      nom: $('#tireur-nom').val(),
      prenom: $('#tireur-prenom').val(),
      naissance: $('#tireur-naissance').val(),
      licence: $('#tireur-licence').val(),
      sexe: ($('#tireur-sexe-m').hasClass('active') ? "M" : "F")
    };

    // On passe par la moulinette de validation
    // Si on y trouve des erreurs, on envoie tous dans
    // la variable de session qui permettra de mettre
    // à jour les champs de saisie.
    var errors = validateTireur(tireur);
    if (errors.nom || errors.prenom || errors.licence || errors.naissance || errors.sexe)
      // return sert plus à interrompre l'exécution
      // qu'à renvoyer toutes les erreurs
      return throwErrors(errors);

    // On vérifie que la licence est bien un Int
    tireur.licence = parseInt(tireur.licence);
    if (isNaN(tireur.licence))
      return throwError("Le n° de licence doit se composer de chiffres uniquement.");

    // RAZ des champs
    $('#tireur-nom').val("");
    $('#tireur-prenom').val("");
    $('#tireur-naissance').val("");
    $('#tireur-licence').val("");
    $('#tireur-sexe-m').button('toggle');

    Meteor.call('insertTireur', tireur, function(error, result) {
      // Affiche l'errreur à l'utilisateur et s'interrompt
      if (error)
        return throwError(error.reason);

      if (result.tireurExists)
        throwError('Un tireur avec le même couple nom/prénom existe déjà.');

      // On reste ensuite sur la même page, on ferme simplement la fenêtre
      $('#modalAddTireur').modal('hide');
    });

  },
  'shown.bs.modal #modalAddTireur': function(e){
    e.preventDefault();

  	// On met le focus sur le champ "nom" de la fenêtre
    $('#tireur-nom').focus();
  }
});

Template.modalAddTireur.onRendered(function() {
    this.$('#tireur-naissance-datepicker').datetimepicker({
        format: 'DD/MM/YYYY',
        enabledHours: false
    });
});