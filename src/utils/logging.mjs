export const log = (module, message) => {
  console.log(`${new Date().toISOString()} | ${module} | ${message}`);
}
