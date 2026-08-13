import testimonials from '../data/testimonials.json'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getTestimonials() {
  await delay(450)
  return structuredClone(testimonials)
}
