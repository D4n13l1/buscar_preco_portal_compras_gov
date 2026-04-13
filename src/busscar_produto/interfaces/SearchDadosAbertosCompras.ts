interface ResultadoSearchDadosAbertosComprasResponse {
  idCompra: string;
  idItemCompra: number;
  forma: string;
  modalidade: number;
  criterioJulgamento: string;
  numeroItemCompra: number;
  descricaoItem: string;
  codigoItemCatalogo: number;
  nomeUnidadeMedida: number | null;
  siglaUnidadeMedida: string | null;
  nomeUnidadeFornecimento: string;
  siglaUnidadeFornecimento: string;
  capacidadeUnidadeFornecimento: number;
  quantidade: number;
  precoUnitario: number;
  percentualMaiorDesconto: number;
  niFornecedor: string;
  nomeFornecedor: string;
  marca: string;
  codigoUasg: string;
  nomeUasg: string;
  codigoMunicipio: number;
  municipio: string;
  estado: string;
  codigoOrgao: number;
  nomeOrgao: string;
  poder: string;
  esfera: string;
  dataCompra: string;
  dataHoraAtualizacaoCompra: string;
  dataHoraAtualizacaoItem: string;
  dataResultado: string;
  dataHoraAtualizacaoUasg: string;
  codigoClasse: number;
  nomeClasse: string;
  objetoCompra: string;
  descricaoDetalhadaItem: string;
}

export interface ResponseSearchDadosAbertosCompras {
  totalRegistros: number;
  total_registros?: number;
  totalPaginas: number;
  paginasRestantes: number;
  dataHoraConsulta: string;
  timeZoneAtual: string;
  resultado: ResultadoSearchDadosAbertosComprasResponse[];
}
