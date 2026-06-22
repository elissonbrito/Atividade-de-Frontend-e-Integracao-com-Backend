require('dotenv').config({ path: '.env.test' });

// Sobreescreeve variáveis para banco de teste
process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/api_test';
process.env.POSTGRES_DB = process.env.TEST_POSTGRES_DB || 'api_test';
process.env.JWT_SECRET = 'test_secret_key_for_jest_only';
process.env.NODE_ENV = 'test';
