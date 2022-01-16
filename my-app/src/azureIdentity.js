import {CommunicationIdentityClient} from '@azure/communication-identity';

export default class AzureIdentity {
  static identityClient = new CommunicationIdentityClient(process.env.REACT_APP_AZURE_CONNECTION_STRING);
  static identityToken = undefined;

  static async getIdentityToken() {
    if (AzureIdentity.identityToken != null) return AzureIdentity.identityToken;

    AzureIdentity.identityToken = await AzureIdentity.identityClient.createUserAndToken(["voip"]);
    return AzureIdentity.identityToken;
  }
}
