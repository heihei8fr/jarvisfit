import { describe, it, expect } from 'vitest'
import { calcOneRepMax, calcACWR, getDayKey, formatDuration } from './fitness'

describe('calcOneRepMax', () => {
  it('calcule le 1RM avec la formule Epley', () => {
    expect(calcOneRepMax(85, 6)).toBeCloseTo(102, 0)
  })
  it('retourne le poids direct pour 1 rep', () => {
    expect(calcOneRepMax(95, 1)).toBe(95)
  })
  it('retourne 0 si reps est 0', () => {
    expect(calcOneRepMax(85, 0)).toBe(0)
  })
})

describe('calcACWR', () => {
  it('retourne null si moins de 4 semaines de données', () => {
    expect(calcACWR([100, 200, 150])).toBeNull()
  })
  it('calcule le ratio acute/chronic correctement', () => {
    const loads = [300, 280, 290, 270]
    const result = calcACWR(loads)
    expect(result).toBeCloseTo(300 / ((300 + 280 + 290 + 270) / 4), 2)
  })
})

describe('getDayKey', () => {
  it('retourne le nom du jour en anglais minuscule', () => {
    const monday = new Date('2026-06-29')
    expect(getDayKey(monday)).toBe('monday')
  })
})

describe('formatDuration', () => {
  it('formate en minutes si moins de 60', () => {
    expect(formatDuration(45)).toBe('45min')
  })
  it('formate en heures et minutes si 60+', () => {
    expect(formatDuration(90)).toBe('1h30')
  })
})
