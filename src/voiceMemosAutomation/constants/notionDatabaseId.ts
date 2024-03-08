export const notionDatabaseId = () => {
  return {
    DI:
      process.env.NODE_ENV !== 'production'
        ? 'b69a8579120d4b879d0384921bd0e19d'
        : '6815102148854a68bac7e74d949304e0',
    DR:
      process.env.NODE_ENV !== 'production'
        ? 'aaa908c8daa445f39e8bbd87876889a1'
        : '7807742d5c7848bf8f0364750825e1a3',
    Q:
      process.env.NODE_ENV !== 'production'
        ? '89d369a6f0a04ecf838ebd11f1e1d948'
        : '815349f144434f11a0a073dc5d5bcd4d',
    DO:
      process.env.NODE_ENV !== 'production'
        ? '596d083fe96c46429b7e2e4243985742'
        : '2820c4b5806247b2a1add5843225bdd4',
  };
};
