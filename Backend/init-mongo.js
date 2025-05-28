// MongoDB initialization script for Docker
db = db.getSiblingDB('image_moderation');

// Create collections
db.createCollection('tokens');
db.createCollection('usages');

// Create indexes for better performance
db.tokens.createIndex({ "token": 1 }, { unique: true });
db.tokens.createIndex({ "createdAt": 1 });

db.usages.createIndex({ "token": 1 });
db.usages.createIndex({ "timestamp": 1 });
db.usages.createIndex({ "token": 1, "timestamp": -1 });

print('Database initialized successfully');