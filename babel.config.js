module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // Estes plugins são essenciais para o Supabase rodar em celulares antigos
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};