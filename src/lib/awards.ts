const tiers = [
    { name: "bronze", start: 0, end: 100 },
    { name: "silver", start: 101, end: 200 },
  ];
  
  export function getData(points: number) {
    const data: Record<string, string | number | undefined> = {};
  
    const temp = tiers.find((tier) => points >= tier.start && points <= tier.end);
  
    data.curr = temp?.name;
    data.next = tiers.find((tier) => points < tier.start)?.name;
    data.max = temp?.end;
  }