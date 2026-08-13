import useCases from '../data/useCases.json'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getUseCases() {
  await delay(300)
  return structuredClone(useCases)
}
