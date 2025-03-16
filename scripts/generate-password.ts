import bcryptjs from "bcryptjs";

async function generateHash(password: string) {
  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(password, salt);
  console.log("Generated hash:", hash);
}

// Get password from command line argument
const password = process.argv[2];
if (!password) {
  console.error("Please provide a password as an argument");
  process.exit(1);
}

generateHash(password).catch(console.error);
