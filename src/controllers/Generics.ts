import { DBModels, Types, Utils } from '@ikomida/shared-backend'
import axios from 'axios'

export default class Generics {
  logger
  constructor(logger: Utils.Logger) {
    this.logger = logger
  }

  async getTerm(type?: Types.Types.TTerm | null) {
    try {
      if (!type) {
        return new Utils.Return(false, null)
      }
      const termModel = await DBModels.TermModel.findOne({
        where: {
          type
        },
        order: [['createdAt', 'DESC']]
      })
      const term = Types.Classes.CTerm.init(
        termModel?.name ?? '',
        termModel?.text ?? '',
        termModel?.type ?? Types.Types.TTerm.PRIVACY_POLICY,
        undefined,
        termModel?.createdAt,
        termModel?.id
      )
      return new Utils.Return(termModel !== null, term)
    } catch (exception: any) {
      new Utils.iKomidaError(Utils.iKomidaError.IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_EXCEPTION, exception).log(
        this.logger
      )
    }
    return new Utils.Return(false)
  }

  async getLastTerm(type?: Types.Types.TTerm | null) {
    try {
      if (!type) {
        return new Utils.Return(false, null)
      }
      const termModel = await DBModels.TermModel.findOne({
        where: {
          type
        },
        order: [['createdAt', 'DESC']]
      })
      const term = Types.Classes.CTerm.init(
        termModel?.name ?? '',
        '',
        termModel?.type ?? Types.Types.TTerm.PRIVACY_POLICY,
        undefined,
        termModel?.createdAt,
        termModel?.id
      )
      return new Utils.Return(termModel !== null, term)
    } catch (exception: any) {
      new Utils.iKomidaError(Utils.iKomidaError.IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_EXCEPTION, exception).log(
        this.logger
      )
    }
    return new Utils.Return(false)
  }

  async getAddressByCep(postalCode: string) {
    try {
      const postalCodeJustNumbersArray = postalCode.match(/\d/g)
      if ((postalCodeJustNumbersArray?.length ?? 0) !== 8) {
        const error = new Utils.iKomidaError(
          Utils.iKomidaError.IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_INVALID_POSTAL_CODE
        )
        return error.logAndReturn(this.logger)
      }
      const postalCodeJustNumbers = postalCodeJustNumbersArray?.join('') ?? ''
      const response = await axios.get(`https://viacep.com.br/ws/${postalCodeJustNumbers}/json/`)
      if (response.status !== 200 || response?.data?.erro) {
        const error = new Utils.iKomidaError(Utils.iKomidaError.IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_NETWORK_ERROR)
        return error.logAndReturn(this.logger)
      }
      const address = Types.Classes.CAddress.init(
        postalCodeJustNumbers,
        response.data?.logradouro ?? '',
        response.data?.bairro ?? '',
        response.data?.localidade ?? '',
        response.data?.uf ?? '',
        undefined,
        response.data?.complemento ?? ''
      )
      return new Utils.Return(true, address)
    } catch (exception: any) {
      const error = new Utils.iKomidaError(
        Utils.iKomidaError.IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_EXCEPTION,
        exception?.response?.data || exception?.message
      )
      return error.logAndReturn(this.logger)
    }
  }
}
