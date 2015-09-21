Template.modalSubscribeTireurs.helpers({
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: '@',
          collection: Tireurs,
          field: "nom",
          template: Template.userPill,
          noMatchTemplate: Template.noMatch
        },
        {
          token: '&',
          collection: Tireurs,
          field: "prenom",
          template: Template.userPill,
          noMatchTemplate: Template.noMatch
        }
      ]
    };
  },
  tireursInscrits: function() {
  	// Récupération des nom, prénom et licence de chaque tireur
  	var t;
  	var tireurs = new Array();
  	if(!this.tireurs)
  		return tireurs;
  	for(var i=0; i<this.tireurs.length; i++) {
  		t = Tireurs.findOne({_id: this.tireurs[i]._id});
  		tireurs.push(t);
  	}
  	return tireurs;
  }
});


Template.modalSubscribeTireurs.events({
  "autocompleteselect #tireur-nom-subscribe": function(e, t, doc) {
    // On vide le champ de sélection
    $("#tireur-nom-subscribe").val("");

    // On ajoute l'id du tireur trouvé à la liste d'inscription de l'événement
    if (doc) {
	    Meteor.call(
	    	"subscribeTireur", 
	    	{ eventId: t.data._id, tireurId: doc._id },
	    	function(error) {
		      	if (error)
		        	throwError(error.reason);
		    }
		  );
    }
    
  	// On met le focus sur le champ "tireur-nom-subscribe" de la fenêtre
    $('#tireur-nom-subscribe').focus();
  },
  'shown.bs.modal #modalSubscribeTireurs': function(e){
    e.preventDefault();

  	// On met le focus sur le champ "tireur-nom-subscribe" de la fenêtre
    $('#tireur-nom-subscribe').focus();
  }

});

Template.tireurInscrit.events({
	"click .delete-label-tireur": function(e,t) {
		var eventId = $('#modalSubscribeTireurs').data('event-id');
	    Meteor.call(
	    	"unsubscribeTireur", 
	    	{ eventId: eventId, tireurId: this._id },
	    	function(error) {
		      	if (error)
		        	throwError(error.reason);
		    }
		);
	}
});