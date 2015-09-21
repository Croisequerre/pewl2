// Un match est une rencontre entre deux tireurs ou deux équipes.
// Il appartient forcément à une poule ou un tableau.
// Il possède :
// - un opposant 1 (tireur ou équipe)
// - la couleur de l'opposant 1
// - un opposant 2 (tireur ou équipe)
// - la couleur de l'opposant 2
// - le score de opp 1
// - le score de opp 2
// - un arbitre
// - de zéro à 3 juges
// - des pénalités
// - des avertissements
Matches = new Mongo.Collection('matches');

Meteor.methods({

});