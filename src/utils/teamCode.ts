const used = new Set();

export function getTeamCode(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;

  while (true) {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    if (!used.has(result)) {
      used.add(result);
      return result;
    }
  }
}
