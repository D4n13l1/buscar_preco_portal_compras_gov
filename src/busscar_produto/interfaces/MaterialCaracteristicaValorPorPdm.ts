interface buscaItemCaracteristica {
  codigoCaracteristica: string;
  codigoValorCaracteristica: string;
  nomeCaracteristica: string;
  caracteristicaObrigatoria: boolean;
  statusCaracteristica: boolean;
  numeroCaracteristica: number;
  nomeValorCaracteristica: string;
  siglaUnidadeMedida: null;
  statusValorCaracteristica: true;
  tuplaCaracteristica: [string, string, string | null];
}

export interface MaterialCaracteristicaValorPorPdmResponse {
  codigoPdm: number;
  codigo?: number;
  codigoItem: number;
  codigo_item?: number;
  nomePdm: string;
  statusItem: boolean;
  itemSuspenso: boolean;
  itemSustentavel: boolean;
  itemExclusivoUasgCentral: boolean;
  codigoClasse: number;
  codigoNcm: string;
  nomeNcm: string;
  aplicaMargemPreferencia: boolean;
  buscaItemCaracteristica: buscaItemCaracteristica[];
}
