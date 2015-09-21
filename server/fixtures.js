var now = new Date().getTime();

/*if (Events.find().count() === 0) {

	// Création de 2 utilisateurs
	var xavId = Meteor.users.insert({
		profile: { name: 'Xavier LEJEUNE' }
	});
	var xav = Meteor.users.findOne(xavId);
	var julId = Meteor.users.insert({
		profile: { name: 'Julien FALCONNET' }
	});
	var jul = Meteor.users.findOne(julId);

	var intxId = Events.insert({
		name: 'Internationaux de France 2015',
		userId: jul._id,
		author: jul.profile.name,
		url: 'http://www.internationaux.2015',
		createdAt: new Date(now - 7*3600*1000)
	});

	var qualifsId = Phases.insert({
		eventId: intxId,
		userId: jul._id,
		author: jul.profile.name,
		name: "Qualifications"
	});

	Poules.insert({
		phaseId: qualifsId,
		name: "Poule 1"
	});

	Poules.insert({
		phaseId: qualifsId,
		name: "Poule 2"
	});

	Classements.insert({
		phaseId: qualifsId,
		tireurs: [{
			id: 0,
			name: "Camillo Cerredo",
			pv: 18,
			ga: 33
		},
		{
			id: 1,
			name: "Loïc Minot",
			pv: 14,
			ga: 67
		}]
	});

	Phases.insert({
		eventId: intxId,
		userId: jul._id,
		author: jul.profile.name,
		name: "Tableau final"
	});

	Events.insert({
		name: "Séance-assauts du 20 septembre",
		userId: xav._id,
		author: xav.profile.name,
		url: "http://www.apachesdepaname.fr",
		createdAt: new Date()
	});
	
	Events.insert({
		name: "Séance-assauts du 20 septembre",
		userId: jul._id,
		author: jul.profile.name,
		url: "http://www.ccbs.fr/?p=1138",
		createdAt: new Date(now - 15*24*3600*1000)
	});

}*/
var PRENOMS = [
	"Louis", "Pedro", "Raymond", "Frédéric", "Gudule", "Jonathan", "Billy", "Alfred", 
	"Joe", "Camille", "Sophie", "Marie-Thérèse", "Monique", "Cléante", "Frédegonde"
];
var NOMS = [
	"Almodovar", "Domenech", "Mitterand", "Dupont", "Dudreuil", "Bob", "Hitchcock",
	"Picasso", "Tibéri", "Durand", "du Bois de Saint-Jacques", "Rivière", "Mitchum"
];
var SEXES = [
	"M", "F"
]
Meteor.methods({
	createRandomTireur: function() {
		Tireurs.insert({
			nom: NOMS[Math.floor(Math.random()*NOMS.length)],
			prenom: PRENOMS[Math.floor(Math.random()*PRENOMS.length)],
			licence: 600000+Math.floor(Math.random()*99999),
			naissance: new Date(now - Math.random()*1576800000),
			sexe: SEXES[Math.floor(Math.random()+1)]
		});
	}
});
/*
if (Tireurs.find().count() === 0) {
	console.log("Creating fighters...");
	var PRENOMS = [
		"Louis", "Pedro", "Raymond", "Frédéric", "Gudule", "Jonathan", "Billy", "Alfred"
	];
	var NOMS = [
		"Almodovar", "Domenech", "Mitterand", "Dupont", "Dudreuil", "Bob", "Hitchcock"
	];

	for (var i=0; i<5; i++) {
		Tireurs.insert({
			nom: NOMS[Math.floor(Math.random()*NOMS.length)],
			prenom: PRENOMS[Math.floor(Math.random()*PRENOMS.length)],
			licence: 600000+Math.floor(Math.random()*99999),
			dateDeNaissance: new Date(now - Math.random()*1576800000)
		});
	}
}
*/