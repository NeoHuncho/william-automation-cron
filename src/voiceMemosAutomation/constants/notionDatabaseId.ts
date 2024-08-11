const mainDatabase = (NODE_ENV: string) => {
  return NODE_ENV !== 'production'
    ? 'b69a8579120d4b879d0384921bd0e19d'
    : '6815102148854a68bac7e74d949304e0';
};

export const notionDatabaseId = () => {
  return {
    DEFAULT: mainDatabase(process.env.NODE_ENV),
    Q:
      process.env.NODE_ENV !== 'production'
        ? '89d369a6f0a04ecf838ebd11f1e1d948'
        : '815349f144434f11a0a073dc5d5bcd4d',
  };
};
