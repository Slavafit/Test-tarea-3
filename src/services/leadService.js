const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function submitLead(payload) {
  await delay(900)
  if (!payload.name || !payload.email || !payload.company) {
    throw new Error('Заполните обязательные поля')
  }
  return { ok: true, requestId: `SB-${Date.now().toString().slice(-6)}` }
}
