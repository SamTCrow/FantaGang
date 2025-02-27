type Risultato = {
  casa: string,
  puntiCasa: number,
  ospite: string,
  puntiOspite: number,
}

type Giornata = {
  numero: number,
  risultati: Risultato[]
}

export const calcoloClassifica = async (risultati: Giornata[]) => {

}