module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
  ],
};

// next-dev.js?3515:20 Warning: Prop `className` did not match. Server: "sc-jPYHJC dBvfxt" Client: "sc-jTrPJq hqxuYc"
// 해당 에러 해결
