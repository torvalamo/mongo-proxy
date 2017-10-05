const { MongoClient } = require('mongodb');

module.exports = (mongodb_uri, options, callback) => {
	if (typeof options == 'function') {
		callback = options;
		options = {};
	}
	
	options = Object.assign({
		collectionSymbol: '@',
		cacheCollections: true,
		cacheCollectionTimeout: 5000
	}, options);
	
	const collections = {};
	
	MongoClient.connect(mongodb_uri, options, (err, db) => {
		if (err) {
			if (callback) {
				return callback(err);
			}
			throw err;
		}
		
		var proxy = new Proxy(db, {
			get: (target, property, receiver) => {
				if (property in target) {
					return target[property];
				} else if (property.substr(0, 1) == options.collectionSymbol) {
					property = property.substr(1);
					if (options.cacheCollections) {
						if (!(property in collections)) {
							collections[property] = db.collection(property);
							options.cacheCollectionTimeout && setTimeout(() => delete collections[property], options.cacheCollectionTimeout);
						}
						return collections[property];
					} else {
						return db.collection(property);
					}
				}
			}
		});
		
		callback && callback(err, db);
	});
};