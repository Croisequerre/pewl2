// vérifie que le document appartient bien à l'userId
ownsDocument = function(userId, doc) {
	return doc && doc.userId === userId;
}