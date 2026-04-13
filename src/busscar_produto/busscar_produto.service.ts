import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { MaterialSearch } from './interfaces/MaterialSearch';
import { MaterialCaracteristicaValorPorPdmResponse } from './interfaces/MaterialCaracteristicaValorPorPdm';
import { ResponseSearchDadosAbertosCompras } from './interfaces/SearchDadosAbertosCompras';

@Injectable()
export class BusscarProdutoService {
  constructor(private readonly httpService: HttpService) {}

  private isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      Boolean((error as AxiosError).isAxiosError)
    );
  }

  private toHttpException(error: unknown, baseMessage: string): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (this.isAxiosError(error)) {
      const status = error.response?.status ?? HttpStatus.BAD_GATEWAY;
      const externalData = error.response?.data;

      const message =
        (typeof externalData === 'object' &&
          externalData !== null &&
          'message' in externalData &&
          typeof (externalData as { message?: unknown }).message === 'string' &&
          (externalData as { message: string }).message) ||
        (typeof externalData === 'string' ? externalData : undefined) ||
        error.message ||
        baseMessage;

      return new HttpException(
        {
          message: `${baseMessage}: ${message}`,
          externalError: externalData,
        },
        status,
      );
    }

    if (error instanceof Error) {
      return new HttpException(
        {
          message: `${baseMessage}: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return new HttpException(
      {
        message: baseMessage,
        error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async search_on_cnbs_material(
    material: string,
    tamanhoPagina?: number,
    pagina?: number,
    estado?: string,
  ): Promise<any> {
    tamanhoPagina = tamanhoPagina ?? 10;
    pagina = pagina ?? 1;

    const url =
      'https://cnbs.estaleiro.serpro.gov.br/cnbs-api/material/v1/palavra';
    try {
      const { data }: { data: MaterialSearch[] } =
        await this.httpService.axiosRef.get(url, {
          params: { palavra: material },
          timeout: 5000,
        });

      const firstItem = Array.isArray(data) ? data[0] : data;

      const codigoPdm =
        firstItem?.codigoPdm ?? firstItem?.codigoPDM ?? firstItem?.codigo_pdm;
      if (!codigoPdm) {
        throw new NotFoundException(
          `Material encontrado, mas código PDM não disponível para material: ${material}`,
        );
      }

      if (codigoPdm) {
        const codigoData = await this.search_on_cnbs_codigo_item(
          String(codigoPdm),
        );

        // const codigoArray = Array.isArray(codigoData) ? codigoData : [codigoData];
        const codigoArray = codigoData;

        let ultimoDadosCompras: ResponseSearchDadosAbertosCompras | null = null;

        for (const codigoObj of codigoArray) {
          const codigoItem =
            codigoObj?.codigoItem ??
            codigoObj?.codigo_item ??
            codigoObj?.codigo;
          if (!codigoItem) continue;

          const dadosCompras = await this.search_on_dados_abertos_compras(
            String(codigoItem),
            tamanhoPagina,
            pagina,
            estado,
          );

          ultimoDadosCompras = dadosCompras;

          const resultado = dadosCompras?.resultado;
          if (Array.isArray(resultado) && resultado.length > 0) {
            return {
              valores: dadosCompras,
              codigoItemUsed: String(codigoItem),
            };
          }
          const totalRegistros =
            dadosCompras?.totalRegistros ?? dadosCompras?.total_registros;
          if (typeof totalRegistros === 'number' && totalRegistros > 0) {
            return {
              valores: dadosCompras,
              codigoItemUsed: String(codigoItem),
            };
          }
        }

        if (ultimoDadosCompras) {
          return { material: data, codigoData, valores: ultimoDadosCompras };
        }

        return { material: data, codigoData };
      }

      return { material: data };
    } catch (error: unknown) {
      throw this.toHttpException(error, 'Erro ao buscar CNBS');
    }
  }

  async search_on_cnbs_codigo_item(
    codigoPdm: string,
  ): Promise<MaterialCaracteristicaValorPorPdmResponse[]> {
    const url =
      'https://cnbs.estaleiro.serpro.gov.br/cnbs-api/material/v1/materialCaracteristcaValorporPDM';
    try {
      const { data }: { data: MaterialCaracteristicaValorPorPdmResponse[] } =
        await this.httpService.axiosRef.get(url, {
          params: { codigo_pdm: codigoPdm },
          timeout: 5000,
        });
      return data;
    } catch (error: unknown) {
      throw this.toHttpException(error, 'Erro ao buscar CNBS por codigoPdm');
    }
  }

  async search_on_dados_abertos_compras(
    codigoItemCatalogo: string,
    tamanhoPagina: number,
    pagina: number,
    estado?: string,
  ): Promise<ResponseSearchDadosAbertosCompras> {
    const url =
      'https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial';
    try {
      const { data }: { data: ResponseSearchDadosAbertosCompras } =
        await this.httpService.axiosRef.get(url, {
          params: {
            codigoItemCatalogo,
            tamanhoPagina,
            pagina,
            estado,
          },
          timeout: 50000,
        });
      return data;
    } catch (error: unknown) {
      throw this.toHttpException(error, 'Erro ao buscar Dados Abertos Compras');
    }
  }
}
