import { DBModels, Types, Utils } from '@ikomida/shared-backend'

export default class Contacts {
  logger
  constructor(logger: Utils.Logger) {
    this.logger = logger
  }

  async requestContact(input: any) {
    try {
      const contact = Types.Classes.CContract.fromObject(input)
      const contactModel = await DBModels.ContactModel.create({
        name: contact.name,
        lastName: contact.lastName,
        areaCode: contact.areaCode,
        phone: contact.phone,
        email: contact.email,
        contractName: contact.contractName
      })
      return new Utils.Return(contactModel !== null)
    } catch (exception: any) {
      new Utils.iKomidaError(Utils.iKomidaError.IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_EXCEPTION, exception).log(
        this.logger
      )
    }
    return new Utils.Return(false)
  }
}
