import bcryptjs from "bcryptjs";
import * as readline from "readline";

async function generateAndTestHash(password: string) {
  console.log("Input password:", password);
  console.log("Password length:", password.length);

  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(password, salt);
  console.log("Generated hash:", hash);

  // Test the hash immediately
  const isValid = await bcryptjs.compare(password, hash);
  console.log("Verification test:", isValid);

  // Test with exact same string
  const samePassword = "FLk37*23s7pTcvnJbLYJg9snkjs@$AQZ";
  const isValidSame = await bcryptjs.compare(samePassword, hash);
  console.log("Verification with same string:", isValidSame);
}

// Read from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter password: ", (password) => {
  generateAndTestHash(password.trim())
    .catch(console.error)
    .finally(() => rl.close());
});
