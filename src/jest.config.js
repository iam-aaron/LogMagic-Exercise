module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};


// module.exports = {
//   preset: 'ts-jest',
//   roots: ["<rootDir>/src"],
//   testMatch: [
//     "**/__tests__/**/*.+(ts|tsx|js)",
//     "**/?(*.)+(spec|test).+(ts|tsx|js)",
//   ],
//   transform: {
//     '^.+\\.tsx?$': 'babel-jest',
//   },
// }
