import { greet, add } from "@pathway/shared";

console.log(greet("World"));
console.log(`2 + 3 = ${add(2, 3)}`);

// API server placeholder
const PORT = process.env.PORT || 3000;

console.log(`API server would start on port ${PORT}`);
