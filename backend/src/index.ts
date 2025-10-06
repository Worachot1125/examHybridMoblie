import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectMongo } from './database/mongo.js';


async function main() {
await connectMongo();
const app = createApp();
app.listen(env.PORT, () => {
console.log(`🚀 Server listening on http://localhost:${env.PORT}`);
});
}


main().catch((e) => {
console.error(e);
process.exit(1);
});