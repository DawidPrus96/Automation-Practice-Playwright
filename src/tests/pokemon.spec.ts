// example.spec.ts
import { test, expect } from '@playwright/test';
import { AutomationTools } from '../pages/pokemon.page';
test('pokeAPI', async ({ request }) => {
  const playwrightDev = new AutomationTools(request);
  const pokeStats: { name: string, baseExp: number }[] = [];
  const pokeCount = await playwrightDev.getCount()
  const pokeURL = await playwrightDev.getAllPokeURL(pokeCount)
  for (let i = 0; i < pokeCount; i++) {
    let name = pokeURL[i].name.charAt(0).toUpperCase() + pokeURL[i].name.slice(1);
    let baseExp = await playwrightDev.getBaseExp(pokeURL[i].url)
    console.log(`${i}. ${name}`)
    pokeStats[i] = { name: name, baseExp: baseExp }
  }
  pokeStats.sort((a, b) => b.baseExp - a.baseExp)
  console.log(`\n\nLiczba wszystkich pokemonów: ${pokeCount}.\nLiczba sprawdzonych pokemonów: ${pokeStats.length}.\nPokemony o największym base_experience:\n`)
  for (let i = 0; i < 5; i++) {
    console.log(`${i + 1}. ${pokeStats[i].name} - ${pokeStats[i].baseExp}`)
  }
})