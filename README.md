# mongo-proxy

Installation

	npm install mongo-proxy -S

Use

	const mongodb = require('mongo-proxy');
	const db = mongodb(process.env.MONGODB_URI, {
		// Any mongodb connection options
		// ...
		
		// Also some additional options for the module
		collectionSymbol: '$',         // the symbol to distinguish collections from other db object members
		cacheCollections: true,        // whether to cache db.collection() calls or always call it
		cacheCollectionTimeout: 5000   // in milliseconds
	}, (err, db) => {
		// Same callback error as the MongoClient.connect callback
		if (err) throw err;
		
		// The following shows why a symbol is necessary
		db.$stats.find({})... // look up in the COLLECTION called 'stats'
		db.stats((err, res) => {...}) // get the stats from the db object

		// Note: ALL the normal functions are accessible on the db object like you would normally.
		// Also, db.collection() works as it always has. 
		// This means you could just drop mongo-proxy into your current project, without anything breaking.
	});