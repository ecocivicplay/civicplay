export function calculateRank(streak) {

  if (streak >= 60)
    return {
      rank: "Diamond",
      reward: "Community Champion Badge"
    };

  if (streak >= 30)
    return {
      rank: "Platinum",
      reward: "Premium Green Kit"
    };

  if (streak >= 14)
    return {
      rank: "Gold",
      reward: "Gardening Toolkit"
    };

  if (streak >= 7)
    return {
      rank: "Silver",
      reward: "Eco Starter Kit"
    };


  return {
    rank: "Bronze",
    reward: null
  };

}