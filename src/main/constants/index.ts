interface MuscleGroup {
  id: number
  name: string
  description: string
}

interface Equipment {
  id: number
  name: string
  description: string
}
interface Exercise_Type {
  id: number
  name: string
  description: string
}

interface Exercise {
  id: number
  name: string
  level?: string
  difficulty?: string
  video_link?: string
  image_link?: string
  description?: string
  exercise_types?: Exercise_Type[]
  muscleGroups?: MuscleGroup[]
  equipment?: Equipment[]
  recommendedSets?: { sets: number; reps: number; time: number }[]
}
