export function createHabitatsResume(hasHabitats: boolean, habitatsIds: any[]) {
  if (!hasHabitats || !habitatsIds.length) return {};

  return {
    create: habitatsIds.map((dt: { habitat_id: number }) => ({
      habitat: {
        connect: {
          id: dt.habitat_id,
        },
      },
    })),
  };
}
