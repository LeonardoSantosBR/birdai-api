export function updateDataResume(
  id: number,
  incomingIds: number[],
  incomingHabitats: { habitat_id: number }[],
) {
  return {
    deleteMany: {
      habitat_id: { notIn: incomingIds },
    },
    upsert: incomingHabitats.map((h) => ({
      where: {
        bird_id_habitat_id: {
          bird_id: id,
          habitat_id: h.habitat_id,
        },
      },
      create: { habitat_id: h.habitat_id },
      update: {},
    })),
  };
}
