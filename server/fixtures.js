if (Events.find().count() === 0) {
/*
	var now = new Date().getTime();

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
*/
}